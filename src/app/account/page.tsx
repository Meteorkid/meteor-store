import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountForms from '@/components/AccountForms';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: '个人主页 - Meteor Store',
  robots: { index: false, follow: false },
};

// 依赖 cookie，不能静态化
export const dynamic = 'force-dynamic';

function formatJoinDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  // 读库而不是读 JWT：token 里只有签发时的快照，拿不到学生身份、注册时间这些
  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!user) redirect('/login');

  const displayName = user.name || user.email.split('@')[0];
  const initial = displayName[0]?.toUpperCase() ?? '?';

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-2xl">
          <h1 className="sr-only">个人主页</h1>

          {/* 身份卡：只读信息集中在这里，可改的放下面 */}
          <section className="glass-card mb-10 rounded-3xl p-7 md:p-9">
            <div className="flex flex-wrap items-center gap-5">
              <span
                aria-hidden
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white"
              >
                {initial}
              </span>
              <div className="min-w-0">
                <p className="t-title-2 t-on-glass truncate">{displayName}</p>
                <p className="t-footnote mt-1 truncate text-white/60">{user.email}</p>
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.08] pt-6 sm:grid-cols-3">
              <div>
                <dt className="t-eyebrow text-white/45">加入时间</dt>
                <dd className="t-footnote mt-1.5 tabular-nums text-white/80">
                  {formatJoinDate(user.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="t-eyebrow text-white/45">邮箱状态</dt>
                <dd className="t-footnote mt-1.5 text-white/80">
                  {user.emailVerified ? '已验证' : '未验证'}
                </dd>
              </div>
              <div>
                <dt className="t-eyebrow text-white/45">学生身份</dt>
                <dd className="t-footnote mt-1.5 text-white/80">
                  {user.isStudent ? '已认证' : '未认证'}
                </dd>
              </div>
            </dl>

            {!user.isStudent && (
              <p className="t-footnote mt-6 text-white/60">
                在校学生用教育邮箱可以免费用全部付费功能，
                <a
                  href="/student"
                  className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                >
                  去认证
                </a>
                。
              </p>
            )}
          </section>

          <AccountForms initialName={user.name ?? ''} email={user.email} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
