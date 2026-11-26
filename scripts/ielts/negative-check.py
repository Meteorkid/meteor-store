#!/usr/bin/env python3
"""
离线负例验证：证明逐句校验会拦住缺词、重复词、时长异常、空边界，
且单句失败会让整篇中止、不留下半成品。

不联网、不调 edge-tts：直接调用 synthesize.py 里的纯校验函数，
并用桩替换逐句合成，验证 build_article 的失败清理语义。

用法：
  python3 scripts/ielts/negative-check.py
退出码 0 = 全部负例都被正确拦住；1 = 有该拦没拦（或行为不符合预期）。
"""
import asyncio
import shutil
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import synthesize  # noqa: E402

TEXT = "Sunday afternoons works well for me. How much does it cost?"
GOOD_BOUNDARIES = synthesize.WORD_RE.findall(TEXT)
WORDS = synthesize.word_count(TEXT)

failures: list[str] = []


def expect_reject(label: str, boundaries: list[str], duration: float, needle: str) -> None:
    try:
        synthesize.validate_sentence(TEXT, boundaries, duration)
    except ValueError as error:
        if needle not in str(error):
            failures.append(f"{label}: 拒绝原因不含 {needle!r}：{error}")
        else:
            print(f"PASS  {label}：已拦截（{needle}）")
    else:
        failures.append(f"{label}: 应当拒绝但通过了")


def main() -> int:
    # 基线：正常输入必须通过。
    words = synthesize.validate_sentence(TEXT, GOOD_BOUNDARIES, 5.0)
    assert words == WORDS, f"基线词数 {words} ≠ {WORDS}"
    print(f"PASS  基线：正常句子通过（{WORDS} 词）")

    # ① 缺词：丢掉句尾一个词（模拟 TTS 漏读最后一个词）。
    expect_reject("缺词（丢句尾词）", GOOD_BOUNDARIES[:-1], 5.0, "词不匹配")

    # ② 重复词：边界里多出最后一个词（模拟 TTS 重复朗读）。
    expect_reject("重复词", GOOD_BOUNDARIES + [GOOD_BOUNDARIES[-1]], 5.0, "词不匹配")

    # ③ 时长异常：边界齐全但音频短到低于宽松下限。
    expect_reject("时长低于下限", GOOD_BOUNDARIES, 0.05, "时长")

    # ③b 截断：词边界齐全，但音频短于最后一个词边界的结束时间 + 容差。
    #     这是真实出现过的情况（test-05-part-1 第 034 句：11 词只合成出 1.92s）。
    try:
        synthesize.validate_sentence(TEXT, GOOD_BOUNDARIES, 1.92, last_boundary_end=2.17)
    except ValueError as error:
        if "截断" not in str(error):
            failures.append(f"截断：拒绝原因不含 '截断'：{error}")
        else:
            print("PASS  截断（边界齐全但音频偏短）：已拦截（截断）")
    else:
        failures.append("截断：应当拒绝但通过了")

    # ④ 空边界：一个 WordBoundary 都没收到。
    expect_reject("空边界", [], 5.0, "WordBoundary")

    # ⑤ 集成：单句合成失败 → 整篇标记 failed，半成品目录被清空。
    workdir = Path(tempfile.mkdtemp(prefix="ielts-neg-"))
    try:
        lesson = {
            "slug": "test-01-part-1",
            "part": 1,
            "speechRate": None,
            "transcriptHash": "aec4cb5c4dbef6f6",
            "sentences": [
                {"index": 0, "speaker": "receptionist", "voice": "en-GB-SoniaNeural", "text": GOOD_BOUNDARIES and TEXT},
                {"index": 1, "speaker": "caller", "voice": "en-GB-RyanNeural", "text": "Hi. I saw a poster about your course."},
            ],
        }

        async def fake_synth(sentence, voice, rate, out_path, retries):
            raise ValueError(f"第 {sentence['index']:03d} 句重试 {retries} 次仍失败：词不匹配（模拟缺词）")

        synthesize.synth_sentence = fake_synth  # 桩掉网络合成

        report: dict = {"articles": {}}
        sem = asyncio.Semaphore(2)
        asyncio.run(synthesize.build_article(lesson, workdir, sem, report))

        article_dir = workdir / lesson["slug"]
        status = report["articles"][lesson["slug"]]["status"]
        if status != "failed":
            failures.append(f"集成：篇目状态应为 failed，实际 {status}")
        elif article_dir.exists():
            failures.append("集成：失败后半成品目录未被清理")
        elif (article_dir / "meta.json").exists():
            failures.append("集成：失败后仍留下 meta.json")
        else:
            print("PASS  集成：单句失败 → 整篇 failed，目录已清空、无 meta/整篇 mp3")
    finally:
        shutil.rmtree(workdir, ignore_errors=True)

    if failures:
        print("\n负例未全部通过：")
        for item in failures:
            print(" - " + item)
        return 1
    print("\n全部负例均被正确拦住。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
