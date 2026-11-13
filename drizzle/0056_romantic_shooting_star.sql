CREATE TABLE "study_courses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"term" text NOT NULL,
	"name" text NOT NULL,
	"credits" numeric(4, 1) NOT NULL,
	"score" numeric(5, 1),
	"status" text DEFAULT 'in-progress' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "study_courses_status_check" CHECK ("study_courses"."status" IN ('in-progress', 'completed')),
	CONSTRAINT "study_courses_credits_check" CHECK ("study_courses"."credits" >= 0.5 AND "study_courses"."credits" <= 20),
	CONSTRAINT "study_courses_score_check" CHECK ("study_courses"."score" IS NULL OR ("study_courses"."score" >= 0 AND "study_courses"."score" <= 100))
);
--> statement-breakpoint
CREATE TABLE "study_deadlines" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"course_id" text,
	"title" text NOT NULL,
	"kind" text DEFAULT 'assignment' NOT NULL,
	"due_at" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"notes" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "study_deadlines_kind_check" CHECK ("study_deadlines"."kind" IN ('assignment', 'exam', 'project', 'other')),
	CONSTRAINT "study_deadlines_status_check" CHECK ("study_deadlines"."status" IN ('open', 'done'))
);
--> statement-breakpoint
CREATE TABLE "study_problems" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"topic" text DEFAULT '' NOT NULL,
	"difficulty" text DEFAULT 'medium' NOT NULL,
	"url" text,
	"status" text DEFAULT 'todo' NOT NULL,
	"notes" text,
	"review_stage" integer DEFAULT 0 NOT NULL,
	"review_due_on" text,
	"review_interval_days" integer DEFAULT 1 NOT NULL,
	"last_reviewed_on" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "study_problems_difficulty_check" CHECK ("study_problems"."difficulty" IN ('easy', 'medium', 'hard')),
	CONSTRAINT "study_problems_status_check" CHECK ("study_problems"."status" IN ('todo', 'solved')),
	CONSTRAINT "study_problems_review_stage_check" CHECK ("study_problems"."review_stage" >= 0 AND "study_problems"."review_stage" <= 5)
);
--> statement-breakpoint
CREATE INDEX "study_courses_user_term_idx" ON "study_courses" USING btree ("user_id","term");--> statement-breakpoint
CREATE INDEX "study_deadlines_user_due_idx" ON "study_deadlines" USING btree ("user_id","due_at");--> statement-breakpoint
CREATE INDEX "study_problems_user_status_idx" ON "study_problems" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "study_problems_user_review_idx" ON "study_problems" USING btree ("user_id","review_due_on");