import { accumulatePass, type Grant } from '@/lib/entitlements';
import { SoftwareLicenseError, type SoftwareLicenseKind, type SoftwareProductId } from './types';

export interface SoftwareGrant { id: string; kind: SoftwareLicenseKind; grantedAt: string }
export interface SoftwareCoverage { kind: SoftwareLicenseKind; expiresAt: string | null }

/** 从有效来源重算，撤销/退款后不会留下先前物化出来的额外月份。 */
export function calculateSoftwareCoverage(grants: SoftwareGrant[]): SoftwareCoverage | null {
  const unique = [...new Map(grants.map((grant) => [grant.id, grant])).values()];
  if (unique.length === 0) return null;
  const normalized: Grant[] = unique.map((grant) => ({
    productId: 'meteor-pass', planName: grant.kind, planId: grant.kind,
    billingPeriod: grant.kind, passPlanKey: grant.kind, grantedAt: grant.grantedAt,
  }));
  const result = accumulatePass(normalized);
  if (!result || (!result.lifetime && result.expiresAt === null)) return null;
  return { kind: result.lifetime ? 'lifetime' : (result.planId ?? 'monthly'), expiresAt: result.expiresAt };
}

export function requireActiveCoverage(coverage: SoftwareCoverage | null, now: Date): SoftwareCoverage {
  if (!coverage) throw new SoftwareLicenseError('revoked', '授权已撤销或不可用', 403);
  if (coverage.expiresAt !== null && new Date(coverage.expiresAt).getTime() <= now.getTime()) {
    throw new SoftwareLicenseError('expired', '授权已到期，请续费后重试', 403);
  }
  return coverage;
}

export function softwareProductName(productId: SoftwareProductId): string {
  return productId === 'xnook' ? 'XNook' : 'XIsland';
}
