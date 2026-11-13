import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StudySubnav from '@/components/study/StudySubnav';

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[34rem] blur-3xl"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 24%, var(--site-glow-deep), transparent 38%), radial-gradient(circle at 82% 12%, var(--site-glow-accent), transparent 34%)',
          }}
        />
        <StudySubnav />
        <main className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
