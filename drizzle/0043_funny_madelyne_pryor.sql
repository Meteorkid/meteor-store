CREATE TABLE "pathfinder_plans" (
	"user_id" text PRIMARY KEY NOT NULL,
	"plan" text NOT NULL,
	"completed_task_ids" text DEFAULT '[]' NOT NULL,
	"pinned_task_ids" text DEFAULT '[]' NOT NULL,
	"profile" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
