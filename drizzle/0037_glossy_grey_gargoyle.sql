CREATE TABLE "pathfinder_item_tags" (
	"item_id" text NOT NULL,
	"dimension" text NOT NULL,
	"tag" text NOT NULL,
	CONSTRAINT "pathfinder_item_tags_item_id_dimension_tag_pk" PRIMARY KEY("item_id","dimension","tag"),
	CONSTRAINT "pathfinder_item_tags_dimension_valid" CHECK ("pathfinder_item_tags"."dimension" in ('topic', 'skill', 'career', 'format'))
);
--> statement-breakpoint
CREATE TABLE "pathfinder_items" (
	"id" text PRIMARY KEY NOT NULL,
	"source_id" text NOT NULL,
	"external_id" text NOT NULL,
	"canonical_url" text NOT NULL,
	"url_hash" text NOT NULL,
	"item_type" text NOT NULL,
	"title_zh" text NOT NULL,
	"title_en" text NOT NULL,
	"summary_zh" text NOT NULL,
	"summary_en" text NOT NULL,
	"organization" text NOT NULL,
	"direction" text NOT NULL,
	"difficulty" text NOT NULL,
	"estimated_minutes" integer,
	"cost_cny" integer,
	"device" text NOT NULL,
	"network" text NOT NULL,
	"region" text,
	"remote_status" text NOT NULL,
	"eligibility_zh" text NOT NULL,
	"eligibility_en" text NOT NULL,
	"deadline_text" text,
	"deadline_at" text,
	"published_at" text,
	"discovered_at" text NOT NULL,
	"verified_at" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"learning_eligible" boolean DEFAULT false NOT NULL,
	"reviewer_id" text,
	"reviewed_at" text,
	"content_hash" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "pathfinder_items_type_valid" CHECK ("pathfinder_items"."item_type" in ('open-source', 'competition', 'internship', 'ai-update')),
	CONSTRAINT "pathfinder_items_direction_valid" CHECK ("pathfinder_items"."direction" in ('ai', 'frontend', 'backend', 'data')),
	CONSTRAINT "pathfinder_items_difficulty_valid" CHECK ("pathfinder_items"."difficulty" in ('beginner', 'intermediate', 'advanced', 'all')),
	CONSTRAINT "pathfinder_items_device_valid" CHECK ("pathfinder_items"."device" in ('phone', 'computer', 'either')),
	CONSTRAINT "pathfinder_items_network_valid" CHECK ("pathfinder_items"."network" in ('low', 'normal', 'high')),
	CONSTRAINT "pathfinder_items_remote_valid" CHECK ("pathfinder_items"."remote_status" in ('remote', 'onsite', 'hybrid', 'unspecified')),
	CONSTRAINT "pathfinder_items_status_valid" CHECK ("pathfinder_items"."status" in ('pending', 'published', 'rejected', 'archived', 'stale', 'expired')),
	CONSTRAINT "pathfinder_items_minutes_positive" CHECK ("pathfinder_items"."estimated_minutes" is null or "pathfinder_items"."estimated_minutes" > 0),
	CONSTRAINT "pathfinder_items_cost_non_negative" CHECK ("pathfinder_items"."cost_cny" is null or "pathfinder_items"."cost_cny" >= 0)
);
--> statement-breakpoint
CREATE TABLE "pathfinder_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"adapter" text NOT NULL,
	"site_url" text NOT NULL,
	"source_type" text NOT NULL,
	"trust_level" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"auto_publish" boolean DEFAULT false NOT NULL,
	"sync_interval_minutes" integer DEFAULT 1440 NOT NULL,
	"etag" text,
	"last_modified" text,
	"cursor" text,
	"last_success_at" text,
	"last_error" text,
	"consecutive_failures" integer DEFAULT 0 NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "pathfinder_sources_adapter_valid" CHECK ("pathfinder_sources"."adapter" in ('manual', 'github', 'rss', 'atom')),
	CONSTRAINT "pathfinder_sources_type_valid" CHECK ("pathfinder_sources"."source_type" in ('manual', 'api', 'rss', 'atom', 'html')),
	CONSTRAINT "pathfinder_sources_trust_valid" CHECK ("pathfinder_sources"."trust_level" in ('official', 'verified')),
	CONSTRAINT "pathfinder_sources_sync_interval_positive" CHECK ("pathfinder_sources"."sync_interval_minutes" > 0),
	CONSTRAINT "pathfinder_sources_failures_non_negative" CHECK ("pathfinder_sources"."consecutive_failures" >= 0)
);
--> statement-breakpoint
CREATE INDEX "pathfinder_item_tags_dimension_tag_idx" ON "pathfinder_item_tags" USING btree ("dimension","tag","item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pathfinder_items_source_external_uniq" ON "pathfinder_items" USING btree ("source_id","external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pathfinder_items_url_hash_uniq" ON "pathfinder_items" USING btree ("url_hash");--> statement-breakpoint
CREATE INDEX "pathfinder_items_source_idx" ON "pathfinder_items" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "pathfinder_items_status_type_idx" ON "pathfinder_items" USING btree ("status","item_type");--> statement-breakpoint
CREATE INDEX "pathfinder_items_status_direction_idx" ON "pathfinder_items" USING btree ("status","direction");--> statement-breakpoint
CREATE INDEX "pathfinder_items_status_deadline_idx" ON "pathfinder_items" USING btree ("status","deadline_at");--> statement-breakpoint
CREATE INDEX "pathfinder_items_status_learning_idx" ON "pathfinder_items" USING btree ("status","learning_eligible");--> statement-breakpoint
CREATE UNIQUE INDEX "pathfinder_sources_site_url_uniq" ON "pathfinder_sources" USING btree ("site_url");--> statement-breakpoint
CREATE INDEX "pathfinder_sources_enabled_idx" ON "pathfinder_sources" USING btree ("enabled","updated_at");