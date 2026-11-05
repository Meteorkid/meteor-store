import { inflateRawSync } from 'node:zlib';
import type { ReleaseAsset } from './types';

const MAX_ZIP_ENTRIES = 1024;
const MAX_ZIP_CENTRAL = 4 * 1024 * 1024;
const MAX_ZIP_ENTRY = 64 * 1024 * 1024;
const MAX_ZIP_UNCOMPRESSED = 128 * 1024 * 1024;
const MAX_ZIP_NAME = 1024;
const MAX_ZIP_DEPTH = 32;
const ZIP_LOCAL_HEADER = 0x04034b50;
const ZIP_CENTRAL_HEADER = 0x02014b50;
const ZIP_END_OF_CENTRAL_DIRECTORY = 0x06054b50;
const ZIP64_END_OF_CENTRAL_DIRECTORY = 0x06064b50;
const ZIP64_LOCATOR = 0x07064b50;
const DATA_DESCRIPTOR = 0x08074b50;
const DUOCAST_ZIP = /^DuoCast-(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)-macOS-arm64\.zip$/;

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

interface ZipEntry {
  name: string;
  isDirectory: boolean;
  flags: number;
  compression: number;
  crc32: number;
  compressedSize: number;
  uncompressedSize: number;
  localOffset: number;
  data?: Buffer;
}

function zipError(message = 'ZIP 安装包结构不正确'): never {
  throw new Error(message);
}

function crc32(buffer: Uint8Array): number {
  let value = 0xffffffff;
  for (const byte of buffer) value = CRC32_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

function findZipEnd(buffer: Buffer): number {
  const minimum = Math.max(0, buffer.length - 22 - 0xffff);
  let match = -1;
  for (let offset = buffer.length - 22; offset >= minimum; offset -= 1) {
    if (buffer.readUInt32LE(offset) !== ZIP_END_OF_CENTRAL_DIRECTORY) continue;
    const commentLength = buffer.readUInt16LE(offset + 20);
    if (offset + 22 + commentLength !== buffer.length) continue;
    if (match !== -1) return zipError();
    match = offset;
  }
  return match === -1 ? zipError() : match;
}

function assertSafeExtra(buffer: Buffer, start: number, length: number): void {
  const end = start + length;
  if (end > buffer.length) return zipError();
  let cursor = start;
  while (cursor < end) {
    if (cursor + 4 > end) return zipError();
    const id = buffer.readUInt16LE(cursor);
    const size = buffer.readUInt16LE(cursor + 2);
    cursor += 4;
    if (cursor + size > end) return zipError();
    if (id === 0x0001) return zipError('ZIP64 安装包不受支持');
    if (id === 0x7075) return zipError('ZIP Unicode 路径扩展不受支持');
    cursor += size;
  }
}

function validateZipName(name: string): { isDirectory: boolean } {
  if (name.length < 1 || name.length > MAX_ZIP_NAME || !/^[\x20-\x7e]+$/.test(name)
      || name.includes('\\') || /^[A-Za-z]:/.test(name)) return zipError();
  const isDirectory = name.endsWith('/');
  const bare = isDirectory ? name.slice(0, -1) : name;
  if (!bare || bare.startsWith('/')) return zipError();
  const parts = bare.split('/');
  if (parts.length > MAX_ZIP_DEPTH || parts.some(part => !part || part === '.' || part === '..')) return zipError();
  return { isDirectory };
}

function readLocalEntry(buffer: Buffer, entry: ZipEntry, centralOffset: number): number {
  const offset = entry.localOffset;
  if (offset + 30 > centralOffset || buffer.readUInt32LE(offset) !== ZIP_LOCAL_HEADER) return zipError();
  const flags = buffer.readUInt16LE(offset + 6);
  const compression = buffer.readUInt16LE(offset + 8);
  const localCrc = buffer.readUInt32LE(offset + 14);
  const localCompressed = buffer.readUInt32LE(offset + 18);
  const localUncompressed = buffer.readUInt32LE(offset + 22);
  const nameLength = buffer.readUInt16LE(offset + 26);
  const extraLength = buffer.readUInt16LE(offset + 28);
  const nameStart = offset + 30;
  const extraStart = nameStart + nameLength;
  const dataStart = extraStart + extraLength;
  if (dataStart > centralOffset) return zipError();
  const name = buffer.subarray(nameStart, extraStart).toString('ascii');
  if (name !== entry.name || flags !== entry.flags || compression !== entry.compression) return zipError();
  assertSafeExtra(buffer, extraStart, extraLength);
  if (entry.compressedSize > centralOffset - dataStart) return zipError();
  const dataEnd = dataStart + entry.compressedSize;

  let recordEnd = dataEnd;
  if ((flags & 0x0008) !== 0) {
    if (localCrc !== 0 && localCrc !== entry.crc32) return zipError();
    if (localCompressed !== 0 && localCompressed !== entry.compressedSize) return zipError();
    if (localUncompressed !== 0 && localUncompressed !== entry.uncompressedSize) return zipError();
    const candidates = [dataEnd];
    if (dataEnd + 4 <= centralOffset && buffer.readUInt32LE(dataEnd) === DATA_DESCRIPTOR) candidates.unshift(dataEnd + 4);
    let descriptorEnd = -1;
    for (const candidate of candidates) {
      if (candidate + 12 > centralOffset) continue;
      if (buffer.readUInt32LE(candidate) === entry.crc32
          && buffer.readUInt32LE(candidate + 4) === entry.compressedSize
          && buffer.readUInt32LE(candidate + 8) === entry.uncompressedSize) {
        descriptorEnd = candidate + 12;
        break;
      }
    }
    if (descriptorEnd === -1) return zipError();
    recordEnd = descriptorEnd;
  } else if (localCrc !== entry.crc32 || localCompressed !== entry.compressedSize
      || localUncompressed !== entry.uncompressedSize) {
    return zipError();
  }

  if (entry.isDirectory) {
    if (entry.compressedSize !== 0 || entry.uncompressedSize !== 0 || entry.crc32 !== 0) return zipError();
    entry.data = Buffer.alloc(0);
    return recordEnd;
  }
  const compressed = buffer.subarray(dataStart, dataEnd);
  let data: Buffer;
  try {
    data = compression === 0
      ? compressed
      : inflateRawSync(compressed, { maxOutputLength: Math.max(1, entry.uncompressedSize) });
  } catch {
    return zipError();
  }
  if (data.length !== entry.uncompressedSize || crc32(data) !== entry.crc32) return zipError();
  entry.data = data;
  return recordEnd;
}

function readZipEntries(buffer: Buffer): Map<string, ZipEntry> {
  if (buffer.length < 22 || buffer.readUInt32LE(0) !== ZIP_LOCAL_HEADER) return zipError();
  const end = findZipEnd(buffer);
  if (end >= 20 && (buffer.readUInt32LE(end - 20) === ZIP64_LOCATOR
      || buffer.readUInt32LE(end - 20) === ZIP64_END_OF_CENTRAL_DIRECTORY)) return zipError('ZIP64 安装包不受支持');
  const disk = buffer.readUInt16LE(end + 4);
  const centralDisk = buffer.readUInt16LE(end + 6);
  const diskEntries = buffer.readUInt16LE(end + 8);
  const totalEntries = buffer.readUInt16LE(end + 10);
  const centralSize = buffer.readUInt32LE(end + 12);
  const centralOffset = buffer.readUInt32LE(end + 16);
  if (disk !== 0 || centralDisk !== 0 || diskEntries !== totalEntries || totalEntries < 1
      || totalEntries > MAX_ZIP_ENTRIES || totalEntries === 0xffff || centralSize > MAX_ZIP_CENTRAL
      || centralSize === 0xffffffff || centralOffset === 0xffffffff
      || centralOffset + centralSize !== end) return zipError();

  const entries = new Map<string, ZipEntry>();
  const folded = new Set<string>();
  let cursor = centralOffset;
  let totalUncompressed = 0;
  for (let index = 0; index < totalEntries; index += 1) {
    if (cursor + 46 > end || buffer.readUInt32LE(cursor) !== ZIP_CENTRAL_HEADER) return zipError();
    const versionMadeBy = buffer.readUInt16LE(cursor + 4);
    const flags = buffer.readUInt16LE(cursor + 8);
    const compression = buffer.readUInt16LE(cursor + 10);
    const entryCrc = buffer.readUInt32LE(cursor + 16);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const externalAttributes = buffer.readUInt32LE(cursor + 38);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const nameStart = cursor + 46;
    const extraStart = nameStart + nameLength;
    const next = extraStart + extraLength + commentLength;
    if (next > end || compressedSize === 0xffffffff || uncompressedSize === 0xffffffff || localOffset === 0xffffffff) return zipError();
    const flagMask = 0x0008 | 0x0800 | (compression === 8 ? 0x0006 : 0);
    if ((flags & ~flagMask) !== 0 || ![0, 8].includes(compression)) return zipError();
    const unixFileType = (externalAttributes >>> 16) & 0o170000;
    if ((versionMadeBy >>> 8) === 3 && ![0, 0o040000, 0o100000].includes(unixFileType)) {
      return zipError(unixFileType === 0o120000 ? 'ZIP 包含符号链接' : 'ZIP 包含特殊文件');
    }
    assertSafeExtra(buffer, extraStart, extraLength);
    const nameBytes = buffer.subarray(nameStart, extraStart);
    const name = nameBytes.toString('ascii');
    if (Buffer.from(name, 'ascii').compare(nameBytes) !== 0) return zipError();
    const { isDirectory } = validateZipName(name);
    if ((unixFileType === 0o040000) !== isDirectory && unixFileType !== 0) return zipError();
    const foldedName = name.toLocaleLowerCase('en-US');
    if (folded.has(foldedName) || entries.has(name)) return zipError();
    if (uncompressedSize > MAX_ZIP_ENTRY) return zipError();
    totalUncompressed += uncompressedSize;
    if (totalUncompressed > MAX_ZIP_UNCOMPRESSED || localOffset >= centralOffset) return zipError();
    folded.add(foldedName);
    entries.set(name, {
      name, isDirectory, flags, compression, crc32: entryCrc,
      compressedSize, uncompressedSize, localOffset,
    });
    cursor = next;
  }
  if (cursor !== end) return zipError();

  for (const entry of entries.values()) {
    if (entry.isDirectory) continue;
    for (const other of entries.keys()) {
      if (other !== entry.name && other.startsWith(entry.name + '/')) return zipError();
    }
  }

  const ranges: { start: number; end: number }[] = [];
  for (const entry of entries.values()) {
    ranges.push({ start: entry.localOffset, end: readLocalEntry(buffer, entry, centralOffset) });
  }
  ranges.sort((left, right) => left.start - right.start);
  let recordsEnd = 0;
  for (const range of ranges) {
    if (range.start !== recordsEnd || range.end < range.start) return zipError();
    recordsEnd = range.end;
  }
  if (recordsEnd !== centralOffset) return zipError();
  return entries;
}

export function assertDuoCastZip(buffer: Buffer, asset: ReleaseAsset): void {
  if (!DUOCAST_ZIP.test(asset.name) || asset.architecture !== 'macos-arm64') {
    return zipError('ZIP 安装包不是已登记的 DuoCast arm64 构建');
  }
  const entries = readZipEntries(buffer);
  for (const name of entries.keys()) {
    if (name !== '__MACOSX/' && !name.startsWith('DuoCast.app/') && !name.startsWith('__MACOSX/DuoCast.app/')) {
      return zipError('ZIP 包含预期应用之外的顶层内容');
    }
  }
  const executable = entries.get('DuoCast.app/Contents/MacOS/DuoCast');
  if (!executable || !entries.has('DuoCast.app/Contents/Info.plist')) {
    return zipError('ZIP 缺少 DuoCast 应用主程序或 Info.plist');
  }
  const macho = executable.data;
  if (!macho || macho.length < 32 || macho.readUInt32LE(0) !== 0xfeedfacf
      || macho.readUInt32LE(4) !== 0x0100000c || macho.readUInt32LE(12) !== 2) {
    return zipError('ZIP 内应用不是 arm64 macOS 可执行文件');
  }
  const commandCount = macho.readUInt32LE(16);
  const commandBytes = macho.readUInt32LE(20);
  if (commandCount === 0 || commandBytes === 0 || 32 + commandBytes > macho.length) {
    return zipError('ZIP 内应用的 Mach-O 命令区不正确');
  }
  let commandCursor = 32;
  let hasTextSegment = false;
  for (let index = 0; index < commandCount; index += 1) {
    if (commandCursor + 8 > 32 + commandBytes) return zipError('ZIP 内应用的 Mach-O 命令区不正确');
    const command = macho.readUInt32LE(commandCursor);
    const commandSize = macho.readUInt32LE(commandCursor + 4);
    if (commandSize < 8 || commandCursor + commandSize > 32 + commandBytes) {
      return zipError('ZIP 内应用的 Mach-O 命令区不正确');
    }
    if (command === 0x19 && commandSize >= 72) {
      const segmentName = macho.toString('ascii', commandCursor + 8, commandCursor + 24).replace(/\0+$/, '');
      if (segmentName === '__TEXT') hasTextSegment = true;
    }
    commandCursor += commandSize;
  }
  if (commandCursor !== 32 + commandBytes || !hasTextSegment) {
    return zipError('ZIP 内应用缺少有效的 __TEXT 段');
  }
}

