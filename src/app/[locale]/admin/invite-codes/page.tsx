import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InviteCodeManager from '@/components/InviteCodeManager';
import { getSession } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { products } from '@/data/products';

export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession();
  const allowed = session && isAdminEmail(session.email);
  return {
    title: allowed ? '邀请码管理 - Meteor Store' : '页面未找到 - Meteor Store',
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function InviteCodesPage() {
  const session = await getSession();
  if (!session || !isAdminEmail(session.email)) notFound();

  const productOptions = products.map((p) => ({
    id: p.id,
    name: p.name,
    plans: p.pricing.map((pr) => pr.name),
  }));

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8">
            <h1 className="t-title-2">邀请码管理</h1>
            <p className="mt-2 text-sm text-gray-400">
              创建邀请码分发给用户，兑换后自动生成授权码
            </p>
          </header>
          <InviteCodeManager products={productOptions} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
