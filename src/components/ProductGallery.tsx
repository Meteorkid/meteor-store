import Image from 'next/image';
import { Product } from '@/data/products';

export default function ProductGallery({ product }: { product: Product }) {
  if (!product.media?.screenshots.length) return null;

  return (
    <section className="mb-20">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Preview</p>
          <h2 className="text-2xl font-bold text-white md:text-3xl">产品实景</h2>
        </div>
        <p className="hidden text-sm text-gray-500 sm:block">来自真实软件界面</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {product.media.screenshots.map((screenshot, index) => (
          <figure
            key={screenshot.src}
            className={`group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-2 ${
              index === 0 && product.media!.screenshots.length % 2 === 1 ? 'md:col-span-2' : ''
            }`}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] bg-zinc-950">
              <Image
                src={screenshot.src}
                alt={screenshot.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              />
            </div>
            <figcaption className="px-3 pb-2 pt-3 text-sm text-gray-400">{screenshot.alt}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
