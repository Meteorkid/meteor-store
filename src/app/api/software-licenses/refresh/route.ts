import { NextRequest } from 'next/server';
import { refreshSoftwareLicense } from '@/lib/software-licenses/service';
import { TokenSchema, parseSoftwareBody, privateJson, softwareError, softwareRequestGuard } from '@/lib/software-licenses/http';

export async function POST(request: NextRequest) {
  const denied = await softwareRequestGuard(request, 'refresh', 120);
  if (denied) return denied;
  try { return privateJson(await refreshSoftwareLicense(await parseSoftwareBody(request, TokenSchema))); }
  catch (error) { return softwareError(error); }
}
