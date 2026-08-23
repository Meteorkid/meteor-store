const LOCALES = new Set(['zh', 'en']);

/** 判断当前地址是否为只展示应用本体的全屏体验页。 */
export function isFullscreenExperiencePath(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] && LOCALES.has(segments[0])) segments.shift();

  if (segments[0] !== 'apps') return false;

  const isExMemory = segments.length === 2 && segments[1] === 'ex-memory';
  const isTrial = segments.length === 3 && segments[2] === 'trial';
  return isExMemory || isTrial;
}
