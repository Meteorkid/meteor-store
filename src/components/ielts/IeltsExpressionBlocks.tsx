import type { MouseEvent } from 'react';
import { IELTS_FOCUS_LABELS, type IeltsFocus } from '@/lib/ielts/types';
import type { IeltsLocatedExpressionEdit } from '@/lib/ielts/expression-edits';
import { ieltsCopy, type IeltsLocale } from './ielts-text';
import styles from './IeltsExpressionBlocks.module.css';

interface Props {
  edits: IeltsLocatedExpressionEdit[];
  paragraph: number;
  locale: IeltsLocale;
  focus: 'all' | IeltsFocus;
  onLocate: (index: number) => void;
}

export default function IeltsExpressionBlocks({ edits, paragraph, locale, focus, onLocate }: Props) {
  if (!edits.length) return null;
  const copy = ieltsCopy(locale);
  const headingId = `ielts-expression-heading-${paragraph}`;
  function locate(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onLocate(index);
  }
  return <section className={styles.section} aria-labelledby={headingId} data-expression-paragraph={paragraph}>
    <div className={styles.sectionHeading}>
      <h4 id={headingId}>{copy.expressionTitle}</h4>
      <span>{copy.expressionHint}</span>
    </div>
    <div className={styles.grid}>
      {edits.map((edit, index) => <article key={`${edit.segmentIndex}-${edit.editIndex}`} className={styles.block}
        data-expression-block data-priority={index === 0 ? 'primary' : 'supporting'} data-focus-match={focus === edit.focus}>
        <div className={styles.blockHeader}>
          <span className={styles.category}>{IELTS_FOCUS_LABELS[edit.focus][locale]}</span>
          <span className={styles.position}>{index === 0 ? copy.expressionPrimary : copy.expressionSupporting}</span>
        </div>
        <div className={styles.change}>
          <div className={styles.before}>
            <span className={styles.version}>{copy.expressionBefore}</span>
            <p lang="en" data-expression-side="before">{edit.before}</p>
          </div>
          <span className={styles.arrow} aria-hidden="true">→</span>
          <div className={styles.after}>
            <span className={styles.version}>{copy.expressionAfter}</span>
            <p lang="en" data-expression-side="after">{edit.after}</p>
          </div>
        </div>
        <p className={styles.explanation}>{edit.explanation[locale]}</p>
        <a className={styles.source} href={`#ielts-sentence-${edit.segmentIndex}`}
          onClick={event => locate(event, edit.segmentIndex)}>
          {copy.locateExpression} <span>{copy.sentenceLabel(edit.segmentIndex + 1)} <span aria-hidden="true">↗</span></span>
        </a>
      </article>)}
    </div>
  </section>;
}
