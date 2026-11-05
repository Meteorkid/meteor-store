import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GetObjectCommand, PutObjectCommand, type S3Client } from '@aws-sdk/client-s3';
import { assertArtifact, downloadArtifact, putAndVerify } from '../artifact.ts';
import type { ReleaseAsset } from '../types';
import { duoCastZip, makeZip } from './zip-fixture';

const body = Buffer.alloc(1024); body.write('koly', 512);
const asset: ReleaseAsset = { fileId: 'dmg', name: 'XIsland-2.0.3.dmg', bytes: body.length, sha256: createHash('sha256').update(body).digest('hex'),
  url: 'https://github.com/Meteorkid/XIsland/releases/download/v2.0.3/XIsland-2.0.3.dmg', assetId: 1, architecture: 'macos-arm64' };

function zipAsset(bytes: Buffer): ReleaseAsset {
  return {
    fileId: 'macos-arm64', name: 'DuoCast-0.1.1-macOS-arm64.zip', bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'), architecture: 'macos-arm64', assetId: 2,
    url: 'https://github.com/Meteorkid/duocast/releases/download/v0.1.1/DuoCast-0.1.1-macOS-arm64.zip',
  };
}
function store(retrieved: Buffer = body, existing = false) {
  const send = vi.fn(async command => {
    if (command instanceof PutObjectCommand) { if (existing) throw { $metadata: { httpStatusCode: 412 } }; return {}; }
    const responseBody = new Uint8Array(retrieved);
    return { ContentLength: retrieved.length, Body: { transformToWebStream: () => new Response(responseBody).body! } };
  });
  return { send, client: { send } as unknown as Pick<S3Client, 'send'> };
}
function slowDownload(duration: number) {
  vi.useFakeTimers();
  // 原生 AbortSignal.timeout 不受 fake timers 控制，保留真实信号传递并替换计时来源。
  vi.spyOn(AbortSignal, 'timeout').mockImplementation(delay => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException('fixture download timeout', 'TimeoutError')), delay);
    return controller.signal;
  });
  let requestSignal: AbortSignal | undefined;
  vi.stubGlobal('fetch', vi.fn((_url: string, options: RequestInit) => new Promise<Response>((resolve, reject) => {
    const signal = options.signal!;
    requestSignal = signal;
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve(new Response(body));
    }, duration);
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    if (signal.aborted) abort();
    else signal.addEventListener('abort', abort, { once: true });
  })));
  return () => requestSignal;
}
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllTimers();
  vi.useRealTimers();
});
describe('安装包边界与私有存储校验', () => {
  it('新对象条件写入、完整读取并对照 SHA', async () => {
    const { send, client } = store(); await putAndVerify(client, 'private', 'releases/key', body, asset);
    expect(send.mock.calls[0][0]).toBeInstanceOf(PutObjectCommand);
    expect(send.mock.calls[0][0].input).toMatchObject({ IfNoneMatch: '*', Bucket: 'private', Metadata: { sha256: asset.sha256 } });
    expect(send.mock.calls[1][0]).toBeInstanceOf(GetObjectCommand);
  });
  it('DuoCast ZIP 校验容器、应用边界和内部 arm64 主程序，并以 application/zip 上传', async () => {
    const zip = duoCastZip();
    const download = zipAsset(zip);
    const { send, client } = store(zip);
    expect(() => assertArtifact(zip, download)).not.toThrow();
    const unsignedDescriptor = duoCastZip(0x0100000c, false);
    expect(() => assertArtifact(unsignedDescriptor, zipAsset(unsignedDescriptor))).not.toThrow();
    await putAndVerify(client, 'private', 'releases/duocast/0.1.1/DuoCast-0.1.1-macOS-arm64.zip', zip, download);
    expect(send.mock.calls[0][0].input).toMatchObject({ ContentType: 'application/zip', IfNoneMatch: '*' });
  });
  it('拒绝非 arm64、错误产品名、额外顶层内容或加密的 ZIP', () => {
    const x64 = duoCastZip(0x01000007);
    expect(() => assertArtifact(x64, zipAsset(x64))).toThrow('arm64');
    const valid = duoCastZip();
    expect(() => assertArtifact(valid, { ...zipAsset(valid), name: 'XIsland-0.1.1-macOS-arm64.zip' })).toThrow('已登记');
    const extra = makeZip([
      { name: 'DuoCast.app/', data: Buffer.alloc(0), compression: 0 },
      { name: 'DuoCast.app/Contents/Info.plist', data: Buffer.from('plist') },
      { name: 'DuoCast.app/Contents/MacOS/DuoCast', data: Buffer.concat([Buffer.from([0xcf, 0xfa, 0xed, 0xfe]), Buffer.from([0x0c, 0x00, 0x00, 0x01])]) },
      { name: 'install.sh', data: Buffer.from('unexpected') },
    ]);
    expect(() => assertArtifact(extra, zipAsset(extra))).toThrow('顶层');
    const encrypted = makeZip([
      { name: 'DuoCast.app/', data: Buffer.alloc(0), compression: 0, flags: 1 },
      { name: 'DuoCast.app/Contents/Info.plist', data: Buffer.from('plist') },
    ]);
    expect(() => assertArtifact(encrypted, zipAsset(encrypted))).toThrow('ZIP');
    const traversal = makeZip([
      { name: 'DuoCast.app/', data: Buffer.alloc(0), compression: 0 },
      { name: 'DuoCast.app/../outside', data: Buffer.from('unexpected') },
    ]);
    expect(() => assertArtifact(traversal, zipAsset(traversal))).toThrow('ZIP');
    const zip64 = Buffer.from(valid);
    zip64.writeUInt16LE(0xffff, zip64.length - 12);
    expect(() => assertArtifact(zip64, { ...zipAsset(zip64), sha256: createHash('sha256').update(zip64).digest('hex') })).toThrow('ZIP');
    const symlink = makeZip([
      { name: 'DuoCast.app/', data: Buffer.alloc(0), compression: 0 },
      { name: 'DuoCast.app/Contents/Info.plist', data: Buffer.from('plist') },
      { name: 'DuoCast.app/Contents/MacOS/DuoCast', data: Buffer.concat([Buffer.from([0xcf, 0xfa, 0xed, 0xfe]), Buffer.from([0x0c, 0x00, 0x00, 0x01])]) },
      { name: 'DuoCast.app/Contents/link', data: Buffer.from('../outside'), mode: 0o120777 },
    ]);
    expect(() => assertArtifact(symlink, zipAsset(symlink))).toThrow('符号链接');
    const badLocalCrc = makeZip([
      { name: 'DuoCast.app/', data: Buffer.alloc(0), compression: 0 },
      { name: 'DuoCast.app/Contents/Info.plist', data: Buffer.from('plist'), localCrc: 1 },
      { name: 'DuoCast.app/Contents/MacOS/DuoCast', data: Buffer.concat([Buffer.from([0xcf, 0xfa, 0xed, 0xfe]), Buffer.from([0x0c, 0x00, 0x00, 0x01]), Buffer.alloc(28)]) },
    ]);
    expect(() => assertArtifact(badLocalCrc, zipAsset(badLocalCrc))).toThrow('ZIP');
    const zip64Extra = makeZip([
      { name: 'DuoCast.app/', data: Buffer.alloc(0), compression: 0 },
      { name: 'DuoCast.app/Contents/Info.plist', data: Buffer.from('plist'), extra: Buffer.from([1, 0, 0, 0]) },
    ]);
    expect(() => assertArtifact(zip64Extra, zipAsset(zip64Extra))).toThrow('ZIP64');
    const unicodePath = makeZip([
      { name: 'DuoCast.app/', data: Buffer.alloc(0), compression: 0 },
      { name: 'DuoCast.app/Contents/Info.plist', data: Buffer.from('plist'), extra: Buffer.from([0x75, 0x70, 0, 0]) },
    ]);
    expect(() => assertArtifact(unicodePath, zipAsset(unicodePath))).toThrow('Unicode');
    const maskedDirectory = makeZip([
      { name: 'DuoCast.app/', data: Buffer.alloc(0), compression: 0, flags: 0x2000 },
    ]);
    expect(() => assertArtifact(maskedDirectory, zipAsset(maskedDirectory))).toThrow('ZIP');
  });
  it('已存在相同对象可幂等复用，不覆盖对象', async () => {
    const { client, send } = store(body, true); await putAndVerify(client, 'private', 'key', body, asset);
    expect(send).toHaveBeenCalledTimes(2);
  });
  it('同名对象内容不同即失败', async () => {
    const { client } = store(Buffer.alloc(body.length), true);
    await expect(putAndVerify(client, 'private', 'key', body, asset)).rejects.toThrow('SHA-256');
  });
  it('上传后回读少字节即失败', async () => {
    const { client } = store(Buffer.alloc(10));
    await expect(putAndVerify(client, 'private', 'key', body, asset)).rejects.toThrow('大小');
  });
  it('hash合法但格式错误仍拒绝', () => {
    const html = Buffer.from('<html>error</html>');
    expect(() => assertArtifact(html, { ...asset, bytes: html.length, sha256: createHash('sha256').update(html).digest('hex') })).toThrow('DMG');
  });
  it('Mach-O 处理器必须匹配登记平台', () => {
    const macho = Buffer.alloc(32); macho.writeUInt32LE(0xfeedfacf); macho.writeUInt32LE(0x0100000c, 4);
    const mac = { ...asset, name: 'statux-darwin-arm64', bytes: macho.length, sha256: createHash('sha256').update(macho).digest('hex') };
    expect(() => assertArtifact(macho, mac)).not.toThrow();
    expect(() => assertArtifact(macho, { ...mac, architecture: 'macos-x64' })).toThrow('架构');
  });
  it('跳转到内网在下一次请求前拒绝', async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/private' } })); vi.stubGlobal('fetch', fetcher);
    await expect(downloadArtifact(asset)).rejects.toThrow('官方来源'); expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('流式下载超出已声明大小时立即停止', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(Buffer.alloc(2048))));
    await expect(downloadArtifact(asset)).rejects.toThrow('超出');
  });
  it('合法安装包下载超过5分钟但未到10分钟时可以完成', async () => {
    const requestSignal = slowDownload(6 * 60_000);
    const result = downloadArtifact(asset).then(value => ({ value }), error => ({ error }));
    await vi.advanceTimersByTimeAsync(6 * 60_000);
    expect(await result).toEqual({ value: body });
    expect(requestSignal()?.aborted).toBe(false);
  });
  it('下载超过10分钟时通过合并后的请求信号中止', async () => {
    const requestSignal = slowDownload(11 * 60_000);
    const result = downloadArtifact(asset, new AbortController().signal).then(value => ({ value }), error => ({ error }));
    await vi.advanceTimersByTimeAsync(10 * 60_000 - 1);
    expect(requestSignal()?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(2);
    expect(requestSignal()?.aborted).toBe(true);
    expect(await result).toMatchObject({ error: { name: 'TimeoutError' } });
  });
});
