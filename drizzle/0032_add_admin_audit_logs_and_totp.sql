-- 管理员操作审计日志 + TOTP 两步验证列
-- 注意：本迁移必须先于引用这些列/表的应用代码部署（drizzle-kit migrate 或手工执行）。

CREATE TABLE "admin_audit_logs" (
  "id" text PRIMARY KEY,
  "admin_id" text NOT NULL,
  "admin_email" text NOT NULL,
  "action" text NOT NULL,
  "target_type" text,
  "target_id" text,
  "detail" text,
  "ip" text,
  "created_at" text NOT NULL
);
CREATE INDEX "admin_audit_logs_created_idx" ON "admin_audit_logs" ("created_at");
CREATE INDEX "admin_audit_logs_admin_idx" ON "admin_audit_logs" ("admin_id", "created_at");

ALTER TABLE "users" ADD COLUMN "totp_secret_enc" text;
ALTER TABLE "users" ADD COLUMN "totp_enabled" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN "totp_recovery_codes" text;
