export const SOFTWARE_PRODUCT_IDS = ['xnook', 'xisland'] as const;
export type SoftwareProductId = typeof SOFTWARE_PRODUCT_IDS[number];
export type SoftwareLicenseKind = 'monthly' | 'annual' | 'lifetime';

export interface SoftwareLicenseCodeView {
  id: string;
  sourceLicenseId: string;
  productId: SoftwareProductId;
  productName: string;
  code: string;
  kind: SoftwareLicenseKind;
  expiresAt: string | null;
  status: 'active' | 'revoked' | 'expired';
  createdAt: string;
}

export interface SoftwareLicenseDeviceView {
  id: string;
  productId: SoftwareProductId;
  productName: string;
  deviceName: string;
  status: 'active' | 'revoked';
  activatedAt: string;
  lastSeenAt: string;
  revokedAt: string | null;
}

export interface SoftwareLeasePayload {
  version: 1;
  productId: SoftwareProductId;
  deviceId: string;
  licenseId: string;
  kind: SoftwareLicenseKind | 'trial';
  issuedAt: number;
  expiresAt: number;
  entitlementExpiresAt: number | null;
}

export interface SoftwareLeaseResponse { lease: string; deviceToken: string }

export class SoftwareLicenseError extends Error {
  constructor(public readonly code: string, message: string, public readonly status = 400) {
    super(message);
    this.name = 'SoftwareLicenseError';
  }
}
