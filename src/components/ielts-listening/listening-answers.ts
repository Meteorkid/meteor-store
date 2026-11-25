/**
 * 多选题的作答映射：勾选的字母按顺序落到该组连续的题号上。
 *
 * 判分按整组比较字母集合，所以 UI 不能把同一个字母记到两个题号上，
 * 也不能在超过 select 之后还接受新的勾选。抽成纯函数是为了让这条规则有测试兜住——
 * 它错了不会报错，只会让人明明选对却判错。
 */
export function toggleMultipleAnswer(
  answers: Record<string, string>,
  numbers: number[],
  limit: number,
  letter: string,
): Record<string, string> {
  const picked = numbers.map(number => answers[String(number)] ?? '').filter(Boolean);
  const next = picked.includes(letter)
    ? picked.filter(item => item !== letter)
    : picked.length >= limit ? picked : [...picked, letter];
  const updated = { ...answers };
  numbers.forEach((number, index) => {
    if (next[index]) updated[String(number)] = next[index];
    else delete updated[String(number)];
  });
  return updated;
}
