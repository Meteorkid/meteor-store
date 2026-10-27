export function isSoftwareLicensingEnabled(): boolean {
  return process.env.SOFTWARE_LICENSE_ENABLED === 'true';
}
