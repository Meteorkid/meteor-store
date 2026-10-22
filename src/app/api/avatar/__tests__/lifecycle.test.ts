import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  avatarUrl: null as string | null,
  objects: new Map<string, Uint8Array>(),
  events: [] as string[],
  failCommit: false,
  failPut: false,
  failHead: false,
  failDelete: false,
  transactionTail: Promise.resolve(),
  afterCommit: undefined as (() => Promise<void>) | undefined,
  beforeDelete: undefined as (() => Promise<void>) | undefined,
}));

vi.mock('@/lib/auth', () => ({
  getSession: async () => ({ userId: 'U1', email: 'a@example.com', tokenVersion: 0 }),
  createSession: vi.fn(async () => 'token'),
}));
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: async () => ({ limited: false }), getClientIp: () => '127.0.0.1',
}));
vi.mock('@/lib/r2-client', () => ({
  isR2Configured: () => true,
  readR2Config: () => ({ bucket: 'avatars-test', publicBase: 'https://cdn.example.com' }),
  getClient: () => ({
    send: async (command: { constructor: { name: string }; input: { Key: string; Body?: Uint8Array } }) => {
      const { Key: key, Body: bytes } = command.input;
      const operation = command.constructor.name;
      state.events.push(`${operation}:${key}`);
      if (operation === 'PutObjectCommand') {
        if (state.failPut) throw new Error('storage_unavailable');
        state.objects.set(key, bytes!);
      }
      if (operation === 'HeadObjectCommand') {
        if (state.failHead) throw new Error('storage_unavailable');
        if (!state.objects.has(key)) throw Object.assign(new Error('Not found'), { $metadata: { httpStatusCode: 404 } });
      }
      if (operation === 'DeleteObjectCommand') {
        await state.beforeDelete?.();
        if (state.failDelete) throw new Error('storage_unavailable');
        state.objects.delete(key);
      }
      return {};
    },
  }),
}));

vi.mock('@/lib/db', () => {
  const queryDb = (read: () => string | null, write: (value: string | null) => void) => ({
    select: () => ({ from: () => ({ where: () => ({ limit: () => ({
      then: (resolve: (rows: unknown[]) => unknown) => Promise.resolve([{ avatarUrl: read() }]).then(resolve),
      for: async (mode: string) => {
        state.events.push(`lock:${mode}`);
        return [{ avatarUrl: read() }];
      },
    }) }) }) }),
    update: () => ({ set: (values: { avatarUrl?: string | null }) => ({ where: async () => {
      if ('avatarUrl' in values) write(values.avatarUrl!);
      state.events.push('update');
    } }) }),
  });
  return { db: {
    ...queryDb(() => state.avatarUrl, value => { state.avatarUrl = value; }),
    transaction: async (run: (tx: ReturnType<typeof queryDb>) => Promise<unknown>) => {
      const previous = state.transactionTail;
      let release!: () => void;
      state.transactionTail = new Promise<void>(resolve => { release = resolve; });
      await previous;
      let value = state.avatarUrl;
      let written = false;
      let result: unknown;
      try {
        result = await run(queryDb(() => value, next => { value = next; written = true; }));
        if (state.failCommit) throw new Error('commit_failed');
        state.avatarUrl = value;
        state.events.push('commit');
      } finally { release(); }
      if (written) await state.afterCommit?.();
      return result;
    },
  } };
});

import { POST } from '../upload/route';
import { PATCH } from '../../auth/profile/route';

const BASE = 'https://cdn.example.com';
const oldKey = 'avatars/U1/old.webp';
const oldUrl = `${BASE}/${oldKey}`;
function request(path: string, method: string, body: unknown): NextRequest {
  return new Request(`http://localhost/api/${path}`, {
    method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }) as NextRequest;
}
async function upload(content = 'new image') {
  const response = await POST(request('avatar/upload', 'POST', {
    dataUrl: `data:image/webp;base64,${Buffer.from(content).toString('base64')}`,
  }));
  expect(response.status).toBe(200);
  return (await response.json()).url as string;
}
const save = (avatar: string) => PATCH(request('auth/profile', 'PATCH', { avatar }));
const keyOf = (url: string) => url.slice(BASE.length + 1);
function barrier() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
}

describe('头像上传和资料保存生命周期', () => {
  beforeEach(() => {
    state.avatarUrl = oldUrl;
    state.objects.clear();
    state.objects.set(oldKey, Buffer.from('old image'));
    state.events.length = 0;
    state.failCommit = state.failPut = state.failHead = state.failDelete = false;
    state.transactionTail = Promise.resolve();
    state.afterCommit = state.beforeDelete = undefined;
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('上传后取消或未保存，旧资料和旧对象仍然可用', async () => {
    const url = await upload();
    expect(state.avatarUrl).toBe(oldUrl);
    expect(state.objects.has(oldKey)).toBe(true);
    expect(state.objects.has(keyOf(url))).toBe(true);
    expect(state.events.some(event => event.startsWith('Delete'))).toBe(false);
  });

  it('相同图片重复上传和保存不会删除相同哈希对象', async () => {
    const url = await upload();
    state.avatarUrl = url;
    state.events.length = 0;
    expect(await upload()).toBe(url);
    expect((await save(url)).status).toBe(200);
    expect(state.objects.has(keyOf(url))).toBe(true);
    expect(state.events.some(event => event.startsWith('Delete'))).toBe(false);
  });

  it('上传对象失败不修改当前资料或删除旧对象', async () => {
    state.failPut = true;
    const response = await POST(request('avatar/upload', 'POST', {
      dataUrl: `data:image/webp;base64,${Buffer.from('new image').toString('base64')}`,
    }));
    expect(response.status).toBe(500);
    expect(state.avatarUrl).toBe(oldUrl);
    expect(state.objects.has(oldKey)).toBe(true);
    expect(state.events.some(event => event.startsWith('Delete'))).toBe(false);
  });

  it('合法替换先提交资料，再清理不同的旧对象', async () => {
    const url = await upload();
    expect((await save(url)).status).toBe(200);
    expect(state.avatarUrl).toBe(url);
    expect(state.objects.has(keyOf(url))).toBe(true);
    expect(state.objects.has(oldKey)).toBe(false);
    expect(state.events.indexOf('commit')).toBeGreaterThanOrEqual(0);
    expect(state.events.indexOf('commit')).toBeLessThan(state.events.indexOf(`DeleteObjectCommand:${oldKey}`));
    expect(state.events.filter(event => event === 'lock:update')).toHaveLength(2);
    expect(state.events.indexOf('lock:update')).toBeLessThan(state.events.indexOf(`HeadObjectCommand:${keyOf(url)}`));
  });

  it.each(['replace', 'clear'])('资料 %s 提交失败不删除旧对象', async operation => {
    const url = operation === 'replace' ? await upload() : '';
    state.failCommit = true;
    expect((await save(url)).status).toBe(500);
    expect(state.avatarUrl).toBe(oldUrl);
    expect(state.objects.has(oldKey)).toBe(true);
    expect(state.events.some(event => event.startsWith('Delete'))).toBe(false);
  });

  it('清空头像也在资料提交成功后删除旧对象', async () => {
    expect((await save('')).status).toBe(200);
    expect(state.avatarUrl).toBeNull();
    expect(state.objects.has(oldKey)).toBe(false);
    expect(state.events.indexOf('commit')).toBeGreaterThanOrEqual(0);
    expect(state.events.indexOf('commit')).toBeLessThan(state.events.indexOf(`DeleteObjectCommand:${oldKey}`));
    expect(state.events.filter(event => event === 'lock:update')).toHaveLength(2);
  });

  it('拒绝引用其他用户的对象，并保留当前头像', async () => {
    expect((await save(`${BASE}/avatars/U2/other.webp`)).status).toBe(400);
    expect(state.avatarUrl).toBe(oldUrl);
    expect(state.objects.has(oldKey)).toBe(true);
  });

  it('历史他人头像链接不被清理', async () => {
    const foreignKey = 'avatars/U2/other.webp';
    state.avatarUrl = `${BASE}/${foreignKey}`;
    state.objects.set(foreignKey, Buffer.from('other image'));
    expect((await save(await upload())).status).toBe(200);
    expect(state.objects.has(foreignKey)).toBe(true);
  });

  it('已失效的新对象和对象存储校验失败都不能覆盖旧资料', async () => {
    expect((await save(`${BASE}/avatars/U1/missing.webp`)).status).toBe(409);
    const url = await upload();
    state.failHead = true;
    expect((await save(url)).status).toBe(500);
    expect(state.avatarUrl).toBe(oldUrl);
    expect(state.objects.has(oldKey)).toBe(true);
  });

  it('清理失败只保留孤儿，不回滚已经保存的新头像', async () => {
    const url = await upload();
    state.failDelete = true;
    expect((await save(url)).status).toBe(200);
    expect(state.avatarUrl).toBe(url);
    expect(state.objects.has(keyOf(url))).toBe(true);
    expect(state.objects.has(oldKey)).toBe(true);
  });

  it('A→B 提交后并发保存回 A，延迟清理不得删除重新引用的 A', async () => {
    const url = await upload();
    const committed = barrier();
    const resumeCleanup = barrier();
    state.afterCommit = async () => {
      state.afterCommit = undefined;
      committed.resolve();
      await resumeCleanup.promise;
    };
    const first = save(url);
    await committed.promise;
    expect((await save(oldUrl)).status).toBe(200);
    resumeCleanup.resolve();
    expect((await first).status).toBe(200);
    expect(state.avatarUrl).toBe(oldUrl);
    expect(state.objects.has(oldKey)).toBe(true);
  });

  it('A 正在被清理时，排队的旧表单不能把已经删除的 A 写回资料', async () => {
    const url = await upload();
    const deleting = barrier();
    const resumeDelete = barrier();
    state.beforeDelete = async () => { deleting.resolve(); await resumeDelete.promise; };
    const first = save(url);
    await deleting.promise;
    const stale = save(oldUrl);
    resumeDelete.resolve();
    expect((await first).status).toBe(200);
    expect((await stale).status).toBe(409);
    expect(state.avatarUrl).toBe(url);
    expect(state.objects.has(keyOf(url))).toBe(true);
  });
});
