'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { localizeCategories } from '@/data/products';
import type { Locale } from '@/i18n/routing';

interface CategoryFilterProps {
  selected: string;
}

export default function CategoryFilter({ selected }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale() as Locale;
  const categories = localizeCategories(locale);

  const handleClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleClick(category.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selected === category.id
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
