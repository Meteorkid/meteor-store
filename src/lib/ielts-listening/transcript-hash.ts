import { createHash } from 'node:crypto';

/**
 * 原文指纹：只取句子文本，不含说话人标签。
 *
 * 音频清单记录合成时的指纹；运行时对不上就说明原文改过而录音没重做，
 * 这时宁可让页面退回逐句朗读，也不能播放一段和原文对不上的录音。
 * 只在服务端和离线脚本里调用，不进客户端包。
 */
export function listeningTranscriptHash(sentences: readonly string[]): string {
  return createHash('sha256').update(sentences.join('\n')).digest('hex').slice(0, 16);
}
