import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import ScrollAnimateInit from "@/components/ScrollAnimateInit";
import EasterEggs from "@/components/EasterEggs";
import SpotlightSearch from "@/components/SpotlightSearch";
import FilmGrain from "@/components/FilmGrain";
import HeroCanvas from "@/components/HeroCanvas";
import MeteorShower from "@/components/MeteorShower";
import { AuthProvider } from "@/components/AuthProvider";
import { HelpPanelProvider } from "@/components/help/HelpPanelContext";
import HelpPanel from "@/components/help/HelpPanel";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

  return {
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
    },
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: "https://www.imagentx.top",
      siteName: "Meteor Store",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "https://www.imagentx.top/og-image.png",
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
      images: ["https://www.imagentx.top/og-image.png"],
      site: "@Meteorkid",
    },
    robots: {
      index: true,
      follow: true,
    },
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
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Meteor Store",
    url: "https://www.imagentx.top",
    logo: "https://www.imagentx.top/favicon.svg",
    description: t("description"),
    contactPoint: {
      "@type": "ContactPoint",
      email: "meteor@stu.gpnu.edu.cn",
      contactType: "customer service",
    },
  };

  // 从 proxy 注入的 x-nonce header 取 nonce，让内联脚本通过 CSP
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang={locale === "zh" ? "zh-CN" : "en"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
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
            <EasterEggs />
            <SpotlightSearch />
            <FilmGrain />
            <HeroCanvas />
            <MeteorShower />
            {children}
            <HelpPanel />
            </HelpPanelProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
