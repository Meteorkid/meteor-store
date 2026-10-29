import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RoundCard, { type MastersRoundDraft } from '../RoundCard';
import MastersRoundDrawer from '../MastersRoundDrawer';
import { mastersText } from '../text';
import { roundFixture, watchFixture } from './fixtures';

vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));

function card(idPrefix?: string, draft?: MastersRoundDraft, busy = false) {
  return <RoundCard round={roundFixture()} watch={watchFixture()} idPrefix={idPrefix} draft={draft} onDraftChange={() => {}}
    now={new Date('2026-10-14T04:00:00Z')} locale="zh" copy={mastersText.zh}
    signedIn watchesReady busy={busy} selected={false} selectionFull={false}
    onSelect={() => {}} onSave={() => {}} onRemove={() => {}} />;
}

describe('列表与抽屉复用申请卡片', () => {
  it('默认锚点和进度ID不变，抽屉内所有标签关联使用独立ID', () => {
    const html = renderToStaticMarkup(<>{card()}{card('masters-drawer')}</>);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('round-school-cs-2027-round1');
    expect(ids).toContain('progress-school-cs-2027-round1');
    expect(ids).toContain('masters-drawer-school-cs-2027-round1');
    expect(ids).toContain('masters-drawer-school-cs-2027-round1-progress');
    for (const match of html.matchAll(/\b(?:for|aria-labelledby)="([^"]+)"/g)) expect(ids).toContain(match[1]);
    expect(html.match(/<input\b/g)).toHaveLength(4);
    expect(html.match(/<input id="[^"]+"/g)).toHaveLength(4);
  });

  it('受控草稿覆盖已保存值，两处卡片显示相同的未保存进度和提醒选择', () => {
    const draft = { status: 'submitted', reminders: true } as const;
    const html = renderToStaticMarkup(<>{card(undefined, draft)}{card('masters-drawer', draft)}</>);
    expect(html.match(/value="submitted" selected=""/g)).toHaveLength(2);
    expect(html.match(/checked=""/g)).toHaveLength(2);
    expect(html.match(/<input id="[^"]+-reminders"[^>]*disabled=""/g)).toHaveLength(2);
  });

  it('抽屉标题ID按组件实例隔离，原生dialog不由open属性伪装成非模态', () => {
    const html = renderToStaticMarkup(<>
      <MastersRoundDrawer open title="申请详情" closeLabel="关闭详情" onClose={() => {}}>{card('first-drawer')}</MastersRoundDrawer>
      <MastersRoundDrawer open={false} title="另一详情" closeLabel="关闭详情" onClose={() => {}}>{card('second-drawer')}</MastersRoundDrawer>
    </>);
    const labels = [...html.matchAll(/<dialog[^>]*aria-labelledby="([^"]+)"/g)].map(match => match[1]);
    expect(labels).toHaveLength(2);
    expect(new Set(labels).size).toBe(2);
    for (const label of labels) expect(html).toContain(`id="${label}"`);
    expect(html).not.toMatch(/<dialog[^>]*\bopen=/);
  });

  it('保存中只禁用编辑控件，保存和取消关注按钮仍可保留焦点', () => {
    const html = renderToStaticMarkup(card(undefined, undefined, true));
    expect(html.match(/<fieldset[^>]*>/)?.[0]).not.toContain('disabled');
    expect(html.match(/<select[^>]*>/)?.[0]).toContain('disabled=""');
    expect(html.match(/<input id="[^"]+-reminders"[^>]*>/)?.[0]).toContain('disabled=""');
    const buttons = [...html.matchAll(/<button[^>]*>/g)].map(match => match[0]);
    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button).toContain('aria-disabled="true"');
      expect(button).not.toMatch(/\sdisabled=/);
    }
  });
});
