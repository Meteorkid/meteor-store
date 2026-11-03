import { Link } from '@/i18n/navigation';

export interface TranslationLink {
  id: string;
  locale: string;
  title: string;
}

const LOCALE_LABEL: Record<string, string> = { zh: '中文', en: 'English' };

/**
 * 同一篇文章其它语言版本的入口。
 *
 * 只在真的存在译文时渲染。没有译文时由 SourceLanguageNote 说明"当前是原文语言"，
 * 两处提示互斥——否则读者会以为有译文却点不到。译文标题只用于 aria-label，
 * 界面上只显示语言名：同一条标题在两种语言里写法不同，混排会显得杂乱。
 */
export default function PostTranslationSwitch({
  uiLocale,
  links,
}: {
  uiLocale: string;
  links: TranslationLink[];
}) {
  if (links.length === 0) return null;

  return (
    <p
      className="t-footnote mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-white/60"
      data-translation-switch
    >
      <span className="text-white/40">{uiLocale === 'en' ? 'Also available in' : '另有版本'}</span>
      {links.map((link, index) => (
        <span key={link.id} className="flex items-center gap-2">
          {index > 0 && (
            <span aria-hidden className="text-white/20">
              ·
            </span>
          )}
          <Link
            href={`/blog/p/${link.id}`}
            locale={link.locale}
            aria-label={link.title}
            className="underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
          >
            {LOCALE_LABEL[link.locale] ?? link.locale}
          </Link>
        </span>
      ))}
    </p>
  );
}
