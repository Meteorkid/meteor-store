# 雅思听力录音生产脚本

离线把 `src/data/ielts-listening/` 里的课时文本合成成 mp3，校验通过后再上传公开 R2
bucket、合并进音频清单。整条链路不上传题目内容，逐句分片只留在本地工作目录做审计证据。

## 脚本一览

| 脚本 | 运行时 | 职责 |
|------|--------|------|
| `export-lessons.mts` | Node 22（类型剥离） | 把指定 slug 的课时导出成合成用 JSON（含 `transcriptHash`，算法复用 `src/lib/ielts-listening/transcript-hash.ts`） |
| `synthesize.py` | Python 3 + edge-tts 7.x | 逐句合成、三道校验、拼装整篇、写 `meta.json` |
| `upload.mjs` | Node 22 + `@aws-sdk/client-s3` | 把整篇 mp3 上传公开 R2 bucket（逐句分片不上传） |
| `merge-manifest.mjs` | Node 22 | 把 `meta.json` 合并进 `audio-manifest.json`，只动 `--only` 点名的 slug |
| `negative-check.py` | Python 3（离线，不联网） | 负例自检：缺词/重复词/时长异常/空边界必须被拦，单句失败必须清空半成品 |

## 前置条件

- Node ≥ 22（仓库 `node_modules` 已装，含 `@aws-sdk/client-s3`）。
- Python 3，且当前解释器能 `import edge_tts`（7.x，建议 7.3.1）：
  ```bash
  python3 -m pip install edge-tts==7.3.1
  # 或用已有 venv 的解释器，例如：
  # /Users/meteor/Library/Caches/meteor-listening-audio/venv/bin/python scripts/ielts/synthesize.py ...
  ```
- `ffmpeg` / `ffprobe` 在 PATH 中。
- 上传前在仓库根 `.env.local` 配齐：`R2_ACCOUNT_ID`、`R2_ACCESS_KEY_ID`、
  `R2_SECRET_ACCESS_KEY`、`R2_BUCKET`、`R2_PUBLIC_BASE`（合成与合并不需要）。

## 完整流程

工作目录默认在仓库之外：
`~/Library/Application Support/Doubao/Default/.doubao/agent_mode/workspace/ielts-audio`
（可用 `--workdir` 覆盖；不要放仓库里，也不要放 `/tmp`。）

### 1. 导出合成 JSON

```bash
# 全部课时
node --experimental-strip-types --no-warnings scripts/ielts/export-lessons.mts

# 只导出指定篇目（逗号分隔）
node --experimental-strip-types --no-warnings scripts/ielts/export-lessons.mts \
  --only test-01-part-1,test-01-part-2
```

产物：`{workdir}/exports/{slug}.json`，字段：`slug`、`part`、`speechRate`、
`cast`（id + voice）、逐句 `text`/`speaker`/`voice`、`transcriptHash`、`sentenceCount`。

### 2. 离线合成（不上传、不改清单）

```bash
python3 scripts/ielts/synthesize.py --only test-01-part-1
python3 scripts/ielts/synthesize.py --only test-01-part-1,test-01-part-2 --jobs 2
```

- `--jobs N`：**篇级并发**，默认 2；篇内句子顺序合成，保证 cues 确定。
- 断点续跑：`meta.json` 存在、`transcriptHash` 一致、整篇 mp3 还在，就跳过该篇。
- 指标汇总写 `{workdir}/synth-report.json`（每篇时长、逐句平均耗时、整篇耗时、重试次数）。

### 3. 上传前预览（dry-run，不发请求）

```bash
node scripts/ielts/upload.mjs --only test-01-part-1 --dry-run
```

### 4. 实际上传

```bash
node scripts/ielts/upload.mjs --only test-01-part-1
```

- 只上传整篇 mp3；`sentences/` 逐句分片留在工作目录，不进 bucket。
- `ContentType: audio/mpeg`，`CacheControl: public, max-age=31536000, immutable`。
- 上传后打印对象 key 与可访问 URL（`R2_PUBLIC_BASE` + key）。

### 5. 合并清单预览（dry-run，不改文件）

```bash
node scripts/ielts/merge-manifest.mjs --only test-01-part-1 --dry-run
```

### 6. 写入清单

```bash
node scripts/ielts/merge-manifest.mjs --only test-01-part-1
```

只覆盖 `--only` 点名的 slug，其它条目原样保留；临时文件 + rename 原子写入。

### 7. 离线负例自检（不联网、不写产物）

```bash
python3 scripts/ielts/negative-check.py
```

覆盖：丢句尾词（缺词）、重复朗读（多词）、时长低于下限、空 WordBoundary，
以及「单句失败 → 整篇 failed → 半成品目录清空」的集成语义。退出码 0 表示全部被正确拦住。

## 产物布局

```
{workdir}/
  exports/{slug}.json                 # 第 1 步导出
  {slug}/
    sentences/NNN.mp3                  # 逐句分片（审计证据，不上传）
    {transcriptHash}-{audioHash8}.mp3  # 整篇
    meta.json                          # slug/key/durationSec/transcriptHash/cues/sentenceCount/generatedAt
  _silence/                           # 0.12s / 0.28s 静音片（同编码参数）
  synth-report.json                   # 本次合成指标
```

对象 key：`ielts-listening/{slug}/{transcriptHash}-{audioHash8}.mp3`，
`audioHash8` 是整篇 mp3 字节 SHA-256 前 8 位。清单只写 key，URL 由 `R2_PUBLIC_BASE` 拼。

## 合成校验规则（每句）

1. **词边界非空**：edge-tts 7.x 的 `Communicate` 默认 `SentenceBoundary`，必须显式传
   `boundary="WordBoundary"`；不传就一个词边界都收不到。
2. **逐词一致**：所有词边界文本归一化（小写、去掉非字母数字）后，与整句文本同样归一化的
   结果**完全相等**——既查漏词也查重复，且不因 `don't`、连字符、分词差异误报。
3. **时长下限**：句 mp3 实际时长（ffprobe）≥ 词数 / 4.5 秒，防截断。

每句最多重试 3 次；仍失败则**该篇整体失败**：删除半成品目录、不产出可被误当成品的分片或
mp3，打印句号与原因，退出码非 0。其它篇目继续。

## 拼装口径

- 逐句分片：edge-tts 默认 24kHz / 48kbps / 单声道。
- 句间静音：同说话人 0.12s，换说话人 0.28s；静音片用
  `anullsrc=r=24000:cl=mono` + `libmp3lame 48k`，与分片同编码参数。
- 整篇：ffmpeg concat demuxer `-c copy` 直拼，不重编码。
- cues：起点 = 前面所有句时长与静音之和；`cues[-1][1] <= durationSec + 0.5`，
  cues 条数必须等于句数。

## 注意事项

- `text` 是朗读脚本；`displayText` 只影响页面展示，**不参与朗读、不进 transcriptHash**。
- 两层校验分工：逐句边界校验拦的是 **TTS 输出相对文本漂移**（漏读/重复/截断/空边界）；
  题目文本被改动则由 `transcriptHash` 兜底——导出时按 `transcript-hash.ts` 同算法重算，
  清单/目录拿它和当前原文比对，对不上就不播旧录音。
- 现有 8 篇音频已在线，脚本只能处理 `--only` 明确点名的 slug，不会覆盖或改写其它条目。
- edge-tts 走微软非官方接口，公开分发授权口径不明确；正式上线前应换有商用授权的 TTS。
