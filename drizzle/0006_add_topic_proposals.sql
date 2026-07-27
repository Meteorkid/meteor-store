-- 新增 topic_proposals（读者话题提议收件箱），不改动任何既有表。
-- users 表历史上是用 db:push 直接建的，未进过迁移文件，所以 drizzle 这次
-- 会把它一起生成出来；两条语句都加 IF NOT EXISTS，保证在已有库和全新库上都能跑。
-- 回滚：DROP TABLE "topic_proposals";
CREATE TABLE IF NOT EXISTS "topic_proposals" (
	"id" text PRIMARY KEY NOT NULL,
	"section_id" text NOT NULL,
	"title" text NOT NULL,
	"pitch" text NOT NULL,
	"submitter_email" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text,
	"avatar_url" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"is_student" boolean DEFAULT false NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
