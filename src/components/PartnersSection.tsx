'use client';

// 纯文字徽章：等宽字体 + 单色点缀，比 emoji 更克制统一
const techStack = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'PostgreSQL',
  'Vercel',
  'GitHub',
];

export default function PartnersSection() {
  return (
    <section className="py-16 border-t border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 scroll-animate">
          <p className="text-sm text-white/30 uppercase tracking-widest font-medium">
            基于现代技术栈构建
          </p>
        </div>

        {/* Marquee-style row */}
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
          {techStack.map((name, i) => (
            <div
              key={name}
              className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-primary/25 hover:bg-white/[0.05] transition-all duration-300 group scroll-animate"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" aria-hidden="true" />
              <span className="text-sm font-mono text-white/40 group-hover:text-white/75 transition-colors">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
