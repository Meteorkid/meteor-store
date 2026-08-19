#!/usr/bin/env node
/**
 * 由品牌 banner 生成社交分享图 public/og-image.png（1200×630）。
 *
 * 根布局的 openGraph.images 和 twitter.images 都指向 /og-image.png，
 * 这个文件缺失时微信、Twitter、Telegram 的分享卡片都没有预览图。
 *
 * 为什么是脚本 + 静态产物，而不是 next/og 动态生成：
 * 分享图内容是固定的品牌图，每次抓取都现渲染纯属浪费；
 * 而且微信的爬虫对动态路由的容忍度很低，静态 PNG 最稳。
 *
 * 使用：node scripts/generate-og-image.mjs
 *
 * banner 是 3:1，OG 卡片要求 1.91:1，所以按宽度缩放后垂直居中，
 * 上下留黑边——banner 底色本身就是纯黑（实测 rgb(0,0,2)），接缝看不出来。
 * 不做裁切是因为左侧「流星软件店 / METEOR STORE / imagentx.top」贴得较近，
 * 裁掉两侧会啃掉文字。
 */
import sharp from 'sharp';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(root, 'public/brand/meteor-store-banner.png');
const OUTPUT = join(root, 'public/og-image.png');

const WIDTH = 1200;
const HEIGHT = 630;

const banner = await sharp(SOURCE)
  .resize({ width: WIDTH, fit: 'inside' })
  .toBuffer({ resolveWithObject: true });

const top = Math.round((HEIGHT - banner.info.height) / 2);

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 3,
    background: { r: 0, g: 0, b: 0 },
  },
})
  .composite([{ input: banner.data, top, left: 0 }])
  // 量化到 256 色：真彩色是 585 KB，纯属浪费——图里只有黑底和一条紫粉渐变。
  // 128 色会让流星的光晕出现可见色带，256 色目视无劣化。
  .png({ compressionLevel: 9, palette: true, colours: 256 })
  .toFile(OUTPUT);

const { size } = statSync(OUTPUT);
console.log(`✓ ${OUTPUT} — ${WIDTH}×${HEIGHT}, ${(size / 1024).toFixed(0)} KB`);
