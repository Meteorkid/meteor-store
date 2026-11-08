import { describe, expect, it, vi } from 'vitest';
import { createNebulaRenderer } from '../nebula';

function createGpu() {
  let nextId = 0;
  return {
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88e4,
    FLOAT: 0x1406,
    TRIANGLES: 4,
    createShader: vi.fn(() => ({ id: ++nextId }) as WebGLShader),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    getShaderInfoLog: vi.fn(() => 'compile failed'),
    deleteShader: vi.fn(),
    createProgram: vi.fn(() => ({ id: ++nextId }) as WebGLProgram | null),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    getProgramInfoLog: vi.fn(() => 'link failed'),
    deleteProgram: vi.fn(),
    createBuffer: vi.fn(() => ({ id: ++nextId }) as WebGLBuffer | null),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    deleteBuffer: vi.fn(),
    createVertexArray: vi.fn(() => ({ id: ++nextId }) as WebGLVertexArrayObject | null),
    bindVertexArray: vi.fn(),
    deleteVertexArray: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    getUniformLocation: vi.fn((_program: WebGLProgram, name: string) => ({ name }) as WebGLUniformLocation),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    useProgram: vi.fn(),
    viewport: vi.fn(),
    uniform2f: vi.fn(),
    uniform1f: vi.fn<(location: WebGLUniformLocation, value: number) => void>(),
    drawArrays: vi.fn(),
    flush: vi.fn(),
  };
}

function createCpu() {
  return {
    createImageData: vi.fn((width: number, height: number) => ({
      width, height, data: new Uint8ClampedArray(width * height * 4), colorSpace: 'srgb',
    }) as ImageData),
    putImageData: vi.fn<(image: ImageData, x: number, y: number) => void>(),
  };
}

function createCanvas(context: unknown, kind: string) {
  const events = new EventTarget();
  const canvas = {
    width: 0,
    height: 0,
    style: { display: '' },
    getContext: vi.fn((requestedKind: string) => requestedKind === kind ? context : null),
    addEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject) => {
      events.addEventListener(type, listener);
    }),
    removeEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject) => {
      events.removeEventListener(type, listener);
    }),
  };
  return {
    canvas,
    element: canvas as unknown as HTMLCanvasElement,
    dispatch: (event: Event) => events.dispatchEvent(event),
  };
}

function setup(gpu = createGpu()) {
  const cpu = createCpu();
  const primary = createCanvas(gpu, 'webgl2');
  const fallback = createCanvas(cpu, '2d');
  return { gpu, cpu, primary, fallback };
}

describe('首页星云渲染器生命周期', () => {
  it('使用批准的采样上限渲染，dispose 释放 GPU 资源并移除监听', () => {
    const { gpu, cpu, primary, fallback } = setup();
    const renderer = createNebulaRenderer(primary.element, fallback.element);
    renderer.resize(1024, 600, 3);
    renderer.render({ brightness: 1.2, dust: 0.9 });

    expect(gpu.viewport).toHaveBeenLastCalledWith(0, 0, 1127, 660);
    expect(gpu.uniform2f).toHaveBeenLastCalledWith(expect.anything(), 1024, 600);
    expect(gpu.uniform1f.mock.calls.slice(-2).map(call => call[1])).toEqual([1.2, 0.9]);
    expect(gpu.drawArrays).toHaveBeenCalledTimes(1);
    expect(cpu.putImageData).not.toHaveBeenCalled();
    expect(primary.canvas.style.display).toBe('block');
    expect(fallback.canvas.style.display).toBe('none');

    renderer.dispose();
    renderer.dispose();
    expect(gpu.deleteShader).toHaveBeenCalledTimes(2);
    expect(gpu.deleteBuffer).toHaveBeenCalledTimes(1);
    expect(gpu.deleteProgram).toHaveBeenCalledTimes(1);
    expect(gpu.deleteVertexArray).toHaveBeenCalledTimes(1);
    expect(gpu.useProgram).toHaveBeenLastCalledWith(null);
    expect(primary.canvas.removeEventListener.mock.calls.map(call => call[0])).toEqual([
      'webglcontextlost', 'webglcontextrestored',
    ]);

    renderer.resize(400, 500);
    renderer.render({ brightness: 2 });
    primary.dispatch(new Event('webglcontextlost', { cancelable: true }));
    primary.dispatch(new Event('webglcontextrestored'));
    expect(gpu.drawArrays).toHaveBeenCalledTimes(1);
    expect(primary.canvas.getContext).toHaveBeenCalledTimes(1);
    expect(cpu.putImageData).not.toHaveBeenCalled();
    expect(primary.canvas.width).toBe(1);
  });

  it.each(['fragment', 'link', 'buffer'] as const)('%s 阶段失败时回收部分资源并生成 CPU 图像', failure => {
    const { gpu, cpu, primary, fallback } = setup();
    if (failure === 'fragment') gpu.getShaderParameter.mockReturnValueOnce(true).mockReturnValueOnce(false);
    if (failure === 'link') gpu.getProgramParameter.mockReturnValue(false);
    if (failure === 'buffer') gpu.createBuffer.mockReturnValue(null);

    const renderer = createNebulaRenderer(primary.element, fallback.element);
    renderer.resize(16, 12);
    renderer.render({ brightness: 1, dust: 0.7 });

    expect(gpu.deleteShader).toHaveBeenCalledTimes(2);
    expect(gpu.deleteProgram).toHaveBeenCalledTimes(failure === 'fragment' ? 0 : 1);
    expect(gpu.drawArrays).not.toHaveBeenCalled();
    expect(primary.canvas.style.display).toBe('none');
    expect(fallback.canvas.style.display).toBe('block');
    expect(cpu.putImageData).toHaveBeenCalledTimes(1);
    const pixels = cpu.putImageData.mock.calls[0][0];
    expect([pixels.width, pixels.height]).toEqual([16, 12]);
    expect(pixels.data.filter((_value, index) => index % 4 === 3).every(alpha => alpha === 255)).toBe(true);

    renderer.dispose();
    expect(gpu.deleteProgram).toHaveBeenCalledTimes(failure === 'fragment' ? 0 : 1);
  });

  it('上下文丢失后切换 CPU，恢复后重建同一尺寸与最近参数', () => {
    const { gpu, cpu, primary, fallback } = setup();
    const renderer = createNebulaRenderer(primary.element, fallback.element);
    renderer.resize(24, 18);
    renderer.render({ brightness: 1.3, dust: 0.4 });

    const lost = new Event('webglcontextlost', { cancelable: true });
    primary.dispatch(lost);
    expect(lost.defaultPrevented).toBe(true);
    expect(cpu.putImageData).toHaveBeenCalledTimes(1);
    expect(gpu.deleteProgram).toHaveBeenCalledTimes(1);
    expect(gpu.deleteBuffer).toHaveBeenCalledTimes(1);
    expect(fallback.canvas.style.display).toBe('block');

    renderer.resize(30, 20);
    renderer.render({ brightness: 0.8, dust: 1 });
    primary.dispatch(new Event('webglcontextrestored'));
    expect(primary.canvas.getContext).toHaveBeenCalledTimes(2);
    expect(gpu.createProgram).toHaveBeenCalledTimes(2);
    expect(gpu.drawArrays).toHaveBeenCalledTimes(2);
    expect(gpu.uniform2f).toHaveBeenLastCalledWith(expect.anything(), 30, 20);
    expect(gpu.uniform1f.mock.calls.slice(-2).map(call => call[1])).toEqual([0.8, 1]);
    expect(primary.canvas.style.display).toBe('block');
    expect(fallback.canvas.style.display).toBe('none');
    renderer.dispose();
  });

  it('丢失上下文后 dispose，迟到的恢复事件不会重建 GPU', () => {
    const { gpu, cpu, primary, fallback } = setup();
    const renderer = createNebulaRenderer(primary.element, fallback.element);
    renderer.resize(12, 10);
    renderer.render({});
    primary.dispatch(new Event('webglcontextlost', { cancelable: true }));
    renderer.dispose();
    primary.dispatch(new Event('webglcontextrestored'));
    renderer.render({});
    expect(gpu.createProgram).toHaveBeenCalledTimes(1);
    expect(cpu.putImageData).toHaveBeenCalledTimes(1);
  });

  it('同一画布清理后再次创建可正常渲染，不主动丢弃 WebGL 上下文', () => {
    const { gpu, primary, fallback } = setup();
    const first = createNebulaRenderer(primary.element, fallback.element);
    first.resize(20, 16);
    first.render({});
    first.dispose();
    const second = createNebulaRenderer(primary.element, fallback.element);
    second.resize(20, 16);
    second.render({});
    expect(gpu.drawArrays).toHaveBeenCalledTimes(2);
    expect(gpu.createProgram).toHaveBeenCalledTimes(2);
    expect(primary.canvas.style.display).toBe('block');
    second.dispose();
    expect(gpu.deleteProgram).toHaveBeenCalledTimes(2);
    expect(gpu.deleteBuffer).toHaveBeenCalledTimes(2);
    expect(gpu.deleteVertexArray).toHaveBeenCalledTimes(2);
  });

  it('没有 WebGL 时保留纯代码 fallback，2D 也不可用时不会抛错', () => {
    const primary = createCanvas(null, 'webgl2');
    const cpu = createCpu();
    const fallback = createCanvas(cpu, '2d');
    const renderer = createNebulaRenderer(primary.element, fallback.element);
    renderer.resize(10, 8);
    renderer.render({});
    expect(cpu.putImageData).toHaveBeenCalledTimes(1);
    renderer.dispose();

    const unavailable = createCanvas(null, '2d');
    const empty = createNebulaRenderer(primary.element, unavailable.element);
    expect(() => empty.render({})).not.toThrow();
    empty.dispose();
  });
});
