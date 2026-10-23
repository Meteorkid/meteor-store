const EDU_DOMAINS = [
  '.edu',
  '.edu.cn',
  '.ac.uk',
  '.ac.jp',
  '.edu.au',
  '.edu.sg',
  '.ac.kr',
];

export function isEduEmail(email: string): boolean {
  const lower = email.toLowerCase().trim();
  return EDU_DOMAINS.some((d) => lower.endsWith(d));
}
