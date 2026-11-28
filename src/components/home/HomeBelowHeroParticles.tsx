'use client';

import { useEffect, useState } from 'react';
import HeroCanvas from '../HeroCanvas';
import { useOptionalSiteTheme } from '../theme/ThemeProvider';

/**
 * 首页首屏由各主题自己的视觉负责；非经典主题只在首屏完全离开视口后，
 * 才把全站粒子层挂回来，保证产品、FAQ 等后续区块仍有背景粒子。
 * 经典紫夜由 ClassicHeroSection 自己渲染固定粒子，不能重复挂载。
 */
export default function HomeBelowHeroParticles() {
  const theme = useOptionalSiteTheme()?.theme ?? 'nebula';
  const [belowHero, setBelowHero] = useState(false);

  useEffect(() => {
    if (theme === 'classic') return;

    const hero = document.querySelector<HTMLElement>('main#main-content > section');
    if (!hero) return;

    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setBelowHero(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [theme]);

  if (theme === 'classic' || !belowHero) return null;
  return <HeroCanvas />;
}
