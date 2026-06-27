'use client';

const testimonials = [
  {
    name: '张三',
    role: '前端开发者',
    content: '这些工具大大提高了我的工作效率，特别是 OmniCrawl，帮我节省了大量时间。',
    rating: 5,
    avatar: '👨‍💻',
  },
  {
    name: '李四',
    role: 'AI 研究员',
    content: 'Ex-Memory 是我用过的最好的 AI 记忆系统，非常智能且易于使用。',
    rating: 5,
    avatar: '👩‍🔬',
  },
  {
    name: '王五',
    role: '产品经理',
    content: 'UI Design System 让我们的设计流程更加标准化，团队协作更顺畅。',
    rating: 5,
    avatar: '👨‍💼',
  },
  {
    name: '赵六',
    role: '全栈开发者',
    content: 'Statux 让状态管理变得如此简单，再也不用为复杂的 state 发愁了。',
    rating: 5,
    avatar: '👩‍💻',
  },
  {
    name: '孙七',
    role: '设计师',
    content: 'Skeleton Anatomy 的 3D 解剖图谱非常惊艳，客户反馈非常好。',
    rating: 5,
    avatar: '👨‍🎨',
  },
  {
    name: '周八',
    role: '创业者',
    content: 'Tollow 帮我更好地管理项目进度，团队效率提升了很多。',
    rating: 5,
    avatar: '👩‍🚀',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            用户评价
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            听听用户怎么说
          </p>
        </div>
        
        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="relative p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
