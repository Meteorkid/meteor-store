import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  MEDIAPIPE_RUNTIME_SCRIPTS,
  getMediaPipeHandsAssetUrl,
} from '../mediapipe';

const publicRoot = join(process.cwd(), 'public');

describe('MediaPipe 同源资源', () => {
  it('脚本与模型均使用站内固定路径', () => {
    expect(MEDIAPIPE_RUNTIME_SCRIPTS).toEqual([
      '/vendor/mediapipe/hands/hands.js',
      '/vendor/mediapipe/camera_utils/camera_utils.js',
      '/vendor/mediapipe/drawing_utils/drawing_utils.js',
    ]);
    expect(getMediaPipeHandsAssetUrl('hands.binarypb'))
      .toBe('/vendor/mediapipe/hands/hands.binarypb');
  });

  it('发布目录包含运行时所需文件', async () => {
    const requiredFiles = [
      ...MEDIAPIPE_RUNTIME_SCRIPTS,
      getMediaPipeHandsAssetUrl('hands.binarypb'),
      getMediaPipeHandsAssetUrl('hands_solution_packed_assets_loader.js'),
      getMediaPipeHandsAssetUrl('hands_solution_packed_assets.data'),
      getMediaPipeHandsAssetUrl('hands_solution_simd_wasm_bin.js'),
      getMediaPipeHandsAssetUrl('hands_solution_simd_wasm_bin.wasm'),
      getMediaPipeHandsAssetUrl('hands_solution_wasm_bin.js'),
      getMediaPipeHandsAssetUrl('hands_solution_wasm_bin.wasm'),
    ];

    await expect(Promise.all(requiredFiles.map((file) => access(join(publicRoot, file)))))
      .resolves.toHaveLength(requiredFiles.length);
  });
});
