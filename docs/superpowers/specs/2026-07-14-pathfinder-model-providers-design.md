# Pathfinder 扩展模型服务商设计

## 目标

将 Pathfinder 的模型服务商下拉选项由 3 个扩展为 20 个固定 API 端点，覆盖常用国内和国际模型服务；用户仍自行填写 API Key 与模型 ID。

## 范围与边界

- 仅纳入支持 `POST {baseUrl}/chat/completions`、Bearer API Key 的公开固定端点。
- 不开放任意 Base URL、自定义域名、局域网地址或用户资源专属端点。
- 不接入 Anthropic 专有协议、Azure OpenAI、Google Vertex AI、Cloudflare Workers AI 等需要资源名、项目 ID 或区域域名的服务。
- 不在应用内动态拉取模型列表：这会额外转发用户密钥并增加兼容性、隐私与失败路径。模型 ID 由用户按所选服务商的官方模型目录填写。

## 服务商白名单

### 国内与区域服务（9 个端点）

| 服务商 | Base URL |
| --- | --- |
| DeepSeek | `https://api.deepseek.com` |
| 硅基流动 SiliconFlow | `https://api.siliconflow.cn/v1` |
| 阿里云百炼（中国） | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| 阿里云百炼（国际） | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| 智谱 AI | `https://open.bigmodel.cn/api/paas/v4` |
| MiniMax（中国） | `https://api.minimaxi.com/v1` |
| MiniMax（国际） | `https://api.minimax.io/v1` |
| 火山方舟 | `https://ark.cn-beijing.volces.com/api/v3` |
| 腾讯混元 | `https://api.hunyuan.cloud.tencent.com/v1` |

### 国际服务（11 个端点）

| 服务商 | Base URL |
| --- | --- |
| OpenAI | `https://api.openai.com/v1` |
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` |
| xAI Grok | `https://api.x.ai/v1` |
| Mistral AI | `https://api.mistral.ai/v1` |
| OpenRouter | `https://openrouter.ai/api/v1` |
| Groq | `https://api.groq.com/openai/v1` |
| Together AI | `https://api.together.ai/v1` |
| Fireworks AI | `https://api.fireworks.ai/inference/v1` |
| NVIDIA NIM | `https://integrate.api.nvidia.com/v1` |
| Cerebras | `https://api.cerebras.ai/v1` |
| DeepInfra | `https://api.deepinfra.com/v1/openai` |

## 交互设计

1. 服务商下拉按“国内与区域服务”“国际服务”分组，并显示品牌名与区域标识。
2. 选中服务商后，展示固定 Base URL 和“查看模型目录”链接；模型名输入框继续允许手动填写，避免账户权限、模型下线或区域差异造成错误预置。
3. 已保存的旧配置继续可用。若其 Base URL 不在新版白名单，界面回落到默认服务商，服务端仍拒绝该配置。

## 数据与安全设计

- 在 `TRUSTED_MODEL_PROVIDERS` 的每一项新增 `group` 与 `docsUrl` 元数据；`baseUrl` 仍是唯一的服务端授权依据。
- `getTrustedModelProvider` 继续只接受精确的 HTTPS 白名单地址（忽略末尾 `/`），拒绝用户名、密码、查询参数、片段和一切未列出域名。
- 继续使用 `fetch(..., { redirect: 'error', signal: AbortSignal.timeout(15_000) })`；不改变用户密钥仅存于 `sessionStorage` 的规则。

## 测试与验收

- 白名单单元测试覆盖 20 个端点及每个端点的末尾斜杠形式。
- 增加相似域名、拼接路径、查询参数、片段等拒绝案例，确保扩容不会放宽 SSRF 边界。
- 运行 `pnpm test`、`pnpm exec tsc --noEmit`；若环境允许，再运行 `pnpm build`。

## 官方端点依据

- [阿里云百炼](https://help.aliyun.com/en/model-studio/base-url)、[智谱 AI](https://docs.bigmodel.cn/cn/guide/develop/http/introduction)、[MiniMax](https://platform.minimaxi.com/document/%E5%AF%B9%E8%AF%9D?key=66701d281d57f38758d581d0)、[腾讯混元](https://cloud.tencent.com/document/product/1729/111007)。
- [Google Gemini](https://ai.google.dev/gemini-api/docs/openai)、[xAI](https://docs.x.ai/developers/rest-api-reference/inference/chat)、[Mistral](https://docs.mistral.ai/api)、[OpenRouter](https://openrouter.ai/docs/quickstart)、[Groq](https://console.groq.com/docs/openai)。
- [Together AI](https://docs.together.ai/docs/inference/openai-compatibility)、[Fireworks AI](https://docs.fireworks.ai/tools-sdks/openai-compatibility)、[NVIDIA NIM](https://docs.api.nvidia.com/nim/reference/openai-gpt-oss-120b-infer)、[Cerebras](https://inference-docs.cerebras.ai/resources/openai)、[DeepInfra](https://docs.deepinfra.com/chat/overview)。
