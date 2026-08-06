import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { findProduct } from '@/lib/products';
import { getUserEntitlements } from '@/lib/entitlements';
import { createSignedReleaseUrl, publicReleaseUrl } from '@/lib/release-storage';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

/**
 * 安装包下载入口。
 *
 * 门控下载**绝不能**把文件读出来再由本接口转发：Vercel serverless 响应体上限约 4.5MB，
 * dmg 动辄几十 MB，一定失败。这里只做三件事：校验授权、签一条 5 分钟有效的
 * 预签名 URL、302 过去，让浏览器直连 R2。
 *
 * `file` 参数是 products.ts 里登记的下载条目 id，**不是路径**：
 * 对象 key 一律由服务端从产品目录查出来，客户端传什么都不会变成 bucket 里的任意路径。
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;

  // 付费资产入口，给一层轻限流；正常用户点几次下载远达不到
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`download:${ip}`, 30, 60_000, { fallback: 'memory' });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const fileId = new URL(request.url).searchParams.get('file') ?? '';

  const product = findProduct(productId);
  const download = product?.downloads?.find((item) => item.id === fileId);
  if (!download) {
    return NextResponse.json({ error: '下载不存在' }, { status: 404 });
  }

  // 公开下载没有校验可言，直接把人送到目标地址，省得调用方还要分两种链接处理
  if (!download.gated) {
    const target = download.url ?? (download.r2Key ? publicReleaseUrl(download.r2Key) : null);
    if (!target) {
      return NextResponse.json({ error: '下载暂不可用' }, { status: 503 });
    }
    return NextResponse.redirect(target, { status: 302, headers: { 'Cache-Control': 'no-store' } });
  }

  if (!download.r2Key) {
    // 数据配错了：标了门控却没给对象 key。挂在公开外链上的「门控」是自欺欺人，
    // 这里宁可报错也不要放行
    console.error(`[download] ${productId}/${fileId} 标记为 gated 但缺少 r2Key`);
    return NextResponse.json({ error: '下载暂不可用' }, { status: 503 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const entitlements = await getUserEntitlements(session.userId, session.email);
  if (!entitlements.some((item) => item.productId === productId)) {
    return NextResponse.json({ error: '你还没有该产品的使用授权' }, { status: 403 });
  }

  const fileName = download.r2Key.split('/').pop() || `${productId}.dmg`;
  const signedUrl = await createSignedReleaseUrl(download.r2Key, fileName);
  if (!signedUrl) {
    return NextResponse.json({ error: '下载服务未配置' }, { status: 503 });
  }

  // 签名链接短时有效，绝不能被 CDN 或浏览器缓存下来复用
  return NextResponse.redirect(signedUrl, { status: 302, headers: { 'Cache-Control': 'no-store' } });
}
