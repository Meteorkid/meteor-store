'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import EasterEggs from '@/components/EasterEggs';
import FilmGrain from '@/components/FilmGrain';
import HeroCanvas from '@/components/HeroCanvas';
import MeteorShower from '@/components/MeteorShower';
import SpotlightSearch from '@/components/SpotlightSearch';
import HelpPanel from '@/components/help/HelpPanel';
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

  return (
    <>
      {!fullscreenExperience && (
        <>
          <EasterEggs />
          <SpotlightSearch />
          <FilmGrain />
          {!helpExperience && !orbitHomepage && <MeteorShower />}
          {/* 首页由各主题首屏自带粒子/星空；通用粒子只服务内页，避免和首屏重复渲染。 */}
          {!helpExperience && !homepage && <HeroCanvas />}
        </>
      )}
      {children}
      {!fullscreenExperience && <HelpPanel />}
    </>
  );
}
