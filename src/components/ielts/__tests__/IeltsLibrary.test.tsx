import { isValidElement, type AnchorHTMLAttributes, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({ states: [] as unknown[], index: 0 }));

// Node 环境执行组件真实事件处理；浏览器布局、焦点与 Next 路由另做页面验收。
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useMemo: <T,>(calculate: () => T) => calculate(),
  useState: <T,>(initial: T) => {
    const index = hooks.index++;
    if (!(index in hooks.states)) hooks.states[index] = initial;
    return [hooks.states[index], (next: T | ((previous: T) => T)) => {
      hooks.states[index] = typeof next === 'function'
        ? (next as (previous: T) => T)(hooks.states[index] as T) : next;
    }];
  },
}));
vi.mock('@/i18n/navigation', () => ({ Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} /> }));

import IeltsLibrary, { type IeltsLibraryItem } from '../IeltsLibrary';

// 仅用于浏览规模测试的摘要，不作为真实范文或内容验收数据。
const summaries: IeltsLibraryItem[] = Array.from({ length: 100 }, (_, index) => ({
  slug: `synthetic-${index + 1}`,
  task: index < 60 ? 'task2' : 'task1-academic',
  category: index < 60 ? 'opinion' : 'table',
  topic: index === 99 ? 'culture' : index % 2 === 0 ? 'education' : 'science',
  title: index === 98 ? 'Distant Observatory' : `Test summary ${index + 1}`,
  prompt: index === 99 ? 'A zephyr reaches the final question.' : `Synthetic question ${index + 1}`,
  lowWords: 250,
  highWords: 270,
  upgrades: 12,
  studied: index === 0,
  bookmarked: index === 0,
}));

type Node = ReactElement<Record<string, unknown>>;
let tree: Node;
let locale: 'zh' | 'en';
let items: IeltsLibraryItem[];

function render() {
  hooks.index = 0;
  tree = IeltsLibrary({ locale, items });
  return renderToStaticMarkup(tree);
}

function elements(predicate: (node: Node) => boolean, node: unknown = tree): Node[] {
  if (Array.isArray(node)) return node.flatMap(child => elements(predicate, child ?? null));
  if (!isValidElement<Record<string, unknown>>(node)) return [];
  return [...(predicate(node) ? [node] : []), ...elements(predicate, node.props.children ?? null)];
}

function click(label: string) {
  const button = elements(node => node.type === 'button' && node.props.children === label)[0];
  expect(button, label).toBeDefined();
  (button.props.onClick as () => void)();
  return render();
}

function search(value: string) {
  const input = elements(node => node.type === 'input')[0];
  (input.props.onChange as (event: { target: { value: string } }) => void)({ target: { value } });
  return render();
}

function cardSlugs() {
  return elements(node => typeof node.props.href === 'string').map(node => String(node.props.href).split('/').at(-1));
}

beforeEach(() => {
  hooks.states = [];
  locale = 'zh';
  items = summaries;
  render();
});

describe('100 组摘要的对照库浏览', () => {
  it('初始只挂载 24 张卡片，逐批展示到 100 组且没有重复或遗漏', () => {
    expect(cardSlugs()).toHaveLength(24);
    expect(render()).toContain('找到 100 组对照，已展示 24 组');
    for (const total of [48, 72, 96]) {
      click('继续加载 24 组');
      expect(cardSlugs()).toHaveLength(total);
    }
    expect(click('继续加载 4 组')).toContain('找到 100 组对照，已展示 100 组');
    expect(cardSlugs()).toEqual(summaries.map(item => item.slug));
    expect(elements(node => node.type === 'button' && String(node.props.children).startsWith('继续加载'))).toHaveLength(0);
  });

  it('搜索全部摘要中的标题与题干，能找到首批之外的第 99 和第 100 组', () => {
    search('  DISTANT OBSERVATORY  ');
    expect(cardSlugs()).toEqual(['synthetic-99']);
    search('zephyr');
    expect(cardSlugs()).toEqual(['synthetic-100']);
    expect(render()).toContain('找到 1 组对照，已展示 1 组');
  });

  it('主题文本可按中文展示名或英文标识搜索', () => {
    search('文化');
    expect(cardSlugs()).toEqual(['synthetic-100']);
    search('culture');
    expect(cardSlugs()).toEqual(['synthetic-100']);
    expect(render()).toContain('文化</button>');
    expect(render()).toContain('科学</button>');
  });

  it('英文多行题干粘贴为空格后仍可整题搜索', () => {
    locale = 'en';
    const prompt = 'Write to your friend.\r\n- thank them for their help;\n- invite them for a meal.';
    items = [{ ...summaries[99], prompt }];
    render();
    // Chrome 粘贴进单行搜索框后，题干的换行会变为空格。
    search(prompt.replace(/\r?\n/g, ' '));
    expect(cardSlugs()).toEqual(['synthetic-100']);
    search('  invite   them for a meal.  ');
    expect(cardSlugs()).toEqual(['synthetic-100']);
  });

  it('题型与主题组合筛选覆盖后续内容，变化后重置展示量', () => {
    click('继续加载 24 组');
    expect(click('Task 2 大作文')).toContain('找到 60 组对照，已展示 24 组');
    click('继续加载 24 组');
    expect(click('科学')).toContain('找到 30 组对照，已展示 24 组');
    click('继续加载 6 组');
    expect(cardSlugs()).toEqual(summaries.filter(item => item.task === 'task2' && item.topic === 'science').map(item => item.slug));
    expect(search('Test')).toContain('找到 30 组对照，已展示 24 组');
    expect(cardSlugs()).toHaveLength(24);
  });

  it('清空搜索也重置为首批，不保留搜索前已展开的全部卡片', () => {
    click('继续加载 24 组');
    search('zephyr');
    expect(search('')).toContain('找到 100 组对照，已展示 24 组');
    expect(cardSlugs()).toHaveLength(24);
  });

  it('保留已学收藏徽标、可命名搜索框、动态计数和 44px 操作区', () => {
    const html = render();
    expect(html).toContain('已学</span>');
    expect(html).toContain('已收藏</span>');
    expect(html).toContain('搜索对照</span>');
    expect(html).toContain('type="search"');
    expect(html).toContain('role="status" aria-live="polite"');
    for (const control of elements(node => node.type === 'button' || node.type === 'input')) {
      expect(control.props.className).toContain('min-h-11');
    }
  });

  it('英文界面提供对应搜索、主题、计数与继续加载文案', () => {
    locale = 'en';
    const html = render();
    expect(html).toContain('Search the library');
    expect(html).toContain('100 sets found, showing 24');
    expect(html).toContain('Culture</button>');
    expect(click('Load 24 more')).toContain('100 sets found, showing 48');
    expect(search('culture')).toContain('1 set found, showing 1');
  });

  it('区分搜索无结果与空库，小型旧库全部展示且不出现加载按钮', () => {
    expect(search('missing-text')).toContain('这个筛选下还没有对照');
    expect(cardSlugs()).toHaveLength(0);
    search('');
    items = summaries.slice(0, 6);
    expect(render()).toContain('找到 6 组对照，已展示 6 组');
    expect(cardSlugs()).toHaveLength(6);
    expect(elements(node => node.type === 'button' && String(node.props.children).startsWith('继续加载'))).toHaveLength(0);
    items = [];
    expect(render()).toContain('对照库暂时为空');
  });
});
