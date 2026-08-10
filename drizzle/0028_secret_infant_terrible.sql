CREATE TABLE "personal_access_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"token_hash" text NOT NULL,
	"token_prefix" text NOT NULL,
	"scopes" text[] NOT NULL,
	"token_version" integer NOT NULL,
	"slot" integer,
	"expires_at" text NOT NULL,
	"last_used_at" text,
	"revoked_at" text,
	"created_at" text NOT NULL,
	CONSTRAINT "personal_access_tokens_slot_range" CHECK ("personal_access_tokens"."slot" is null or "personal_access_tokens"."slot" between 1 and 10)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "personal_access_tokens_hash_idx" ON "personal_access_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "personal_access_tokens_user_slot_idx" ON "personal_access_tokens" USING btree ("user_id","slot");--> statement-breakpoint
CREATE INDEX "personal_access_tokens_user_created_idx" ON "personal_access_tokens" USING btree ("user_id","created_at");