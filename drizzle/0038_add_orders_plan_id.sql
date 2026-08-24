ALTER TABLE "orders" ADD COLUMN "plan_id" text;
--> statement-breakpoint
UPDATE "orders"
SET "plan_id" = CASE
  WHEN lower(trim("plan_name")) = 'pro' THEN 'pro'
  WHEN lower(trim("plan_name")) IN ('basic', 'free') THEN 'free'
END
WHERE "product_id" = 'tollow'
  AND "plan_id" IS NULL
  AND lower(trim("plan_name")) IN ('pro', 'basic', 'free');
