CREATE TABLE IF NOT EXISTS "comments" (
  "id" text PRIMARY KEY NOT NULL,
  "target_id" text NOT NULL,
  "author_id" text NOT NULL,
  "author_name" text NOT NULL,
  "author_avatar" text,
  "content" text NOT NULL,
  "parent_id" text,
  "created_at" text NOT NULL
);

CREATE INDEX IF NOT EXISTS "comments_target_idx" ON "comments" ("target_id", "created_at");
CREATE INDEX IF NOT EXISTS "comments_author_idx" ON "comments" ("author_id");
