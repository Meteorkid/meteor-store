'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { TollowAccessLevel } from '@/lib/tollow-plans';

const TollowAccessContext = createContext<TollowAccessLevel>('none');

export function TollowAccessProvider({
  level,
  children,
}: {
  level: TollowAccessLevel;
  children: ReactNode;
}) {
  return <TollowAccessContext.Provider value={level}>{children}</TollowAccessContext.Provider>;
}

export function useTollowAccessLevel(): TollowAccessLevel {
  return useContext(TollowAccessContext);
}
