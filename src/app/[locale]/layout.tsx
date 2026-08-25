import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import ScrollAnimateInit from "@/components/ScrollAnimateInit";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import ExperienceAwareChrome from "@/components/ExperienceAwareChrome";
import { AuthProvider } from "@/components/AuthProvider";
import { HelpPanelProvider } from "@/components/help/HelpPanelContext";
import { SITE_URL } from "@/lib/constants";
import { buildAlternateUrls } from "@/lib/seo";
import "../globals.css";

const geistSans = localFont({
  src: "../../fonts/Geist-Latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "../../fonts/GeistMono-Latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * 搜索引擎站长平台的归属验证 meta 标签。
 *
 * 三家都支持「HTML 标签」验证方式，比传验证文件省事：在各自后台拿到 content 值，
 * 填进对应环境变量即可。**没配的那家不输出标签**——挂一个空 content 的
 * 验证标签会让平台判定验证失败，比没有更糟。
 *
 * 值本身不是密钥（本来就要公开在页面源码里），但仍走环境变量而非硬编码，
 * 免得换域名或重新验证时要改代码。
 */
function siteVerification(): Metadata["verification"] | undefined {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  const bing = process.env.BING_SITE_VERIFICATION?.trim();
  const baidu = process.env.BAIDU_SITE_VERIFICATION?.trim();

  const other: Record<string, string> = {};
  if (bing) other["msvalidate.01"] = bing;
  if (baidu) other["baidu-site-verification"] = baidu;

  if (!google && Object.keys(other).length === 0) return undefined;

  return {
    ...(google ? { google } : {}),
    ...(Object.keys(other).length > 0 ? { other } : {}),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "HomePage" });

  // og:url 必须是**当前页面**的地址，不是站点首页。写死首页的话，
  // 每条分享出去的链接在微信/Twitter 的抓取端看来都指向同一个页面，
  // 也会让搜索引擎收到「这些页面其实是一个」的信号。
  const alternates = buildAlternateUrls((await headers()).get("x-pathname"));
  const pageUrl = alternates?.canonical ?? SITE_URL;

  return {
    // 让 metadata 里的相对地址（og:image 等）解析成绝对地址；缺了它 Next 会告警
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s | Meteor Store`,
    },
    description: t("description"),
    keywords: [
      "developer tools",
      "AI apps",
      "crawler framework",
      "design tools",
      "macOS apps",
      "open source",
      "Next.js",
      "React component library",
    ],
    authors: [{ name: "Meteor Store" }],
    creator: "Meteor Store",
    icons: {
      icon: "/favicon.svg",
      // iOS Safari 不读 manifest 里的 icons，「添加到主屏幕」只认 apple-touch-icon。
      // 缺了它 iOS 会拿页面截图当图标，PWA 在 iPhone 上就是半残的
      apple: "/icon-192.png",
    },
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: pageUrl,
      siteName: "Meteor Store",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${SITE_URL}/og-image.png`],
      site: "@Meteorkid",
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: siteVerification(),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // 验证 locale 是否有效
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // 启用静态渲染
  setRequestLocale(locale);

  // 获取翻译消息
  const messages = await getMessages();

  // JSON-LD 结构化数据
  //
  // 两条并列：Organization 描述「谁在经营」，WebSite 描述「这个站叫什么」。
  // 只有 Organization 时，搜索引擎缺少把站点与品牌词绑定的那条声明——
  // 而 "Meteor Store" 要和 Meteor.js 生态、一堆同名商店抢结果，
  // alternateName 让 imagentx 这类别名也能指回来。
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Meteor Store",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      description: t("description"),
      contactPoint: {
        "@type": "ContactPoint",
        email: "meteor@stu.gpnu.edu.cn",
        contactType: "customer service",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Meteor Store",
      alternateName: "imagentx",
      url: SITE_URL,
      inLanguage: locale === "zh" ? "zh-CN" : "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ];

  // 从 proxy 注入的请求头取 nonce（让内联脚本通过 CSP）与 pathname（算 canonical）
  const requestHeaders = await headers();
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  const alternates = buildAlternateUrls(requestHeaders.get("x-pathname"));

  return (
    <html
      lang={locale === "zh" ? "zh-CN" : "en"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          canonical 与 hreflang 直接写在 <head> 里，不走 generateMetadata 的 alternates。
          原因是 Next 的 metadata 按字段浅合并：任何页面只要声明了自己的 `alternates`
          （博客几个页面就用它挂 RSS 的 `types`），就会把布局这一层整个顶掉，
          canonical 会**静默消失**。写在这里，页面怎么声明都盖不掉，
          新增页面也不必记得补。
        */}
        {alternates && (
          <>
            <link rel="canonical" href={alternates.canonical} />
            <link rel="alternate" hrefLang="zh-CN" href={alternates.languages.zh} />
            <link rel="alternate" hrefLang="en" href={alternates.languages.en} />
            <link rel="alternate" hrefLang="x-default" href={alternates.languages.xDefault} />
          </>
        )}
        {/* DNS 预解析：提前建立外部资源连接 */}
        <link rel="dns-prefetch" href="//pub-2cd69bb8e53f47a7802ded60c1d358b0.r2.dev" />
        {/* 防闪烁：在 React 渲染前读取本地存储的玻璃透明度偏好 */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `try{var a=localStorage.getItem('glass-alpha');if(a){document.documentElement.style.setProperty('--glass-alpha',a)}}catch(e){}`,
          }}
        />
        {/* JSON-LD 结构化数据 - 数据为硬编码静态内容，安全 */}
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <NextIntlClientProvider messages={messages}>
          {/* 屏幕阅读器用户的悄悄话：视觉上不存在，只有读屏软件会朗读 */}
          <p className="sr-only">
            {locale === "zh"
              ? "你好呀，正在用屏幕阅读器的朋友。这个网站的每个按钮和图片我都认真标注过，希望你逛得顺畅。有任何不方便的地方，页脚有我的邮箱，说了我就改。—— 店主"
              : "Hey there, friend using a screen reader. I've carefully labeled every button and image on this site. Hope you have a smooth experience. If anything is inconvenient, my email is in the footer — just let me know and I'll fix it. — Store Owner"}
          </p>
          <Suspense>
            <ScrollAnimateInit />
          </Suspense>
          <AuthProvider>
            <HelpPanelProvider>
            <ServiceWorkerRegistrar />
            <ExperienceAwareChrome>{children}</ExperienceAwareChrome>
            </HelpPanelProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
