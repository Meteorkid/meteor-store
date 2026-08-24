import { describe, expect, it, vi } from 'vitest';
import { acquireCameraStream, requestCameraAccess } from '../camera-access';

describe('摄像头权限预检', () => {
  it('授权后立即释放预检视频轨道', async () => {
    const stop = vi.fn();
    const request = vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] });

    await expect(requestCameraAccess(request)).resolves.toEqual({ ok: true });
    expect(stop).toHaveBeenCalledOnce();
  });

  it('正式采集返回同一条视频流，由调用方管理生命周期', async () => {
    const stop = vi.fn();
    const stream = { getTracks: () => [{ stop }] };

    await expect(acquireCameraStream(vi.fn().mockResolvedValue(stream))).resolves.toEqual({
      ok: true,
      stream,
    });
    expect(stop).not.toHaveBeenCalled();
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

  it('授权请求一直悬挂时自动超时，不能永久锁住交互', async () => {
    vi.useFakeTimers();
    const request = vi.fn(() => new Promise<Pick<MediaStream, 'getTracks'>>(() => {}));

    const result = requestCameraAccess(request, { timeoutMs: 8_000 });
    await vi.advanceTimersByTimeAsync(8_000);

    await expect(result).resolves.toEqual({ ok: false, reason: 'timeout' });
    vi.useRealTimers();
  });
});
