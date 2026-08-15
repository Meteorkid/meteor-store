# 依赖 overrides 对照表

`package.json` 的 `pnpm.overrides` 是 JSON，写不了注释，所以每条的来源与退出条件记在这里。
**新增或删除 override 时同步更新本文件**——否则半年后没人能反推某条是为什么加的，
也就没人敢删，锁版本会一直越堆越多。

CI 的「依赖安全审计」步骤跑 `pnpm audit --prod --audit-level=high`（非阻塞），
具体公告编号以那一步的输出为准，本文件只记「为什么需要这条」和「什么时候能删」。

| override | 现在锁到 | 谁把它带进来（`pnpm why`） | 什么时候可以删 |
|---|---|---|---|
| `postcss` | `^8.5.23` | `@tailwindcss/postcss`、`next`、`vite` 三方共用，树里只有 1 个版本 | 三方的直接依赖范围都不再允许低于 8.5.23 时 |
| `nanoid@3` | `3.3.18` | 仅 `postcss` → nanoid 3.x。`docx` 用的是 nanoid 5.x，不受这条影响 | postcss 自己升到修复版之后 |
| `brace-expansion@^1.0.0` | `^1.1.18` | `minimatch@3` → brace-expansion 1.x | 树里不再出现 minimatch 3.x 时 |
| `brace-expansion@>=3.0.0` | `5.0.9` | `minimatch@10` → brace-expansion 5.x | 上游自己带上 5.0.9+ 时 |
| `fast-uri` | `^3.1.5` | `ajv` | ajv 升到带修复版本之后 |
| `js-yaml@3` | `^3.15.1` | `gray-matter`（读博客 frontmatter 用） | gray-matter 换掉 js-yaml 3.x，或本项目不再用 gray-matter |
| `js-yaml@^4.0.0` | `^4.3.1` | `@eslint/eslintrc` | eslint 侧自己升上去之后 |
| `esbuild@<0.25.0` | `^0.25.0` | `@esbuild-kit/core-utils`、`drizzle-kit` | 这两个包的 esbuild 依赖范围自己迈过 0.25 时 |
| `sharp` | `$sharp` | 直接依赖，同时被传递依赖引用 | 一般不删；`$sharp` 表示跟随 `dependencies` 里的版本 |

## 为什么同一个包会有两条 override

`brace-expansion` 和 `js-yaml` 在依赖树里各有两个大版本共存（分别由 `minimatch@3`/`minimatch@10`、
`gray-matter`/`@eslint/eslintrc` 带进来）。一个 semver range 覆盖不了两个不兼容的大版本，
所以按 `pkg@range` selector 分开写。**不要合并成一条**，合并后其中一个大版本会被强制升到
不兼容的版本，安装直接失败。

## `sharp` 为什么写成 `$sharp`

`sharp` 既是直接依赖（`dependencies`）又需要覆盖传递依赖。写死版本号会让两处独立漂移，
升级时改一处漏一处。`$sharp` 是 pnpm 的语法，表示「用 `dependencies` 里声明的那个范围」，
从此只有一个真值来源。
