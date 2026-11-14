## 先看结论

XIsland 不改动 Claude Code、Codex 这些客户端本体，也不接管它们的网络请求或终端输出。它做的是在客户端**自己的配置文件里注册一个 hook**：事件触发时由客户端调用 `~/.xisland/bin/di-bridge`，这个桥接进程把 stdin 上的 JSON 编码成一条消息，经 Unix socket 送进 XIsland，面板据此刷新状态。

前提是 macOS 14 及以上、已安装 XIsland，并且在「设置 → Agents」里目标客户端处于开启状态。

## 它到底写了什么

首次启动时 XIsland 自动检测本机代理，写入两类东西：

1. 桥接二进制 `~/.xisland/bin/di-bridge`，同目录还有用于就地升级的 `xisland` CLI；
2. 各客户端配置里的 hook 条目。

Claude Code 写进 `~/.claude/settings.json` 的 `hooks` 字段，每个事件一条命令，形如：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "'/Users/<你的用户名>/.xisland/bin/di-bridge' --agent claude_code --hook PreToolUse || true"
          }
        ]
      }
    ]
  }
}
```

三个细节值得注意：

- 命令用**绝对路径**，所以移动用户名目录或迁移到新机器后，旧条目会指向不存在的文件；
- `--agent claude_code` 标明来源，面板靠它区分不同客户端的会话；
- 末尾的 `|| true` 让 hook 失败时不阻塞代理主流程——桥接进程崩了，Claude Code 依旧正常工作，只是面板不更新。

Codex 写进 `~/.codex/hooks.json`，结构类似，命令换成 `--agent codex`。Cursor、Gemini CLI、Kimi Code、Qwen Code 等客户端按各自的原生机制写入，文件位置与键名都不相同，产品页的集成路线表列出了每个客户端用的是哪一种。

## 事件怎么走到面板

```
客户端触发 hook
  → di-bridge 读取 stdin 上的 JSON
  → 编码为 DIMessage
  → 写入 Unix socket
  → XIsland 的 SessionManager 更新对应会话
  → 刘海面板刷新状态 / 弹出审批卡片
```

这条链路基本是单向的：客户端上报事件，XIsland 回传审批结果（允许、拒绝、回答、计划确认），除此之外不读取你的项目文件，也不代为转发请求。

## 面板没有反应时按这个顺序查

1. **客户端重启了吗。** Claude Code 只在会话启动时加载 `settings.json`，改完要开新会话才生效。
2. **桥接进程还在吗。** `ls -l ~/.xisland/bin/di-bridge`，文件不存在就重新安装 XIsland。
3. **开关是开的吗。** 设置 → Agents，逐项确认目标客户端没有被关掉。
4. **配置里真的有条目吗。** 在对应的配置文件里搜 `di-bridge`，搜不到就重开 XIsland 让它重新写入。
5. **手工跑一次。** 把配置里的那条命令复制到终端执行，看它输出什么——报错信息通常直接指出路径或权限问题。

## 验证到了什么程度

Claude Code 是目前验证程度最高的一条路线：在本地 mock model 下验证过 isolated native Read 与「在灵动岛内拒绝」的完整往返，完整客户端验收仍在进行。其余客户端多数是契约测试通过、真机验收待完成。

这个区别在产品页的集成路线表里逐条标注。配置文件存在不等于客户端会加载它，更不等于端到端可用，所以本站不写「已全面支持」这类笼统声明。

## 卸载后的残留

只把 App 拖进废纸篓不会清理 hook 条目。换机或不再使用时：

1. 在 `~/.claude/settings.json`、`~/.codex/hooks.json` 等文件里删掉带 `di-bridge` 的条目；
2. 删除 `~/.xisland/bin` 目录。

残留条目不会造成数据泄露，但每次事件都会启动一个不存在的命令，多一次失败调用。
