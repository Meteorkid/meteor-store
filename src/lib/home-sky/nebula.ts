export interface NebulaRenderOptions {
  brightness?: number;
  dust?: number;
}

export interface NebulaRenderer {
  resize(width: number, height: number, dpr?: number): void;
  render(options: NebulaRenderOptions): void;
  dispose(): void;
}

interface GpuResources {
  program: WebGLProgram;
  buffer: WebGLBuffer;
  vertexArray: WebGLVertexArrayObject;
  resolution: WebGLUniformLocation;
  brightness: WebGLUniformLocation;
  dust: WebGLUniformLocation;
}

const vertexSource = `#version 300 es
  in vec2 a_position;
  out vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }`;

const fragmentSource = `#version 300 es
  precision highp float;
  in vec2 v_uv;
  out vec4 outColor;
  uniform vec2 u_resolution;
  uniform float u_brightness;
  uniform float u_dust;

  float hash31(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }
  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash31(i), hash31(i + vec3(1,0,0)), f.x),
          mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x),
          mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) {
    float value = 0.0;
    float weight = 0.52;
    const mat3 turn = mat3(0.00,0.80,0.60, -0.80,0.36,-0.48, -0.60,-0.48,0.64);
    for (int octave = 0; octave < 5; octave++) {
      value += weight * noise3(p);
      p = turn * p * 2.04 + vec3(17.3,11.8,7.4);
      weight *= 0.48;
    }
    return value;
  }
  vec3 warp(vec3 p) {
    return vec3(
      noise3(p * 1.7 + vec3(8.1,3.4,9.2)),
      noise3(p * 1.7 + vec3(2.6,7.8,4.3)),
      noise3(p * 1.7 + vec3(6.2,1.1,5.7))) - 0.5;
  }
  float envelope(vec3 p) {
    float bend = 0.20 * sin(p.x * 2.3 + 0.7) + p.x * 0.16;
    float band = exp(-pow((p.y - bend) / 0.67, 2.0));
    float extent = exp(-pow(p.x / 1.60, 4.0));
    float thickness = exp(-pow(p.z / 0.75, 2.0));
    float shoulder = exp(-dot((p.xy - vec2(0.55,0.18)) / vec2(0.85,0.60),
                             (p.xy - vec2(0.55,0.18)) / vec2(0.85,0.60)));
    return max(band * extent, shoulder * 0.70) * thickness;
  }
  void main() {
    vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
    float mobile = 1.0 - smoothstep(0.85, 1.05, u_resolution.x / u_resolution.y);
    vec2 q = (uv - vec2(mix(0.60,0.55,mobile),0.46)) * vec2(mix(3.15,2.35,mobile),2.65);
    // 坐标扭转只改变密度场，不把云画成重复的环线。
    q = mat2(0.958,-0.287,0.287,0.958) * q;
    vec3 radiance = vec3(0.0);
    float transmittance = 1.0;
    const float stepLength = 2.6 / 36.0;
    for (int stepIndex = 0; stepIndex < 36; stepIndex++) {
      float z = -1.3 + (float(stepIndex) + 0.5) * stepLength;
      vec3 p = vec3(q + vec2(z * 0.055, z * -0.025), z);
      vec3 displacement = warp(p + vec3(3.7,4.8,1.5));
      vec3 field = p * vec3(1.55,2.45,1.75) + displacement * 0.95;
      float broad = fbm(field + vec3(1.7,6.3,2.1));
      float detail = noise3(field * 8.5 + displacement * 2.0);
      float ridge = pow(1.0 - abs(2.0 * noise3(field * 4.4 + 13.0) - 1.0), 2.5);
      float cloud = smoothstep(0.26,0.72,broad + (detail - 0.5) * 0.085);
      float density = envelope(p) * cloud * (0.40 + ridge * 1.05);
      float dustNoise = fbm(field * 0.81 + vec3(14.0,3.0,17.0));
      float lane = exp(-pow((p.y - 0.10 - p.x * 0.19 - (dustNoise - 0.5) * 0.80) / 0.17, 2.0));
      float dust = envelope(p) * smoothstep(0.38,0.73,dustNoise) * (0.45 + lane * 2.1);
      float lamp = exp(-length((p - vec3(0.48,-0.08,0.12)) * vec3(1.35,1.75,1.1)) * 1.6);
      float secondLamp = exp(-length((p - vec3(-0.63,0.12,-0.1)) * vec3(1.9,2.2,1.5)) * 1.4);
      vec3 gasColor = mix(vec3(0.20,0.39,0.60), vec3(0.66,0.77,0.82), clamp(broad * 0.8 + lamp,0.0,1.0));
      gasColor = mix(gasColor, vec3(0.91,0.76,0.54), lamp * 0.38);
      float lighting = 0.32 + lamp * 3.0 + secondLamp * 0.68;
      vec3 emission = gasColor * density * lighting * 2.2;
      float extinction = density * 1.10 + dust * u_dust * 3.4;
      float absorbed = 1.0 - exp(-extinction * stepLength);
      radiance += transmittance * emission * stepLength;
      transmittance *= 1.0 - absorbed;
    }
    // 广泛而不规则的前景尘埃，避免把发光气体画成地球积云的镀金边。
    vec3 frontField = vec3(q * vec2(1.9,2.8),2.7);
    float foreground = fbm(frontField + warp(frontField * .75) * 1.3);
    float fibers = fbm(frontField * 3.1 + vec3(7.1,12.4,5.8));
    float cloudAxis = 0.20 * sin(q.x * 2.3 + 0.7) + q.x * 0.16;
    float irregularity = (foreground - .48) * .84 + (fibers - .48) * .13;
    float mainDistance = q.y - cloudAxis - .025 + irregularity;
    float veinWidth = .045 + .095 * fibers;
    float mainVein = exp(-pow(mainDistance / veinWidth,2.0));
    float branchDistance = q.y - cloudAxis + (q.x - .16) * .43 - .13 + irregularity * .83;
    float branch = exp(-pow(branchDistance / (veinWidth * .70),2.0));
    branch *= smoothstep(-.30,.15,q.x) * (1.0 - smoothstep(.86,1.40,q.x));
    float dustExtent = exp(-pow(q.x / 1.30,4.0));
    float denseVeins = max(mainVein,branch) * dustExtent * (.62 + fibers * .74);
    float diffuseDust = smoothstep(.40,.70,foreground) * .55;
    radiance *= exp(-(denseVeins * 3.8 + diffuseDust * 1.3) * u_dust);
    vec3 color = vec3(1.0) - exp(-radiance * u_brightness * 1.45);
    color = pow(max(color,vec3(0.0)),vec3(0.82));
    vec2 textPoint = (uv - vec2(0.49,0.46)) / vec2(mix(0.36,0.52,mobile),0.32);
    float textShade = 1.0 - 0.30 * exp(-dot(textPoint,textPoint) * 1.5);
    float edge = smoothstep(0.0,0.12,uv.y) * smoothstep(0.0,0.10,1.0-uv.y);
    color *= textShade * edge;
    vec3 base = vec3(0.012,0.020,0.035);
    outColor = vec4(base + color * vec3(0.84,0.92,1.0),1.0);
  }`;

/** 只持有传入画布的资源；同一 DOM 画布可在 StrictMode 清理后重新创建引擎。 */
export function createNebulaRenderer(
  canvas: HTMLCanvasElement,
  fallbackCanvas: HTMLCanvasElement,
): NebulaRenderer {
  let width = 1;
  let height = 1;
  let disposed = false;
  let contextLost = false;
  let hasRendered = false;
  let gl: WebGL2RenderingContext | null = null;
  let gpu: GpuResources | null = null;
  let lastOptions = { brightness: 1, dust: 0.7 };

  function releaseGpu(): void {
    if (gl && gpu) {
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.useProgram(null);
      gl.deleteVertexArray(gpu.vertexArray);
      gl.deleteBuffer(gpu.buffer);
      gl.deleteProgram(gpu.program);
    }
    gpu = null;
    gl = null;
  }

  function compile(context: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = context.createShader(type);
    if (!shader) throw new Error('无法创建星云着色器');
    try {
      context.shaderSource(shader, source);
      context.compileShader(shader);
      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        throw new Error(context.getShaderInfoLog(shader) || '星云着色器编译失败');
      }
      return shader;
    } catch (error) {
      context.deleteShader(shader);
      throw error;
    }
  }

  function initializeGpu(): void {
    let context: WebGL2RenderingContext | null = null;
    let vertex: WebGLShader | null = null;
    let fragment: WebGLShader | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let vertexArray: WebGLVertexArrayObject | null = null;
    try {
      context = canvas.getContext('webgl2', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: true,
        powerPreference: 'low-power',
      });
      if (!context) throw new Error('WebGL2 unavailable');
      vertex = compile(context, context.VERTEX_SHADER, vertexSource);
      fragment = compile(context, context.FRAGMENT_SHADER, fragmentSource);
      program = context.createProgram();
      if (!program) throw new Error('无法创建星云程序');
      context.attachShader(program, vertex);
      context.attachShader(program, fragment);
      context.linkProgram(program);
      if (!context.getProgramParameter(program, context.LINK_STATUS)) {
        throw new Error(context.getProgramInfoLog(program) || '星云着色器链接失败');
      }
      buffer = context.createBuffer();
      if (!buffer) throw new Error('无法创建星云顶点缓冲');
      vertexArray = context.createVertexArray();
      if (!vertexArray) throw new Error('无法创建星云顶点数组');
      context.useProgram(program);
      context.bindVertexArray(vertexArray);
      context.bindBuffer(context.ARRAY_BUFFER, buffer);
      context.bufferData(
        context.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        context.STATIC_DRAW,
      );
      const position = context.getAttribLocation(program, 'a_position');
      const resolution = context.getUniformLocation(program, 'u_resolution');
      const brightness = context.getUniformLocation(program, 'u_brightness');
      const dust = context.getUniformLocation(program, 'u_dust');
      if (position < 0 || !resolution || !brightness || !dust) {
        throw new Error('星云着色器接口不可用');
      }
      context.enableVertexAttribArray(position);
      context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
      gl = context;
      gpu = { program, buffer, vertexArray, resolution, brightness, dust };
      program = null;
      buffer = null;
      vertexArray = null;
      canvas.style.display = 'block';
      fallbackCanvas.style.display = 'none';
    } catch {
      // 装饰渲染失败只降级；已创建的部分资源由 finally 统一释放。
      gl = null;
      gpu = null;
      canvas.style.display = 'none';
      fallbackCanvas.style.display = 'block';
    } finally {
      if (context) {
        if (vertex) context.deleteShader(vertex);
        if (fragment) context.deleteShader(fragment);
        if (program || buffer || vertexArray) {
          context.bindVertexArray(null);
          context.bindBuffer(context.ARRAY_BUFFER, null);
          context.useProgram(null);
        }
        if (vertexArray) context.deleteVertexArray(vertexArray);
        if (buffer) context.deleteBuffer(buffer);
        if (program) context.deleteProgram(program);
      }
    }
  }

  function hash(x: number, y: number): number {
    let n = Math.imul(x, 374761393) + Math.imul(y, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }
  function noise(x: number, y: number): number {
    const ix = Math.floor(x), iy = Math.floor(y);
    let fx = x - ix, fy = y - iy;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
    return a + (b - a) * fx + (c - a) * fy * (1 - fx) + (d - b) * fx * fy;
  }
  function fractal(x: number, y: number): number {
    let sum = 0, weight = .54;
    for (let i = 0; i < 5; i++) { sum += noise(x, y) * weight; const oldX = x; x = (x * .8 + y * .6) * 2.07 + 19.3; y = (-oldX * .6 + y * .8) * 2.07 + 7.1; weight *= .47; }
    return sum;
  }
  function renderFallback(brightness: number, dust: number): void {
    let target: CanvasRenderingContext2D | null;
    try { target = fallbackCanvas.getContext('2d'); } catch { return; }
    if (!target) return;
    const ratio = Math.min(1, 460 / width);
    fallbackCanvas.width = Math.ceil(width * ratio);
    fallbackCanvas.height = Math.ceil(height * ratio);
    const pixels = target.createImageData(fallbackCanvas.width, fallbackCanvas.height);
    const mobile = width < 621;
    for (let y = 0; y < pixels.height; y++) for (let x = 0; x < pixels.width; x++) {
      const u = x / pixels.width, v = y / pixels.height;
      const px = (u - (mobile ? .55 : .60)) * (mobile ? 2.35 : 3.15), py = (v - .46) * 2.65;
      const qx = px * .958 + py * .287, qy = -px * .287 + py * .958;
      const wx = fractal(qx * 1.3 + 11, qy * 1.7 + 4) - .5;
      const wy = fractal(qx * 1.7 + 23, qy * 1.3 + 19) - .5;
      const f = fractal(qx * 2.4 + wx, qy * 3.9 + wy);
      const envelope = Math.exp(-Math.pow((qy - .20 * Math.sin(qx * 2.3 + .7) - qx * .16) / .67, 2)) * Math.exp(-Math.pow(qx / 1.6, 4));
      const lamp = Math.exp(-Math.hypot((qx - .48) * 1.35, (qy + .08) * 1.75) * 1.6);
      const filament = fractal(qx * 4 + 7, qy * 6.2 + 13);
      const irregularity = (filament - .48) * .78;
      const axis = .20 * Math.sin(qx * 2.3 + .7) + qx * .16;
      const veinWidth = .045 + .095 * f;
      const mainVein = Math.exp(-Math.pow((qy - axis - .025 + irregularity) / veinWidth, 2));
      const branch = Math.exp(-Math.pow((qy - axis + (qx - .16) * .43 - .13 + irregularity * .83) / (veinWidth * .70), 2)) * Math.max(0,Math.min(1,(qx + .3) / .45)) * Math.max(0,Math.min(1,(1.4 - qx) / .54));
      const absorption = Math.exp(-(Math.max(mainVein,branch) * Math.exp(-Math.pow(qx / 1.3, 4)) * 3.8 + Math.max(0, filament - .4) * 2) * dust);
      const density = Math.max(0, f - .23) * envelope * absorption * (1.0 + lamp * 2.2);
      const shade = 1 - .3 * Math.exp(-((u - .49) ** 2 / (mobile ? .52 ** 2 : .36 ** 2) + (v - .46) ** 2 / .32 ** 2) * 1.5);
      const light = (1 - Math.exp(-density * brightness * 2.0)) * shade * Math.min(1, v / .12, (1 - v) / .1);
      const offset = (y * pixels.width + x) * 4;
      pixels.data[offset] = 3 + light * (133 + lamp * 70);
      pixels.data[offset + 1] = 5 + light * (178 + lamp * 20);
      pixels.data[offset + 2] = 9 + light * (220 - lamp * 22);
      pixels.data[offset + 3] = 255;
    }
    target.putImageData(pixels, 0, 0);
  }

  function applySize(): void {
    // 与批准预览相同的采样上限，不随高 DPR 无限放大一次性体积渲染。
    const scale = Math.min(1.1, 1200 / width);
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    gl?.viewport(0, 0, canvas.width, canvas.height);
  }

  function renderCurrent(): void {
    if (disposed) return;
    if (gl && gpu) {
      gl.useProgram(gpu.program);
      gl.bindVertexArray(gpu.vertexArray);
      gl.uniform2f(gpu.resolution, width, height);
      gl.uniform1f(gpu.brightness, lastOptions.brightness);
      gl.uniform1f(gpu.dust, lastOptions.dust);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.flush();
    } else {
      renderFallback(lastOptions.brightness, lastOptions.dust);
    }
  }

  function onContextLost(event: Event): void {
    if (disposed) return;
    event.preventDefault();
    contextLost = true;
    releaseGpu();
    canvas.style.display = 'none';
    fallbackCanvas.style.display = 'block';
    if (hasRendered) renderCurrent();
  }

  function onContextRestored(): void {
    if (disposed || !contextLost) return;
    contextLost = false;
    initializeGpu();
    applySize();
    if (hasRendered) renderCurrent();
  }

  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  initializeGpu();

  return {
    resize(nextWidth, nextHeight) {
      if (disposed) return;
      width = Number.isFinite(nextWidth) && nextWidth > 0 ? nextWidth : 1;
      height = Number.isFinite(nextHeight) && nextHeight > 0 ? nextHeight : 1;
      applySize();
    },
    render(options = {}) {
      if (disposed) return;
      const brightness = options.brightness ?? 1;
      const dust = options.dust ?? 0.7;
      lastOptions = {
        brightness: Number.isFinite(brightness) ? Math.max(0.2, Math.min(2, brightness)) : 1,
        dust: Number.isFinite(dust) ? Math.max(0, Math.min(1.5, dust)) : 0.7,
      };
      hasRendered = true;
      renderCurrent();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      releaseGpu();
      // 缩小绘制缓冲即可回收显存；不调用 loseContext，以免复挂载无法重建。
      canvas.width = canvas.height = 1;
      fallbackCanvas.width = fallbackCanvas.height = 1;
      canvas.style.display = 'none';
      fallbackCanvas.style.display = 'none';
    },
  };
}
