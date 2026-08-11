'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface HelpPanelState {
  open: boolean;
  slug: string | null;
  width: number; // px
}

interface HelpPanelContextValue {
  state: HelpPanelState;
  openPanel: (slug: string) => void;
  closePanel: () => void;
  setWidth: (w: number) => void;
}

const HelpPanelContext = createContext<HelpPanelContextValue | null>(null);

const MIN_WIDTH = 360;
const MAX_WIDTH = 720;
const DEFAULT_WIDTH = 480;

export function HelpPanelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HelpPanelState>({
    open: false,
    slug: null,
    width: DEFAULT_WIDTH,
  });

  const openPanel = useCallback((slug: string) => {
    setState((prev) => ({ ...prev, open: true, slug }));
  }, []);

  const closePanel = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const setWidth = useCallback((w: number) => {
    const clamped = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, w));
    setState((prev) => ({ ...prev, width: clamped }));
  }, []);

  return (
    <HelpPanelContext.Provider value={{ state, openPanel, closePanel, setWidth }}>
      {children}
    </HelpPanelContext.Provider>
  );
}

export function useHelpPanel() {
  const ctx = useContext(HelpPanelContext);
  if (!ctx) throw new Error('useHelpPanel must be used within HelpPanelProvider');
  return ctx;
}
