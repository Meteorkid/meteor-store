# 博客发布 API

博客发布 API 供 Codex、Claude Code 等本地工具管理**当前已验证用户自己的数据库投稿**。它不能发布或编辑 `content/blog/` 中的文件文章，也不能访问账户、订单、授权码或管理员后台。

机器可读合约：[`/api/v1/blog/openapi.json`](https://imagentx.top/api/v1/blog/openapi.json)。

## 先创建并保护令牌

登录后前往“账户设置 → 博客 API 令牌”，输入当前密码，选择名称、权限和有效期（30、90 或 365 天）。完整令牌只显示一次；关闭提示后无法找回，只能新建。

在本机终端中静默读取令牌，再设置临时环境变量。令牌内容不会回显，也不会成为 shell 历史中的命令文本：

```bash
printf '粘贴博客 API 令牌：'
IFS= read -r -s METEOR_BLOG_TOKEN
printf '\n'
export METEOR_BLOG_TOKEN
export METEOR_STORE_API='https://imagentx.top/api/v1/blog'
```

不要把令牌提交到仓库、`.md` 文章、`AGENTS.md`、提示词文件、截图、日志或 shell 历史共享文件。不要通过 URL 参数、请求 JSON 或 Cookie 传递令牌；每次请求只使用请求头：

```bash
curl --fail-with-body \
  -H "Authorization: Bearer $METEOR_BLOG_TOKEN" \
  "$METEOR_STORE_API/sections"
```

可用 scope 相互独立：

| Scope | 能力 |
| --- | --- |
| `blog:read` | 读取分区、自己的文章和预览 |
| `blog:write` | 创建文章，修改自己的草稿或被驳回文章 |
| `blog:submit` | 提交文章，撤回待审核文章 |
| `blog:image` | 上传博客图片 |

## 发布流程

以下流程假设令牌拥有四项 scope。所有私有响应均不缓存；命令中的文章 ID 和 `updatedAt` 应替换为接口实际返回值。

### 1. 获取分区

`sectionId` 与 `sections` 只能使用此接口列出的 ID。主分区应放在 `sections` 首位；最多 8 个分区和 8 个标签。

```bash
curl --fail-with-body \
  -H "Authorization: Bearer $METEOR_BLOG_TOKEN" \
  "$METEOR_STORE_API/sections"
```

字段限制：标题去首尾空白后 4–80 字，摘要 10–200 字，Markdown 正文 200–50,000 字；标签每个 1–24 字；日期如提供必须是 `YYYY-MM-DD`。请求对象是严格模式，`authorId`、`status`、`asAdmin`、`adminPublish` 等未列出的字段会被拒绝。

### 2. 创建草稿

创建永远得到 `draft`，不会隐式提交。示例正文需满足最小长度；使用真实内容时请自行替换。

```bash
curl --fail-with-body -X POST "$METEOR_STORE_API/posts" \
  -H "Authorization: Bearer $METEOR_BLOG_TOKEN" \
  -H 'Content-Type: application/json' \
  --data '{
    "title": "用 API 整理一篇 Markdown 投稿",
    "excerpt": "通过个人访问令牌创建、预览并明确提交一篇博客投稿。",
    "content": "这里放入至少两百个字符的 Markdown 正文。可以先由本地工具生成草稿，再由作者审核事实、链接和隐私内容。发布前请确认文章分区与标签准确，图片 URL 来自本 API 的上传接口。这个示例故意保留为普通投稿，不会借由请求字段指定作者、审核状态或管理员能力。继续补充正文，直到满足长度限制并准备好进入预览步骤。提交之前还要检查引用是否可靠、代码能否运行、图片是否包含敏感信息，并删除模型可能编造的结论。排版可以使用标题、列表、引用和代码块，但不要依赖会被安全管线丢弃的原生 HTML。最后再通读一遍摘要和正文，确认它们准确表达同一个主题。",
    "sectionId": "literature",
    "sections": ["literature"],
    "tags": ["写作", "API"],
    "eventDate": null
  }'
```

保存响应中的 `post.id` 与 `post.updatedAt`。创建响应还含有中英文浏览器预览地址；这些地址不携带令牌，并继续使用正常登录会话校验作者身份。

创建、修改、提交和撤回这些写操作只返回 `id`、`status`、`updatedAt` 和 `previewUrls`，**不返回正文**。需要再次读取 Markdown 时，令牌必须额外拥有 `blog:read` scope，并调用单篇 GET 接口。

### 3. 读取并修改 Markdown

列表最多返回最近更新的 100 篇摘要，不含正文；单篇读取返回完整正文：

```bash
curl --fail-with-body \
  -H "Authorization: Bearer $METEOR_BLOG_TOKEN" \
  "$METEOR_STORE_API/posts/POST_ID"
```

修改必须带上刚读取到的 `updatedAt`。这是乐观并发控制：不要猜测或复用旧值。先将修改后的完整 Markdown 保存到 `/absolute/path/article.md`，并确保移除首尾空白后不少于 200 个字符。下面的 `jq --rawfile` 会按 JSON 规则安全编码正文中的引号、换行和代码，无需将长文内联到 shell 命令：

```bash
POST_ID='POST_ID'
EXPECTED_UPDATED_AT="$(
  curl --fail-with-body \
    -H "Authorization: Bearer $METEOR_BLOG_TOKEN" \
    "$METEOR_STORE_API/posts/$POST_ID" | jq -er '.post.updatedAt'
)"

PATCH_BODY="$(
jq -e -n \
  --arg expectedUpdatedAt "$EXPECTED_UPDATED_AT" \
  --rawfile content /absolute/path/article.md \
  'if (($content | gsub("^\\s+|\\s+$"; "") | length) < 200)
   then error("content must contain at least 200 characters after trimming")
   else {expectedUpdatedAt: $expectedUpdatedAt, content: $content}
   end'
)" || exit 1

curl --fail-with-body -X PATCH "$METEOR_STORE_API/posts/$POST_ID" \
  -H "Authorization: Bearer $METEOR_BLOG_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary "$PATCH_BODY"
unset PATCH_BODY
```

只允许修改自己的 `draft` 或 `rejected` 文章。被驳回文章更新后会回到草稿并清除旧审核留痕；`pending` 和 `published` 文章在本 API 中只读。

### 4. 上传图片并预览

上传仅接受能被服务端实际解码为 WebP、JPEG、PNG、GIF 的文件，单图最大 5,000,000 字节、4000 万像素；仅伪造文件名或 MIME 会被拒绝。响应 `url` 可直接插入 Markdown，`quota` 给出上传后的已用、上限和剩余字节数：

```bash
curl --fail-with-body -X POST "$METEOR_STORE_API/images" \
  -H "Authorization: Bearer $METEOR_BLOG_TOKEN" \
  -F 'file=@/absolute/path/to/image.png'

curl --fail-with-body \
  -H "Authorization: Bearer $METEOR_BLOG_TOKEN" \
  "$METEOR_STORE_API/posts/POST_ID/preview"
```

普通账户的图片总配额是 200 MiB（209,715,200 字节），管理员账户是 1 GiB（1,073,741,824 字节）。同一账户重复上传内容完全相同且已就绪的图片会复用原 URL，不重复占用配额。Cookie 投稿页和博客 API 共用每用户 10 次/分钟的上传额度；全站最多 30 次/分钟，单个服务进程最多同时处理 4 张图片。

首版不提供单图删除接口，因为删除已经写入 Markdown 或历史版本的对象会造成裂图。达到配额后，已有图片仍可访问，新的唯一图片会被拒绝；请联系管理员核对并清理未引用对象。

预览响应中的 `html` 已走正式 Markdown 渲染和 sanitize 管线；原生 HTML 会被丢弃。根据预览修订后，务必使用 PATCH 响应中新的 `updatedAt`。

### 5. 明确提交或撤回

提交是独立操作，必须携带最新 `updatedAt`：

```bash
curl --fail-with-body -X POST "$METEOR_STORE_API/posts/POST_ID/submit" \
  -H "Authorization: Bearer $METEOR_BLOG_TOKEN" \
  -H 'Content-Type: application/json' \
  --data '{"expectedUpdatedAt":"从最近一次响应复制的 updatedAt"}'
```

普通用户提交后状态变为 `pending`，进入人工审核；管理员使用自己的令牌提交自己的文章时会直接变为 `published`。管理员令牌不会获得编辑他人文章、审核投稿或调用后台接口的能力。

待审核文章可在审核前无请求体撤回：

```bash
curl --fail-with-body -X POST "$METEOR_STORE_API/posts/POST_ID/withdraw" \
  -H "Authorization: Bearer $METEOR_BLOG_TOKEN"
```

## 错误恢复

| 状态 | 稳定错误码 | 应对方式 |
| --- | --- | --- |
| 400 | `invalid_request` | 检查严格字段、长度、分区、标签、日期或 JSON。不要加入作者、状态或管理员字段。 |
| 401 | `invalid_token` | 检查 Authorization 格式、令牌是否已撤销/过期，或在账户页创建新令牌。邮箱必须仍为已验证状态。 |
| 403 | `insufficient_scope` | 在账户页另建一枚包含该操作 scope 的令牌；现有令牌无法提权。 |
| 404 | `post_not_found` | 确认文章 ID；不存在和不属于当前用户的文章都返回该错误。 |
| 409 | `version_conflict` | 重新 GET 文章，合并本地改动，并用最新 `updatedAt` 重试 PATCH 或提交。 |
| 409 | `invalid_state` | 文章当前状态不允许该操作；例如 API 不可修改已发布文章。 |
| 409 | `image_upload_in_progress` | 相同内容正在由另一个请求上传；等待 `Retry-After` 后重试。 |
| 413 / 415 | `invalid_image` | 缩小图片，或换成能被实际解码且声明格式一致的受支持图片。 |
| 413 | `storage_quota_exceeded` | 查看 `details.usedBytes`、`limitBytes` 和 `requestedBytes`；复用已有图片，或联系管理员清理未引用对象。 |
| 429 | `rate_limited` | 等待响应头 `Retry-After` 指定的秒数后再试，不要并发重放请求。 |
| 429 | `upload_busy` | 当前服务进程的图片处理槽位已满；等待 `Retry-After` 后重试。 |
| 500 | `internal_error` | 不要盲目重放写请求；先重新 GET 确认当前状态和 `updatedAt`，再决定是否重试。 |
| 503 | `storage_unavailable` | 图片存储暂不可用；保留草稿，稍后重试上传。 |

响应错误格式固定如下，客户端应根据 `error.code` 而非人类可读 `message` 做恢复分支：

```json
{
  "error": {
    "code": "version_conflict",
    "message": "文章已被其他客户端修改",
    "details": {}
  }
}
```

完成发布后可从当前 shell 清除令牌：

```bash
unset METEOR_BLOG_TOKEN
```
