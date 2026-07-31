-- 用户个人简介字段
-- 幂等，中断后可直接重跑。
-- 回滚：ALTER TABLE "users" DROP COLUMN IF EXISTS "bio";

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" text;
