'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ONLINE_VISIBLE_THRESHOLD } from '@/lib/online-presence';

const VISITOR_ID_KEY = 'meteor.onlineVisitorId';
const POLL_INTERVAL_MS = 60_000;

/** Footer 底栏「当前 X 人在线」：> 阈值才显示，接口异常静默隐藏 */
export default function OnlineVisitors() {
  const t = useTranslations('Footer');
  // 初始 null，挂载后才 set，避免 hydration 不一致；服务端不参与渲染
  const [count, setCount] = useState<number | null>(null);
  const visitorIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const getVisitorId = () => {
      if (visitorIdRef.current) return visitorIdRef.current;
      let id = localStorage.getItem(VISITOR_ID_KEY);
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(VISITOR_ID_KEY, id);
      }
      visitorIdRef.current = id;
      return id;
    };

    const updateCount = async () => {
      try {
        // 心跳保证 visitor 被计入在线集合，再拉取当前人数
        await fetch('/api/online/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId: getVisitorId() }),
        });
        const res = await fetch('/api/online');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.count === 'number') {
          setCount(data.count);
        }
      } catch {
        // 静默失败：接口异常时不显示，也绝不向用户报错
      }
    };

    updateCount();
    const interval = setInterval(updateCount, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (count === null || count <= ONLINE_VISIBLE_THRESHOLD) return null;

  return (
    <p className="t-footnote text-white/60">{t('onlineVisitors', { count })}</p>
  );
}
