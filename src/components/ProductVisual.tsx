import Image from 'next/image';
import { Product } from '@/data/products';

interface ProductVisualProps {
  product: Product;
  priority?: boolean;
  demoOnHover?: boolean;
  className?: string;
}

export default function ProductVisual({
  product,
  priority = false,
  demoOnHover = false,
  className = '',
}: ProductVisualProps) {
  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden rounded-[1.4rem] border border-white/10 bg-zinc-950 shadow-2xl ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-25`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_36%),linear-gradient(to_bottom,transparent_55%,rgba(0,0,0,0.35))]" />

      {product.media ? (
        <>
          <Image
            src={product.media.cover}
            alt={`${product.name} 产品界面`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
          {demoOnHover && product.media.demo && (
            <Image
              src={product.media.demo}
              alt={`${product.name} 动态演示`}
              fill
              unoptimized
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="hidden object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-safe:md:block"
            />
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/70 backdrop-blur">
              METEOR LAB
            </span>
            <span className="text-3xl drop-shadow-lg">{product.icon}</span>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
              {product.platforms.join(' · ')}
            </p>
            <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {product.name}
            </p>
            <p className="mt-1 max-w-sm text-sm text-white/65">{product.tagline}</p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}
