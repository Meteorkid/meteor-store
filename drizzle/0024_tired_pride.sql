CREATE TABLE "pass_reminders" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"expires_at" text NOT NULL,
	"sent_at" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "pass_reminders_email_expiry_idx" ON "pass_reminders" USING btree ("email","expires_at");--> statement-breakpoint
CREATE INDEX "pass_reminders_email_idx" ON "pass_reminders" USING btree ("email");