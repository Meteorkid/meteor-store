CREATE TABLE "announcements" (
	"id" text PRIMARY KEY NOT NULL,
	"title_zh" text,
	"title_en" text,
	"body_zh" text,
	"body_en" text,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "announcements_published_idx" ON "announcements" USING btree ("published","published_at");