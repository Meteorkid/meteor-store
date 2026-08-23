'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import EasterEggs from '@/components/EasterEggs';
import FilmGrain from '@/components/FilmGrain';
import HeroCanvas from '@/components/HeroCanvas';
import MeteorShower from '@/components/MeteorShower';
import SpotlightSearch from '@/components/SpotlightSearch';
import HelpPanel from '@/components/help/HelpPanel';
import { isFullscreenExperiencePath } from '@/lib/fullscreen-experience';

/** 商城视觉层与浮层；全屏体验页只保留传入的应用内容。 */
export default function ExperienceAwareChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fullscreenExperience = isFullscreenExperiencePath(pathname);

  return (
    <>
      {!fullscreenExperience && (
        <>
          <EasterEggs />
          <SpotlightSearch />
          <FilmGrain />
          <HeroCanvas />
          <MeteorShower />
        </>
      )}
      {children}
      {!fullscreenExperience && <HelpPanel />}
    </>
  );
}
