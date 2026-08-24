ALTER TABLE "pathfinder_items" ADD COLUMN "organization_en" text;--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD COLUMN "directions" text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD COLUMN "cost_amount" numeric(14, 2);--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD COLUMN "cost_currency" text;--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD COLUMN "cost_label_zh" text;--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD COLUMN "cost_label_en" text;--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD COLUMN "region_zh" text;--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD COLUMN "region_en" text;--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD COLUMN "deadline_text_zh" text;--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD COLUMN "deadline_text_en" text;--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD COLUMN "deadline_date" text;--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD COLUMN "requires_manual_eligibility_check" boolean DEFAULT false NOT NULL;--> statement-breakpoint
UPDATE "pathfinder_items"
SET
  "organization_en" = "organization",
  "directions" = json_build_array("direction")::text,
  "cost_amount" = "cost_cny",
  "cost_currency" = CASE WHEN "cost_cny" IS NULL THEN NULL ELSE 'CNY' END,
  "region_zh" = "region",
  "region_en" = CASE WHEN lower("region") = 'global' THEN 'Global' ELSE "region" END,
  "deadline_text_zh" = "deadline_text",
  "deadline_text_en" = "deadline_text",
  "deadline_date" = CASE
    WHEN "deadline_at" ~ '^\d{4}-\d{2}-\d{2}' THEN substring("deadline_at" from 1 for 10)
    ELSE NULL
  END;--> statement-breakpoint
ALTER TABLE "pathfinder_items" ALTER COLUMN "organization_en" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD CONSTRAINT "pathfinder_items_cost_amount_non_negative" CHECK ("pathfinder_items"."cost_amount" is null or "pathfinder_items"."cost_amount" >= 0);--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD CONSTRAINT "pathfinder_items_cost_currency_valid" CHECK ("pathfinder_items"."cost_currency" is null or "pathfinder_items"."cost_currency" ~ '^[A-Z]{3}$');--> statement-breakpoint
ALTER TABLE "pathfinder_items" ADD CONSTRAINT "pathfinder_items_deadline_date_valid" CHECK ("pathfinder_items"."deadline_date" is null or "pathfinder_items"."deadline_date" ~ '^\d{4}-\d{2}-\d{2}$');
