#!/usr/bin/env node
/**
 * 依据官方截图制作参数演示，未运行 DuoCast，也不代表音频设备实测。
 * 初次：node scripts/render-duocast-cover.mjs --source /path/to/screenshot.png
 * 复现：node scripts/render-duocast-cover.mjs
 * 依赖项目已有 sharp 与 PATH 中的 ffmpeg / ffprobe，无网络请求。
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'public/products/duocast');
const argument = (name, fallback) => {
  const index = process.argv.indexOf(name);
  if (index < 0) return fallback;
  if (!process.argv[index + 1]) throw new Error(`${name} 需要路径`);
  return resolve(process.argv[index + 1]);
};
const source = argument('--source', join(output, 'screenshot-1.webp'));
const evidence = argument('--evidence', '/tmp/meteor-duocast-20261103/cover-evidence');
const frames = join(evidence, 'frames');
const width = 1280;
const height = 800;
const fps = 30;
const duration = 5.4;
const frameCount = Math.round(fps * duration);
const sourceWidth = 1400;
const sourceHeight = 768;
const scale = width / sourceWidth;
const offsetY = (height - sourceHeight * scale) / 2;
const sampleIndices = [0, 35, 80, 124, 161];
const sourceSha256 = 'e9ecc04bcd5763b0f90a095358851c88f40a862b23a3d6af2778528445cea06e';

await mkdir(output, { recursive: true });
await mkdir(frames, { recursive: true });
const input = await readFile(source);
const metadata = await sharp(input).metadata();
if (metadata.width !== sourceWidth || metadata.height !== sourceHeight) {
  throw new Error('参考图必须是官方 1400×768 截图');
}
if (source !== join(output, 'screenshot-1.webp')) {
  if (createHash('sha256').update(input).digest('hex') !== sourceSha256) {
    throw new Error('参考图 SHA-256 与已核对的官方截图不符');
  }
  await sharp(input).webp({ lossless: true, effort: 6 }).toFile(join(output, 'screenshot-1.webp'));
}
const reference = await readFile(join(output, 'screenshot-1.webp'));
// librsvg 不解码内嵌 WebP；只在渲染内存中转 PNG，交付仍用原图无损 WebP。
const referenceData = (await sharp(reference).png().toBuffer()).toString('base64');
const ease = (time, start, end) => {
  const progress = Math.max(0, Math.min(1, (time - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
};
const stateAt = (time) => ({
  volume: Math.round(78 - 8 * ease(time, 0.6, 1.65)),
  delay: Math.round(24 * ease(time, 1.95, 3.25)) * 5,
  eq: Math.round(6 * ease(time, 3.6, 4.6)) / 2,
});
const cursor = (x, y, opacity) => `<g transform="translate(${x} ${y})" opacity="${opacity}">
  <path d="M0 0 L0 20 L5.4 15.4 L9.1 23.5 L12.4 22 L8.6 14 L15.9 14 Z" fill="#f2f2f2" stroke="#0f0e0e" stroke-width="1.5"/>
</g>`;
function renderSvg(time) {
  const { volume, delay, eq } = stateAt(time);
  const volumeX = 44 + (volume / 120) * 398;
  const delayX = 543 + (delay / 300) * 299;
  const eqY = 585 - (eq / 12) * 42;
  const gainDb = (20 * Math.log10(volume / 100)).toFixed(1).replace('-', '−');
  const ticks = Array.from({ length: 61 }, (_, i) => `<path d="M${543 + i * 4.9833} 419 V426"/>`).join('');
  let pointer = '';
  if (time >= 0.45 && time < 1.85) pointer = cursor(volumeX + 2, 393, 1);
  if (time >= 1.85 && time < 3.45) pointer = cursor(delayX + 2, 425, 1);
  if (time >= 3.45 && time < 4.85) pointer = cursor(266, eqY + 3, 1);
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="1280" height="800" fill="#0f0e0e"/>
  <g transform="translate(0 ${offsetY}) scale(${scale})">
    <image xlink:href="data:image/png;base64,${referenceData}" width="1400" height="768"/>
    <!-- 只重绘指定参数及其控件；设备、电平和 C 路状态保留原图。 -->
    <rect x="40" y="328" width="52" height="41" fill="#161513"/>
    <text x="42" y="362" fill="#f2f2f2" font-family="Menlo, monospace" font-size="38" font-weight="600">${volume}</text>
    <rect x="393" y="302" width="58" height="18" fill="#161513"/>
    <text x="448" y="316" fill="#8a857f" font-family="Menlo, monospace" font-size="9.5" text-anchor="end">${gainDb} dB</text>
    <rect x="39" y="378" width="411" height="25" fill="#161513"/>
    <rect x="43" y="388" width="404" height="4" rx="2" fill="#363431"/>
    <circle cx="${volumeX}" cy="390" r="10" fill="#93928f"/>
    <rect x="537" y="410" width="369" height="25" fill="#161513"/>
    <g stroke="#514f4a" stroke-width="1.5">${ticks}</g>
    <rect x="${delayX - 4}" y="412" width="8" height="20" rx="4" fill="#93928f"/>
    <text x="901" y="426" fill="#8a857f" font-family="Menlo, monospace" font-size="9.5" text-anchor="end">${delay} ms</text>
    <rect x="250" y="516" width="29" height="119" fill="#161513"/>
    <text x="264" y="530" fill="${eq ? '#f2f2f2' : '#8a857f'}" font-family="Menlo, monospace" font-size="9.5" text-anchor="middle">+${eq.toFixed(1)}</text>
    <rect x="263" y="538" width="2" height="95" rx="1" fill="#302d28"/>
    <path d="M257 585 H271" stroke="#ffffff" stroke-opacity="0.11"/>
    <rect x="263" y="${eqY}" width="2" height="${585 - eqY}" rx="1" fill="#f2f2f2" fill-opacity="0.4"/>
    <rect x="253" y="${eqY - 2}" width="22" height="4" rx="1" fill="#f2f2f2"/>
    ${pointer}
  </g>
  <text x="1260" y="783" fill="#8a857f" font-family="PingFang SC, sans-serif" font-size="13" text-anchor="end">参数演示</text>
</svg>`;
}

for (let index = 0; index < frameCount; index += 1) {
  const time = index / fps;
  const png = await sharp(Buffer.from(renderSvg(time))).png().toBuffer();
  await writeFile(join(frames, `${String(index).padStart(4, '0')}.png`), png);
  if (sampleIndices.includes(index)) {
    await writeFile(join(evidence, `sample-${String(index).padStart(4, '0')}.png`), png);
  }
  if (index === frameCount - 1) {
    const poster = await sharp(png).webp({ quality: 92, effort: 6 }).toBuffer();
    await writeFile(join(output, 'cover-motion.webp'), poster);
    await writeFile(join(output, 'cover.webp'), poster);
  }
}
const encoded = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y', '-framerate', String(fps),
  '-i', join(frames, '%04d.png'), '-frames:v', String(frameCount), '-an',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', '-metadata', 'comment=UI parameter demonstration rendered from the official DuoCast screenshot; not a live audio recording.',
  join(output, 'cover-motion.mp4'),
], { encoding: 'utf8' });
if (encoded.status !== 0) throw new Error(encoded.stderr || 'ffmpeg 编码失败');
const probed = spawnSync('ffprobe', [
  '-v', 'error', '-show_format', '-show_streams', '-of', 'json', join(output, 'cover-motion.mp4'),
], { encoding: 'utf8' });
if (probed.status !== 0) throw new Error(probed.stderr || 'ffprobe 检查失败');
const probe = JSON.parse(probed.stdout);
const files = [];
for (const filename of ['cover-motion.mp4', 'cover-motion.webp', 'cover.webp', 'screenshot-1.webp']) {
  const data = await readFile(join(output, filename));
  files.push({ filename, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex') });
}
await writeFile(join(evidence, 'ffprobe.json'), `${JSON.stringify(probe, null, 2)}\n`);
await writeFile(join(evidence, 'media-sha256.json'), `${JSON.stringify({
  reference: { url: 'https://github.com/Meteorkid/duocast/blob/29d6eddcd72867979eff76c31041616e56455ed9/duocast-mac/docs/screenshot.png', pngSha256: sourceSha256 },
  kind: 'rendered-ui-parameter-demonstration', width, height, fps, duration,
  samples: sampleIndices.map((index) => ({ frame: index, time: index / fps, ...stateAt(index / fps) })),
  files,
}, null, 2)}\n`);
console.log(JSON.stringify({ output, evidence, files }, null, 2));
