import { NextRequest } from 'next/server';
import { activateSoftwareLicense } from '@/lib/software-licenses/service';
import { ActivationSchema, parseSoftwareBody, privateJson, softwareError, softwareRequestGuard } from '@/lib/software-licenses/http';

export async function POST(request: NextRequest) {
  const denied = await softwareRequestGuard(request, 'activate', 10);
  if (denied) return denied;
  try { return privateJson(await activateSoftwareLicense(await parseSoftwareBody(request, ActivationSchema))); }
  catch (error) { return softwareError(error); }
}
