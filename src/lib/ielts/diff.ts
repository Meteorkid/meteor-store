export interface IeltsDiffPart {
  text: string;
  changed: boolean;
}

/**
 * 对齐词与标点，再把标记映射回原始字符；不改写空格、数字、大小写或标点。
 * 句子重写并不保证词语语义一一替换，因此只标“字面变化”，原因仍由逐句笔记说明。
 */
export function diffIeltsSentence(low: string, high: string): { low: IeltsDiffPart[]; high: IeltsDiffPart[] } {
  const tokenize = (text: string) => text.match(/\s+|[\p{L}\p{N}]+(?:['’‐‑-][\p{L}\p{N}]+)*|[^\s]/gu) ?? [];
  const left = tokenize(low);
  const right = tokenize(high);
  const words = (tokens: string[]) => tokens.flatMap((text, index) => /^\s+$/.test(text) ? [] : [{ text, index }]);
  const a = words(left);
  const b = words(right);
  const width = b.length + 1;
  const lengths = new Uint16Array((a.length + 1) * width);
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      lengths[i * width + j] = a[i].text === b[j].text
        ? lengths[(i + 1) * width + j + 1] + 1
        : Math.max(lengths[(i + 1) * width + j], lengths[i * width + j + 1]);
    }
  }
  const sameLeft = new Set<number>();
  const sameRight = new Set<number>();
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i].text === b[j].text) {
      sameLeft.add(a[i].index);
      sameRight.add(b[j].index);
      i += 1;
      j += 1;
    } else if (lengths[(i + 1) * width + j] >= lengths[i * width + j + 1]) i += 1;
    else j += 1;
  }
  const parts = (tokens: string[], unchanged: Set<number>): IeltsDiffPart[] => {
    const result: IeltsDiffPart[] = [];
    tokens.forEach((text, index) => {
      const whitespace = /^\s+$/.test(text);
      // 词间空格仅在两侧都变化时并入色块，避免跨越未改动词语。
      const changed = whitespace
        ? index > 0 && index + 1 < tokens.length && !unchanged.has(index - 1) && !unchanged.has(index + 1)
        : !unchanged.has(index);
      const previous = result.at(-1);
      if (previous?.changed === changed) previous.text += text;
      else result.push({ text, changed });
    });
    return result;
  };
  return { low: parts(left, sameLeft), high: parts(right, sameRight) };
}
