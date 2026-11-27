import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["public/meteor-runner.js"],
    rules: {
      // 这是给浏览器直接加载的普通脚本，沿用 IIFE 内的 this 绑定，
      // 不能因为 lint 风格把它改成箭头函数而改变运行语义。
      "@typescript-eslint/no-this-alias": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 站内集成的第三方应用源码（vendored），不参与本项目 lint
    "src/apps/**",
    "src/lib/apps/**",
    // 第三方浏览器运行库，不参与本项目 lint
    "public/vendor/**",
    // 发布过程留档与宣传素材里的 CommonJS 脚本，不是应用运行代码
    "docs/**",
    "promo/**",
    // 临时校验脚本，不进入仓库运行链路
    ".tmp-validation/**",
    ".tmp-validation.mjs",
  ]),
]);

export default eslintConfig;
