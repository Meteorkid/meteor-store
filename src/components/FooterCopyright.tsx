'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { OPERATOR } from '@/lib/constants';
import { showToast } from './EasterEggs';
import OnlineVisitors from './OnlineVisitors';

/** Footer 版权行：hover 眨眼（CSS），连点 5 次有小惊喜 */
export default function FooterCopyright() {
  const t = useTranslations('Footer');
  const taps = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClick = () => {
    taps.current++;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { taps.current = 0; }, 1500);
    if (taps.current >= 5) {
      taps.current = 0;
      showToast(t('copyrightTapReward'));
    }
  };

  const year = new Date().getFullYear();
  // 管局要求「版权所有」与备案主体一致。眨眼彩蛋那行同样要带主体名——
  // 两行都在 DOM 里，缺主体的 © 声明会被判定为不一致
  const copyright = t('copyrightOperator', { year, operator: OPERATOR.name });
  const copyrightAlt = t('copyrightOperatorAlt', { year, operator: OPERATOR.name });

  return (
    <div className="space-y-2">
      <p
        className="footer-wink text-muted-foreground text-sm cursor-default select-none"
        onClick={onClick}
      >
        <span className="wink-default">{copyright}</span>
        <span className="wink-alt">{copyrightAlt}</span>
      </p>
      {/* 备案信息：未取得的项留空即不渲染，避免把占位符挂到线上被管局驳回 */}
      {/*
        备案号是管局要逐页核对的承载信息，必须读得出来：原来的 text-gray-600
        在这个近黑背景上只有 2.73:1，低于全站 white/60 基线，肉眼几乎看不见。
      */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
        {OPERATOR.icp && (
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/80 transition-colors"
          >
            {OPERATOR.icp}
          </a>
        )}
        {/*
          公安备案要求：警徽图标在左、备案号在右，且链接指向本站备案记录的查询页
          （带 code 参数），不是 beian.mps.gov.cn 首页。图标是纯装饰——编号文字
          紧跟其后已经把信息说全了，所以留空 alt 而不是再念一遍编号。
        */}
        {OPERATOR.police && (
          <a
            href={`https://beian.mps.gov.cn/#/query/webSearch?code=${OPERATOR.policeCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white/80 transition-colors"
          >
            {/*
              官方图标原始尺寸 36×40（宽高比 0.9），**不是正方形**，别写成等宽高。
              这里缩到 16×18：原来的 13×14 在这行 12px 小字里小到辨认不出警徽，
              管局核验是要能看清图标的——把合规元素缩到看不见等于没放。
              再大就会撑高整行，16×18 刚好压在行高边缘。

              eager 不是随手加的：这是管局要核验的合规元素，才 1.4KB，
              不值得为省这点流量赌懒加载一定会触发。

              **这里必须用原生 img，不能用 next/image。** 两个原因：

              1. 会裂图。next/image 按 width 生成 `w=16 1x, w=32 2x` 的 srcset，
                 而 /_next/image 只接受 imageSizes/deviceSizes 里的宽度——Next 16 的
                 默认 imageSizes 最小是 32，w=16 直接返回
                 `400 "w" parameter (width) of 16 is not allowed`。
                 于是 1x 屏拿到 400、显示成裂图，2x 屏取 w=32 反而正常，
                 「有的机器看得见有的看不见」就是这么来的。
              2. 优化是负收益。实测 /_next/image?w=32 回来的是 2051B 的 png，
                 比原图 1403B 还大 46%，格式也没变。为一张 1.4KB 的图额外做一次
                 服务端转换、占一次优化额度，纯亏。

              合规元素必须无条件渲染，不该依赖图片优化端点这条会 400 的链路。
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/beian-police.png"
              alt=""
              aria-hidden
              width={16}
              height={18}
              loading="eager"
              className="flex-shrink-0"
            />
            {OPERATOR.police}
          </a>
        )}
      </div>
      <OnlineVisitors />
    </div>
  );
}
