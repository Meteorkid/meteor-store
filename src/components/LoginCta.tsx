'use client';

import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import styles from './LoginCta.module.css';

type LoginCtaProps = {
  label: ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
};

/**
 * 顶栏/手机菜单共用的登录入口：3D 玻璃键帽。
 * 立体厚度、按压位移、沿圆角循环的水光描边和斜向扫光都是纯 CSS 装饰层，
 * 不参与点击区域；reduced-motion 下全部停在静态高光。
 */
export default function LoginCta({ label, onClick, fullWidth = false }: LoginCtaProps) {
  return (
    <Link
      href="/login"
      onClick={onClick}
      className={`${styles.cta} ${fullWidth ? styles.fullWidth : ''}`}
    >
      <span className={styles.sheen} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </Link>
  );
}
