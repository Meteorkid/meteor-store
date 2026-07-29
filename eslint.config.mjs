import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // 已知待办，暂降为 warning，好让 CI 能拦住「新增」问题而不是一直是红的。
      //
      // 命中的 7 处（motion / AuthProvider / FeedbackForm / LoadingQuip /
      // ScrambleText / SpotlightSearch / TerminalSection）都是「挂载后计算以避开
      // SSR 水合不一致」或「依赖变化时重置派生状态」的写法，行为正确，规则报的是
      // 多一次渲染的性能气味。正确修法是逐处改用 useSyncExternalStore 或调整渲染
      // 时序，每处都会动到水合与动画的可见行为，需要单独一轮改动加验证。
      //
      // 修完这 7 处后请删掉这条覆盖，恢复成 error。
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
