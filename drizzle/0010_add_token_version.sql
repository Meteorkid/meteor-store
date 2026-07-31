-- 用户 token_version 字段：用于"改密踢掉其他会话"。
-- 写入会话 JWT，getSession 比对 session 内的 tokenVersion 与数据库当前值，
-- 不一致即视为过期。
-- 幂等，中断后可直接重跑。
-- 回滚：ALTER TABLE "users" DROP COLUMN IF EXISTS "token_version";

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "token_version" integer NOT NULL DEFAULT 0;
