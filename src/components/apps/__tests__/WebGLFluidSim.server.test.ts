import { describe, expect, it } from 'vitest';

describe('WebGLFluidSim 服务端模块边界', () => {
  it('在没有 window 的 Node 环境中导入组件不会执行 dat.gui', async () => {
    await expect(import('../WebGLFluidSim')).resolves.toHaveProperty('default');
  });
});
