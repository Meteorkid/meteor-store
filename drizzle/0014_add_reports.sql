-- UGC 举报表
-- 覆盖评论与读者投稿两种内容
-- 不加外键（与全站其它表保持一致）；下架/注销后记录保留作留痕
CREATE TABLE IF NOT EXISTS "reports" (
  "id" text NOT NULL,
  "target_type" text NOT NULL,                  -- comment | post
  "target_id" text NOT NULL,                    -- 评论 ID 或 posts.id
  "reporter_id" text NOT NULL,
  "reason" text NOT NULL,                       -- spam | abuse | nsfw | illegal | other
  "detail" text,
  "status" text DEFAULT 'pending' NOT NULL,     -- pending | resolved | dismissed
  "resolver_id" text,
  "resolved_at" text,
  "created_at" text NOT NULL,
  CONSTRAINT "reports_id_pk" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "reports_status_idx" ON "reports" ("status");
CREATE INDEX IF NOT EXISTS "reports_target_idx" ON "reports" ("target_type", "target_id");
CREATE INDEX IF NOT EXISTS "reports_reporter_idx" ON "reports" ("reporter_id");
