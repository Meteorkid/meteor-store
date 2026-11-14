## The short version

XIsland does not modify Claude Code, Codex, or any other client. It does not proxy their network traffic or intercept terminal output. What it does is register a **hook in the client's own config file**. When the event fires, the client invokes `~/.xisland/bin/di-bridge`; that bridge encodes the JSON on stdin into a message and sends it over a Unix socket to XIsland, which refreshes the panel.

Requirements: macOS 14 or later, XIsland installed, and the target client switched on under Settings → Agents.

## What it actually writes

On first launch XIsland scans for agents and writes two things:

1. The bridge binary at `~/.xisland/bin/di-bridge` (the same directory holds the `xisland` CLI used for in-place upgrades);
2. Hook entries in each client's own configuration.

For Claude Code it writes into the `hooks` object of `~/.claude/settings.json`, one command per event:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "'/Users/<your-username>/.xisland/bin/di-bridge' --agent claude_code --hook PreToolUse || true"
          }
        ]
      }
    ]
  }
}
```

Three details matter here:

- The command uses an **absolute path**, so old entries break after a username change or a migration to a new machine;
- `--agent claude_code` identifies the source, which is how the panel tells sessions apart;
- The trailing `|| true` keeps a failing hook from blocking the agent. If the bridge crashes, Claude Code keeps working — the panel just stops updating.

Codex uses `~/.codex/hooks.json` with a similar shape and `--agent codex`. Cursor, Gemini CLI, Kimi Code, Qwen Code and the others are configured through their own native mechanisms, with different file locations and key names. The integration routes table on the product page lists which mechanism each client uses.

## How an event reaches the panel

```
Client fires a hook
  → di-bridge reads the JSON on stdin
  → encodes it as a DIMessage
  → writes to a Unix socket
  → XIsland's SessionManager updates that session
  → the notch panel refreshes status / shows an approval card
```

The flow is largely one-way: the client reports events, XIsland sends back decisions (allow, deny, answer, plan approval). Beyond that it does not read your project files or forward your requests.

## When the panel stays silent

1. **Did you restart the client?** Claude Code reads `settings.json` at session start; open a new session after any change.
2. **Is the bridge still there?** `ls -l ~/.xisland/bin/di-bridge`. If the file is gone, reinstall XIsland.
3. **Is the toggle on?** Settings → Agents, check that the client was not switched off.
4. **Is the entry actually in the file?** Search the config for `di-bridge`. If it is missing, restart XIsland so it rewrites the config.
5. **Run it by hand.** Copy the command from the config into a terminal and run it. The error message usually names the path or permission problem directly.

## How far verification goes

Claude Code is the most thoroughly verified route so far: isolated native Read and the in-island denial round trip were verified against a local mock model, while full client acceptance is still in progress. Most other clients have passed contract tests and await real-client acceptance.

The integration routes table on the product page labels every route individually. A config file existing does not mean the client loads it, and it certainly does not mean end-to-end support, so this site avoids blanket claims of full support.

## Leftovers after uninstalling

Dragging the app to the Trash does not remove the hook entries. When you switch machines or stop using XIsland:

1. Delete the entries containing `di-bridge` from `~/.claude/settings.json`, `~/.codex/hooks.json` and any other client config;
2. Remove the `~/.xisland/bin` directory.

Leftover entries do not leak data, but every event will try to launch a command that no longer exists.
