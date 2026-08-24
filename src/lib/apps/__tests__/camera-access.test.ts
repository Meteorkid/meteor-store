import { describe, expect, it, vi } from 'vitest';
import { requestCameraAccess } from '../camera-access';

describe('摄像头权限预检', () => {
  it('授权后立即释放预检视频轨道', async () => {
    const stop = vi.fn();
    const request = vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] });

    await expect(requestCameraAccess(request)).resolves.toEqual({ ok: true });
    expect(stop).toHaveBeenCalledOnce();
  });

  it('保留浏览器拒绝权限的具体原因', async () => {
    const error = new DOMException('Permission denied', 'NotAllowedError');
    const request = vi.fn().mockRejectedValue(error);

    await expect(requestCameraAccess(request)).resolves.toEqual({
      ok: false,
      reason: 'permission-denied',
    });
  });

  it('区分无摄像头和摄像头被占用', async () => {
    await expect(requestCameraAccess(vi.fn().mockRejectedValue(
      new DOMException('Missing device', 'NotFoundError'),
    ))).resolves.toEqual({ ok: false, reason: 'not-found' });
    await expect(requestCameraAccess(vi.fn().mockRejectedValue(
      new DOMException('Device busy', 'NotReadableError'),
    ))).resolves.toEqual({ ok: false, reason: 'device-busy' });
  });
});
