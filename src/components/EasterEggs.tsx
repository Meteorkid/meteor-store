'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createKonamiMatcher, createWordMatcher, isLateNight, useReducedMotion } from '@/lib/motion';

// ---------- 轻量 toast（零依赖，屏幕阅读器可感知） ----------
export function showToast(message: string, duration = 4200) {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.textContent = message;
  el.style.cssText = [
    'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%) translateY(16px)',
    'max-width:min(90vw,420px)', 'padding:12px 20px', 'border-radius:12px',
    'background:rgba(20,10,40,0.92)', 'border:1px solid rgba(139,92,246,0.35)',
    'color:#e9d5ff', 'font-size:14px', 'line-height:1.6', 'z-index:9999',
    'box-shadow:0 8px 32px rgba(139,92,246,0.25)', 'backdrop-filter:blur(8px)',
    'opacity:0', 'transition:opacity .3s ease, transform .3s ease', 'pointer-events:none',
    'text-align:center',
  ].join(';');
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(16px)';
    setTimeout(() => el.remove(), 350);
  }, duration);
}

/** 触发全屏流星雨爆发（MeteorShower 监听此事件） */
export function triggerMeteorBurst() {
  window.dispatchEvent(new CustomEvent('meteor:burst'));
}

/** 从指定位置放出一颗 DOM 流星（不依赖 Hero 画布，任何页面可用） */
function spawnStreakAt(x: number, y: number) {
  const angle = -8 - Math.random() * 24; // 向右下方
  const streak = document.createElement('div');
  streak.setAttribute('aria-hidden', 'true');
  streak.style.cssText = [
    'position:fixed', `top:${y}px`, `left:${x}px`, 'width:90px', 'height:2px',
    'background:linear-gradient(90deg,transparent,#c4b5fd,#fff)', 'border-radius:2px',
    'z-index:9998', 'pointer-events:none', `transform:rotate(${angle}deg)`,
    'transition:transform 1.1s cubic-bezier(.2,.6,.3,1), opacity .4s ease .7s', 'opacity:1',
  ].join(';');
  document.body.appendChild(streak);
  const dist = 300 + Math.random() * 260;
  requestAnimationFrame(() => {
    streak.style.transform = `rotate(${angle}deg) translateX(${dist}px)`;
    streak.style.opacity = '0';
  });
  setTimeout(() => streak.remove(), 1300);
}

// ---------- window.meteor 控制台 API ----------
declare global {
  interface Window {
    meteor?: {
      story: () => string;
      hire: () => string;
      secret: () => string;
    };
  }
}

const CONSOLE_BANNER = `
%c☄ Meteor Store

%c你好啊，打开控制台的人。内行。

这个站是一个大学生一行行写出来的——
服务器钱是从奶茶钱里省出来的，
每个 bug 都是陪我熬到天亮的老朋友。

试试在这里输入：
  meteor.story()   → 店主的一封信
  meteor.hire()    → 我真的可以被雇佣
  meteor.secret()  → 触发一点小魔法
`;

const NIGHT_GREETINGS = [
  '这么晚还醒着？没关系，流星也醒着。',
  '深夜的网速和思绪一样，容易飘远。慢慢逛，不着急。',
  '今天不管发生了什么，都过去了。真的。',
];

const KONAMI_TOASTS = {
  normal: '☄ 秘技达成：流星雨爆发！这个秘技和你一样，是老派的浪漫',
  veteran: '☄ 你已经是流星雨管理员了',
};

export default function EasterEggs() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const routerRef = useRef(router);
  routerRef.current = router;

  // 控制台留言 + window.meteor API（仅一次）
  useEffect(() => {
    console.log(
      CONSOLE_BANNER,
      'color:#a78bfa;font-size:20px;font-weight:bold',
      'color:#9ca3af;font-size:12px;line-height:1.8',
    );
    window.meteor = {
      story() {
        routerRef.current.push('/story');
        return '☄ 正在带你去看那封信…';
      },
      hire() {
        return [
          '📮 meteor@stu.gpnu.edu.cn',
          '简历随时奉上，价格公道，童叟无欺。',
          '会写 TypeScript，也会写情书（指 commit message）。',
        ].join('\n');
      },
      secret() {
        triggerMeteorBurst();
        return '☄☄☄ 小魔法已发动，抬头看！';
      },
    };
    return () => { delete window.meteor; };
  }, []);

  // reduced-motion 安静模式留言
  useEffect(() => {
    if (reducedMotion) {
      console.log('%c检测到你偏好减少动画，已为你切换到安静模式 🌙', 'color:#a78bfa');
    }
  }, [reducedMotion]);

  // Konami 秘技（键盘）+ "meteor" 咒语 + Logo 连点 7 次（移动端）
  useEffect(() => {
    const matcher = createKonamiMatcher();
    const wordMatcher = createWordMatcher('meteor');
    const fireKonami = () => {
      const count = Number(sessionStorage.getItem('meteor:konami') || '0') + 1;
      sessionStorage.setItem('meteor:konami', String(count));
      triggerMeteorBurst();
      showToast(count >= 3 ? KONAMI_TOASTS.veteran : KONAMI_TOASTS.normal);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // 输入框里打字不算秘技
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if (matcher(e.key)) fireKonami();
      if (wordMatcher(e.key)) {
        triggerMeteorBurst();
        showToast('☄ 你用键盘敲出了咒语。这个召唤术只有内行知道。');
      }
    };

    let logoTaps = 0;
    let logoTimer: ReturnType<typeof setTimeout>;
    const onClick = (e: MouseEvent) => {
      const logo = (e.target as HTMLElement).closest('[data-meteor-logo]');
      if (!logo) return;
      logoTaps++;
      clearTimeout(logoTimer);
      logoTimer = setTimeout(() => { logoTaps = 0; }, 1500);
      if (logoTaps >= 7) {
        logoTaps = 0;
        fireKonami();
      }
    };

    // 双击页面空白处：从点击点放出几颗小流星
    let lastSpark = 0;
    const onDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, select, [role="button"], canvas')) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const now = Date.now();
      if (now - lastSpark < 600) return; // 节流
      lastSpark = now;
      for (let i = 0; i < 3; i++) {
        setTimeout(() => spawnStreakAt(e.clientX + (Math.random() - 0.5) * 40, e.clientY + (Math.random() - 0.5) * 30), i * 90);
      }
      if (!sessionStorage.getItem('meteor:spark-hinted')) {
        sessionStorage.setItem('meteor:spark-hinted', '1');
        showToast('☄ 双击召唤流星——你发现了一个小秘密');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    document.addEventListener('dblclick', onDblClick);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClick);
      document.removeEventListener('dblclick', onDblClick);
      clearTimeout(logoTimer);
    };
  }, []);

  // 标签页标题挽留
  useEffect(() => {
    const original = document.title;
    let restoreTimer: ReturnType<typeof setTimeout>;
    const onVisibility = () => {
      if (document.hidden) {
        document.title = '☄ 别走嘛，流星还在等你';
      } else {
        document.title = '☄ 欢迎回来！';
        restoreTimer = setTimeout(() => { document.title = original; }, 1800);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(restoreTimer);
      document.title = original;
    };
  }, []);

  // 深夜问候（每会话一次，随机不重复靠会话内记录已用索引）
  useEffect(() => {
    if (!isLateNight() || sessionStorage.getItem('meteor:night-greeted')) return;
    sessionStorage.setItem('meteor:night-greeted', '1');
    const used = JSON.parse(localStorage.getItem('meteor:night-used') || '[]') as number[];
    const pool = NIGHT_GREETINGS.map((_, i) => i).filter(i => !used.includes(i));
    const pick = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : Math.floor(Math.random() * NIGHT_GREETINGS.length);
    localStorage.setItem('meteor:night-used', JSON.stringify(pool.length > 0 ? [...used, pick] : [pick]));
    const timer = setTimeout(() => showToast(`${NIGHT_GREETINGS[pick]} 🌙`, 6000), 2500);
    return () => clearTimeout(timer);
  }, []);

  // 滚动到底奖励（首次）
  useEffect(() => {
    if (sessionStorage.getItem('meteor:bottom-rewarded')) return;
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 8;
      if (!nearBottom) return;
      sessionStorage.setItem('meteor:bottom-rewarded', '1');
      window.removeEventListener('scroll', onScroll);
      showToast('你居然滚到底了，送你一颗流星 ☄');
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // 一颗小流星横穿页面底部
        const streak = document.createElement('div');
        streak.setAttribute('aria-hidden', 'true');
        streak.style.cssText = [
          'position:fixed', 'bottom:80px', 'left:-120px', 'width:100px', 'height:2px',
          'background:linear-gradient(90deg,transparent,#c4b5fd,#fff)', 'border-radius:2px',
          'z-index:9998', 'pointer-events:none', 'transform:rotate(-8deg)',
          'transition:left 1.4s cubic-bezier(.2,.6,.3,1), opacity .4s ease 1s', 'opacity:1',
        ].join(';');
        document.body.appendChild(streak);
        requestAnimationFrame(() => {
          streak.style.left = 'calc(100vw + 120px)';
          streak.style.opacity = '0';
        });
        setTimeout(() => streak.remove(), 1600);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
