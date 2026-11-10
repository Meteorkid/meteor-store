'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useReducedMotion } from '@/lib/motion';
import CelestialText from './home/CelestialText';
import HomeSky from './home/HomeSky';
import ClassicHeroSection from './ClassicHeroSection';
import { useOptionalSiteTheme } from './theme/ThemeProvider';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  productCount: number;
  webAppCount: number;
  freeCount: number;
  helpCount: number;
}

function EntryArrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>;
}

/** 首屏只拥有自己的星空；统计仍来自服务端真实目录，显示状态不写入账号或缓存。 */
export default function HeroSection(props: HeroSectionProps) {
  const theme = useOptionalSiteTheme()?.theme ?? 'nebula';
  return theme === 'classic' ? <ClassicHeroSection {...props} /> : <NebulaHeroSection {...props} />;
}

function NebulaHeroSection({ productCount, webAppCount, freeCount, helpCount }: HeroSectionProps) {
  const english = useLocale() === 'en';
  const reducedMotion = useReducedMotion();
  const [peopleVisible, setPeopleVisible] = useState(false);
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const [viewMode, setViewMode] = useState<'follow' | 'drag' | 'off' | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [resetView, setResetView] = useState(0);
  const [viewSettingsOpen, setViewSettingsOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const viewControlsRef = useRef<HTMLDivElement>(null);
  const viewButtonRef = useRef<HTMLButtonElement>(null);
  const playing = motionOverride ?? !reducedMotion;
  const interactionMode = viewMode ?? (reducedMotion ? 'off' : 'follow');
  const title = english ? 'Starlight is near' : '星光不远';
  const peopleLabel = peopleVisible
    ? (english ? 'Hide the crowd and return to starlight' : '隐藏人海，回到星光')
    : (english ? 'See the people behind the starlight' : '看见星光背后的人');
  const stats = [
    { value: productCount, text: 'TOOLS', label: english ? 'Tools in the catalogue' : '目录中的工具' },
    { value: webAppCount, text: 'WEB APPS', label: english ? 'Apps available in the browser' : '可在线体验的应用' },
    { value: freeCount, text: 'FREE', label: english ? 'Free tools' : '免费工具' },
    { value: helpCount, text: 'GUIDES', label: english ? 'Help articles' : '帮助文档' },
  ];

  useEffect(() => {
    if (!viewSettingsOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !viewControlsRef.current?.contains(event.target)) setViewSettingsOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [viewSettingsOpen]);

  return (
    <>
      <section ref={heroRef} className={styles.hero} aria-labelledby="home-celestial-title" data-home-celestial="true">
        <div className={styles.background} aria-hidden="true">
          <HomeSky peopleVisible={peopleVisible} paused={!playing} interactionMode={interactionMode} autoRotate={autoRotate} resetView={resetView} interactionRef={heroRef} />
        </div>
        <div className={styles.content}>
          <div className={styles.copy}>
            <p className={styles.eyebrow} aria-label={english ? 'Independent creations' : '独立创造'}>
              <span className={styles.eyebrowLine} aria-hidden="true" />
              <CelestialText className={styles.eyebrowFull} text="INDEPENDENT CREATIONS" spacing={14} weight={7} decorative />
              <CelestialText className={styles.eyebrowShort} text="INDEPENDENT" spacing={14} weight={7} decorative />
            </p>
            <h1 id="home-celestial-title" className={styles.title}>
              <span className="sr-only">{title}</span>
              {english ? <>
                <CelestialText className={styles.englishTitle} text="STARLIGHT" spacing={10} weight={3.2} decorative />
                <CelestialText className={styles.englishTitleSecond} text="IS NEAR" spacing={10} weight={3.2} decorative />
              </> : <CelestialText className={styles.titleText} text="星光不远" spacing={10} weight={3.2} decorative />}
            </h1>
            <p className={styles.description} aria-label={english ? 'Let your thoughts glow' : '让想念发光'}>
              <CelestialText className={english ? styles.englishDescription : styles.descriptionText} text={english ? 'LET YOUR THOUGHTS GLOW' : '让想念发光'} spacing={english ? 8 : 17} weight={4.8} decorative />
            </p>
            <p className="sr-only">{english ? 'Independent tools, applications, writing and learning resources from Meteor Store.' : 'Meteor Store 的独立工具、应用、文字与学习资源。'}</p>
            <div className={styles.actions}>
              <Link className={styles.entry} href="/products" aria-label={english ? 'Explore tools and products' : '探索作品与产品'}>
                <CelestialText className={styles.entryMain} text={english ? 'WORKS' : '作品'} spacing={10} weight={4.5} decorative />
                <CelestialText className={styles.entrySub} text={english ? 'EXPLORE' : 'WORKS'} spacing={12} weight={7} decorative />
                <EntryArrow />
              </Link>
              <Link className={`${styles.entry} ${styles.entrySecondary}`} href="/docs" aria-label={english ? 'Read guides and help' : '查看指南与帮助'}>
                <CelestialText className={styles.entryMain} text={english ? 'GUIDE' : '指南'} spacing={10} weight={4.5} decorative />
                <CelestialText className={styles.entrySub} text={english ? 'HELP' : 'GUIDE'} spacing={12} weight={7} decorative />
                <EntryArrow />
              </Link>
            </div>
          </div>
          <div className={styles.discoverWrap}>
            <button className={styles.discover} type="button" aria-label={peopleLabel} aria-pressed={peopleVisible} onClick={() => setPeopleVisible(value => !value)}>
              <span className={styles.orbit} aria-hidden="true" />
              <span className={styles.peopleCopy}>
                <CelestialText className={styles.peopleLabel} text={english ? (peopleVisible ? 'RETURN' : 'SEE YOU') : (peopleVisible ? '回到星光' : '看见你')} spacing={10} weight={4.5} decorative />
                <CelestialText className={styles.peopleLatin} text={peopleVisible ? 'TO THE STARS' : 'BEHIND THE LIGHT'} spacing={4} weight={7} decorative />
              </span>
            </button>
          </div>
          <div className={styles.heroFooter}>
            <span aria-label={english ? 'A light is never alone' : '每一束光，都有人回应'}>
              <CelestialText className={styles.footerFull} text="A LIGHT IS NEVER ALONE" spacing={11} weight={7} decorative />
              <CelestialText className={styles.footerShort} text="WITH YOU" spacing={11} weight={7} decorative />
            </span>
            <div className={styles.footerControls}>
              <div ref={viewControlsRef} className={styles.viewControls} data-sky-controls="true" onBlurCapture={event => {
                if (!event.currentTarget.contains(event.relatedTarget)) setViewSettingsOpen(false);
              }} onKeyDown={event => {
                if (event.key === 'Escape' && viewSettingsOpen) {
                  event.stopPropagation();
                  setViewSettingsOpen(false);
                  viewButtonRef.current?.focus();
                }
              }}>
                <button ref={viewButtonRef} className={styles.viewToggle} type="button" aria-label={english ? 'Starlight view settings' : '星空视角设置'} aria-expanded={viewSettingsOpen} aria-controls="home-view-settings" onClick={() => setViewSettingsOpen(value => !value)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><circle cx="12" cy="12" r="7.5" /><path d="M12 1v5m0 12v5M1 12h5m12 0h5" /><circle cx="12" cy="12" r="1.5" /></svg>
                  <CelestialText className={styles.controlLabel} text="VIEW" spacing={9} weight={7} decorative />
                </button>
                {viewSettingsOpen && <div id="home-view-settings" className={styles.viewPanel} role="group" aria-label={english ? 'Starlight view settings' : '星空视角设置'}>
                  <CelestialText className={styles.panelHeading} text="PERSPECTIVE" spacing={11} weight={7} decorative />
                  <div className={styles.viewModes}>
                    {([
                      ['follow', 'FOLLOW', english ? 'Follow the pointer' : '跟随鼠标'],
                      ['drag', 'DRAG', english ? 'Drag to rotate the view' : '按住空白处拖拽旋转'],
                      ['off', 'STILL', english ? 'Turn off pointer interaction' : '关闭鼠标交互'],
                    ] as const).map(([mode, text, label]) => <button key={mode} type="button" aria-label={label} title={label} aria-pressed={interactionMode === mode} onClick={() => {
                      setViewMode(mode);
                      if (mode === 'off') setAutoRotate(false);
                    }}>
                      <span className={styles.modeMark} aria-hidden="true" />
                      <CelestialText className={styles.modeLabel} text={text} spacing={7} weight={7} decorative />
                    </button>)}
                  </div>
                  <div className={styles.viewActions}>
                    <button type="button" aria-label={english ? 'Slow automatic rotation' : '缓慢自动旋转'} aria-pressed={autoRotate} onClick={() => setAutoRotate(value => !value)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-35 12 12)" /><circle cx="12" cy="12" r="2" /></svg>
                      <CelestialText className={styles.controlLabel} text="ORBIT" spacing={8} weight={7} decorative />
                    </button>
                    <button type="button" aria-label={english ? 'Reset the view' : '复位视角'} onClick={() => {
                      setAutoRotate(false);
                      setResetView(value => value + 1);
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M5 8a8 8 0 1 1-1 7M5 3v5h5" /></svg>
                      <CelestialText className={styles.controlLabel} text="RESET" spacing={8} weight={7} decorative />
                    </button>
                  </div>
                </div>}
              </div>
              <button className={styles.pause} type="button" aria-label={english ? (playing ? 'Pause starlight' : 'Play starlight') : (playing ? '暂停星光' : '继续星光')} aria-pressed={playing} onClick={() => setMotionOverride(!playing)}>
                <span className={styles.pauseDot} aria-hidden="true" />
                <CelestialText className={styles.pauseLabel} text={playing ? 'PAUSE' : 'PLAY'} spacing={10} weight={7} decorative />
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className={styles.stats} aria-label={english ? 'Catalogue facts' : '目录统计'}>
        {stats.map(stat => <div className={styles.stat} key={stat.text} aria-label={`${stat.label}: ${stat.value}`}>
          <CelestialText className={styles.statValue} text={String(stat.value)} spacing={4} weight={4} decorative />
          <CelestialText className={styles.statLabel} text={stat.text} spacing={8} weight={6} decorative />
        </div>)}
      </div>
    </>
  );
}
