CREATE TABLE "pathfinder_deadline_reminders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"item_id" text NOT NULL,
	"deadline" text NOT NULL,
	"sent_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pathfinder_follows" (
	"user_id" text NOT NULL,
	"kind" text NOT NULL,
	"value" text NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "pathfinder_follows_user_id_kind_value_pk" PRIMARY KEY("user_id","kind","value"),
	CONSTRAINT "pathfinder_follows_kind_valid" CHECK ("pathfinder_follows"."kind" in ('organization', 'topic'))
);
--> statement-breakpoint
CREATE TABLE "pathfinder_saves" (
	"item_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" text NOT NULL,
	"remind_deadline" boolean DEFAULT true NOT NULL,
	CONSTRAINT "pathfinder_saves_item_id_user_id_pk" PRIMARY KEY("item_id","user_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "pathfinder_deadline_reminders_unique_idx" ON "pathfinder_deadline_reminders" USING btree ("user_id","item_id","deadline");--> statement-breakpoint
CREATE INDEX "pathfinder_deadline_reminders_user_idx" ON "pathfinder_deadline_reminders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pathfinder_follows_kind_value_idx" ON "pathfinder_follows" USING btree ("kind","value");--> statement-breakpoint
CREATE INDEX "pathfinder_saves_user_idx" ON "pathfinder_saves" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pathfinder_saves_item_idx" ON "pathfinder_saves" USING btree ("item_id");