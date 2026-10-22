import { cloneElement, isValidElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EnglishContent } from '@/lib/daily/types';

const hooks = vi.hoisted(() => ({ states: [] as unknown[], index: 0 }));
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useId: () => 'practice-fixture',
  useState: <T,>(initial: T) => {
    const index = hooks.index++;
    if (!(index in hooks.states)) hooks.states[index] = initial;
    return [hooks.states[index], (next: T | ((previous: T) => T)) => {
      hooks.states[index] = typeof next === 'function' ? (next as (previous: T) => T)(hooks.states[index] as T) : next;
    }];
  },
}));

import EditionContent from '../EditionContent';
import { dailyText } from '../text';
type ElementNode = ReactElement<Record<string, unknown>>;
const lesson: EnglishContent = {
  kind: 'english', vocabulary: [{ term: 'review', meaning: '复查', example: 'Review it.', translation: '复查它。' }],
  passage: 'Original passage.', questions: [{ question: 'Original question?', options: ['Yes', 'No'], answerIndex: 0, explanation: 'Original explanation.' }],
};
const changed: EnglishContent = { ...lesson, passage: 'Updated passage.', questions: [{ question: 'Updated question?', options: ['New option', 'Other option'], answerIndex: 1, explanation: 'Updated explanation.' }] };

// 执行真实组件及事件；只替换 hook 调度，浏览器焦点与布局另行验收。
function resolve(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(resolve);
  if (!isValidElement<Record<string, unknown>>(node)) return node;
  if (typeof node.type === 'function') return resolve((node.type as (props: Record<string, unknown>) => unknown)(node.props));
  return cloneElement(node, { children: resolve(node.props.children) });
}
function render(content: EnglishContent) {
  hooks.index = 0;
  return resolve(<EditionContent content={content} locale="zh" copy={dailyText.zh} />) as ElementNode;
}
function find(node: unknown, predicate: (element: ElementNode) => boolean): ElementNode | undefined {
  if (Array.isArray(node)) return node.map(child => find(child, predicate)).find(Boolean);
  if (!isValidElement<Record<string, unknown>>(node)) return undefined;
  return predicate(node) ? node : find(node.props.children, predicate);
}

beforeEach(() => { hooks.states = []; hooks.index = 0; });
describe('英语作答过程中的公共内容刷新', () => {
  it('尚未作答时能接收新版课程', () => {
    render(lesson);
    const html = renderToStaticMarkup(render(changed));
    expect(html).toContain('Updated passage.');
    expect(html).toContain('Updated question?');
  });

  it('第一次选择后保留原题、选择与判分，背景更新不重置练习', () => {
    const first = render(lesson);
    const answer = find(first, element => element.props.type === 'radio' && element.props.value === 0)!;
    (answer.props.onChange as () => void)();
    const resumed = render(changed);
    expect(find(resumed, element => element.props.type === 'radio' && element.props.value === 0)?.props.checked).toBe(true);
    const html = renderToStaticMarkup(resumed);
    expect(html).toContain('Original passage.');
    expect(html).toContain('Original question?');
    expect(html).not.toContain('Updated question?');
    const form = find(resumed, element => element.type === 'form')!;
    (form.props.onSubmit as (event: unknown) => void)({ preventDefault: vi.fn() });
    const result = renderToStaticMarkup(render(changed));
    expect(result).toContain('回答正确');
    expect(result).toContain('Original explanation.');
    expect(result).not.toContain('Updated explanation.');
  });
});
