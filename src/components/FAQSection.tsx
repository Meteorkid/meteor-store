'use client';

import { useState, useRef, useEffect } from 'react';
import { SHOW_PRICING } from '@/lib/constants';

const allFaqs = [
  {
    question: '如何购买产品？',
    answer: '选择你想要的产品和方案，点击「立即购买」，通过支付宝完成支付。支付成功后，确认邮件会自动发送到你的邮箱。',
    commercial: true,
  },
  {
    question: '购买后如何获取产品？',
    answer: '支付成功后，我们会通过邮件发送产品下载链接和激活码。你也可以在订单详情页面查看购买记录。',
    commercial: true,
  },
  {
    question: '是否支持退款？',
    answer: '是的，我们提供 30 天退款保证。如果你对产品不满意，可以在购买后 30 天内联系我们申请全额退款。',
    commercial: true,
  },
  {
    question: '产品是否提供更新？',
    answer: '是的，所有产品都提供终身免费更新。我们会持续改进产品并添加新功能。',
    commercial: false,
  },
  {
    question: '如何获取技术支持？',
    answer: '你可以通过邮件联系我们获取技术支持，或在 GitHub 上提交 Issue。我们会在 24 小时内回复。',
    commercial: false,
  },
  {
    question: '是否支持企业购买？',
    answer: '是的，我们提供企业版产品和批量购买优惠。请通过邮件联系我们获取定制方案。',
    commercial: true,
  },
];

// 备案期间隐藏销售相关 FAQ
const faqs = SHOW_PRICING ? allFaqs : allFaqs.filter(f => !f.commercial);

function FAQItem({ faq, isOpen, onToggle }: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="mb-3 scroll-animate">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full text-left p-5 rounded-xl border transition-all duration-300 ${
          isOpen
            ? 'border-primary/30 bg-white/[0.03]'
            : 'border-white/[0.06] bg-transparent hover:border-white/10 hover:bg-white/[0.02]'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-medium text-foreground">{faq.question}</h3>
          <svg
            className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Animated content */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: height }}
        >
          <div ref={contentRef} className="pt-3 text-sm text-muted-foreground leading-relaxed">
            {faq.answer}
          </div>
        </div>
      </button>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-animate">
          <p className="text-sm text-primary uppercase tracking-widest font-medium mb-4">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            常见问题
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            如果你有其他问题，请随时联系我们
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
