import type { IeltsPairContent } from '@/lib/ielts/types';
import type { IeltsLocale } from './ielts-text';

interface Props {
  content: IeltsPairContent;
  locale: IeltsLocale;
}

export function IeltsStudyLinks({ locale }: { locale: IeltsLocale }) {
  const en = locale === 'en';
  return <nav aria-label={en ? 'Essay study sections' : '本文学习分区'} className="mt-5 flex flex-wrap gap-3">
    <a className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-white/85 underline-offset-4 hover:underline" href="#ielts-study-notes">{en ? 'Detailed study notes' : '详细学习笔记'}</a>
    <a className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-white/85 underline-offset-4 hover:underline" href="#ielts-vocabulary">{en ? 'Vocabulary & collocations' : '生词与搭配'}</a>
  </nav>;
}

/** 原句从正文按索引读取；词汇卡和技巧讲解不会保留一份可能过期的引用。 */
export default function IeltsLearningNotes({ content, locale }: Props) {
  const en = locale === 'en';
  const learning = content.learning;
  const copy = {
    title: en ? 'Detailed study notes' : '详细学习笔记',
    task: en ? 'Understand the question' : '审题与写作思路',
    paragraphs: en ? 'How each paragraph works' : '逐段拆解',
    techniques: en ? 'Changes worth learning' : '句式与衔接精讲',
    mistakes: en ? 'Mistakes to watch for' : '易错点与改进空间',
    vocabulary: en ? 'Vocabulary & collocations' : '生词与搭配',
    source: en ? 'In this essay' : '文中原句',
    usage: en ? 'Usage' : '用法与辨析',
    collocations: en ? 'Common collocations' : '常用搭配',
    example: en ? 'A new example' : '迁移例句',
    original: en ? 'Original' : '原文写法',
    revised: en ? 'Revised' : '改写方式',
  };

  return (
    <>
      <section id="ielts-study-notes" aria-labelledby="ielts-study-notes-title" className="mt-10 scroll-mt-28 border-t border-white/15 pt-8">
        <h2 id="ielts-study-notes-title" className="t-title-2 text-white">{copy.title}</h2>
        <p className="mt-3 t-footnote text-white/70">{en ? 'Original teaching examples; the band labels are practice targets, not official examiner scores.' : '原创教学示例，分档用于练习参考；并非考官的官方评分。'} <a href="https://ielts.org/cdn/Guides/ielts-writing-band-descriptors.pdf" className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">{en ? 'Official assessment criteria' : '官方评分维度'}</a></p>
        {learning ? (
          <div className="mt-6 space-y-8">
            <div>
              <h3 className="t-title-3 text-white">{copy.task}</h3>
              <p className="mt-3 max-w-4xl whitespace-pre-line t-body text-white/85">{learning.taskAnalysis[locale]}</p>
            </div>
            <div>
              <h3 className="t-title-3 text-white">{copy.paragraphs}</h3>
              <ol className="mt-4 space-y-5">
                {learning.paragraphs.map(item => (
                  <li key={item.paragraph} className="border-l-2 border-violet-300/50 pl-4">
                    <h4 className="t-title-4 text-violet-100">{en ? `Paragraph ${item.paragraph}` : `第 ${item.paragraph} 段`} · {item.role[locale]}</h4>
                    <p className="mt-2 max-w-4xl t-body text-white/85">{item.analysis[locale]}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="t-title-3 text-white">{copy.techniques}</h3>
              <div className="mt-4 space-y-3">
                {learning.techniques.map((item, index) => {
                  const segment = content.segments[item.segmentIndex];
                  if (!segment) return null;
                  return (
                    <details key={index} open={index === 0} className="rounded-xl border border-white/20 bg-black/40 p-4">
                      <summary className="min-h-11 cursor-pointer py-2 t-title-4 text-white">{item.title[locale]}</summary>
                      <p className="mt-2 t-footnote text-white/65">{en ? `Sentence ${item.segmentIndex + 1}` : `第 ${item.segmentIndex + 1} 个句对`}</p>
                      <div className="mt-3 grid gap-4 md:grid-cols-2">
                        <div><p className="t-footnote text-amber-200">{copy.original}</p><blockquote lang="en" className="mt-1 t-body text-white/85">{segment.low}</blockquote></div>
                        <div><p className="t-footnote text-emerald-200">{copy.revised}</p><blockquote lang="en" className="mt-1 t-body text-white/95">{segment.high}</blockquote></div>
                      </div>
                      <p className="mt-4 t-body text-white/85">{item.explanation[locale]}</p>
                    </details>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="t-title-3 text-white">{copy.mistakes}</h3>
              <ul className="mt-4 list-disc space-y-3 pl-5 t-body text-white/85">
                {learning.mistakes.map((item, index) => <li key={index}>{item[locale]}</li>)}
              </ul>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="t-footnote text-white/70">{en ? 'This earlier edition contains sentence notes. Extended study notes have not been added yet.' : '这篇历史内容已有逐句说明，扩展学习笔记尚未补充。'}</p>
            {content.segments.map((segment, index) => <p key={index} className="t-body text-white/85">{index + 1}. {segment.note[locale]}</p>)}
          </div>
        )}
      </section>
      <section id="ielts-vocabulary" aria-labelledby="ielts-vocabulary-title" className="mt-10 scroll-mt-28 border-t border-white/15 pt-8">
        <h2 id="ielts-vocabulary-title" className="t-title-2 text-white">{copy.vocabulary}{learning && <span className="ml-3 t-footnote text-white/70">{learning.vocabulary.length} {en ? 'items' : '个词与表达'}</span>}</h2>
        {learning ? (
          <div className="mt-5 grid items-start gap-4 md:grid-cols-2">
            {learning.vocabulary.map(item => {
              const sentence = content.segments[item.segmentIndex]?.high;
              if (!sentence) return null;
              return (
                <details key={item.term} className="min-w-0 break-words rounded-xl border border-white/20 bg-black/50 p-4" data-vocabulary={item.term}>
                  <summary className="min-h-11 cursor-pointer text-white">
                    <span lang="en" className="text-xl font-semibold text-emerald-100">{item.term}</span>
                    <span className="ml-2 t-footnote text-white/70">{item.partOfSpeech}</span>
                    <span className="mt-2 block t-body text-white/85">{item.meaning[locale]}</span>
                  </summary>
                  <dl className="mt-4 space-y-4">
                    <div><dt className="t-footnote text-white/70">{copy.source} · {en ? `sentence ${item.segmentIndex + 1}` : `第 ${item.segmentIndex + 1} 个句对`}</dt><dd lang="en" className="mt-1 border-l-2 border-emerald-300/50 pl-3 t-body text-white/90">{sentence}</dd></div>
                    <div><dt className="t-footnote text-white/70">{copy.usage}</dt><dd className="mt-1 t-body text-white/85">{item.usage[locale]}</dd></div>
                    <div><dt className="t-footnote text-white/70">{copy.collocations}</dt><dd lang="en" className="mt-1 t-body text-white/90">{item.collocations.join(' · ')}</dd></div>
                    <div><dt className="t-footnote text-white/70">{copy.example}</dt><dd><p lang="en" className="mt-1 t-body text-white/90">{item.example.en}</p><p lang="zh" className="mt-1 t-footnote text-white/75">{item.example.zh}</p></dd></div>
                  </dl>
                </details>
              );
            })}
          </div>
        ) : <p className="mt-4 t-body text-white/70">{en ? 'A vocabulary list has not been added to this earlier edition.' : '这篇历史内容尚未整理生词表。'}</p>}
      </section>
    </>
  );
}
