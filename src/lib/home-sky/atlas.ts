import { PHONE_STYLES, STAR_COLORS } from './lights';

export const PHONE_ATLAS_URL = '/home/phone-atlas-color-twelve.png';
export type PhoneSprites = Array<Array<HTMLCanvasElement | null>>;

export function createPointSprites(doc: Document): Array<HTMLCanvasElement | null> {
  return STAR_COLORS.map(color => {
    const sprite = doc.createElement('canvas');
    sprite.width = 24;
    sprite.height = 24;
    const context = sprite.getContext('2d');
    if (!context) return null;
    const glow = context.createRadialGradient(12, 12, 0, 12, 12, 10);
    glow.addColorStop(0, `rgba(${color},.30)`);
    glow.addColorStop(.24, `rgba(${color},.075)`);
    glow.addColorStop(1, `rgba(${color},0)`);
    context.fillStyle = glow;
    context.fillRect(0, 0, 24, 24);
    context.fillStyle = `rgb(${color})`;
    context.beginPath();
    context.arc(12, 12, 1.6, 0, Math.PI * 2);
    context.fill();
    return sprite;
  });
}

/** 图集、LED锚点及局部光照与已确认的首页预览一致。 */
export function createPhoneSprites(image: HTMLImageElement, doc: Document): PhoneSprites {
  const cellWidth = image.naturalWidth / 4;
  const cellHeight = image.naturalHeight / 3;
  if (cellWidth <= 0 || cellHeight <= 0) return [];

  return PHONE_STYLES.map(meta => {
    const cell = doc.createElement('canvas');
    cell.width = Math.round(cellWidth);
    cell.height = Math.round(cellHeight);
    const source = cell.getContext('2d');
    if (!source) return [];
    source.filter = 'saturate(1) brightness(.92)';
    source.drawImage(image, meta.column * cellWidth, meta.row * cellHeight, cellWidth, cellHeight, 0, 0, cell.width, cell.height);

    const sprites = [32, 64, 96].map((size, layer) => {
      const sprite = doc.createElement('canvas');
      sprite.width = size;
      sprite.height = size;
      const context = sprite.getContext('2d');
      if (!context) return null;
      context.drawImage(cell, 0, 0, size, size);
      context.globalCompositeOperation = 'destination-in';
      const lightRadius = size * [.76, .96, 1.04][layer];
      const light = context.createRadialGradient(meta.ledX * size, meta.ledY * size, 0, meta.ledX * size, meta.ledY * size, lightRadius);
      light.addColorStop(0, 'rgba(0,0,0,1)');
      light.addColorStop(.22, 'rgba(0,0,0,1)');
      light.addColorStop(.57, `rgba(0,0,0,${[.72, .94, .96][layer]})`);
      light.addColorStop(.87, `rgba(0,0,0,${[.18, .50, .60][layer]})`);
      light.addColorStop(1, `rgba(0,0,0,${[.02, .08, .12][layer]})`);
      context.fillStyle = light;
      context.fillRect(0, 0, size, size);

      const edge = context.createLinearGradient(0, 0, 0, size);
      edge.addColorStop(0, 'rgba(0,0,0,1)');
      edge.addColorStop(.45, 'rgba(0,0,0,1)');
      edge.addColorStop(.64, 'rgba(0,0,0,.36)');
      edge.addColorStop(.82, 'rgba(0,0,0,.05)');
      edge.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = edge;
      context.fillRect(0, 0, size, size);
      return sprite;
    });
    cell.width = cell.height = 0;
    return sprites;
  });
}

export function releaseSprites(sprites: ReadonlyArray<HTMLCanvasElement | null>): void {
  for (const sprite of sprites) {
    if (sprite) sprite.width = sprite.height = 0;
  }
}
