/**
 * dat.gui 无自带类型，这里做最小声明，方便在客户端组件中以任意类型使用。
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'dat.gui' {
  const dat: any;
  export default dat;
  export const GUI: any;
}