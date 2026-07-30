-- 用户投稿：posts + post_tags
--
-- 全部语句幂等，中断后可直接重跑。
-- 回滚：DROP TABLE IF EXISTS "post_tags"; DROP TABLE IF EXISTS "posts";
-- 两张表都是新增，不触碰任何已有表，回滚不影响现有数据。

CREATE TABLE IF NOT EXISTS "post_tags" (
	"post_id" text NOT NULL,
	"tag" text NOT NULL,
	"label" text NOT NULL,
	CONSTRAINT "post_tags_post_id_tag_pk" PRIMARY KEY("post_id","tag")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"section_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"review_note" text,
	"reviewer_id" text,
	"reviewed_at" text,
	"published_at" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_tags_tag_idx" ON "post_tags" USING btree ("tag");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_status_created_idx" ON "posts" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_author_idx" ON "posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_published_idx" ON "posts" USING btree ("published_at");
