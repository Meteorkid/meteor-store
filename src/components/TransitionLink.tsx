'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';

type TransitionLinkProps = ComponentProps<typeof Link>;

export default function TransitionLink({ href, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;

    if ('startViewTransition' in document) {
      e.preventDefault();
      (document as any).startViewTransition(() => {
        router.push(typeof href === 'string' ? href : href.pathname ?? '/');
      });
    }
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
