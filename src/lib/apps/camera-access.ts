export type CameraAccessFailure =
  | 'unsupported'
  | 'permission-denied'
  | 'not-found'
  | 'device-busy'
  | 'timeout'
  | 'unknown';

export type CameraAccessResult =
  | { ok: true }
  | { ok: false; reason: CameraAccessFailure };

type CameraRequester = () => Promise<Pick<MediaStream, 'getTracks'>>;

export type CameraStreamResult =
  | { ok: true; stream: Pick<MediaStream, 'getTracks'> }
  | { ok: false; reason: CameraAccessFailure };

interface CameraAccessOptions {
  timeoutMs?: number;
}

const CAMERA_REQUEST_TIMEOUT = Symbol('camera-request-timeout');

function releaseCameraStream(stream: Pick<MediaStream, 'getTracks'>): void {
  stream.getTracks().forEach((track) => track.stop());
}

function classifyCameraError(error: unknown): CameraAccessFailure {
  if (!(error instanceof DOMException)) return 'unknown';
  if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
    return 'permission-denied';
  }
  if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
    return 'not-found';
  }
  if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
    return 'device-busy';
  }
  return 'unknown';
}

export async function acquireCameraStream(
  request?: CameraRequester,
  options: CameraAccessOptions = {},
): Promise<CameraStreamResult> {
  const requester = request ?? (() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new DOMException('Camera API unavailable', 'NotSupportedError');
    }
    return navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
  });

  const requestPromise = Promise.resolve().then(requester);
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  try {
    const stream = await Promise.race([
      requestPromise,
      new Promise<typeof CAMERA_REQUEST_TIMEOUT>((resolve) => {
        timeoutHandle = setTimeout(
          () => resolve(CAMERA_REQUEST_TIMEOUT),
          options.timeoutMs ?? 12_000,
        );
      }),
    ]);
    if (stream === CAMERA_REQUEST_TIMEOUT) {
      // getUserMedia 本身不能可靠取消；用户稍后才允许时仍要立即释放迟到的轨道。
      void requestPromise.then(releaseCameraStream, () => {});
      return { ok: false, reason: 'timeout' };
    }
    return { ok: true, stream };
  } catch (error) {
    const reason = error instanceof DOMException && error.name === 'NotSupportedError'
      ? 'unsupported'
      : classifyCameraError(error);
    return { ok: false, reason };
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

export async function requestCameraAccess(
  request?: CameraRequester,
  options: CameraAccessOptions = {},
): Promise<CameraAccessResult> {
  const result = await acquireCameraStream(request, options);
  if (!result.ok) return result;
  releaseCameraStream(result.stream);
  return { ok: true };
}
