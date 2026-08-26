import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';
import { getAdminBadgeCounts } from '@/lib/admin-stats';

/**
 * 后台的统一外壳：一道鉴权 + 一套页面骨架。
 *
 * 鉴权放在布局上是**兜底**而不是替代：每个页面里原有的 `isAdminSession` 检查照旧保留
 * （页面在取数前就要挡住越权，且 `generateMetadata` 也各自跟着权限走）。
 * 但布局这一层保证「以后新增的后台页忘了写检查」不会变成一个敞开的洞——
 * 这类遗漏既不报错也不会有人报障，只能靠结构挡住。
 *
 * 同样按 404 而非 403 处理：403 等于告诉未授权访问者「这里有个后台」。
 */
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();

  const counts = await getAdminBadgeCounts();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:gap-10">
          <AdminNav counts={counts} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
