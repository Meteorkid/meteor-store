CREATE TABLE "tollow_book_progress" (
	"user_id" text NOT NULL,
	"book_id" text NOT NULL,
	"section_id" text NOT NULL,
	"segment_index" integer NOT NULL,
	"offset" integer NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "tollow_book_progress_user_id_book_id_pk" PRIMARY KEY("user_id","book_id"),
	CONSTRAINT "tollow_book_progress_position_non_negative" CHECK ("tollow_book_progress"."segment_index" >= 0 and "tollow_book_progress"."offset" >= 0)
);
--> statement-breakpoint
CREATE TABLE "tollow_practice_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"client_record_id" text NOT NULL,
	"book_id" text,
	"book_title" text NOT NULL,
	"started_at" text NOT NULL,
	"ended_at" text NOT NULL,
	"duration_ms" integer NOT NULL,
	"words_typed" integer NOT NULL,
	"wpm" numeric(8, 2) NOT NULL,
	"accuracy" numeric(5, 2) NOT NULL,
	"error_count" integer NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "tollow_sessions_metrics_non_negative" CHECK ("tollow_practice_sessions"."duration_ms" >= 0 and "tollow_practice_sessions"."words_typed" >= 0 and "tollow_practice_sessions"."wpm" >= 0 and "tollow_practice_sessions"."error_count" >= 0),
	CONSTRAINT "tollow_sessions_accuracy_range" CHECK ("tollow_practice_sessions"."accuracy" between 0 and 100)
);
--> statement-breakpoint
CREATE TABLE "tollow_text_favorites" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"book_id" text,
	"book_title" text NOT NULL,
	"section_id" text,
	"section_title" text,
	"segment_index" integer,
	"start_offset" integer NOT NULL,
	"end_offset" integer NOT NULL,
	"quote" text NOT NULL,
	"note" text,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "tollow_favorites_offsets_valid" CHECK ("tollow_text_favorites"."start_offset" >= 0 and "tollow_text_favorites"."end_offset" >= "tollow_text_favorites"."start_offset")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "tollow_sessions_user_client_uniq" ON "tollow_practice_sessions" USING btree ("user_id","client_record_id");--> statement-breakpoint
CREATE INDEX "tollow_sessions_user_started_idx" ON "tollow_practice_sessions" USING btree ("user_id","started_at");--> statement-breakpoint
CREATE INDEX "tollow_favorites_user_updated_idx" ON "tollow_text_favorites" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "tollow_favorites_user_book_idx" ON "tollow_text_favorites" USING btree ("user_id","book_id");