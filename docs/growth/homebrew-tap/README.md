# Homebrew Tap 准备包

> **目标**：让 macOS 用户能用 `brew install --cask meteorkid/xisland/xisland` 一条命令装好。
>
> **现状**：竞品 `bluedusk/homebrew-xisland` 已存在（`brew install --cask bluedusk/xisland/x-island`），
> 本站没有。这是可零成本追赶的一项。

## 一、为什么值得做

| 理由 | 说明 |
|---|---|
| **macOS 用户装应用的首选方式** | 开发者群体里 `brew` 是默认习惯，比下载 DMG 更顺手 |
| **自动更新** | cask 配 `livecheck` + `auto_updates` 后，用户 `brew upgrade` 即可升级 |
| **搜索发现** | `brew search xisland` 能搜到（官方 cask 库与已添加的 tap） |
| **成本为零** | 只需一个公开 GitHub 仓库 + 一个 `.rb` 文件 |
| **竞品已在做** | 不追赶等于让出这条渠道 |

## 二、前置：两个限制必须知道

### ⚠️ 限制 1：进不了官方 cask 库

Homebrew 官方库的收录要求（原文）：

> "apps, installers and other executable artefacts that Gatekeeper can assess must pass
> Homebrew's Gatekeeper checks and **must not require System Integrity Protection or
> Gatekeeper to be disabled or bypassed**"

本站 DMG 实测结果：

```
codesign:  code object is not signed at all
spctl:     rejected — no usable signature
```

**无签名 + 需要 `xattr -cr` 绕过 = 不符合官方库要求。** 这是硬门槛，不是技巧问题。
要进官方库必须先买 Apple Developer 证书（$99/年）并做公证。

**但自定义 tap 不受此限** —— tap 是自己的仓库，Homebrew 不审核其内容。
所以现在能做的是**自定义 tap**，官方库留到有签名之后。

### ⚠️ 限制 2：必须如实写 caveats

无签名意味着用户装完首次启动会被 Gatekeeper 拦截。**cask 里必须写明怎么绕过**，
否则用户装完打不开、又不知道原因，会直接卸载并留下差评——比不提供 cask 更糟。
`Casks/xisland.rb` 里的 `caveats` 段已经写好。

## 三、执行步骤（需你的 GitHub 账号）

### 步骤 1：创建 tap 仓库

在 GitHub 上新建公开仓库，**名字必须是**：

```
homebrew-xisland
```

（Homebrew 的命名约定：`homebrew-<tap名>`，所以 tap 名是 `xisland`）

### 步骤 2：放入 cask 文件

把本目录的 `Casks/xisland.rb` 放到仓库根目录的 `Casks/` 下：

```
homebrew-xisland/
└── Casks/
    └── xisland.rb
```

**注意文件名**：`xisland.rb` 对应 `brew install --cask meteorkid/xisland/xisland`。

### 步骤 3：验证（在有 Homebrew 的 Mac 上）

```bash
brew tap meteorkid/xisland
brew install --cask meteorkid/xisland/xisland
```

也可以用 Homebrew 的审计工具自查（会指出格式问题）：

```bash
brew audit --cask --new meteorkid/xisland/xisland
```

### 步骤 4：更新方式

每次发新版，需要同步两处：

1. `Casks/xisland.rb` 里的 `version` 与 `sha256`
2. 提交推送到 tap 仓库

`sha256` 取法（**必须从 release 的 SHA256SUMS.txt 取，不要自己算**——
两者不一致说明下载被篡改或构建有问题）：

```bash
curl -sL https://github.com/Meteorkid/XIsland/releases/download/v<版本>/SHA256SUMS.txt
```

## 四、当前 cask 的关键字段说明

| 字段 | 值 | 说明 |
|---|---|---|
| `version` | `2.0.18` | 当前最新版（2026-11-06 发布） |
| `sha256` | `7d7350a4...` | 已与 release 的 SHA256SUMS.txt 核对一致 |
| `url` | `.../releases/download/v#{version}/XIsland-#{version}.dmg` | 用 `#{version}` 插值，改版本号时只动一处 |
| `name` | `X Island` | 与 DMG 内的 `.app` 包名一致（`X Island.app`） |
| `desc` | `Dynamic Island control tower for AI coding agents` | 官方库要求 desc 不含应用名、首字母大写、不超过 80 字符 |
| `homepage` | `imagentx.top/zh/products/xisland` | **指向本站，不是 xisland.app** |
| `depends_on macos: :sonoma` | macOS 14+ | 与 README 要求一致 |
| `auto_updates true` | | 应用自带更新机制 |
| `livecheck` | `:github_latest` | `brew livecheck` 能自动发现新版本 |

**`app "X Island.app"`**：包名必须与 DMG 里的 `.app` 完全一致（含空格）。
`src/data/products.ts` 的 `macBundleName: 'X Island.app'` 是同一事实的另一个引用点。

## 五、如果将来做了签名

有 Apple Developer 证书并完成公证后，可以：

1. 删掉 cask 里的 `caveats` 段（不再需要绕过提示）
2. 向官方库提交 PR：`Homebrew/homebrew-cask`
3. 官方库收录后，用户可以不 tap 直接 `brew install --cask xisland`

**届时要注意**：官方库有 `xisland` 这个 token 可用吗？需先检查是否被占用：

```bash
curl -sL -o /dev/null -w "%{http_code}\n" https://formulae.brew.sh/api/cask/xisland.json
```

当前返回 404（未占用），但**别人可能先占**——这也是尽早提交的一个理由。
