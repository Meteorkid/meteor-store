CREATE TABLE "xiaohongshu_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"source_kind" text DEFAULT 'manual' NOT NULL,
	"source_ref" text,
	"source_url" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "xiaohongshu_notes_title_check" CHECK (char_length("xiaohongshu_notes"."title") <= 20),
	CONSTRAINT "xiaohongshu_notes_body_check" CHECK (char_length("xiaohongshu_notes"."body") <= 1000),
	CONSTRAINT "xiaohongshu_notes_tags_check" CHECK (jsonb_typeof("xiaohongshu_notes"."tags") = 'array' AND jsonb_array_length("xiaohongshu_notes"."tags") <= 10),
	CONSTRAINT "xiaohongshu_notes_images_check" CHECK (jsonb_typeof("xiaohongshu_notes"."images") = 'array' AND jsonb_array_length("xiaohongshu_notes"."images") <= 18),
	CONSTRAINT "xiaohongshu_notes_status_check" CHECK ("xiaohongshu_notes"."status" IN ('draft', 'ready', 'published')),
	CONSTRAINT "xiaohongshu_notes_source_check" CHECK ("xiaohongshu_notes"."source_kind" IN ('daily', 'post', 'manual'))
);
--> statement-breakpoint
CREATE INDEX "xiaohongshu_notes_status_updated_idx" ON "xiaohongshu_notes" USING btree ("status","updated_at");--> statement-breakpoint
CREATE INDEX "xiaohongshu_notes_source_idx" ON "xiaohongshu_notes" USING btree ("source_kind","source_ref");