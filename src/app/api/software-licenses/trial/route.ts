import { NextRequest } from 'next/server';
import { startSoftwareTrial } from '@/lib/software-licenses/service';
import { DeviceSchema, parseSoftwareBody, privateJson, softwareError, softwareRequestGuard } from '@/lib/software-licenses/http';

export async function POST(request: NextRequest) {
  const denied = await softwareRequestGuard(request, 'trial', 10);
  if (denied) return denied;
  try { return privateJson(await startSoftwareTrial(await parseSoftwareBody(request, DeviceSchema))); }
  catch (error) { return softwareError(error); }
}
