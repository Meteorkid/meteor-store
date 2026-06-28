import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeedbackForm from './FeedbackForm';

export const metadata: Metadata = {
  title: '反馈建议 - Meteor Store',
  description: '提交 Bug 反馈、功能建议或使用疑问，我们会认真处理每一条反馈。',
};

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">反馈与建议</h1>
          <p className="text-gray-400 mb-10">
            遇到了 Bug？有功能建议？或者只是有个问题想问？我们都会认真看。
          </p>
          <FeedbackForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
