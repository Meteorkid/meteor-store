import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
  title: '登录 - Meteor Store',
  description: '登录或注册 Meteor Store 账户',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto flex items-center justify-center px-4 py-16 md:py-24">
        <AuthForm />
      </main>
      <Footer />
    </div>
  );
}
