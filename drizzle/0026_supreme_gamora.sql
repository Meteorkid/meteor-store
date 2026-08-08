CREATE TABLE "post_sections" (
	"post_id" text NOT NULL,
	"section_id" text NOT NULL,
	CONSTRAINT "post_sections_post_id_section_id_pk" PRIMARY KEY("post_id","section_id")
);
--> statement-breakpoint
CREATE INDEX "post_sections_section_idx" ON "post_sections" USING btree ("section_id");