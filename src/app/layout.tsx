import { redirect } from "next/navigation";

// 根布局：重定向到默认 locale
// next-intl middleware 会自动处理 locale 检测和重定向
// 这个文件只是作为 fallback
export default function RootLayout() {
  redirect("/zh");
}
