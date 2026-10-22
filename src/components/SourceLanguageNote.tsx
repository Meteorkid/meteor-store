/** 界面语言与来源正文分开说明，不将原文自动改写为未经核验的译文。 */
export default function SourceLanguageNote({ locale, sourceLanguage }: { locale: string; sourceLanguage?: string }) {
  if (locale !== 'en' || sourceLanguage === 'en') return null;
  return <p className="mt-3 t-footnote text-white/60" data-source-language-note>
    {sourceLanguage === 'zh'
      ? 'This article is in Chinese. The navigation and controls are in English.'
      : 'Source titles, descriptions and official notices are shown in their original language. Some content is in Chinese.'}
  </p>;
}
