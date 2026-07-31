import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RedeemForm from '@/components/RedeemForm';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: '兑换邀请码 - Meteor Store',
  description: '输入邀请码获取软件授权',
};

export default async function RedeemPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-10">
        <RedeemForm />
      </main>
      <Footer />
    </div>
  );
}
