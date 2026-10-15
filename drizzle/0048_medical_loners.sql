ALTER TABLE "daily_editions" ADD COLUMN "automation_paused" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "masters_rounds" ADD COLUMN "automation_paused" boolean DEFAULT false NOT NULL;--> statement-breakpoint
-- 保留迁移前的人工编辑与下架意图；初始自动草稿仍可由新任务校验后发布。
UPDATE "daily_editions" SET "automation_paused" = true
WHERE ("source_key" IS NULL AND "status" IN ('draft', 'published'))
OR EXISTS (
  SELECT 1 FROM "admin_audit_logs" a
  WHERE a."target_type" = 'daily-edition' AND a."target_id" = "daily_editions"."id"
    AND a."action" IN ('daily.save', 'daily.publish', 'daily.retire')
);--> statement-breakpoint
UPDATE "masters_rounds" SET "automation_paused" = true
WHERE "revision" > 1 OR "status" = 'published';
