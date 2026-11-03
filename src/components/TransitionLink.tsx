'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';

type TransitionLinkProps = ComponentProps<typeof Link>;

/** View Transitions API 尚未进入 lib.dom.d.ts，按用到的部分声明 */
type DocumentWithViewTransition = Document & {
  startViewTransition: (callback: () => void) => { ready: Promise<void> };
};

export default function TransitionLink({ href, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;

    if ('startViewTransition' in document) {
      e.preventDefault();
      const transition = (document as DocumentWithViewTransition).startViewTransition(() => {
        router.push(typeof href === 'string' ? href : href.pathname ?? '/');
      });
      // 视口变化或新过渡可取消动画；路由回调仍执行，其错误保留原有传播路径。
      void transition.ready.catch((error: unknown) => {
        if (error instanceof DOMException && (error.name === 'AbortError' || error.name === 'InvalidStateError')) return;
        throw error;
      });
    }
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
