'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { SHOW_PRICING } from '@/lib/constants';
import { localizeFaqs } from '@/data/faqs';
import type { Locale } from '@/i18n/routing';



// 备案期间隐藏销售相关 FAQ
const localizedFaqs = localizeFaqs('zh' as Locale, SHOW_PRICING);

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
        className={`glass-card w-full text-left p-5 rounded-xl transition-all duration-300 ${
          isOpen
            ? '!border-t-purple-400/30 !border-l-purple-400/15 !border-r-purple-400/10 !border-b-purple-400/5 shadow-[inset_0_1px_0_rgba(168,85,247,0.12)]'
            : ''
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
  const t = useTranslations('FAQSection');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-animate">
          <p className="text-sm text-primary uppercase tracking-widest font-medium mb-4">FAQ</p>
          <h2 className="t-title-1 text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {localizedFaqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={{ question: faq.question, answer: faq.answer }}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
