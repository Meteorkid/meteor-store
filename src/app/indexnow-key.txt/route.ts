/**
 * IndexNow 的密钥校验文件。
 *
 * 协议要求密钥在本站某个可公开读取的地址上原样可见，Bing 收到推送后会来核对，
 * 对不上就整批丢弃。这里用 route handler 而不是往 public/ 里放一个静态文件，
 * 是为了让密钥只有环境变量一个来源——放文件的话，换密钥要同时改文件名和环境变量，
 * 漏一处就变成「推送一直被静默丢弃」，而这种失败没有任何报错。
 *
 * 密钥本身不是机密：协议设计上它就得公开可读，它只用来证明「能改这个站的人才知道」。
 */
export const dynamic = 'force-dynamic';

export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) return new Response('Not Found', { status: 404 });

  return new Response(key, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
