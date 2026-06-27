'use client';

import { useState } from 'react';

const faqs = [
  {
    question: '如何购买产品？',
    answer: '您可以通过支付宝或微信支付购买我们的产品。选择您想要的产品，点击"立即购买"，然后选择支付方式完成购买。',
  },
  {
    question: '购买后如何获取产品？',
    answer: '购买成功后，我们会通过邮件发送产品下载链接和激活码。您也可以在"我的订单"中查看和下载产品。',
  },
  {
    question: '是否支持退款？',
    answer: '是的，我们提供 30 天退款保证。如果您对产品不满意，可以在购买后 30 天内申请全额退款。',
  },
  {
    question: '产品是否提供更新？',
    answer: '是的，所有产品都提供终身免费更新。我们会持续改进产品并添加新功能。',
  },
  {
    question: '如何获取技术支持？',
    answer: '您可以通过邮件联系我们获取技术支持。我们提供 24/7 技术支持服务。',
  },
  {
    question: '是否支持企业购买？',
    answer: '是的，我们提供企业版产品和批量购买优惠。请联系我们获取更多信息。',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  return (
    <section className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            常见问题
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            如果您有其他问题，请随时联系我们
          </p>
        </div>
        
        {/* FAQ list */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={faq.question}
              className="mb-4 scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {openIndex === index && (
                  <div className="mt-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
