'use client';

import { useAuth } from './AuthProvider';

export default function AdminGithubEditLink({ href, label }: { href: string; label: string }) {
  const { user } = useAuth();
  if (!user?.isAdmin) return null;

  return (
    <>
      <span aria-hidden className="text-white/20">·</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/50 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
      >
        {label}
      </a>
    </>
  );
}
