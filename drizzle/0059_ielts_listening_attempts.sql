CREATE TABLE "ielts_listening_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lesson_slug" text NOT NULL,
	"mode" text NOT NULL,
	"question_numbers" jsonb NOT NULL,
	"answers" jsonb NOT NULL,
	"wrong_numbers" jsonb NOT NULL,
	"score" integer NOT NULL,
	"total" integer NOT NULL,
	"duration_sec" integer NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "ielts_listening_attempts_mode_check" CHECK ("ielts_listening_attempts"."mode" IN ('full', 'custom')),
	CONSTRAINT "ielts_listening_attempts_lesson_check" CHECK ("ielts_listening_attempts"."lesson_slug" ~ '^test-[0-9]{2}-part-[1-4]$'),
	CONSTRAINT "ielts_listening_attempts_questions_check" CHECK (jsonb_typeof("ielts_listening_attempts"."question_numbers") = 'array' AND jsonb_array_length("ielts_listening_attempts"."question_numbers") BETWEEN 1 AND 10),
	CONSTRAINT "ielts_listening_attempts_answers_check" CHECK (jsonb_typeof("ielts_listening_attempts"."answers") = 'object' AND octet_length("ielts_listening_attempts"."answers"::text) <= 4096),
	CONSTRAINT "ielts_listening_attempts_wrong_check" CHECK (jsonb_typeof("ielts_listening_attempts"."wrong_numbers") = 'array' AND jsonb_array_length("ielts_listening_attempts"."wrong_numbers") <= 10),
	CONSTRAINT "ielts_listening_attempts_score_check" CHECK ("ielts_listening_attempts"."score" >= 0 AND "ielts_listening_attempts"."score" <= "ielts_listening_attempts"."total" AND "ielts_listening_attempts"."total" BETWEEN 1 AND 10),
	CONSTRAINT "ielts_listening_attempts_duration_check" CHECK ("ielts_listening_attempts"."duration_sec" >= 0 AND "ielts_listening_attempts"."duration_sec" <= 86400),
	CONSTRAINT "ielts_listening_attempts_created_check" CHECK ("ielts_listening_attempts"."created_at" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T')
);
--> statement-breakpoint
CREATE INDEX "ielts_listening_attempts_user_created_idx" ON "ielts_listening_attempts" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "ielts_listening_attempts_user_lesson_idx" ON "ielts_listening_attempts" USING btree ("user_id","lesson_slug","created_at");