import { redirect } from "next/navigation";

// 根页面：重定向到默认 locale
// next-intl middleware 会自动处理 locale 检测和重定向
export default function RootPage() {
  redirect("/zh");
}
