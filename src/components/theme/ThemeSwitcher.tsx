'use client';

import { useLocale } from 'next-intl';
import { useAuth } from '@/components/AuthProvider';
import type { SiteTheme } from '@/lib/appearance';
import { useOptionalSiteTheme } from './ThemeProvider';
import styles from './ThemeSwitcher.module.css';

const OPTIONS: Array<{ id: SiteTheme; zh: string; en: string; zhMeta: string; enMeta: string }> = [
  { id: 'classic', zh: '经典紫夜', en: 'CLASSIC VIOLET', zhMeta: '紫色渐变、流光与科技网格', enMeta: 'Violet gradients, flow and precision grids' },
  { id: 'nebula', zh: '星云星海', en: 'NEBULA SKY', zhMeta: '银蓝星云、三维视角与遥远微光', enMeta: 'Silver-blue nebula, depth and distant light' },
];

export default function ThemeSwitcher({ compact = false, headingId = 'site-theme-heading' }: { compact?: boolean; headingId?: string }) {
  const english = useLocale() === 'en';
  const { user } = useAuth();
  const context = useOptionalSiteTheme();
  if (!context) return null;
  const { theme, saving, saveError, setTheme } = context;
  return (
    <section className={`${styles.card} ${compact ? styles.compact : ''}`} aria-labelledby={headingId}>
      <p className={styles.eyebrow}>APPEARANCE / 01</p>
      <h2 id={headingId} className={styles.title}>{english ? 'Choose your sky' : '选择你的天空'}</h2>
      <p className={styles.description}>{english ? 'One setting changes the visual language across the whole store. Both themes stay dark for comfortable reading.' : '一次选择，改变整个商店的视觉语言。两套主题都保持深色底，长文阅读不受影响。'}</p>
      <div className={styles.options} role="group" aria-label={english ? 'Website theme' : '网站主题'}>
        {OPTIONS.map(option => {
          const selected = theme === option.id;
          return <button key={option.id} type="button" className={styles.option} aria-pressed={selected} onClick={() => setTheme(option.id)}>
            <span className={`${styles.preview} ${option.id === 'classic' ? styles.classicPreview : styles.nebulaPreview}`} aria-hidden="true" />
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
      {saveError && <p className={styles.error} role="alert">
        {saveError === 'accountChanged' ? (english ? 'The account changed in another tab. Reload before saving again.' : '账号已在其他标签页变化，刷新后再保存。') : (english ? 'Theme changed on this device, but the account copy could not be confirmed.' : '主题已在本设备生效，但账号保存结果未能确认。')}
      </p>}
    </section>
  );
}
