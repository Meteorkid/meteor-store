import LoadingQuip from './LoadingQuip';

export default function PageSkeleton() {
  return (
    <div className="min-h-screen">
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
