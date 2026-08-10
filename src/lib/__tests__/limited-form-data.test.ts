import { describe, expect, it } from 'vitest';
import { readLimitedFormData } from '../limited-form-data';

describe('readLimitedFormData', () => {
  it('在解析前拒绝超过请求体上限的 multipart', async () => {
    const form = new FormData();
    form.set('file', new File([new Uint8Array(1024)], 'image.png', { type: 'image/png' }));
    const request = new Request('https://imagentx.top/upload', { method: 'POST', body: form });

    await expect(readLimitedFormData(request, 100)).resolves.toEqual({
      ok: false,
      reason: 'too_large',
    });
  });

  it('在上限内解析文件字段', async () => {
    const form = new FormData();
    form.set('file', new File(['image'], 'image.png', { type: 'image/png' }));
    const request = new Request('https://imagentx.top/upload', { method: 'POST', body: form });
    const result = await readLimitedFormData(request, 10_000);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const file = result.formData.get('file');
    expect(file).toBeInstanceOf(File);
    expect((file as File).name).toBe('image.png');
  });
});
