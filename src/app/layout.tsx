import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import ScrollAnimateInit from "@/components/ScrollAnimateInit";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Meteor Store — 开发者工具与 AI 应用",
    description:
      "精心打造的开发者工具矩阵：智能爬虫、AI 记忆、3D 解剖、设计系统。",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <Suspense>
          <ScrollAnimateInit />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
