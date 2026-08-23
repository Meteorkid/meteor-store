'use client';

import { useEffect, useRef, useState } from 'react';

export default function ExMemoryExperienceFrame({
  loadingLabel,
  title,
  unavailableLabel,
  retryLabel,
}: {
  loadingLabel: string;
  title: string;
  unavailableLabel: string;
  retryLabel: string;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => setTimedOut(true), 15_000);
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === 'ex-memory:ready') {
        window.clearTimeout(timeout);
        setReady(true);
        setTimedOut(false);
      } else if (event.data?.type === 'ex-memory:session-expired') {
        window.location.reload();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
    };
  }, [attempt]);

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-[#09090b]">
      {!ready && !timedOut && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#09090b] text-sm text-white/60" role="status">
          <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" aria-hidden />
          {loadingLabel}
        </div>
      )}
      {timedOut && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#09090b] px-6 text-center" role="alert">
          <p className="text-sm text-white/60">{unavailableLabel}</p>
          <button
            type="button"
            onClick={() => {
              setReady(false);
              setTimedOut(false);
              setAttempt((current) => current + 1);
            }}
            className="mt-5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {retryLabel}
          </button>
        </div>
      )}
      <iframe
        key={attempt}
        ref={frameRef}
        src="/ex-memory-runtime/"
        title={title}
        className="h-dvh w-screen border-0 bg-[#09090b]"
        allow="clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals"
      />
    </div>
  );
}
