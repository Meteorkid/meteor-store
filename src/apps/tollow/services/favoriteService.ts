import type {
  TollowFavoriteCreateInput,
  TollowFavoritePatchInput,
  TollowFavoritesQuery,
} from '@/lib/tollow-contract';
import {
  TOLLOW_FAVORITES_CACHE_KEY,
  getActiveTollowStorageKey,
  getTollowAccountStorageKey,
} from './accountSyncService';

export type TollowFavoriteDraft = Omit<TollowFavoriteCreateInput, 'clientRecordId'>;
export type TollowFavoriteSyncState = 'synced' | 'pending' | 'error';

export interface TollowFavorite extends TollowFavoriteCreateInput {
  id: string;
  createdAt: string;
  updatedAt: string;
  syncState?: TollowFavoriteSyncState;
}

export interface TollowFavoriteList {
  items: TollowFavorite[];
  total: number;
  page: number;
  limit: number;
  facets: {
    books: Array<{ id: string; title: string }>;
    tags: string[];
  };
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface FavoriteServiceOptions {
  storage?: StorageLike;
  userId?: string;
}

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type FavoriteOperation = {
  operationId: string;
  entityKey: string;
  version: string;
  type: 'create';
  payload: TollowFavoriteCreateInput;
} | {
  operationId: string;
  entityKey: string;
  version: string;
  type: 'update';
  payload: { id: string; patch: TollowFavoritePatchInput };
} | {
  operationId: string;
  entityKey: string;
  version: string;
  type: 'delete';
  payload: { id: string; favorite: TollowFavorite };
} | {
  operationId: string;
  entityKey: string;
  version: string;
  type: 'delete-after-create';
  payload: TollowFavoriteCreateInput;
};

interface StoreContext {
  storage: StorageLike;
  cacheKey: string;
  outboxKey: string;
}

class FavoriteRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export const TOLLOW_FAVORITES_OUTBOX_KEY = 'favorites-outbox';
export const TOLLOW_FAVORITES_CHANGED_EVENT = 'tollow:favorites-changed';
export const TOLLOW_FAVORITES_PENDING_EVENT = 'tollow:favorites-pending';

function parseJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFavorite(value: unknown): value is TollowFavorite {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.clientRecordId === 'string'
    && typeof value.bookTitle === 'string'
    && typeof value.quote === 'string'
    && Array.isArray(value.tags);
}

function isOperation(value: unknown): value is FavoriteOperation {
  if (!isRecord(value)
    || typeof value.operationId !== 'string'
    || typeof value.entityKey !== 'string'
    || typeof value.version !== 'string'
    || !isRecord(value.payload)) return false;
  return value.type === 'create'
    || value.type === 'update'
    || value.type === 'delete'
    || value.type === 'delete-after-create';
}

function createId(): string {
  return crypto.randomUUID();
}

function dispatch(name: string): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(name));
}

function matchesQuery(favorite: TollowFavorite, query: TollowFavoritesQuery): boolean {
  if (query.bookId && favorite.bookId !== query.bookId) return false;
  if (query.tag && !favorite.tags.includes(query.tag)) return false;
  if (query.q) {
    const q = query.q.toLocaleLowerCase();
    if (!favorite.quote.toLocaleLowerCase().includes(q)
      && !(favorite.note || '').toLocaleLowerCase().includes(q)) return false;
  }
  return true;
}

function sortFavorites(items: TollowFavorite[], sort: TollowFavoritesQuery['sort']): TollowFavorite[] {
  return [...items].sort((left, right) => {
    if (sort === 'updated-asc') return left.updatedAt.localeCompare(right.updatedAt);
    if (sort === 'updated-desc') return right.updatedAt.localeCompare(left.updatedAt);
    return left.bookTitle.localeCompare(right.bookTitle, 'zh-CN')
      || (left.sectionTitle || '').localeCompare(right.sectionTitle || '', 'zh-CN')
      || (left.segmentIndex ?? 0) - (right.segmentIndex ?? 0)
      || left.startOffset - right.startOffset;
  });
}

export class TollowFavoriteService {
  private flushing: Promise<void> | null = null;
  private cloudEnabled = true;

  constructor(
    private readonly fetcher: Fetcher = fetch,
    private readonly options: FavoriteServiceOptions = {},
  ) {}

  setCloudEnabled(enabled: boolean): void {
    this.cloudEnabled = enabled;
  }

  private getContext(): StoreContext | null {
    let storage = this.options.storage;
    if (!storage && typeof window !== 'undefined') {
      try {
        storage = window.localStorage;
      } catch {
        return null;
      }
    }
    if (!storage) return null;
    const cacheKey = this.options.userId
      ? getTollowAccountStorageKey(this.options.userId, TOLLOW_FAVORITES_CACHE_KEY)
      : getActiveTollowStorageKey(TOLLOW_FAVORITES_CACHE_KEY);
    const outboxKey = this.options.userId
      ? getTollowAccountStorageKey(this.options.userId, TOLLOW_FAVORITES_OUTBOX_KEY)
      : getActiveTollowStorageKey(TOLLOW_FAVORITES_OUTBOX_KEY);
    return cacheKey && outboxKey ? { storage, cacheKey, outboxKey } : null;
  }

  private readCache(context: StoreContext): TollowFavorite[] {
    const value = parseJson(context.storage.getItem(context.cacheKey));
    return Array.isArray(value) ? value.filter(isFavorite) : [];
  }

  private writeCache(context: StoreContext, favorites: TollowFavorite[]): void {
    context.storage.setItem(context.cacheKey, JSON.stringify(favorites));
  }

  private readOutbox(context: StoreContext): FavoriteOperation[] {
    const value = parseJson(context.storage.getItem(context.outboxKey));
    return Array.isArray(value) ? value.filter(isOperation) : [];
  }

  private writeOutbox(context: StoreContext, operations: FavoriteOperation[]): void {
    context.storage.setItem(context.outboxKey, JSON.stringify(operations));
    if (operations.length > 0) dispatch(TOLLOW_FAVORITES_PENDING_EVENT);
  }

  private async request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const response = init ? await this.fetcher(input, init) : await this.fetcher(input);
    const body = response.status === 204
      ? null
      : await response.json().catch(() => null) as { error?: string } | null;
    if (!response.ok) {
      throw new FavoriteRequestError(body?.error || '收藏服务暂时不可用', response.status);
    }
    return body as T;
  }

  private listUrl(query: TollowFavoritesQuery): string {
    const params = new URLSearchParams();
    if (query.q) params.set('q', query.q);
    if (query.bookId) params.set('bookId', query.bookId);
    if (query.tag) params.set('tag', query.tag);
    params.set('sort', query.sort);
    params.set('page', String(query.page));
    params.set('limit', String(query.limit));
    return `/api/tollow/favorites?${params.toString()}`;
  }

  async list(query: TollowFavoritesQuery): Promise<TollowFavoriteList> {
    const context = this.getContext();
    if (!context) return this.request(this.listUrl(query));
    if (!this.cloudEnabled) return this.listFromCache(context, query);

    try {
      const remote = await this.request<TollowFavoriteList>(this.listUrl(query));
      const merged = this.mergeRemoteList(context, remote, query);
      void this.flush().catch(() => undefined);
      return merged;
    } catch {
      return this.listFromCache(context, query);
    }
  }

  async create(input: TollowFavoriteDraft): Promise<TollowFavorite> {
    const payload: TollowFavoriteCreateInput = { ...input, clientRecordId: createId() };
    const context = this.getContext();
    if (!context) {
      const body = await this.request<{ favorite: TollowFavorite }>('/api/tollow/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return body.favorite;
    }

    const now = new Date().toISOString();
    const favorite: TollowFavorite = {
      ...payload,
      id: `local:${payload.clientRecordId}`,
      createdAt: now,
      updatedAt: now,
      syncState: this.cloudEnabled ? 'pending' : undefined,
    };
    this.writeCache(context, [...this.readCache(context), favorite]);
    this.writeOutbox(context, [...this.readOutbox(context), {
      operationId: createId(),
      entityKey: payload.clientRecordId,
      version: now,
      type: 'create',
      payload,
    }]);
    dispatch(TOLLOW_FAVORITES_CHANGED_EVENT);
    void this.flush().catch(() => undefined);
    return favorite;
  }

  async update(id: string, input: TollowFavoritePatchInput): Promise<TollowFavorite> {
    const context = this.getContext();
    if (!context) {
      const body = await this.request<{ favorite: TollowFavorite }>(
        `/api/tollow/favorites/${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        },
      );
      return body.favorite;
    }

    const cache = this.readCache(context);
    const current = cache.find((favorite) => favorite.id === id);
    if (!current) throw new Error('收藏不在本地缓存中，请重新打开收藏列表');
    const now = new Date().toISOString();
    const favorite: TollowFavorite = {
      ...current,
      ...input,
      updatedAt: now,
      syncState: this.cloudEnabled ? 'pending' : undefined,
    };
    this.writeCache(context, cache.map((item) => item.id === id ? favorite : item));

    const outbox = this.readOutbox(context);
    const pendingCreate = outbox.find((item): item is Extract<FavoriteOperation, { type: 'create' | 'delete-after-create' }> => (
      item.entityKey === current.clientRecordId
      && (item.type === 'create' || item.type === 'delete-after-create')
    ));
    const operationId = createId();
    if (pendingCreate?.type === 'create') {
      this.writeOutbox(context, outbox.map((item) => item === pendingCreate ? {
        ...item,
        operationId,
        version: now,
        payload: { ...item.payload, ...input },
      } : item));
    } else {
      this.writeOutbox(context, [
        ...outbox.filter((item) => item.entityKey !== id),
        { operationId, entityKey: id, version: now, type: 'update', payload: { id, patch: input } },
      ]);
    }
    dispatch(TOLLOW_FAVORITES_CHANGED_EVENT);
    void this.flush().catch(() => undefined);
    return favorite;
  }

  async remove(id: string): Promise<void> {
    const context = this.getContext();
    if (!context) {
      return this.request(`/api/tollow/favorites/${encodeURIComponent(id)}`, { method: 'DELETE' });
    }

    const cache = this.readCache(context);
    const favorite = cache.find((item) => item.id === id);
    if (!favorite) return;
    this.writeCache(context, cache.filter((item) => item.id !== id));
    const outbox = this.readOutbox(context);
    const pendingCreate = outbox.find((item): item is Extract<FavoriteOperation, { type: 'create' | 'delete-after-create' }> => (
      item.entityKey === favorite.clientRecordId
      && (item.type === 'create' || item.type === 'delete-after-create')
    ));
    if (pendingCreate) {
      const isInFlight = this.flushing !== null;
      this.writeOutbox(context, isInFlight ? outbox.map((item) => item === pendingCreate ? {
        operationId: createId(),
        entityKey: favorite.clientRecordId,
        version: new Date().toISOString(),
        type: 'delete-after-create' as const,
        payload: pendingCreate.payload,
      } : item) : outbox.filter((item) => item !== pendingCreate));
    } else {
      this.writeOutbox(context, [
        ...outbox.filter((item) => item.entityKey !== id),
        {
          operationId: createId(),
          entityKey: id,
          version: new Date().toISOString(),
          type: 'delete',
          payload: { id, favorite },
        },
      ]);
    }
    dispatch(TOLLOW_FAVORITES_CHANGED_EVENT);
    void this.flush().catch(() => undefined);
  }

  async flush(): Promise<void> {
    if (!this.cloudEnabled) return;
    if (this.flushing) return this.flushing;
    const context = this.getContext();
    if (!context) return;
    this.flushing = this.flushOutbox(context).finally(() => {
      this.flushing = null;
    });
    return this.flushing;
  }

  private async flushOutbox(context: StoreContext): Promise<void> {
    while (true) {
      const operation = this.readOutbox(context)[0];
      if (!operation) return;
      try {
        const favorite = await this.sendOperation(operation);
        this.acknowledge(context, operation, favorite);
        dispatch(TOLLOW_FAVORITES_CHANGED_EVENT);
      } catch (error) {
        if (error instanceof FavoriteRequestError && error.status >= 400 && error.status < 500
          && error.status !== 401 && error.status !== 403 && error.status !== 429) {
          this.markPermanentFailure(context, operation);
          dispatch(TOLLOW_FAVORITES_CHANGED_EVENT);
          continue;
        }
        throw error;
      }
    }
  }

  private async sendOperation(operation: FavoriteOperation): Promise<TollowFavorite | null> {
    if (operation.type === 'create' || operation.type === 'delete-after-create') {
      const body = await this.request<{ favorite: TollowFavorite }>('/api/tollow/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operation.payload),
      });
      return body.favorite;
    }
    if (operation.type === 'update') {
      const body = await this.request<{ favorite: TollowFavorite }>(
        `/api/tollow/favorites/${encodeURIComponent(operation.payload.id)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(operation.payload.patch),
        },
      );
      return body.favorite;
    }
    await this.request(`/api/tollow/favorites/${encodeURIComponent(operation.payload.id)}`, {
      method: 'DELETE',
    });
    return null;
  }

  private acknowledge(context: StoreContext, sent: FavoriteOperation, serverFavorite: TollowFavorite | null): void {
    const outbox = this.readOutbox(context);
    const current = outbox.find((item) => item.entityKey === sent.entityKey);
    const exact = current?.operationId === sent.operationId && current.version === sent.version;
    const cache = this.readCache(context);

    if ((sent.type === 'create' || sent.type === 'delete-after-create') && serverFavorite) {
      if (current?.type === 'delete-after-create' || sent.type === 'delete-after-create') {
        const nextDelete: FavoriteOperation = {
          operationId: createId(),
          entityKey: serverFavorite.id,
          version: new Date().toISOString(),
          type: 'delete',
          payload: { id: serverFavorite.id, favorite: { ...serverFavorite, syncState: 'pending' } },
        };
        this.writeOutbox(context, [
          ...outbox.filter((item) => item.entityKey !== sent.entityKey),
          nextDelete,
        ]);
        return;
      }
      if (exact) {
        this.writeOutbox(context, outbox.filter((item) => item.operationId !== sent.operationId));
        this.writeCache(context, cache.map((item) => (
          item.clientRecordId === serverFavorite.clientRecordId
            ? { ...serverFavorite, syncState: 'synced' }
            : item
        )));
        return;
      }
      if (current?.type === 'create') {
        const latest = cache.find((item) => item.clientRecordId === serverFavorite.clientRecordId);
        this.writeOutbox(context, [
          ...outbox.filter((item) => item.entityKey !== sent.entityKey),
          {
            operationId: createId(),
            entityKey: serverFavorite.id,
            version: current.version,
            type: 'update',
            payload: {
              id: serverFavorite.id,
              patch: { note: latest?.note ?? null, tags: latest?.tags ?? [] },
            },
          },
        ]);
        this.writeCache(context, cache.map((item) => (
          item.clientRecordId === serverFavorite.clientRecordId
            ? { ...item, id: serverFavorite.id, createdAt: serverFavorite.createdAt }
            : item
        )));
      }
      return;
    }

    if (!exact) return;
    this.writeOutbox(context, outbox.filter((item) => item.operationId !== sent.operationId));
    if (sent.type === 'update' && serverFavorite) {
      this.writeCache(context, cache.map((item) => (
        item.id === serverFavorite.id ? { ...serverFavorite, syncState: 'synced' } : item
      )));
    }
  }

  private markPermanentFailure(context: StoreContext, operation: FavoriteOperation): void {
    const outbox = this.readOutbox(context);
    this.writeOutbox(context, outbox.filter((item) => item.operationId !== operation.operationId));
    if (operation.type === 'delete' || operation.type === 'delete-after-create') return;
    this.writeCache(context, this.readCache(context).map((favorite) => (
      favorite.clientRecordId === operation.entityKey || favorite.id === operation.entityKey
        ? { ...favorite, syncState: 'error' }
        : favorite
    )));
  }

  private mergeRemoteList(context: StoreContext, remote: TollowFavoriteList, query: TollowFavoritesQuery): TollowFavoriteList {
    const cache = this.readCache(context);
    const outbox = this.readOutbox(context);
    const pendingIds = new Set(outbox.map((item) => item.entityKey));
    const deletedIds = new Set(outbox.flatMap((item) => item.type === 'delete' ? [item.payload.id] : []));
    const cacheById = new Map(cache.map((favorite) => [favorite.id, favorite]));
    const cacheByClientId = new Map(cache.map((favorite) => [favorite.clientRecordId, favorite]));

    const remoteItems = remote.items.flatMap((favorite) => {
      if (deletedIds.has(favorite.id)) return [];
      const local = cacheById.get(favorite.id) || cacheByClientId.get(favorite.clientRecordId);
      return [local && (pendingIds.has(local.id) || pendingIds.has(local.clientRecordId))
        ? local
        : { ...favorite, syncState: 'synced' as const }];
    });
    const remoteIds = new Set(remote.items.map((favorite) => favorite.id));
    const remoteClientIds = new Set(remote.items.map((favorite) => favorite.clientRecordId));
    const preserved = cache.filter((favorite) => !remoteIds.has(favorite.id) && !remoteClientIds.has(favorite.clientRecordId));
    const nextCache = [...preserved, ...remoteItems];
    this.writeCache(context, nextCache);

    const pendingCreates = query.page === 1
      ? nextCache.filter((favorite) => favorite.id.startsWith('local:') && matchesQuery(favorite, query))
      : [];
    const items = sortFavorites(
      [...pendingCreates, ...remoteItems.filter((item) => !pendingCreates.some((pending) => pending.clientRecordId === item.clientRecordId))],
      query.sort,
    ).slice(0, query.limit);
    return {
      ...remote,
      items,
      total: remote.total + pendingCreates.length,
      facets: this.buildFacets(nextCache, remote.facets),
    };
  }

  private listFromCache(context: StoreContext, query: TollowFavoritesQuery): TollowFavoriteList {
    const cache = this.readCache(context);
    const matches = sortFavorites(cache.filter((item) => matchesQuery(item, query)), query.sort);
    const start = (query.page - 1) * query.limit;
    return {
      items: matches.slice(start, start + query.limit),
      total: matches.length,
      page: query.page,
      limit: query.limit,
      facets: this.buildFacets(cache),
    };
  }

  private buildFacets(
    cache: TollowFavorite[],
    remote: TollowFavoriteList['facets'] = { books: [], tags: [] },
  ): TollowFavoriteList['facets'] {
    const books = new Map(remote.books.map((book) => [book.id, book.title]));
    const tags = new Set(remote.tags);
    for (const favorite of cache) {
      if (favorite.bookId) books.set(favorite.bookId, favorite.bookTitle);
      for (const tag of favorite.tags) tags.add(tag);
    }
    return {
      books: [...books].map(([id, title]) => ({ id, title })).sort((a, b) => a.title.localeCompare(b.title, 'zh-CN')),
      tags: [...tags].sort((a, b) => a.localeCompare(b, 'zh-CN')),
    };
  }
}

export const tollowFavoriteService = new TollowFavoriteService();

export function configureTollowFavoriteCloudSync(enabled: boolean): void {
  tollowFavoriteService.setCloudEnabled(enabled);
}

export function startTollowFavoriteSync(): () => void {
  let stopped = false;
  let retryCount = 0;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  const attempt = () => {
    if (stopped) return;
    if (retryTimer) clearTimeout(retryTimer);
    retryTimer = null;
    void tollowFavoriteService.flush().then(() => {
      retryCount = 0;
    }).catch((error) => {
      if (stopped) return;
      if (error instanceof FavoriteRequestError && (error.status === 401 || error.status === 403)) {
        stopped = true;
        return;
      }
      const delay = Math.min(30_000, 1_000 * (2 ** retryCount));
      retryCount += 1;
      retryTimer = setTimeout(attempt, delay);
    });
  };
  const retryNow = () => {
    retryCount = 0;
    attempt();
  };

  window.addEventListener(TOLLOW_FAVORITES_PENDING_EVENT, retryNow);
  window.addEventListener('online', retryNow);
  window.addEventListener('focus', retryNow);
  attempt();

  return () => {
    stopped = true;
    if (retryTimer) clearTimeout(retryTimer);
    window.removeEventListener(TOLLOW_FAVORITES_PENDING_EVENT, retryNow);
    window.removeEventListener('online', retryNow);
    window.removeEventListener('focus', retryNow);
  };
}
