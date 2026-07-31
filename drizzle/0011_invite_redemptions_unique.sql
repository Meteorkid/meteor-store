-- invite_redemptions 加 (invite_code_id, user_id) 唯一约束
-- 防止应用层 select-then-insert 竞态导致同一用户对同一邀请码兑换多次
-- 幂等，中断后可直接重跑。
-- 回滚：DROP INDEX IF EXISTS "invite_redemptions_code_user_uniq";

CREATE UNIQUE INDEX IF NOT EXISTS "invite_redemptions_code_user_uniq"
  ON "invite_redemptions" ("invite_code_id", "user_id");
