import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PathfinderSubnav from '@/components/pathfinder/PathfinderSubnav';

export default function PathfinderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <PathfinderSubnav />
      <div className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[34rem] bg-[radial-gradient(circle_at_18%_24%,rgba(124,58,237,0.18),transparent_38%),radial-gradient(circle_at_82%_12%,rgba(14,165,233,0.12),transparent_34%)] blur-3xl"
        />
        {children}
      </div>
      <Footer />
    </div>
  );
}
