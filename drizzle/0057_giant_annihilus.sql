CREATE TABLE "ielts_pairs" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"task" text NOT NULL,
	"category" text NOT NULL,
	"topic" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"content" jsonb,
	"source" text DEFAULT 'generated' NOT NULL,
	"published_at" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "ielts_pairs_task_check" CHECK ("ielts_pairs"."task" IN ('task2', 'task1-academic', 'task1-general')),
	CONSTRAINT "ielts_pairs_status_check" CHECK ("ielts_pairs"."status" IN ('draft', 'published', 'hidden')),
	CONSTRAINT "ielts_pairs_source_check" CHECK ("ielts_pairs"."source" IN ('curated', 'generated'))
);
--> statement-breakpoint
CREATE TABLE "ielts_progress" (
	"user_id" text NOT NULL,
	"pair_slug" text NOT NULL,
	"studied_at" text,
	"bookmarked_at" text,
	"updated_at" text NOT NULL,
	CONSTRAINT "ielts_progress_user_id_pair_slug_pk" PRIMARY KEY("user_id","pair_slug")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ielts_pairs_slug_idx" ON "ielts_pairs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "ielts_pairs_task_status_idx" ON "ielts_pairs" USING btree ("task","status");--> statement-breakpoint
CREATE INDEX "ielts_progress_user_bookmark_idx" ON "ielts_progress" USING btree ("user_id","bookmarked_at");