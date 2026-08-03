ALTER TABLE "invite_codes" ADD COLUMN "plan_id" text;
UPDATE "invite_codes"
SET "plan_id" = lower(trim(both '-' from regexp_replace("plan_name", '[^a-zA-Z0-9]+', '-', 'g')));
ALTER TABLE "invite_codes" ALTER COLUMN "plan_id" SET NOT NULL;
