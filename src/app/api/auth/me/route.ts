import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  // isAdmin 每次请求现算，不进 JWT：进了 token，撤销管理员就得等它过期。
  // 这个字段只用来决定要不要显示入口，真正的鉴权在 /admin/review 和写接口里。
  return NextResponse.json({ user: { ...session, isAdmin: isAdminEmail(session.email) } });
}
