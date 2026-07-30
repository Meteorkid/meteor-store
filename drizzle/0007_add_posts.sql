CREATE TABLE "post_tags" (
	"post_id" text NOT NULL,
	"tag" text NOT NULL,
	"label" text NOT NULL,
	CONSTRAINT "post_tags_post_id_tag_pk" PRIMARY KEY("post_id","tag")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"section_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"review_note" text,
	"reviewer_id" text,
	"reviewed_at" text,
	"published_at" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "post_tags_tag_idx" ON "post_tags" USING btree ("tag");--> statement-breakpoint
CREATE INDEX "posts_status_created_idx" ON "posts" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "posts_published_idx" ON "posts" USING btree ("published_at");