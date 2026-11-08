import type { CSSProperties } from 'react';
import { celestialGlyphs } from './celestial-glyphs';

export interface CelestialTextProps {
  text: string;
  className?: string;
  /** 100 单位字形网格内的字距，沿用预览的默认 4。 */
  spacing?: number;
  weight?: number;
  /** 父链接、按钮或标题已提供名称时，避免重复朗读。 */
  decorative?: boolean;
}

function layoutLettering(text: string, spacing: number) {
  const gap = Number.isFinite(spacing) && spacing >= -24 && spacing <= 100 ? spacing : 4;
  let cursor = 0;
  let width = 0;
  const letters = Array.from(text, character => {
    const glyph = celestialGlyphs[character.replace(/[a-z]/g, letter => letter.toUpperCase())];
    const x = cursor;
    width = Math.max(width, x + (glyph?.width ?? 100));
    cursor += (glyph?.advance ?? 100) + gap;
    return { character, glyph, x };
  });
  return { letters, width: Math.max(1, width) };
}

export function getLetteringAspect(text: string, spacing = 4): number {
  return layoutLettering(text, spacing).width / 100;
}

/** 高度由 --type-height 控制；服务端直接渲染笔画，未知字符保留整段可读文字。 */
export default function CelestialText({ text, className, spacing = 4, weight, decorative = false }: CelestialTextProps) {
  const { letters, width } = layoutLettering(text, spacing);
  const height = 'var(--type-height, 1em)';

  if (letters.some(letter => !letter.glyph)) {
    return <span className={className} data-celestial-fallback="true" aria-hidden={decorative || undefined}
      style={{ fontSize: height, lineHeight: 1.2 }}>{text}</span>;
  }

  const style: CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: `calc(${height} * ${width / 100})`,
    height,
    maxWidth: '100%',
    flexShrink: 0,
  };
  const strokeWidth = weight !== undefined && Number.isFinite(weight) && weight > 0 && weight <= 12
    ? weight : 'var(--letter-stroke, 3.4)';

  return (
    <span className={className} style={style} data-celestial-text={text}
      role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : text} aria-hidden={decorative || undefined}>
      <svg viewBox={`0 0 ${width} 100`} preserveAspectRatio="xMinYMid" width="100%" height="100%"
        fill="none" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round"
        style={{ display: 'block', overflow: 'visible', strokeWidth }} aria-hidden="true" focusable="false">
        {letters.map(({ character, glyph, x }, index) => (
          <g key={index} data-glyph={character} transform={`translate(${x} 0)`}>
            {glyph?.d && <path d={glyph.d} fill={glyph.solid ? 'currentColor' : undefined} stroke={glyph.solid ? 'none' : undefined} />}
          </g>
        ))}
      </svg>
    </span>
  );
}
