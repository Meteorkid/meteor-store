export interface NebulaRenderOptions {
  brightness?: number;
  dust?: number;
  /** 弧度；与星光相同的先 Y 后 X 视角，屏幕 x 向右、y 向下、z 向远处。 */
  yaw?: number;
  pitch?: number;
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
  viewRotation: WebGLUniformLocation;
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
  uniform mat3 u_view_rotation;

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
  float starCell(vec3 dir, float density, float threshold, float sharp) {
    vec3 p = dir * density;
    vec3 cell = floor(p);
    float h = hash31(cell);
    if (h < threshold) return 0.0;
    vec3 f = fract(p) - 0.5;
    vec3 jitter = (vec3(hash31(cell + 11.0), hash31(cell + 23.0), hash31(cell + 37.0)) - 0.5) * 0.62;
    float d = length(f - jitter);
    float core = pow(max(0.0, 1.0 - d * 2.45), sharp);
    return core * (0.34 + 0.66 * hash31(cell + 71.0));
  }
  vec3 proceduralStars(vec3 dir) {
    float large = starCell(dir, 54.0, 0.895, 6.2);
    float fine = starCell(dir, 104.0, 0.932, 5.0) * 0.62;
    float tint = hash31(floor(dir * 73.0));
    vec3 color = mix(vec3(0.70, 0.84, 1.00), vec3(1.00, 0.88, 0.68), step(0.84, tint));
    return color * (large + fine);
  }
  vec4 drawPlanet(vec3 dir, vec3 center, float radius, vec3 base, float ringed) {
    float angle = acos(clamp(dot(dir, center), -1.0, 1.0));
    if (angle > radius * 2.35) return vec4(0.0);
    vec3 axis = abs(center.y) > 0.92 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(axis, center));
    vec3 up = normalize(cross(center, right));
    vec2 p = vec2(dot(dir, right), dot(dir, up)) / radius;
    float rr = length(p);
    float body = 1.0 - smoothstep(0.945, 1.015, rr);
    float nz = sqrt(max(0.0, 1.0 - rr * rr));
    vec3 normal = normalize(right * p.x + up * p.y + center * nz);
    vec3 lightDirection = normalize(vec3(-0.62, 0.74, 0.32));
    float light = 0.16 + 0.92 * max(0.0, dot(normal, lightDirection));
    float bands = 0.82 + 0.18 * sin(p.y * 28.0 + noise3(dir * 19.0) * 3.0);
    vec3 bodyColor = base * (0.26 + light) * bands;
    float rim = pow(smoothstep(0.62, 1.0, rr), 2.2) * body;
    float specular = pow(max(0.0, dot(reflect(-lightDirection, normal), -dir)), 22.0) * 0.42;
    bodyColor += base * rim * 0.48 + vec3(specular);
    float halo = (1.0 - smoothstep(0.96, 2.35, rr)) * 0.18;
    vec3 color = bodyColor + base * halo * 0.34;
    float alpha = max(body, halo);
    if (ringed > 0.5) {
      float ringDistance = length(vec2(p.x, p.y * 2.70));
      float ring = (1.0 - smoothstep(0.00, 0.105, abs(ringDistance - 1.52))) * ringed;
      ring *= 1.0 - smoothstep(0.78, 1.04, abs(p.y));
      vec3 ringColor = mix(vec3(0.50, 0.47, 0.40), vec3(0.88, 0.81, 0.64), ring) * (0.50 + light * 0.40);
      color = mix(ringColor, bodyColor, body);
      alpha = max(alpha, ring * 0.66);
    }
    return vec4(color, clamp(alpha, 0.0, 1.0));
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
    float aspect = u_resolution.x / max(1.0, u_resolution.y);
    vec2 ndc = vec2((uv.x - 0.5) * 2.0, (0.5 - uv.y) * 2.0 / aspect);
    vec3 radiance = vec3(0.0);
    float transmittance = 1.0;
    // 观察者固定在云团内部；视角只改变看出去的方向，云体本身不绕用户旋转。
    vec3 cameraRay = normalize(vec3(ndc, 1.0));
    vec3 rayDirection = u_view_rotation * cameraRay;
    const float stepLength = 2.8 / 36.0;
    for (int stepIndex = 0; stepIndex < 36; stepIndex++) {
      float radius = 0.20 + (float(stepIndex) + 0.5) * stepLength;
      vec3 p = rayDirection * radius;
      vec3 displacement = warp(p + vec3(3.7,4.8,1.5));
      vec3 field = p * vec3(1.55,2.45,1.75) + displacement * 0.95;
      float broad = fbm(field + vec3(1.7,6.3,2.1));
      float detail = noise3(field * 8.5 + displacement * 2.0);
      float ridge = pow(1.0 - abs(2.0 * noise3(field * 4.4 + 13.0) - 1.0), 2.5);
      float cloud = smoothstep(0.44,0.88,broad + (detail - 0.5) * 0.085);
      // 抬高亮云、压掉低密度雾，内部天幕才保留深空黑位而非整屏蒙灰。
      float density = pow(envelope(p) * cloud * (0.40 + ridge * 1.05), 1.65) * 1.35;
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
    vec3 color = vec3(1.0) - exp(-radiance * u_brightness * 1.45);
    color = pow(max(color,vec3(0.0)),vec3(0.82));
    vec3 coreDirection = normalize(vec3(0.40, 0.06, 0.92));
    vec3 secondCore = normalize(vec3(-0.72, -0.10, -0.68));
    float coreAngle = acos(clamp(dot(rayDirection, coreDirection), -1.0, 1.0));
    float secondAngle = acos(clamp(dot(rayDirection, secondCore), -1.0, 1.0));
    float coreCloud = exp(-pow(coreAngle / 0.46, 2.0));
    float secondCloud = exp(-pow(secondAngle / 0.34, 2.0));
    float filaments = fbm(rayDirection * 7.2 + vec3(2.4, 5.8, 8.1));
    float distantNoise = fbm(rayDirection * 3.25 + vec3(13.0, 1.7, 5.3));
    float distantFine = fbm(rayDirection * 13.0 + vec3(4.1, 9.2, 2.7));
    float galacticBand = exp(-pow((rayDirection.y + 0.10 * sin(rayDirection.x * 2.8 + 0.6)) / 0.34, 2.0));
    float gasVeil = galacticBand * smoothstep(0.28, 0.82, distantNoise) * (0.34 + distantFine * 0.66);
    color *= 1.0 - galacticBand * smoothstep(0.54, 0.82, distantFine) * 0.22;
    color += mix(vec3(0.08, 0.17, 0.28), vec3(0.48, 0.62, 0.70), distantFine) * gasVeil * 0.38;
    color += vec3(0.24, 0.36, 0.48) * coreCloud * (0.32 + filaments * 0.74);
    color += vec3(0.20, 0.29, 0.42) * secondCloud * (0.22 + filaments * 0.52);
    vec3 stars = proceduralStars(rayDirection);
    vec2 textPoint = (uv - vec2(0.49,0.46)) / vec2(mix(0.36,0.52,mobile),0.32);
    float textShade = 1.0 - 0.30 * exp(-dot(textPoint,textPoint) * 1.5);
    float edge = smoothstep(0.0,0.12,uv.y) * smoothstep(0.0,0.10,1.0-uv.y);
    color *= textShade * edge;
    vec3 base = vec3(0.009,0.016,0.029);
    vec3 sky = base + color * vec3(0.84,0.92,1.0) + stars * vec3(0.90,0.95,1.0);
    vec4 planet = drawPlanet(rayDirection, normalize(vec3(-0.62, 0.32, 0.72)), 0.0075, vec3(0.44, 0.66, 0.88), 0.0);
    sky = mix(sky, planet.rgb, planet.a);
    planet = drawPlanet(rayDirection, normalize(vec3(0.48, 0.10, 0.87)), 0.012, vec3(0.75, 0.62, 0.44), 1.0);
    sky = mix(sky, planet.rgb, planet.a);
    planet = drawPlanet(rayDirection, normalize(vec3(-0.36, -0.42, -0.84)), 0.0060, vec3(0.42, 0.72, 0.76), 0.0);
    sky = mix(sky, planet.rgb, planet.a);
    planet = drawPlanet(rayDirection, normalize(vec3(0.18, 0.67, -0.72)), 0.0065, vec3(0.86, 0.56, 0.40), 0.0);
    sky = mix(sky, planet.rgb, planet.a);
    planet = drawPlanet(rayDirection, normalize(vec3(-0.80, -0.18, -0.57)), 0.0052, vec3(0.39, 0.60, 0.88), 1.0);
    sky = mix(sky, planet.rgb, planet.a);
    planet = drawPlanet(rayDirection, normalize(vec3(0.78, -0.28, -0.56)), 0.0058, vec3(0.93, 0.77, 0.52), 0.0);
    sky = mix(sky, planet.rgb, planet.a);
    outColor = vec4(sky, 1.0);
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
  let lastOptions = { brightness: 1, dust: 0.7, yaw: 0, pitch: 0 };

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
        powerPreference: 'high-performance',
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
      const viewRotation = context.getUniformLocation(program, 'u_view_rotation');
      if (position < 0 || !resolution || !brightness || !dust || !viewRotation) {
        throw new Error('星云着色器接口不可用');
      }
      context.enableVertexAttribArray(position);
      context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
      gl = context;
      gpu = { program, buffer, vertexArray, resolution, brightness, dust, viewRotation };
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
  function renderFallback(brightness: number, dust: number, yaw: number, pitch: number): void {
    let target: CanvasRenderingContext2D | null;
    try { target = fallbackCanvas.getContext('2d'); } catch { return; }
    if (!target) return;
    const ratio = Math.min(1, 460 / width);
    fallbackCanvas.width = Math.ceil(width * ratio);
    fallbackCanvas.height = Math.ceil(height * ratio);
    const pixels = target.createImageData(fallbackCanvas.width, fallbackCanvas.height);
    const mobile = width < 621;
    // 2D 降级只提供温和的平面视差；重新采样全幅噪声，不移动画布而露出边缘。
    const shiftX = Math.sin(yaw) * 0.18;
    const shiftY = Math.sin(pitch) * 0.18;
    for (let y = 0; y < pixels.height; y++) for (let x = 0; x < pixels.width; x++) {
      const u = x / pixels.width, v = y / pixels.height;
      const px = (u - (mobile ? .55 : .60)) * (mobile ? 2.35 : 3.15) - shiftX;
      const py = (v - .46) * 2.65 + shiftY;
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
      // 世界坐标到相机坐标旋转的逆矩阵，按 WebGL 列主序上传。
      const cy = Math.cos(lastOptions.yaw), sy = Math.sin(lastOptions.yaw);
      const cp = Math.cos(lastOptions.pitch), sp = Math.sin(lastOptions.pitch);
      gl.uniformMatrix3fv(gpu.viewRotation, false, new Float32Array([
        cy, 0, -sy,
        -sp * sy, cp, -sp * cy,
        cp * sy, sp, cp * cy,
      ]));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.flush();
    } else {
      renderFallback(lastOptions.brightness, lastOptions.dust, lastOptions.yaw, lastOptions.pitch);
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
      const yaw = options.yaw ?? 0;
      const pitch = options.pitch ?? 0;
      lastOptions = {
        brightness: Number.isFinite(brightness) ? Math.max(0.2, Math.min(2, brightness)) : 1,
        dust: Number.isFinite(dust) ? Math.max(0, Math.min(1.5, dust)) : 0.7,
        // 水平视角连续绕行一整圈；俯仰仍留出安全余量，避免穿过云层极点。
        yaw: Number.isFinite(yaw) ? Math.atan2(Math.sin(yaw), Math.cos(yaw)) : 0,
        pitch: Number.isFinite(pitch) ? Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch)) : 0,
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
