import { cache } from 'react';
import { getSession } from './auth';

/**
 * 后台专用的会话读取，按请求去重。
 *
 * 一个后台页现在要过三道同样的检查：`generateMetadata`、布局的兜底、页面自己那道。
 * 而 `getSession()` 每次都是一次 JWT 验签 + 一次 `users` 主键查询，
 * Neon HTTP 下每次都是独立网络往返——同一个请求里跑三遍纯属浪费。
 *
 * **只在后台的服务端组件里用这个**。没有把 `getSession` 本身包起来，是因为它还被
 * 一堆 route handler 调用，其中有「改完 token_version 之后再读一次」这类路径，
 * 缓存住会读到旧值。缓存范围收窄到后台页面，风险就只剩「同一请求内权限不会变」，
 * 而这在一次渲染里本来就成立。
 */
export const getAdminPageSession = cache(getSession);
