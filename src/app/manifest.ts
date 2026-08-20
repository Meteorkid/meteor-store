import type { MetadataRoute } from 'next';

/**
 * PWA 清单。
 *
 * 和 robots.ts / sitemap.ts 一样是 App Router 的特殊文件，产出 /manifest.webmanifest。
 * **它必须写进 proxy.ts 的 matcher 排除列表**：next-intl 会把没排除的路径重定向到
 * /zh/... 去，manifest 请求由此变成 404，浏览器则静默地不再认为这是个 PWA——
 * 不报错，只是安装提示永远不出现。robots.txt / sitemap.xml 当初也是同样的原因被排除的。
 *
 * start_url 用 '/' 而不是 '/zh'：让 next-intl 按访问者的语言偏好决定落地页，
 * 写死 locale 会让英文用户从桌面图标点进来永远是中文站。
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Meteor Store',
    short_name: 'Meteor',
    description: '独立开发者的工具与应用小店',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#000000',
    // 全站只有暗色一套主题，这里跟根布局 viewport 的 themeColor 保持一致
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      // maskable 单独一张：Android 会把图标裁成圆形，用 any 的那张会被切掉四角
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
