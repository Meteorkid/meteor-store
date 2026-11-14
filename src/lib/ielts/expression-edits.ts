import type { IeltsExpressionEdit, IeltsSegment } from './types';

export interface IeltsLocatedExpressionEdit extends IeltsExpressionEdit {
  segmentIndex: number;
  editIndex: number;
}

/** 保留编辑者挑选的顺序；首个表达块是本段重点，旧内容不推测配对。 */
export function expressionEditsForParagraph(segments: IeltsSegment[], paragraph: number): IeltsLocatedExpressionEdit[] {
  return segments.flatMap((segment, segmentIndex) => segment.paragraph === paragraph
    ? (segment.expressionEdits ?? []).map((edit, editIndex) => ({ ...edit, segmentIndex, editIndex }))
    : []);
}
