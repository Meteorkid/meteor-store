'use client';

import { useLocale } from 'next-intl';
import { useAuth } from '@/components/AuthProvider';
import { SITE_THEMES, type SiteTheme } from '@/lib/appearance';
import { useOptionalSiteTheme } from './ThemeProvider';
import styles from './ThemeSwitcher.module.css';

const OPTIONS = {
  classic: { zh: '经典紫夜', en: 'Classic Violet', zhMeta: '紫色流光与科技网格', enMeta: 'Violet light and precision grids', preview: styles.classicPreview },
  nebula: { zh: '星云星海', en: 'Nebula Sky', zhMeta: '银蓝星云与三维星空', enMeta: 'Silver-blue nebula and 3D stars', preview: styles.nebulaPreview },
  horizon: { zh: '黑洞视界', en: 'Event Horizon', zhMeta: '橙金吸积盘与黑曜石面板', enMeta: 'Amber accretion disk and obsidian panels', preview: styles.horizonPreview },
  orbit: { zh: '行星轨道', en: 'Planetary Orbits', zhMeta: '暖色恒星与可探索的产品行星', enMeta: 'A warm star and explorable product planets', preview: styles.orbitPreview },
} satisfies Record<SiteTheme, { zh: string; en: string; zhMeta: string; enMeta: string; preview: string }>;

export default function ThemeSwitcher({ compact = false, headingId = 'site-theme-heading' }: { compact?: boolean; headingId?: string }) {
  const english = useLocale() === 'en';
  const { user } = useAuth();
  const context = useOptionalSiteTheme();
  if (!context) return null;
  const { theme, saving, saveError, setTheme } = context;
  return (
    <section className={`${styles.card} ${compact ? styles.compact : ''}`} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.title}>{english ? 'Appearance' : '网站外观'}</h2>
      <div className={styles.options} role="group" aria-label={english ? 'Website theme' : '网站主题'}>
        {SITE_THEMES.map(id => {
          const option = OPTIONS[id];
          const selected = theme === id;
          return <button key={id} type="button" className={styles.option} aria-pressed={selected} onClick={() => setTheme(id)}>
            <span className={`${styles.preview} ${option.preview}`} aria-hidden="true" />
            {selected && <span className={styles.selected} aria-hidden="true" />}
            <span className={styles.optionCopy}>
              <span className={styles.optionName}>{english ? option.en : option.zh}</span>
              <span className={styles.optionMeta}>{english ? option.enMeta : option.zhMeta}</span>
            </span>
          </button>;
        })}
      </div>
      <p className={styles.footnote} aria-live="polite">
        {user ? (english ? 'Saved to your account and synced across signed-in devices.' : '保存到账号，登录的其他设备会同步主题。') : (english ? 'Saved in this browser. Sign in to sync it across devices.' : '保存在当前浏览器；登录后可随账号跨设备同步。')}
        {saving && (english ? ' Saving…' : ' 正在保存…')}
      </p>
      <p className={styles.credit}>
        {english ? 'Event Horizon inspired by ' : '黑洞视界灵感来自 '}
        <a href="https://vibefather.ai/templates/black-hole-interactive-explainer" target="_blank" rel="noreferrer">{english ? 'VibeFather’s Black Hole Interactive Explainer' : 'VibeFather《黑洞交互式讲解》'}</a>
      </p>
      <p className={styles.credit}>
        {english ? 'Planetary Orbits adapted from ' : '行星轨道改编自 '}
        <a href="https://vibefather.ai/zh/templates/solar-system-3d-explainer" target="_blank" rel="noreferrer">{english ? 'VibeFather’s Solar System 3D Explainer' : 'VibeFather《太阳系 3D 讲解》'}</a>
      </p>
      {saveError && <p className={styles.error} role="alert">
        {saveError === 'accountChanged' ? (english ? 'The account changed in another tab. Reload before saving again.' : '账号已在其他标签页变化，刷新后再保存。') : (english ? 'Theme changed on this device, but the account copy could not be confirmed.' : '主题已在本设备生效，但账号保存结果未能确认。')}
      </p>}
    </section>
  );
}
