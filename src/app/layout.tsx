import type { Metadata } from "next";
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
  title: "Meteor Store - 高质量的开发者工具和 AI 应用",
  description: "从爬虫框架到 AI 记忆系统，从 3D 解剖平台到设计工具，我们提供一系列精心打造的工具，帮助你提升效率。",
  keywords: ["开发者工具", "AI 应用", "爬虫框架", "设计工具", "macOS 应用"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Meteor Store - 高质量的开发者工具和 AI 应用",
    description: "从爬虫框架到 AI 记忆系统，从 3D 解剖平台到设计工具，我们提供一系列精心打造的工具，帮助你提升效率。",
    type: "website",
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
      <body className="min-h-full flex flex-col bg-black text-white">
        <ScrollAnimateInit />
        {children}
      </body>
    </html>
  );
}
