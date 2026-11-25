'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import EasterEggs from '@/components/EasterEggs';
import FilmGrain from '@/components/FilmGrain';
import HeroCanvas from '@/components/HeroCanvas';
import MeteorShower from '@/components/MeteorShower';
import SpotlightSearch from '@/components/SpotlightSearch';
import HelpPanel from '@/components/help/HelpPanel';
import LearningFocusMode from '@/components/LearningFocusMode';
import { useOptionalSiteTheme } from '@/components/theme/ThemeProvider';
import { isFullscreenExperiencePath } from '@/lib/fullscreen-experience';

/** 商城视觉层与浮层；全屏体验页只保留传入的应用内容。 */
export default function ExperienceAwareChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fullscreenExperience = isFullscreenExperiencePath(pathname);
  const helpExperience = /^\/(?:zh|en)?\/docs(?:\/|$)/.test(pathname);
  const homepage = /^\/(?:zh|en)?\/?$/.test(pathname);
  const theme = useOptionalSiteTheme()?.theme;
  const orbitHomepage = theme === 'orbit' && homepage;
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    function onFocusMode(event: Event) {
      const next = (event as CustomEvent<{ on?: boolean }>).detail?.on;
      setFocusMode(next ?? document.documentElement.dataset.focusMode === 'on');
    }
    window.addEventListener('meteor:focus-mode-change', onFocusMode);
    // LearningFocusMode 的 effect 会紧接着广播一次；先同步读取属性覆盖
    // 首屏脚本已经设置好的状态，避免粒子先挂载一帧。
    onFocusMode(new Event('sync'));
    return () => window.removeEventListener('meteor:focus-mode-change', onFocusMode);
  }, []);

  return (
    <>
      {!fullscreenExperience && (
        <>
          <EasterEggs />
          <SpotlightSearch />
          {!focusMode && <FilmGrain />}
          {!helpExperience && !orbitHomepage && !focusMode && <MeteorShower />}
          {/* 首页由各主题首屏自带视觉；通用粒子只服务内页，避免和首屏重复渲染。 */}
          {!helpExperience && !homepage && !focusMode && <HeroCanvas />}
        </>
      )}
      {children}
      {!fullscreenExperience && <LearningFocusMode />}
      {!fullscreenExperience && <HelpPanel />}
    </>
  );
}
