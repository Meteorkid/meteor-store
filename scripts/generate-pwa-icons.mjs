/**
 * 生成 PWA 图标（manifest.json 引用的三张 png）。
 *
 * 一次性产物已提交进仓库，这个脚本只在品牌色或字形变化时重跑：
 *   node scripts/generate-pwa-icons.mjs
 *
 * 图标必须是 png：manifest 的 icons 虽然允许 svg，但 Android 的添加到主屏幕
 * 对 svg 支持一直不稳，给了 svg 可能直接退化成截图缩略图。
 */
import sharp from 'sharp';

// M 字形用 path 而不是 <text>：librsvg 在不同机器上对 system-ui 的解析结果不一样，
// 靠字体渲染可能得到一个只有渐变没有字母的图标，而且不会报错。
const GLYPH = 'M28 74 V30 H40 L50 52 L60 30 H72 V74 H62 V47 L53 66 H47 L38 47 V74 Z';

const rounded = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#ec4899"/>
  </linearGradient></defs>
  <rect width="100" height="100" rx="20" fill="url(#g)"/>
  <path d="${GLYPH}" fill="white"/>
</svg>`;

// maskable：系统会把图标裁成圆形/圆角矩形，只有中间 80% 是安全区。
// 所以渐变铺满整个方形（不留圆角），字形缩到 62% 居中，怎么裁都不会切到 M。
const maskable = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#ec4899"/>
  </linearGradient></defs>
  <rect width="100" height="100" fill="url(#g)"/>
  <g transform="translate(50,50) scale(0.62) translate(-50,-50)"><path d="${GLYPH}" fill="white"/></g>
</svg>`;

const jobs = [
  ['public/icon-192.png', rounded(192), 192],
  ['public/icon-512.png', rounded(512), 512],
  ['public/icon-maskable-512.png', maskable(512), 512],
];

for (const [out, svg, size] of jobs) {
  await sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toFile(out);
  const { data, info } = await sharp(out).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  // 自检：白色像素占比。M 画不出来的话这个数会是 0，宁可构建时发现也不要上线一个瞎图标
  let white = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240 && data[i + 3] > 200) white++;
  }
  const pct = ((white / (info.width * info.height)) * 100).toFixed(1);
  console.log(`${out}  ${info.width}x${info.height}  白色像素 ${pct}%`);
  if (Number(pct) < 3) throw new Error(`${out} 的字形没渲染出来`);
}
