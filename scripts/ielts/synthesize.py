#!/usr/bin/env python3
"""
雅思听力录音离线合成（edge-tts 7.x，逐句合成 + 三道校验 + 拼装整篇）。

用法：
  python3 scripts/ielts/synthesize.py --only test-01-part-1
  python3 scripts/ielts/synthesize.py --only test-01-part-1,test-01-part-2 --jobs 2

产物（工作目录默认 ~/Library/Application Support/Doubao/.../agent_mode/workspace/ielts-audio）：
  {workdir}/{slug}/sentences/NNN.mp3        逐句分片（审计证据，不上传）
  {workdir}/{slug}/{transcriptHash}-{audioHash8}.mp3   整篇
  {workdir}/{slug}/meta.json                key/durationSec/transcriptHash/cues/...
  {workdir}/synth-report.json               本次演练指标

校验（每句，任一不过即重试，3 次仍不过则整篇失败、不产出半成品）：
  ① WordBoundary 事件非空（edge-tts 7.x 默认 SentenceBoundary，必须显式 boundary='WordBoundary'）；
  ② 词边界文本归一化（小写、去掉非字母数字）后与整句文本归一化结果完全相等；
  ③ 句 mp3 实际时长（ffprobe）不小于 词数 / 4.5 秒（防截断）。
"""
import argparse
import asyncio
import datetime
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

try:
    import edge_tts
except ImportError:
    sys.stderr.write("缺少 edge-tts：请在当前 Python 环境安装 `pip install edge-tts==7.3.1`（或用已有 venv 的解释器运行）。\n")
    raise

WORD_RE = re.compile(r"[A-Za-z0-9]+(?:['’\-][A-Za-z0-9]+)*")
NON_ALNUM = re.compile(r"[^a-z0-9]")
SLUG_RE = re.compile(r"^test-\d{2}-part-[1-4]$")

SAME_SILENCE_SEC = 0.12   # 同说话人句间静音
TURN_SILENCE_SEC = 0.28   # 换说话人轮次间静音
SAMPLE_RATE = 24000
BIT_RATE = "48k"
DURATION_RATE = 8.0       # 极宽松时长下限：每秒至少 8 词，只兜空白/静音输出
MIN_SENTENCE_SECONDS = 0.5  # 短句的绝对下限
TRUNCATION_MARGIN = 0.10  # 音频时长必须比最后一个词边界多出的最小余量
MAX_RETRIES = 3

DEFAULT_WORKDIR = Path(
    "/Users/meteor/Library/Application Support/Doubao/Default/.doubao/agent_mode/workspace/ielts-audio"
)


class ArticleFailure(Exception):
    """整篇合成失败：携带 slug、句号与原因。"""

    def __init__(self, slug: str, reason: str):
        super().__init__(f"{slug}: {reason}")
        self.slug = slug
        self.reason = reason


# ---------------------------------------------------------------------------
# 工具
# ---------------------------------------------------------------------------

def find_tool(name: str) -> str:
    located = shutil.which(name)
    if located:
        return located
    for candidate in (f"/usr/bin/{name}", f"/opt/homebrew/bin/{name}"):
        if os.path.exists(candidate):
            return candidate
    raise RuntimeError(f"找不到 {name}，请确认已安装并在 PATH 中")


FFMPEG = find_tool("ffmpeg")
FFPROBE = find_tool("ffprobe")


def probe_duration(path: Path) -> float | None:
    """ffprobe 读时长；文件缺失/为空/时长不足 0.05s 返回 None。"""
    if not path.exists() or path.stat().st_size == 0:
        return None
    try:
        out = subprocess.run(
            [FFPROBE, "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)],
            capture_output=True, text=True, timeout=20, check=True,
        ).stdout
        value = float(json.loads(out)["format"]["duration"])
        return value if value > 0.05 else None
    except Exception:
        return None


def normalize(text: str) -> str:
    """小写、去掉所有非字母数字（撇号/连字符/空格/标点都不参与比对）。"""
    return NON_ALNUM.sub("", text.lower())


def word_count(text: str) -> int:
    return len(WORD_RE.findall(text))


def iso_utc_now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def escape_concat_path(path: Path) -> str:
    return str(path).replace("'", "'\\''")


# ---------------------------------------------------------------------------
# 静音片（与逐句分片同一编码参数，保证 concat -c copy 可直接拼接）
# ---------------------------------------------------------------------------

def make_silence(path: Path, seconds: float) -> None:
    if probe_duration(path) is not None:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [FFMPEG, "-y", "-f", "lavfi", "-i", f"anullsrc=r={SAMPLE_RATE}:cl=mono",
         "-t", str(seconds), "-codec:a", "libmp3lame", "-b:a", BIT_RATE,
         "-ar", str(SAMPLE_RATE), "-ac", "1", str(path)],
        check=True, capture_output=True,
    )


# ---------------------------------------------------------------------------
# 逐句校验（纯函数：不依赖网络/文件，便于离线负例测试）
# ---------------------------------------------------------------------------

def validate_sentence(text: str, boundaries: list[str], duration_sec: float,
                      last_boundary_end: float | None = None) -> int:
    """四道校验，任一不过抛 ValueError；通过返回词数。

    ① 词边界非空；
    ② 词边界归一化（小写、去非字母数字）后与整句文本归一化结果完全相等（查漏词、查重复）；
    ③ 句 mp3 时长 ≥ 最后一个词边界结束时间 + 0.10s —— 这是「词边界齐全、音频却被提前
       截断」的确定性判据（edge-tts 真实出现过：11 词的句子只合成出 1.92s 音频）；
    ④ 时长 ≥ max(0.5s, 词数 / 8.0) 的极宽松下限，只兜空白/静音输出。实测 en-US-AndrewNeural
       在 +5% 语速下会把 11 个短词压进 1.92s（词边界齐全、无截断），所以这里不能按正常语速设下限。
    """
    if not boundaries:
        raise ValueError("未收到任何 WordBoundary 事件")
    if normalize("".join(boundaries)) != normalize(text):
        raise ValueError(
            f"词不匹配：原文归一化={normalize(text)!r}，词边界归一化={normalize(''.join(boundaries))!r}，"
            f"边界序列={boundaries!r}"
        )
    if last_boundary_end is not None and duration_sec < last_boundary_end + TRUNCATION_MARGIN - 1e-6:
        raise ValueError(
            f"音频被截断：时长 {duration_sec:.3f}s 短于最后词边界 {last_boundary_end:.3f}s"
            f"（+{TRUNCATION_MARGIN:.2f}s 容差）"
        )
    words = word_count(text)
    floor = max(MIN_SENTENCE_SECONDS, words / DURATION_RATE)
    if duration_sec < floor - 1e-6:
        raise ValueError(f"时长 {duration_sec:.3f}s 低于下限 {floor:.3f}s（{words} 词）")
    return words


# ---------------------------------------------------------------------------
# 逐句合成
# ---------------------------------------------------------------------------

async def synth_sentence(sentence: dict, voice: str, rate: str, out_path: Path, retries: int) -> dict:
    text = sentence["text"]
    last_error: Exception | None = None

    for attempt in range(1, retries + 1):
        tmp = out_path.with_suffix(f".tmp{attempt}.mp3")
        boundaries: list[str] = []
        last_boundary_end = 0.0
        try:
            communicate = edge_tts.Communicate(
                text, voice,
                rate=rate,
                boundary="WordBoundary",  # 7.x 默认 SentenceBoundary，不传就收不到词边界
                connect_timeout=10, receive_timeout=60,
            )
            with open(tmp, "wb") as handle:
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        handle.write(chunk["data"])
                    elif chunk["type"] == "WordBoundary":
                        boundaries.append(chunk["text"])
                        # offset/duration 以 100ns 为单位；取最晚的词尾作为截断判据
                        last_boundary_end = max(
                            last_boundary_end,
                            (chunk.get("offset", 0) + chunk.get("duration", 0)) / 10_000_000,
                        )

            duration = probe_duration(tmp)
            if duration is None:
                raise ValueError("音频为空或无法解码")
            words = validate_sentence(text, boundaries, duration, last_boundary_end or None)
            tmp.replace(out_path)
            return {"duration": duration, "attempts": attempt, "words": words, "boundaries": boundaries}
        except Exception as error:  # noqa: BLE001 —— 重试后统一上报
            last_error = error
            tmp.unlink(missing_ok=True)
            if attempt < retries:
                await asyncio.sleep(min(5.0, 1.0 * attempt))

    raise ValueError(f"第 {sentence['index']:03d} 句重试 {retries} 次仍失败：{last_error}")


# ---------------------------------------------------------------------------
# 整篇拼装
# ---------------------------------------------------------------------------

def concat_article(slug: str, records: list[dict], sentences: list[dict], article_dir: Path,
                   silence_same: Path, silence_turn: Path, whole_tmp: Path) -> float:
    list_file = article_dir / "concat-list.txt"
    lines: list[str] = []
    for index, record in enumerate(records):
        lines.append(f"file '{escape_concat_path(record['mp3'])}'")
        if index < len(records) - 1:
            gap = silence_turn if sentences[index + 1]["speaker"] != sentences[index]["speaker"] else silence_same
            lines.append(f"file '{escape_concat_path(gap)}'")
    list_file.write_text("\n".join(lines) + "\n")

    subprocess.run(
        [FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(list_file),
         "-c", "copy", str(whole_tmp)],
        check=True, capture_output=True,
    )
    list_file.unlink(missing_ok=True)

    duration = probe_duration(whole_tmp)
    if duration is None:
        raise ArticleFailure(slug, "整篇拼接后无法读取时长")
    return duration


def build_cues(records: list[dict], sentences: list[dict]) -> list[list[float]]:
    cues: list[list[float]] = []
    cursor = 0.0
    for index, record in enumerate(records):
        start = round(cursor, 3)
        end = round(cursor + record["duration"], 3)
        if start < 0 or end <= start:
            raise ValueError(f"第 {index:03d} 句 cue 非法：[{start}, {end}]")
        cues.append([start, end])
        cursor += record["duration"]
        if index < len(records) - 1:
            cursor += TURN_SILENCE_SEC if sentences[index + 1]["speaker"] != sentences[index]["speaker"] else SAME_SILENCE_SEC
    return cues


async def build_article(lesson: dict, workdir: Path, sem: asyncio.Semaphore, report: dict) -> None:
    slug = lesson["slug"]
    sentences = lesson["sentences"]
    article_dir = workdir / slug
    sentences_dir = article_dir / "sentences"
    meta_path = article_dir / "meta.json"

    # 断点续跑：meta 存在、指纹一致、整篇 mp3 还在，直接跳过。
    if meta_path.exists():
        try:
            existing_meta = json.loads(meta_path.read_text())
            existing_mp3 = article_dir / os.path.basename(existing_meta["key"])
            if (existing_meta.get("transcriptHash") == lesson["transcriptHash"]
                    and existing_mp3.exists()
                    and existing_meta.get("sentenceCount") == len(sentences)):
                report["articles"][slug] = {
                    "status": "skipped", "durationSec": existing_meta["durationSec"],
                    "sentenceCount": len(sentences), "retries": 0,
                }
                return
        except Exception:
            pass  # 旧 meta 损坏则重建

    async with sem:
        started = time.monotonic()
        records: list[dict] = []
        retries = 0
        try:
            if article_dir.exists():
                shutil.rmtree(article_dir)
            sentences_dir.mkdir(parents=True, exist_ok=True)

            rate = lesson.get("speechRate") or "+0%"
            for sentence in sentences:
                mp3 = sentences_dir / f"{sentence['index']:03d}.mp3"
                result = await synth_sentence(sentence, sentence["voice"], rate, mp3, MAX_RETRIES)
                retries += result["attempts"] - 1
                records.append({**result, "mp3": mp3})

            silence_dir = workdir / "_silence"
            silence_same = silence_dir / "same-0.12.mp3"
            silence_turn = silence_dir / "turn-0.28.mp3"
            make_silence(silence_same, SAME_SILENCE_SEC)
            make_silence(silence_turn, TURN_SILENCE_SEC)

            whole_tmp = article_dir / "whole.tmp.mp3"
            duration_sec = concat_article(slug, records, sentences, article_dir, silence_same, silence_turn, whole_tmp)

            cues = build_cues(records, sentences)
            if len(cues) != len(sentences):
                raise ValueError(f"cues 条数 {len(cues)} ≠ 句数 {len(sentences)}")
            if cues[-1][1] > duration_sec + 0.5:
                raise ValueError(f"末句止点 {cues[-1][1]}s 超出整篇时长 {duration_sec:.3f}s + 0.5s")

            audio_hash8 = hashlib.sha256(whole_tmp.read_bytes()).hexdigest()[:8]
            transcript_hash = lesson["transcriptHash"]
            final_name = f"{transcript_hash}-{audio_hash8}.mp3"
            final_mp3 = article_dir / final_name
            whole_tmp.replace(final_mp3)

            key = f"ielts-listening/{slug}/{final_name}"
            meta = {
                "slug": slug,
                "key": key,
                "durationSec": round(duration_sec, 3),
                "transcriptHash": transcript_hash,
                "cues": cues,
                "sentenceCount": len(sentences),
                "generatedAt": iso_utc_now(),
            }
            meta_path.write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n")

            wall = time.monotonic() - started
            report["articles"][slug] = {
                "status": "done",
                "durationSec": meta["durationSec"],
                "sentenceCount": len(sentences),
                "totalWallSec": round(wall, 3),
                "avgSentenceSec": round(wall / len(sentences), 3),
                "retries": retries,
                "audioHash8": audio_hash8,
            }
            print(f"[done] {slug}: {meta['durationSec']}s, {len(sentences)} 句, 重试 {retries} 次, 耗时 {wall:.1f}s", flush=True)
        except Exception as error:
            # 整篇失败：清掉半成品目录，不留可被误当成品的分片/mp3。
            if article_dir.exists():
                shutil.rmtree(article_dir)
            reason = str(error)
            report["articles"][slug] = {"status": "failed", "sentenceCount": len(sentences), "reason": reason}
            print(f"[FAILED] {slug}: {reason}", flush=True)


# ---------------------------------------------------------------------------
# 入口
# ---------------------------------------------------------------------------

async def main() -> int:
    parser = argparse.ArgumentParser(description="雅思听力录音离线合成")
    parser.add_argument("--workdir", type=Path, default=DEFAULT_WORKDIR)
    parser.add_argument("--only", type=str, default="")
    parser.add_argument("--jobs", type=int, default=2, help="篇级并发数，默认 2")
    args = parser.parse_args()

    workdir: Path = args.workdir
    workdir.mkdir(parents=True, exist_ok=True)
    exports_dir = workdir / "exports"

    only = [s.strip() for s in args.only.split(",") if s.strip()]
    for slug in only:
        if not SLUG_RE.match(slug):
            raise SystemExit(f"非法 slug：{slug}")

    export_files = sorted(exports_dir.glob("*.json"))
    lessons: list[dict] = []
    for file in export_files:
        lesson = json.loads(file.read_text())
        if only and lesson["slug"] not in only:
            continue
        lessons.append(lesson)

    if only:
        loaded = {lesson["slug"] for lesson in lessons}
        missing = [slug for slug in only if slug not in loaded]
        if missing:
            raise SystemExit(f"缺少导出 JSON：{', '.join(missing)}（先运行 export-lessons.mts）")

    if not lessons:
        raise SystemExit("没有可合成的课时（检查 exports 目录或 --only）")

    report = {
        "startedAt": iso_utc_now(),
        "jobs": args.jobs,
        "workdir": str(workdir),
        "articles": {},
    }
    sem = asyncio.Semaphore(args.jobs)
    await asyncio.gather(*(build_article(lesson, workdir, sem, report) for lesson in lessons))

    report["finishedAt"] = iso_utc_now()
    (workdir / "synth-report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")

    failed = [slug for slug, item in report["articles"].items() if item["status"] == "failed"]
    done = [slug for slug, item in report["articles"].items() if item["status"] == "done"]
    skipped = [slug for slug, item in report["articles"].items() if item["status"] == "skipped"]
    print(f"\n汇总：完成 {len(done)}，跳过 {len(skipped)}，失败 {len(failed)}")
    if failed:
        print(f"失败篇目：{', '.join(failed)}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
