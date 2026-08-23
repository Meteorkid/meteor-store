import type {
  TollowFavoriteCreateInput,
  TollowFavoritePatchInput,
  TollowFavoritesQuery,
} from '@/lib/tollow-contract';

export interface TollowFavorite extends TollowFavoriteCreateInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface TollowFavoriteList {
  items: TollowFavorite[];
  total: number;
  page: number;
  limit: number;
}

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export class TollowFavoriteService {
  constructor(private readonly fetcher: Fetcher = fetch) {}

  private async request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const response = init ? await this.fetcher(input, init) : await this.fetcher(input);
    const body = response.status === 204
      ? null
      : await response.json().catch(() => null) as { error?: string } | null;
    if (!response.ok) {
      throw new Error(body?.error || '收藏服务暂时不可用');
    }
    return body as T;
  }

  list(query: TollowFavoritesQuery): Promise<TollowFavoriteList> {
    const params = new URLSearchParams();
    if (query.q) params.set('q', query.q);
    if (query.bookId) params.set('bookId', query.bookId);
    if (query.tag) params.set('tag', query.tag);
    params.set('sort', query.sort);
    params.set('page', String(query.page));
    params.set('limit', String(query.limit));
    return this.request(`/api/tollow/favorites?${params.toString()}`);
  }

  async create(input: TollowFavoriteCreateInput): Promise<TollowFavorite> {
    const body = await this.request<{ favorite: TollowFavorite }>('/api/tollow/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return body.favorite;
  }

  async update(id: string, input: TollowFavoritePatchInput): Promise<TollowFavorite> {
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

  remove(id: string): Promise<void> {
    return this.request(`/api/tollow/favorites/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }
}

export const tollowFavoriteService = new TollowFavoriteService();
export const TOLLOW_FAVORITES_CHANGED_EVENT = 'tollow:favorites-changed';
