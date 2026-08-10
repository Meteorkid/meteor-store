export type LimitedFormDataResult =
  | { ok: true; formData: FormData }
  | { ok: false; reason: 'invalid' | 'too_large' };

/** 在解析 multipart 前流式计数，避免 request.formData() 先无上限缓冲整个请求。 */
export async function readLimitedFormData(
  request: Request,
  maxBytes: number,
): Promise<LimitedFormDataResult> {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { ok: false, reason: 'too_large' };
  }
  if (!request.body) return { ok: false, reason: 'invalid' };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, reason: 'too_large' };
      }
      chunks.push(value);
    }

    const body = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const contentType = request.headers.get('content-type');
    if (!contentType) return { ok: false, reason: 'invalid' };
    const formData = await new Response(body, {
      headers: { 'Content-Type': contentType },
    }).formData();
    return { ok: true, formData };
  } catch {
    return { ok: false, reason: 'invalid' };
  }
}
