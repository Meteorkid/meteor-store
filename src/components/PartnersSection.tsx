'use client';

const techStack = [
  { name: 'Next.js', icon: '⚡' },
  { name: 'React', icon: '⚛️' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'Tailwind CSS', icon: '🎨' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'Vercel', icon: '▲' },
  { name: 'GitHub', icon: '🐙' },
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
          {techStack.map((tech, i) => (
            <div
              key={tech.name}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300 group scroll-animate"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{tech.icon}</span>
              <span className="text-sm text-white/40 group-hover:text-white/70 transition-colors font-medium">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
