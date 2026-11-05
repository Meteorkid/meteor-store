import { deflateRawSync } from 'node:zlib';

interface ZipFixtureEntry {
  name: string;
  data: Buffer;
  compression?: 0 | 8;
  flags?: number;
  mode?: number;
  extra?: Buffer;
  descriptor?: boolean;
  descriptorSignature?: boolean;
  localCrc?: number;
}

function crc32(buffer: Uint8Array): number {
  let value = 0xffffffff;
  for (const byte of buffer) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return (value ^ 0xffffffff) >>> 0;
}

export function makeZip(entries: ZipFixtureEntry[]): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let localOffset = 0;
  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'ascii');
    const extra = entry.extra ?? Buffer.alloc(0);
    const compression = entry.compression ?? 8;
    const compressed = compression === 8 ? deflateRawSync(entry.data) : entry.data;
    const entryCrc = crc32(entry.data);
    const descriptor = entry.descriptor ?? ((entry.flags ?? 0) & 0x0008) !== 0;
    const flags = (entry.flags ?? 0) | (descriptor ? 0x0008 : 0);
    const descriptorSize = descriptor ? 12 + (entry.descriptorSignature === false ? 0 : 4) : 0;
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(flags, 6);
    local.writeUInt16LE(compression, 8);
    if (!descriptor) {
      local.writeUInt32LE(entry.localCrc ?? entryCrc, 14);
      local.writeUInt32LE(compressed.length, 18);
      local.writeUInt32LE(entry.data.length, 22);
    }
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(extra.length, 28);
    localParts.push(local, name, extra, compressed);
    if (descriptor) {
      const descriptorBuffer = Buffer.alloc(descriptorSize);
      let cursor = 0;
      if (entry.descriptorSignature !== false) {
        descriptorBuffer.writeUInt32LE(0x08074b50, cursor);
        cursor += 4;
      }
      descriptorBuffer.writeUInt32LE(entryCrc, cursor);
      descriptorBuffer.writeUInt32LE(compressed.length, cursor + 4);
      descriptorBuffer.writeUInt32LE(entry.data.length, cursor + 8);
      localParts.push(descriptorBuffer);
    }

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(0x0314, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(flags, 8);
    central.writeUInt16LE(compression, 10);
    central.writeUInt32LE(entryCrc, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(entry.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(extra.length, 30);
    central.writeUInt32LE(((entry.mode ?? 0) * 0x10000) >>> 0, 38);
    central.writeUInt32LE(localOffset, 42);
    centralParts.push(central, name, extra);
    localOffset += local.length + name.length + extra.length + compressed.length + descriptorSize;
  }
  const central = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(central.length, 12);
  end.writeUInt32LE(localOffset, 16);
  return Buffer.concat([...localParts, central, end]);
}

export function duoCastZip(cpu = 0x0100000c, descriptorSignature = true): Buffer {
  const macho = Buffer.alloc(104);
  macho.writeUInt32LE(0xfeedfacf, 0);
  macho.writeUInt32LE(cpu, 4);
  macho.writeUInt32LE(2, 12);
  macho.writeUInt32LE(1, 16);
  macho.writeUInt32LE(72, 20);
  macho.writeUInt32LE(0x19, 32);
  macho.writeUInt32LE(72, 36);
  macho.write('__TEXT', 40, 'ascii');
  return makeZip([
    { name: 'DuoCast.app/', data: Buffer.alloc(0), compression: 0 },
    { name: 'DuoCast.app/Contents/Info.plist', data: Buffer.from('<plist><dict/></plist>'), descriptor: true, descriptorSignature },
    { name: 'DuoCast.app/Contents/MacOS/DuoCast', data: macho, descriptor: true, descriptorSignature },
    { name: '__MACOSX/', data: Buffer.alloc(0), compression: 0 },
    { name: '__MACOSX/DuoCast.app/Contents/._Info.plist', data: Buffer.from('metadata') },
  ]);
}

