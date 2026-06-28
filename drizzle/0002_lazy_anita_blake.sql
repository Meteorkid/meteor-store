CREATE TABLE "feedbacks" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"created_at" text NOT NULL
);
