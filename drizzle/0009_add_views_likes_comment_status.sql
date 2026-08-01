-- 为 comments 表添加审核状态
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'approved' NOT NULL;
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "reviewed_at" text;
CREATE INDEX IF NOT EXISTS "comments_status_idx" ON "comments" ("status");

-- 页面浏览量表
CREATE TABLE IF NOT EXISTS "page_views" (
  "id" text PRIMARY KEY NOT NULL,
  "target_id" text NOT NULL,
  "ip_hash" text NOT NULL,
  "created_at" text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "page_views_target_ip_uniq" ON "page_views" ("target_id", "ip_hash");
CREATE INDEX IF NOT EXISTS "page_views_target_idx" ON "page_views" ("target_id");

-- 点赞表
CREATE TABLE IF NOT EXISTS "likes" (
  "target_id" text NOT NULL,
  "user_id" text NOT NULL,
  "created_at" text NOT NULL,
  CONSTRAINT "likes_target_id_user_id_pk" PRIMARY KEY ("target_id", "user_id")
);
CREATE INDEX IF NOT EXISTS "likes_target_idx" ON "likes" ("target_id");