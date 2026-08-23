# Ex-Memory 在线体验部署

## 架构

- 商城入口：`/{locale}/products/ex-memory` → `/{locale}/apps/ex-memory`
- 体验页面保留 Meteor Store 页头页尾，登录后才渲染同源 iframe。
- iframe 访问 `/ex-memory-runtime/`，Nginx 通过 `auth_request` 调用
  `/api/internal/ex-memory-auth` 校验 Meteor Store session。
- Nginx 覆盖外部身份头，将不可变的 Meteor Store user ID 转发给仅监听
  `127.0.0.1:18000` 的 Ex-Memory 容器。

## 密钥配置

生成一枚随机服务间令牌，并保持以下三处完全一致：

- Meteor Store `.env.production`：`EX_MEMORY_PROXY_TOKEN`
- Ex-Memory `.env`：`METEOR_STORE_PROXY_TOKEN`
- Nginx 私密 include：`/etc/nginx/private/ex-memory-proxy-token.conf`

include 文件权限必须为 `600`，内容格式如下；令牌不得提交到仓库：

```nginx
set $ex_memory_proxy_token "<random-token>";
```

## 发布顺序

1. 使用 Ex-Memory 的 `docker-compose.production.yml` 构建并启动容器。
2. 验证 `http://127.0.0.1:18000/health` 与 `/health/ready`。
3. 构建并重启 Meteor Store，确认 `/api/health` 正常。
4. 将 `deploy/nginx.conf` 安装到服务器，运行 `nginx -t` 后 reload。

## 验收

```bash
curl -I https://imagentx.top/ex-memory-runtime/            # 未登录应为 401
curl -I https://imagentx.top/zh/apps/ex-memory             # 应为 200
curl -I https://imagentx.top/zh/products/ex-memory         # 应为 200
```

还需在浏览器完成一次登录验收：登录后应返回体验页、iframe 正常加载；退出登录或
session 失效后，运行时请求必须重新变为 401。

## 回滚

按相反顺序回滚：先恢复 Nginx 备份并 reload，再恢复 Meteor Store `.next`，最后停止
Ex-Memory 容器。不要删除 `data/` 与 `exes/`，它们保存用户映射和体验数据。
