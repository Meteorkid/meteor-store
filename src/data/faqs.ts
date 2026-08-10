import type { Locale } from '@/i18n/routing';

export interface FaqMeta {
  id: string;
  commercial: boolean;
  helpSlug?: string;
  question: { zh: string; en: string };
  answer: { zh: string; en: string };
}

export interface LocalizedFaq {
  id: string;
  commercial: boolean;
  helpSlug?: string;
  question: string;
  answer: string;
}

export const faqItems: FaqMeta[] = [
  {
    id: 'purchase',
    question: { zh: '如何购买产品？', en: 'How to purchase products?' },
    answer: { zh: '选择你想要的产品和方案，点击「立即购买」，通过支付宝完成支付。支付成功后，确认邮件会自动发送到你的邮箱。', en: 'Choose your desired product and plan, click \'Buy Now\', and complete payment via Alipay. After successful payment, a confirmation email will be sent to your inbox automatically.' },
    commercial: true,
  },
  {
    id: 'delivery',
    question: { zh: '购买后如何获取产品？', en: 'How to get the product after purchase?' },
    answer: { zh: '支付成功后，我们会通过邮件发送订单信息和激活码；产品下载入口保留在对应产品页，使用同一邮箱注册并验证后也可在账户中心查看授权码。', en: 'After successful payment, we send the order details and activation code by email. Download links remain on the product page, and a verified account using the same email can view the licence key.' },
    commercial: true,
  },
  {
    id: 'refund',
    question: { zh: '是否支持退款？', en: 'Are refunds supported?' },
    answer: { zh: '支持。未实际使用的误购可在付款后 7 天内申请；未交付、重复扣款或重大功能缺陷等情形按退款政策处理。', en: 'Yes. An unused mistaken purchase may be refunded within 7 days; non-delivery, duplicate charges, and major defects are handled under the Refund Policy.' },
    commercial: true,
  },
  {
    id: 'updates',
    question: { zh: '产品是否提供更新？', en: 'Do products get updates?' },
    answer: { zh: '我们会持续维护产品；具体更新范围以产品页、开源许可证和购买时的授权说明为准。', en: 'We continue to maintain our products. The update scope follows the product page, open-source licence, and the licence terms shown at purchase.' },
    commercial: false,
  },
  {
    id: 'support',
    question: { zh: '如何获取技术支持？', en: 'How to get technical support?' },
    answer: { zh: '你可以通过邮件联系我们获取技术支持，我们会在 24 小时内回复。', en: 'You can contact us via email for technical support. We will reply within 24 hours.' },
    commercial: false,
  },
  {
    id: 'enterprise',
    question: { zh: '是否支持企业购买？', en: 'Are enterprise purchases supported?' },
    answer: { zh: '是的，我们提供企业版产品和批量购买优惠。请通过邮件联系我们获取定制方案。', en: 'Yes, we offer enterprise products and bulk purchase discounts. Please contact us via email for customized solutions.' },
    commercial: true,
  },
];

export function localizeFaqs(locale: Locale, showPricing: boolean): LocalizedFaq[] {
  return faqItems
    .filter((faq) => showPricing || !faq.commercial)
    .map((faq) => ({
      id: faq.id,
      commercial: faq.commercial,
      helpSlug: faq.helpSlug,
      question: faq.question[locale],
      answer: faq.answer[locale],
    }));
}
