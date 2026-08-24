export type CameraAccessFailure =
  | 'unsupported'
  | 'permission-denied'
  | 'not-found'
  | 'device-busy'
  | 'unknown';

export type CameraAccessResult =
  | { ok: true }
  | { ok: false; reason: CameraAccessFailure };

type CameraRequester = () => Promise<Pick<MediaStream, 'getTracks'>>;

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

export async function requestCameraAccess(
  request?: CameraRequester,
): Promise<CameraAccessResult> {
  const requester = request ?? (() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new DOMException('Camera API unavailable', 'NotSupportedError');
    }
    return navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
  });

  try {
    const stream = await requester();
    stream.getTracks().forEach((track) => track.stop());
    return { ok: true };
  } catch (error) {
    const reason = error instanceof DOMException && error.name === 'NotSupportedError'
      ? 'unsupported'
      : classifyCameraError(error);
    return { ok: false, reason };
  }
}
