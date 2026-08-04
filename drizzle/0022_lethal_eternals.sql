ALTER TABLE "users" ADD COLUMN "student_email" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "student_verified_at" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_student_email_unique" UNIQUE("student_email");