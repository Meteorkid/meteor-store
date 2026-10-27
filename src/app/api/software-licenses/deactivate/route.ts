import { NextRequest } from 'next/server';
import { deactivateSoftwareLicense } from '@/lib/software-licenses/service';
import { TokenSchema, parseSoftwareBody, privateJson, softwareError, softwareRequestGuard } from '@/lib/software-licenses/http';

export async function POST(request: NextRequest) {
  const denied = await softwareRequestGuard(request, 'deactivate');
  if (denied) return denied;
  try {
    await deactivateSoftwareLicense(await parseSoftwareBody(request, TokenSchema));
    return privateJson({ success: true });
  } catch (error) { return softwareError(error); }
}
