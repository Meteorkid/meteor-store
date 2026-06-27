'use client';

const partners = [
  { name: 'Vercel', logo: '▲' },
  { name: 'GitHub', logo: '⚛️' },
  { name: 'Google', logo: 'G' },
  { name: 'Microsoft', logo: '🪟' },
  { name: 'Apple', logo: '' },
  { name: 'Meta', logo: '∞' },
];

export default function PartnersSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            受到信赖
          </h2>
          <p className="text-muted-foreground text-lg">
            被全球领先企业使用
          </p>
        </div>
        
        {/* Partners grid */}
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
          {partners.map((partner, index) => (
            <div 
              key={partner.name}
              className="flex items-center gap-2 text-2xl font-bold text-muted-foreground hover:text-foreground transition-colors scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span>{partner.logo}</span>
              <span>{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
