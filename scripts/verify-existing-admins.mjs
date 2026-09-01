import { createSql } from './lib/pg-sql.mjs';

function getAdminEmails() {
  return [...new Set(
    (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )];
}

function placeholders(count) {
  return Array.from({ length: count }, (_, index) => `$${index + 1}`).join(', ');
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');

  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) throw new Error('ADMIN_EMAILS is empty; refusing to continue');

  const sql = createSql(databaseUrl);
  const params = placeholders(adminEmails.length);
  const matched = await sql.query(
    `SELECT email_verified FROM users WHERE lower(email) IN (${params})`,
    adminEmails,
  );
  const pending = matched.filter((row) => row.email_verified !== true);

  console.log(JSON.stringify({
    configuredAdmins: adminEmails.length,
    registeredAdmins: matched.length,
    alreadyVerified: matched.length - pending.length,
    pendingVerification: pending.length,
    mode: process.argv.includes('--apply') ? 'apply' : 'dry-run',
  }));

  if (!process.argv.includes('--apply')) return;
  if (matched.length === 0) {
    throw new Error('No registered administrator matched; refusing to apply');
  }

  const updated = await sql.query(
    `UPDATE users
       SET email_verified = true
     WHERE lower(email) IN (${params})
       AND email_verified = false
     RETURNING id`,
    adminEmails,
  );

  console.log(JSON.stringify({ updatedAdmins: updated.length }));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Administrator verification failed');
  process.exitCode = 1;
});
