import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import ScrollAnimateInit from "@/components/ScrollAnimateInit";
import EasterEggs from "@/components/EasterEggs";
import SpotlightSearch from "@/components/SpotlightSearch";
import FilmGrain from "@/components/FilmGrain";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Meteor Store — 开发者工具与 AI 应用",
    template: "%s | Meteor Store",
  },
  description:
    "精心打造的开发者工具矩阵：智能爬虫框架、AI 记忆系统、3D 解剖图谱、设计系统、状态管理库。开源驱动，终身免费更新。",
  keywords: [
    "开发者工具",
    "AI 应用",
    "爬虫框架",
    "设计工具",
    "macOS 应用",
    "开源工具",
    "Next.js",
    "React 组件库",
  ],
  authors: [{ name: "Meteor Store" }],
  creator: "Meteor Store",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://www.imagentx.top",
    siteName: "Meteor Store",
    title: "Meteor Store — 开发者工具与 AI 应用",
    description:
      "精心打造的开发者工具矩阵：智能爬虫、AI 记忆、3D 解剖、设计系统。开源驱动，终身免费更新。",
    images: [
      {
        url: "https://www.imagentx.top/og-image.png",
        width: 1200,
        height: 630,
        alt: "Meteor Store — 开发者工具与 AI 应用",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meteor Store — 开发者工具与 AI 应用",
    description:
      "精心打造的开发者工具矩阵：智能爬虫、AI 记忆、3D 解剖、设计系统。",
    images: ["https://www.imagentx.top/og-image.png"],
    site: "@Meteorkid",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Meteor Store",
  url: "https://www.imagentx.top",
  logo: "https://www.imagentx.top/favicon.svg",
  description:
    "精心打造的开发者工具矩阵：智能爬虫框架、AI 记忆系统、3D 解剖图谱、设计系统。",
  sameAs: ["https://github.com/Meteorkid"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "meteor@stu.gpnu.edu.cn",
    contactType: "customer service",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD 结构化数据 - 数据为硬编码静态内容，安全 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        {/* 屏幕阅读器用户的悄悄话：视觉上不存在，只有读屏软件会朗读 */}
        <p className="sr-only">
          你好呀，正在用屏幕阅读器的朋友。这个网站的每个按钮和图片我都认真标注过，希望你逛得顺畅。
          有任何不方便的地方，页脚有我的邮箱，说了我就改。—— 店主
        </p>
        <Suspense>
          <ScrollAnimateInit />
        </Suspense>
        <EasterEggs />
        <SpotlightSearch />
        <FilmGrain />
        {children}
      </body>
    </html>
  );
}
