import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PathfinderSubnav from '@/components/pathfinder/PathfinderSubnav';

export default function PathfinderLayout({ children }: { children: React.ReactNode }) {
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
        <div className="container mx-auto grid min-w-0 grid-cols-1 xl:grid-cols-[10rem_minmax(0,1fr)] xl:gap-6 xl:px-4 2xl:grid-cols-[11rem_minmax(0,1fr)] 2xl:gap-8">
          <PathfinderSubnav />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
