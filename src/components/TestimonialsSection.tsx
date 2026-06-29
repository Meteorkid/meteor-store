'use client';

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Senior Backend Engineer',
    company: 'Tech Startup',
    content: 'OmniCrawl handled anti-bot measures that previously took us weeks to bypass. Setup took 10 minutes, and it\'s been running reliably in production for 3 months.',
    rating: 5,
    initials: 'AC',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Sarah Liu',
    role: 'AI Research Lead',
    company: 'University Lab',
    content: 'Ex-Memory\'s context retention is genuinely impressive. We tested it against 3 commercial alternatives — it outperformed all of them on long-conversation benchmarks.',
    rating: 5,
    initials: 'SL',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Marcus Wang',
    role: 'Product Designer',
    company: 'Design Agency',
    content: 'The Skeleton Anatomy 3D viewer saved us from buying expensive medical software. The annotation layer alone is worth it for our anatomy courses.',
    rating: 5,
    initials: 'MW',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Full-Stack Developer',
    company: 'Freelance',
    content: 'I\'ve been using Statux in a React project with 200+ components. Zero prop-drilling, clean architecture, and the TypeScript support is excellent.',
    rating: 5,
    initials: 'YT',
    color: 'from-orange-500 to-red-500',
  },
  {
    name: 'David Park',
    role: 'DevOps Engineer',
    company: 'Cloud Platform',
    content: 'We integrated OmniCrawl into our data pipeline. The parallel crawling reduced our data collection time from 6 hours to 45 minutes.',
    rating: 5,
    initials: 'DP',
    color: 'from-violet-500 to-purple-500',
  },
  {
    name: 'Emma Zhang',
    role: 'Frontend Lead',
    company: 'SaaS Company',
    content: 'The UI Design System component library saved our team 200+ hours on our latest project. Clean code, great documentation, and the tokens system is well thought out.',
    rating: 5,
    initials: 'EZ',
    color: 'from-pink-500 to-rose-500',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 scroll-animate">
          <p className="text-sm text-primary uppercase tracking-widest font-medium mb-4">用户反馈</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            被开发者信赖
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            来自真实用户的声音
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={t.name}
              className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 scroll-animate"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/80 text-sm leading-relaxed mb-6">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
