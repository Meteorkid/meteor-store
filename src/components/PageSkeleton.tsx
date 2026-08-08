import LoadingQuip from './LoadingQuip';

export default function PageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* 星空底纹：静态星点，衬在骨架之下 */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 12% 28%, rgba(255,255,255,.5) 50%, transparent 50%),' +
            'radial-gradient(1.5px 1.5px at 68% 12%, rgba(255,255,255,.4) 50%, transparent 50%),' +
            'radial-gradient(1px 1px at 42% 64%, rgba(255,255,255,.35) 50%, transparent 50%),' +
            'radial-gradient(2px 2px at 85% 45%, rgba(196,181,253,.4) 50%, transparent 50%),' +
            'radial-gradient(1px 1px at 25% 82%, rgba(255,255,255,.3) 50%, transparent 50%)',
        }}
      />
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
              <div className="w-32 h-6 rounded bg-secondary animate-pulse" />
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-4 rounded bg-secondary animate-pulse" />
              <div className="w-12 h-4 rounded bg-secondary animate-pulse" />
              <div className="w-20 h-10 rounded-lg bg-secondary animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="relative container mx-auto px-4 py-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="w-24 h-8 rounded-full bg-secondary animate-pulse mx-auto mb-8" />
            <div className="w-96 h-16 rounded bg-secondary animate-pulse mx-auto mb-6" />
            <div className="w-80 h-8 rounded bg-secondary animate-pulse mx-auto mb-6" />
            <div className="w-96 h-4 rounded bg-secondary animate-pulse mx-auto mb-12" />
            <div className="flex gap-4 justify-center">
              <div className="w-32 h-12 rounded-lg bg-secondary animate-pulse" />
              <div className="w-32 h-12 rounded-lg bg-secondary animate-pulse" />
            </div>
            <LoadingQuip />
          </div>
        </div>
      </section>

      {/* Products skeleton */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-48 h-10 rounded bg-secondary animate-pulse mx-auto mb-4" />
            <div className="w-64 h-6 rounded bg-secondary animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6">
                <div className="w-12 h-12 rounded bg-secondary animate-pulse mb-4" />
                <div className="w-24 h-6 rounded bg-secondary animate-pulse mb-2" />
                <div className="w-32 h-4 rounded bg-secondary animate-pulse mb-4" />
                <div className="w-16 h-8 rounded bg-secondary animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
