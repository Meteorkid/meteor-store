CREATE TABLE "daily_editions" (
	"id" text PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"channel" text NOT NULL,
	"status" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"content" jsonb,
	"source_key" text,
	"error" text,
	"published_at" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "daily_editions_channel_check" CHECK ("daily_editions"."channel" IN ('english', 'papers', 'ai', 'events')),
	CONSTRAINT "daily_editions_status_check" CHECK ("daily_editions"."status" IN ('draft', 'published', 'empty', 'failed'))
);
--> statement-breakpoint
CREATE TABLE "daily_preferences" (
	"user_id" text PRIMARY KEY NOT NULL,
	"channels" jsonb NOT NULL,
	"reminders" boolean DEFAULT false NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_reminders" (
	"date" text PRIMARY KEY NOT NULL,
	"edition_ids" jsonb NOT NULL,
	"published_at" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "daily_editions_date_channel_idx" ON "daily_editions" USING btree ("date","channel");--> statement-breakpoint
CREATE UNIQUE INDEX "daily_editions_source_idx" ON "daily_editions" USING btree ("channel","source_key");