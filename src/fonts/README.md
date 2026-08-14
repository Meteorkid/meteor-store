# 自托管字体

原为 `next/font/google` 构建期从 fonts.googleapis.com 下载；国内网络不可达时构建会无限挂起（生产构建无请求超时）。改为自托管：

| 文件 | 字体 | 来源 |
| --- | --- | --- |
| `Geist-Latin.woff2` | Geist（variable，100–900） | Google Fonts，latin 子集 |
| `GeistMono-Latin.woff2` | Geist Mono（variable，100–900） | Google Fonts，latin 子集 |
| `DancingScript-Latin.woff2` | Dancing Script（700） | Google Fonts，latin 子集 |

三个字体均为 SIL Open Font License 1.1 授权，可自由自托管与再分发。
