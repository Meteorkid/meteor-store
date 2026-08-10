export const BLOG_API_SCOPES = [
  'blog:read',
  'blog:write',
  'blog:submit',
  'blog:image',
] as const;

export const BLOG_API_TOKEN_EXPIRY_DAYS = [30, 90, 365] as const;

export type BlogApiScope = (typeof BLOG_API_SCOPES)[number];
export type BlogApiTokenExpiryDays = (typeof BLOG_API_TOKEN_EXPIRY_DAYS)[number];
export type PersonalAccessTokenStatus = 'active' | 'expired' | 'revoked' | 'invalidated';

export interface TokenMetadata {
  id: string;
  name: string;
  tokenPrefix: string;
  scopes: BlogApiScope[];
  status: PersonalAccessTokenStatus;
  expiresAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}
