-- 文章收藏表
-- target_id 复用 views/likes 约定：文件文章用 slug，数据库投稿用 post.id
CREATE TABLE IF NOT EXISTS "post_favorites" (
  "target_id" text NOT NULL,
  "user_id" text NOT NULL,
  "created_at" text NOT NULL,
  CONSTRAINT "post_favorites_target_id_user_id_pk" PRIMARY KEY ("target_id", "user_id")
);
CREATE INDEX IF NOT EXISTS "post_favorites_target_idx" ON "post_favorites" ("target_id");
CREATE INDEX IF NOT EXISTS "post_favorites_user_idx" ON "post_favorites" ("user_id");
