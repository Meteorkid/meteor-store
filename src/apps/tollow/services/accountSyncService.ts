import type {
  TollowBookProgress,
  TollowPracticeSessionInput,
} from '@/lib/tollow-contract';

export const TOLLOW_IMPORT_MARKER_KEY = 'import-marker';
export const TOLLOW_SYNC_QUEUE_KEY = 'sync-queue';
export const TOLLOW_BOOK_PROGRESS_KEY = 'book-progress';
export const TOLLOW_LEARNING_PROGRESS_KEY = 'learning-progress';
export const TOLLOW_PRACTICE_SESSIONS_KEY = 'practice-sessions';
export const TOLLOW_FAVORITES_CACHE_KEY = 'favorites-cache';
export const TOLLOW_LEGACY_MIGRATION_OWNER_KEY = 'tollow:legacy-migration-owner:v2';
export const TOLLOW_PROGRESS_SAVED_EVENT = 'tollow:progress-saved';
export const TOLLOW_SESSION_SAVED_EVENT = 'tollow:session-saved';
export const TOLLOW_SYNC_STATUS_EVENT = 'tollow:sync-status';
const LEGACY_BOOK_PROGRESS_STORAGE_KEY = 'tollow-book-progress-v1';
const LEGACY_LEARNING_PROGRESS_STORAGE_KEY = 'tollow_learning_progress';
const LEGACY_PRACTICE_SESSIONS_STORAGE_KEY = 'tollow_practice_sessions';

const legacyStorageKeys = [
  [TOLLOW_BOOK_PROGRESS_KEY, LEGACY_BOOK_PROGRESS_STORAGE_KEY],
  [TOLLOW_LEARNING_PROGRESS_KEY, LEGACY_LEARNING_PROGRESS_STORAGE_KEY],
  [TOLLOW_PRACTICE_SESSIONS_KEY, LEGACY_PRACTICE_SESSIONS_STORAGE_KEY],
] as const;

let activeTollowUserId: string | null = null;

export function getTollowAccountStorageKey(userId: string, name: string): string {
  return `tollow:${encodeURIComponent(userId)}:${name}:v2`;
}

export function configureTollowAccountStorage(userId: string): void {
  activeTollowUserId = userId;
}

export function releaseTollowAccountStorage(userId: string): void {
  if (activeTollowUserId === userId) activeTollowUserId = null;
}

export function getActiveTollowStorageKey(name: string): string | null {
  return activeTollowUserId
    ? getTollowAccountStorageKey(activeTollowUserId, name)
    : null;
}

export type TollowSyncStatus = 'synced' | 'pending' | 'error';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type QueueItem =
  | {
      id: string;
      operationId: string;
      version: string;
      type: 'progress';
      payload: TollowBookProgress;
    }
  | {
      id: string;
      operationId: string;
      version: string;
      type: 'session';
      payload: TollowPracticeSessionInput;
    };

interface TollowAccountSyncOptions {
  userId: string;
  storage: StorageLike;
  fetcher?: Fetcher;
  onStatusChange?: (status: TollowSyncStatus) => void;
}

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

function isProgress(value: unknown): value is TollowBookProgress {
  return isRecord(value)
    && typeof value.bookId === 'string'
    && typeof value.sectionId === 'string'
    && Number.isInteger(value.segmentIndex)
    && Number.isInteger(value.offset)
    && typeof value.updatedAt === 'string'
    && Number.isFinite(Date.parse(value.updatedAt));
}

function parseQueueItem(value: unknown): QueueItem | null {
  if (!isRecord(value) || typeof value.id !== 'string') return null;
  const operationId = typeof value.operationId === 'string'
    ? value.operationId
    : `legacy:${value.id}`;
  if (value.type === 'progress' && isProgress(value.payload)) {
    return {
      id: value.id,
      operationId,
      version: typeof value.version === 'string' ? value.version : value.payload.updatedAt,
      type: 'progress',
      payload: value.payload,
    };
  }
  if (value.type !== 'session' || !isRecord(value.payload)) return null;
  const valid = typeof value.payload.clientRecordId === 'string'
    && typeof value.payload.bookTitle === 'string'
    && typeof value.payload.startedAt === 'string'
    && typeof value.payload.endedAt === 'string';
  if (!valid) return null;
  return {
    id: value.id,
    operationId,
    version: typeof value.version === 'string'
      ? value.version
      : value.payload.clientRecordId as string,
    type: 'session',
    payload: value.payload as TollowPracticeSessionInput,
  };
}

function createOperationId(): string {
  return crypto.randomUUID();
}

function toIso(value: unknown): string | null {
  const parsed = value instanceof Date ? value : new Date(String(value ?? ''));
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function toSession(
  raw: unknown,
  source?: { bookId?: string; bookTitle?: string },
): TollowPracticeSessionInput | null {
  if (isRecord(raw) && typeof raw.clientRecordId === 'string') {
    const startedAt = toIso(raw.startedAt);
    const endedAt = toIso(raw.endedAt);
    const durationMs = Number(raw.durationMs);
    const wordsTyped = Number(raw.wordsTyped);
    const wpm = Number(raw.wpm);
    const accuracy = Number(raw.accuracy);
    const errorCount = Number(raw.errorCount);
    if (!startedAt || !endedAt) return null;
    if (![durationMs, wordsTyped, wpm, accuracy, errorCount].every(Number.isFinite)) return null;
    return {
      clientRecordId: raw.clientRecordId,
      bookId: typeof raw.bookId === 'string' ? raw.bookId : null,
      bookTitle: typeof raw.bookTitle === 'string' ? raw.bookTitle : '本地练习',
      startedAt,
      endedAt,
      durationMs: Math.max(0, Math.round(durationMs)),
      wordsTyped: Math.max(0, Math.round(wordsTyped)),
      wpm: Math.max(0, wpm),
      accuracy: Math.min(100, Math.max(0, accuracy)),
      errorCount: Math.max(0, Math.round(errorCount)),
    };
  }
  if (!isRecord(raw) || typeof raw.id !== 'string') return null;
  const startedAt = toIso(raw.startTime);
  const endedAt = toIso(raw.endTime);
  if (!startedAt || !endedAt) return null;

  const durationMs = Number(raw.duration);
  const wordsTyped = Number(raw.wordsTyped);
  const wpm = Number(raw.wpm);
  const accuracy = Number(raw.accuracy);
  const errorCount = Number(raw.errors);
  if (![durationMs, wordsTyped, wpm, accuracy, errorCount].every(Number.isFinite)) return null;

  return {
    clientRecordId: raw.id,
    bookId: source?.bookId || null,
    bookTitle: source?.bookTitle || '本地练习',
    startedAt,
    endedAt,
    durationMs: Math.max(0, Math.round(durationMs)),
    wordsTyped: Math.max(0, Math.round(wordsTyped)),
    wpm: Math.max(0, wpm),
    accuracy: Math.min(100, Math.max(0, accuracy)),
    errorCount: Math.max(0, Math.round(errorCount)),
  };
}

function readProgressMap(
  storage: StorageLike,
  storageKey: string,
): Record<string, TollowBookProgress> {
  const raw = parseJson(storage.getItem(storageKey));
  if (!isRecord(raw)) return {};
  return Object.fromEntries(
    Object.entries(raw).filter((entry): entry is [string, TollowBookProgress] => isProgress(entry[1])),
  );
}

function readLocalSessions(
  storage: StorageLike,
  learningProgressKey: string,
  practiceSessionsKey: string,
): TollowPracticeSessionInput[] {
  const sessions = new Map<string, TollowPracticeSessionInput>();
  const learning = parseJson(storage.getItem(learningProgressKey));
  if (Array.isArray(learning)) {
    for (const item of learning) {
      if (!isRecord(item) || !Array.isArray(item.practiceSessions)) continue;
      const source = {
        bookId: typeof item.fileId === 'string' ? item.fileId : undefined,
        bookTitle: typeof item.fileName === 'string' ? item.fileName : undefined,
      };
      for (const raw of item.practiceSessions) {
        const session = toSession(raw, source);
        if (session) sessions.set(session.clientRecordId, session);
      }
    }
  }

  const direct = parseJson(storage.getItem(practiceSessionsKey));
  if (Array.isArray(direct)) {
    for (const raw of direct) {
      const session = toSession(raw);
      if (session && !sessions.has(session.clientRecordId)) {
        sessions.set(session.clientRecordId, session);
      }
    }
  }
  return [...sessions.values()];
}

export function mergeProgressMaps(
  local: Record<string, TollowBookProgress>,
  remote: TollowBookProgress[],
): Record<string, TollowBookProgress> {
  const merged = { ...local };
  for (const progress of remote) {
    if (!isProgress(progress)) continue;
    const current = merged[progress.bookId];
    if (!current || Date.parse(progress.updatedAt) > Date.parse(current.updatedAt)) {
      merged[progress.bookId] = progress;
    }
  }
  return merged;
}

export class TollowAccountSync {
  private readonly userId: string;
  private readonly storage: StorageLike;
  private readonly fetcher: Fetcher;
  private readonly onStatusChange?: (status: TollowSyncStatus) => void;
  private status: TollowSyncStatus = 'synced';
  private flushing: Promise<void> | null = null;

  constructor(options: TollowAccountSyncOptions) {
    this.userId = options.userId;
    this.storage = options.storage;
    this.fetcher = options.fetcher ?? fetch;
    this.onStatusChange = options.onStatusChange;
  }

  getStatus(): TollowSyncStatus {
    return this.status;
  }

  private setStatus(status: TollowSyncStatus) {
    if (this.status === status) return;
    this.status = status;
    this.onStatusChange?.(status);
  }

  private readQueue(): QueueItem[] {
    const raw = parseJson(this.storage.getItem(this.key(TOLLOW_SYNC_QUEUE_KEY)));
    if (!Array.isArray(raw)) return [];
    return raw.map(parseQueueItem).filter((item): item is QueueItem => item !== null);
  }

  private writeQueue(queue: QueueItem[]) {
    this.storage.setItem(this.key(TOLLOW_SYNC_QUEUE_KEY), JSON.stringify(queue));
    this.setStatus(queue.length > 0 ? 'pending' : 'synced');
  }

  private key(name: string): string {
    return getTollowAccountStorageKey(this.userId, name);
  }

  private migrateLegacyStorage(): void {
    const owner = this.storage.getItem(TOLLOW_LEGACY_MIGRATION_OWNER_KEY);
    if (owner && owner !== this.userId) return;

    for (const [name, legacyKey] of legacyStorageKeys) {
      const scopedKey = this.key(name);
      if (this.storage.getItem(scopedKey) === null) {
        const legacyValue = this.storage.getItem(legacyKey);
        if (legacyValue !== null) this.storage.setItem(scopedKey, legacyValue);
      }
    }
    if (!owner) this.storage.setItem(TOLLOW_LEGACY_MIGRATION_OWNER_KEY, this.userId);
  }

  enqueueProgress(progress: TollowBookProgress) {
    const queue = this.readQueue().filter((item) => item.id !== `progress:${progress.bookId}`);
    queue.push({
      id: `progress:${progress.bookId}`,
      operationId: createOperationId(),
      version: progress.updatedAt,
      type: 'progress',
      payload: progress,
    });
    this.writeQueue(queue);
  }

  enqueueSession(session: TollowPracticeSessionInput) {
    const id = `session:${session.clientRecordId}`;
    const queue = this.readQueue();
    if (!queue.some((item) => item.id === id)) {
      queue.push({
        id,
        operationId: createOperationId(),
        version: session.clientRecordId,
        type: 'session',
        payload: session,
      });
      this.writeQueue(queue);
    }
  }

  async flush(): Promise<void> {
    if (this.flushing) return this.flushing;
    this.flushing = this.flushQueue().finally(() => {
      this.flushing = null;
    });
    return this.flushing;
  }

  private async flushQueue(): Promise<void> {
    const queue = this.readQueue();
    if (queue.length === 0) {
      this.setStatus('synced');
      return;
    }
    this.setStatus('pending');

    for (const item of [...queue]) {
      try {
        const response = await this.fetcher(
          item.type === 'progress' ? '/api/tollow/progress' : '/api/tollow/sessions',
          {
            method: item.type === 'progress' ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.payload),
          },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const current = this.readQueue().filter((queued) => (
          queued.id !== item.id
          || queued.operationId !== item.operationId
          || queued.version !== item.version
        ));
        this.writeQueue(current);
      } catch {
        this.setStatus('error');
        return;
      }
    }
    this.setStatus(this.readQueue().length > 0 ? 'pending' : 'synced');
  }

  async importLocalData(): Promise<void> {
    if (this.storage.getItem(this.key(TOLLOW_IMPORT_MARKER_KEY))) return;

    this.migrateLegacyStorage();

    const progress = Object.values(readProgressMap(
      this.storage,
      this.key(TOLLOW_BOOK_PROGRESS_KEY),
    ));
    const sessions = readLocalSessions(
      this.storage,
      this.key(TOLLOW_LEARNING_PROGRESS_KEY),
      this.key(TOLLOW_PRACTICE_SESSIONS_KEY),
    );
    const records = [
      ...progress.map((payload) => ({ type: 'progress' as const, payload })),
      ...sessions.map((payload) => ({ type: 'session' as const, payload })),
    ];

    for (let index = 0; index < records.length; index += 100) {
      const batch = records.slice(index, index + 100);
      const response = await this.fetcher('/api/tollow/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress: batch.filter((item) => item.type === 'progress').map((item) => item.payload),
          sessions: batch.filter((item) => item.type === 'session').map((item) => item.payload),
        }),
      });
      if (!response.ok) throw new Error('Tollow 本地数据导入失败');
    }

    this.storage.setItem(this.key(TOLLOW_IMPORT_MARKER_KEY), new Date().toISOString());
  }

  async mergeRemoteProgress(): Promise<void> {
    const response = await this.fetcher('/api/tollow/progress');
    if (!response.ok) throw new Error('Tollow 远端进度读取失败');
    const body = await response.json() as { items?: unknown[] };
    const remote = (body.items ?? []).filter(isProgress);
    const local = readProgressMap(this.storage, this.key(TOLLOW_BOOK_PROGRESS_KEY));
    const merged = mergeProgressMaps(local, remote);
    this.storage.setItem(this.key(TOLLOW_BOOK_PROGRESS_KEY), JSON.stringify(merged));

    const remoteByBook = Object.fromEntries(remote.map((item) => [item.bookId, item]));
    for (const progress of Object.values(local)) {
      const current = remoteByBook[progress.bookId];
      if (!current || Date.parse(progress.updatedAt) > Date.parse(current.updatedAt)) {
        this.enqueueProgress(progress);
      }
    }
  }

  async mergeRemoteSessions(): Promise<void> {
    const practiceSessionsKey = this.key(TOLLOW_PRACTICE_SESSIONS_KEY);
    const learningProgressKey = this.key(TOLLOW_LEARNING_PROGRESS_KEY);
    const localSessions = readLocalSessions(
      this.storage,
      learningProgressKey,
      practiceSessionsKey,
    );
    const remoteSessions = new Map<string, TollowPracticeSessionInput>();
    let page = 1;
    let received = 0;
    let total = Number.POSITIVE_INFINITY;

    while (received < total && page <= 10_000) {
      const response = await this.fetcher(`/api/tollow/sessions?page=${page}&limit=100`);
      if (!response.ok) throw new Error('Tollow 远端练习记录读取失败');
      const body = await response.json() as { items?: unknown[]; total?: unknown };
      const items = Array.isArray(body.items) ? body.items : [];
      total = Number.isInteger(body.total) && Number(body.total) >= 0
        ? Number(body.total)
        : received + items.length;
      if (items.length === 0) break;
      received += items.length;
      for (const raw of items) {
        const session = toSession(raw);
        if (session) remoteSessions.set(session.clientRecordId, session);
      }
      page += 1;
    }

    const direct = parseJson(this.storage.getItem(practiceSessionsKey));
    const mergedDirect = Array.isArray(direct) ? [...direct] : [];
    const localIds = new Set(localSessions.map((session) => session.clientRecordId));
    for (const session of remoteSessions.values()) {
      if (!localIds.has(session.clientRecordId)) mergedDirect.push(session);
    }
    this.storage.setItem(practiceSessionsKey, JSON.stringify(mergedDirect));

    for (const session of localSessions) {
      if (!remoteSessions.has(session.clientRecordId)) this.enqueueSession(session);
    }
  }

  async initialize(): Promise<void> {
    try {
      await this.importLocalData();
      await this.mergeRemoteProgress();
      await this.mergeRemoteSessions();
      await this.flush();
    } catch {
      this.setStatus('error');
    }
  }
}

function getBrowserStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export interface TollowAccountSyncHandle {
  ready: Promise<void>;
  stop(): void;
}

export function startTollowAccountSync(userId: string): TollowAccountSyncHandle {
  const storage = getBrowserStorage();
  if (!storage) return { ready: Promise.resolve(), stop: () => undefined };

  const sync = new TollowAccountSync({
    userId,
    storage,
    onStatusChange(status) {
      window.dispatchEvent(new CustomEvent(TOLLOW_SYNC_STATUS_EVENT, { detail: status }));
    },
  });
  const onProgress = (event: Event) => {
    const progress = (event as CustomEvent<unknown>).detail;
    if (!isProgress(progress)) return;
    sync.enqueueProgress(progress);
    void sync.flush();
  };
  const onSession = (event: Event) => {
    const session = (event as CustomEvent<TollowPracticeSessionInput>).detail;
    if (!session) return;
    sync.enqueueSession(session);
    void sync.flush();
  };
  const onOnline = () => void sync.flush();

  window.addEventListener(TOLLOW_PROGRESS_SAVED_EVENT, onProgress);
  window.addEventListener(TOLLOW_SESSION_SAVED_EVENT, onSession);
  window.addEventListener('online', onOnline);
  const ready = sync.initialize();

  return {
    ready,
    stop() {
      window.removeEventListener(TOLLOW_PROGRESS_SAVED_EVENT, onProgress);
      window.removeEventListener(TOLLOW_SESSION_SAVED_EVENT, onSession);
      window.removeEventListener('online', onOnline);
    },
  };
}
