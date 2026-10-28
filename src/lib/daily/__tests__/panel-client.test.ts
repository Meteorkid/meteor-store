import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultDailyPanelSettings } from '../panel-types';
import { dailyDate } from '../types';

let client: typeof import('../panel-client');
let storage: Map<string, string>;
const settings = () => defaultDailyPanelSettings(['english', 'papers']);
const revision = '2026-10-23T01:00:00.000Z';
const prefs = (userId = 'a', value = settings(), rev = revision) => ({ userId, settings: value, revision: rev, followedChannels: ['english'] });
const preview = (title = '词汇', date = dailyDate()) => ({ date, updatedAt: new Date().toISOString(), editions: [{
  channel: 'english', status: 'published', title, updatedAt: new Date().toISOString(), totalCount: 1,
  content: { kind: 'english', vocabulary: [{ term: 'adapt', meaning: '适应', example: 'We adapt.', translation: '我们会适应。' }] },
}] });
const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status });
beforeEach(async () => {
  vi.resetModules(); storage = new Map();
  vi.stubGlobal('localStorage', { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) });
  vi.stubGlobal('window', new EventTarget());
  client = await import('../panel-client');
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('每日面板公开内容缓存', () => {
  it('双实例共享请求，正常一分钟内复用，无私人信息入请求', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => response(preview())); vi.stubGlobal('fetch', fetchMock);
    await Promise.all([client.ensureDailyPanelPreview(), client.ensureDailyPanelPreview()]);
    await client.ensureDailyPanelPreview();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`/api/daily/preview?date=${dailyDate()}&recent=1`);
    expect(client.getDailyPanelPreviewState().data?.editions[0].content).toHaveProperty('vocabulary');
  });
  it('同批强制刷新去重，旧响应不能覆盖新内容', async () => {
    let old!: (value: Response) => void;
    const fetchMock = vi.fn().mockImplementationOnce(() => new Promise<Response>(resolve => { old = resolve; })).mockResolvedValueOnce(response(preview('新版')));
    vi.stubGlobal('fetch', fetchMock);
    const pending = client.ensureDailyPanelPreview();
    await Promise.all([client.ensureDailyPanelPreview(true), client.ensureDailyPanelPreview(true)]);
    old(response(preview('旧版'))); await pending;
    expect(client.getDailyPanelPreviewState().data?.editions[0].title).toBe('新版');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  });
  it('刷新失败保留旧内容并标明失败，之后可以重试', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response(preview())).mockResolvedValueOnce(response({}, 503)).mockResolvedValueOnce(response(preview('恢复')));
    vi.stubGlobal('fetch', fetchMock); await client.ensureDailyPanelPreview(); await client.ensureDailyPanelPreview(true);
    expect(client.getDailyPanelPreviewState()).toMatchObject({ failed: true, loading: false, data: { editions: [{ title: '词汇' }] } });
    await client.ensureDailyPanelPreview(true); expect(client.getDailyPanelPreviewState()).toMatchObject({ failed: false, data: { editions: [{ title: '恢复' }] } });
  });
  it('跨北京时间午夜不接受前一天迟到响应，下次读取拉新日内容', async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-23T15:59:59.000Z'));
    let finish!: (value: Response) => void;
    const fetchMock = vi.fn().mockImplementationOnce(() => new Promise<Response>(resolve => { finish = resolve; })).mockImplementationOnce(async () => response(preview('新日','2026-10-24')));
    vi.stubGlobal('fetch',fetchMock); const pending = client.ensureDailyPanelPreview();
    vi.setSystemTime(new Date('2026-10-23T16:00:01.000Z')); finish(response(preview('昨日','2026-10-23'))); await pending;
    expect(client.getDailyPanelPreviewState().data).toBeNull();
    await client.ensureDailyPanelPreview(); expect(client.getDailyPanelPreviewState().data?.date).toBe('2026-10-24');
  });
  it('当天请求不把昨天的合法载荷当成今日缓存',async()=>{
    vi.useFakeTimers();vi.setSystemTime(new Date('2026-10-24T02:00:00Z'));
    vi.stubGlobal('fetch',vi.fn(async()=>response(preview('昨天','2026-10-23'))));
    await client.ensureDailyPanelPreview();expect(client.getDailyPanelPreviewState()).toMatchObject({data:null,failed:true});
  });
  it('预览超时后显示失败，并拒收忽略abort的迟到内容',async()=>{
    vi.useFakeTimers();let finish!: (r:Response)=>void;
    vi.stubGlobal('fetch',vi.fn(()=>new Promise<Response>(resolve=>{finish=resolve;})));
    const pending=client.ensureDailyPanelPreview();await vi.advanceTimersByTimeAsync(15_000);
    expect(client.getDailyPanelPreviewState()).toMatchObject({failed:true,loading:false});
    finish(response(preview()));await pending;expect(client.getDailyPanelPreviewState().data).toBeNull();
  });
  it('损坏内容明确失败，不被当成空日刊', async () => {
    vi.stubGlobal('fetch',vi.fn(async()=>response({date:dailyDate(),editions:'bad'})));
    await client.ensureDailyPanelPreview(); expect(client.getDailyPanelPreviewState()).toMatchObject({failed:true,data:null});
  });
});

describe('每日面板账号与并发设置', () => {
  it('账号缓存与游客隔离，GET的owner不匹配时拒绝使用数据', async () => {
    vi.stubGlobal('fetch', vi.fn(async()=>response(prefs('b'))));
    await client.ensureDailyPanelPreferences('a');
    expect(client.getDailyPanelPreferencesState('a')).toMatchObject({loaded:false,changed:true,settings:null});
    expect(client.getDailyPanelPreferencesState('b')).toBe(client.EMPTY_PANEL_PREFERENCES);
    expect(client.getDailyPanelPreferencesState(null)).toBe(client.EMPTY_PANEL_PREFERENCES);
  });
  it('两处铃铛共享同账号查询，强制刷新拒收旧回复', async () => {
    let old!: (value:Response)=>void;
    const fresh={...settings(),channels:[]};
    const fetchMock=vi.fn().mockImplementationOnce(()=>new Promise<Response>(resolve=>{old=resolve;})).mockResolvedValueOnce(response(prefs('a',fresh)));
    vi.stubGlobal('fetch',fetchMock);const pending=client.ensureDailyPanelPreferences('a');client.ensureDailyPanelPreferences('a');
    await Promise.all([client.ensureDailyPanelPreferences('a',true),client.ensureDailyPanelPreferences('a',true)]);
    old(response(prefs()));await pending;expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(client.getDailyPanelPreferencesState('a').settings?.channels).toEqual([]);
  });
  it('读取失败不伪造默认已保存设置', async()=>{
    vi.stubGlobal('fetch',vi.fn(async()=>response({},503)));await client.ensureDailyPanelPreferences('a');
    expect(client.getDailyPanelPreferencesState('a')).toMatchObject({loaded:false,failed:true,settings:null});
  });
  it('保存携带编辑开始时的revision和owner，成功不改游客缓存',async()=>{
    const fetchMock=vi.fn<typeof fetch>(async()=>response(prefs('a',settings(),'2026-10-23T02:00:00.000Z')));vi.stubGlobal('fetch',fetchMock);
    expect(await client.saveDailyPanelPreferences('a',settings(),revision)).toBe(true);
    const options=fetchMock.mock.calls[0][1] as RequestInit;
    expect(options.headers).toMatchObject({'X-Daily-User':'a'});expect(JSON.parse(String(options.body)).expectedRevision).toBe(revision);
    expect(client.getDailyPanelPreferencesState('a').revision).toBe('2026-10-23T02:00:00.000Z');expect(storage.size).toBe(0);
  });
  it.each([[401,{},'login'],[409,{code:'account_changed'},'changed'],[409,{code:'revision_conflict'},'conflict'],[503,{},'failed']] as const)('保存HTTP %i 保留原配置并给出明确错误',async(status,body,error)=>{
    vi.stubGlobal('fetch',vi.fn().mockResolvedValueOnce(response(prefs())).mockResolvedValueOnce(response(body,status)));
    await client.ensureDailyPanelPreferences('a');expect(await client.saveDailyPanelPreferences('a',null,revision)).toBe(false);
    expect(client.getDailyPanelPreferencesState('a')).toMatchObject({settings:settings(),revision,saveError:error,saving:false});
  });
  it('后台刷新不会清除版本冲突提示或自动重放保存',async()=>{
    const fetchMock=vi.fn().mockResolvedValueOnce(response(prefs())).mockResolvedValueOnce(response({code:'revision_conflict'},409)).mockResolvedValueOnce(response(prefs('a',settings(),'2026-10-23T03:00:00.000Z')));vi.stubGlobal('fetch',fetchMock);
    await client.ensureDailyPanelPreferences('a');await client.saveDailyPanelPreferences('a',settings(),revision);
    await client.ensureDailyPanelPreferences('a',true);
    expect(client.getDailyPanelPreferencesState('a').saveError).toBe('conflict');
    expect(fetchMock.mock.calls.filter((call:unknown[]) => (call[1] as RequestInit)?.method==='PUT')).toHaveLength(1);
  });
  it('保存返回另一账号时不采用该配置',async()=>{
    vi.stubGlobal('fetch',vi.fn(async()=>response(prefs('b'))));expect(await client.saveDailyPanelPreferences('a',settings(),null)).toBe(false);
    expect(client.getDailyPanelPreferencesState('a')).toMatchObject({settings:null,saveError:'changed'});
  });
  it('保存中取消旧GET，重复保存只提交一次',async()=>{
    let read!: (value:Response)=>void,write!: (value:Response)=>void;
    const fetchMock=vi.fn().mockImplementationOnce(()=>new Promise<Response>(resolve=>{read=resolve;})).mockImplementationOnce(()=>new Promise<Response>(resolve=>{write=resolve;}));vi.stubGlobal('fetch',fetchMock);
    const pending=client.ensureDailyPanelPreferences('a');const first=client.saveDailyPanelPreferences('a',settings(),null);const second=client.saveDailyPanelPreferences('a',settings(),null);
    write(response(prefs()));await Promise.all([first,second]);read(response(prefs('a',{...settings(),channels:[]})));await pending;
    expect(fetchMock).toHaveBeenCalledTimes(2);expect(client.getDailyPanelPreferencesState('a').settings?.channels).toEqual(['english','papers']);
  });
  it('游客明确空选保存本机，恢复默认保留空关注且不写云端',async()=>{
    storage.set('ms_daily_preferences_v1:guest',JSON.stringify({channels:[],reminders:false}));
    const fetchMock=vi.fn();vi.stubGlobal('fetch',fetchMock);await client.ensureDailyPanelPreferences(null);
    expect(client.getDailyPanelPreferencesState(null).followedChannels).toEqual([]);
    const empty={...settings(),channels:[]};expect(await client.saveDailyPanelPreferences(null,empty,null)).toBe(true);
    const state=client.getDailyPanelPreferencesState(null);expect(state.settings?.channels).toEqual([]);
    expect(await client.saveDailyPanelPreferences(null,null,state.revision)).toBe(true);
    expect(client.getDailyPanelPreferencesState(null).settings).toBeNull();expect(fetchMock).not.toHaveBeenCalled();
  });
  it('设置读取与保存超时均不接受迟到成功，保存可重新读取确认',async()=>{
    vi.useFakeTimers();let finishRead!: (r:Response)=>void,finishSave!: (r:Response)=>void;
    const fetchMock=vi.fn().mockImplementationOnce(()=>new Promise<Response>(resolve=>{finishRead=resolve;})).mockImplementationOnce(()=>new Promise<Response>(resolve=>{finishSave=resolve;}));vi.stubGlobal('fetch',fetchMock);
    const pending=client.ensureDailyPanelPreferences('a');await vi.advanceTimersByTimeAsync(15_000);
    expect(client.getDailyPanelPreferencesState('a')).toMatchObject({failed:true,loading:false});
    finishRead(response(prefs()));await pending;expect(client.getDailyPanelPreferencesState('a').loaded).toBe(false);
    const saving=client.saveDailyPanelPreferences('a',settings(),null);await vi.advanceTimersByTimeAsync(15_000);
    finishSave(response(prefs()));expect(await saving).toBe(false);expect(client.getDailyPanelPreferencesState('a')).toMatchObject({saveError:'failed',settings:null,saving:false});
  });
  it('游客写存储失败不声称保存成功',async()=>{
    vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{throw new Error('blocked');}});
    expect(await client.saveDailyPanelPreferences(null,settings(),null)).toBe(false);
    expect(client.getDailyPanelPreferencesState(null)).toMatchObject({saveError:'storage',saving:false,settings:null});
  });
});
