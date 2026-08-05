/**
 * dat.gui 无自带类型，这里做最小声明，方便在客户端组件中以任意类型使用。
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'dat.gui' {
  const dat: any;
  export default dat;
  export const GUI: any;
}

/**
 * 源应用把 dat.gui 作为 UMD 全局变量 dat 使用（new dat.GUI）。
 * WebGLFluidSim 组件用模块导入后注入到 globalThis.dat，这里做全局声明。
 * 全局声明必须用 var 才会被 globalThis.dat 赋值认可，故禁用 no-var。
 */
// eslint-disable-next-line no-var
declare var dat: any;