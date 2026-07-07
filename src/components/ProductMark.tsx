import { Product } from '@/data/products';

/** 从产品名派生 2 字母缩写：按空格/连字符/驼峰切词取首字母 */
export function monogram(name: string): string {
  const words = name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[\s\-_]+/)
    .filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const SIZES = {
  sm: 'w-8 h-8 rounded-lg text-[11px]',
  md: 'w-12 h-12 rounded-xl text-base',
  lg: 'w-16 h-16 rounded-2xl text-xl',
} as const;

interface ProductMarkProps {
  product: Pick<Product, 'name' | 'gradient'>;
  size?: keyof typeof SIZES;
  className?: string;
}

/**
 * 产品标识：渐变方块 + 名称缩写。
 * 与评论区的"渐变圆 + 姓名缩写"头像同一视觉语言，替代原先风格混杂的 emoji 图标。
 */
export default function ProductMark({ product, size = 'md', className = '' }: ProductMarkProps) {
  return (
    <div
      aria-hidden="true"
      className={`bg-gradient-to-br ${product.gradient} ${SIZES[size]} ${className} flex items-center justify-center font-bold text-white shadow-lg ring-1 ring-white/15 select-none`}
    >
      {monogram(product.name)}
    </div>
  );
}
