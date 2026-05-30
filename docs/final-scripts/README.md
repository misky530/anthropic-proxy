# AI Coding Gateway — Final Video Scripts

## Status: Ready to Record

Three episodes. All updated with the latest strategy.

---

## What Changed (vs previous version)

**Episode 2** — completely rewritten.  
Old: OpenCode install + anthropic-proxy deployment (complex)  
New: Two lines of config using DeepSeek's official Anthropic API (simple)

```bash
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_API_KEY=你的DeepSeek_Key
```

That's the entire episode. Source: DeepSeek official docs.

**Episode 3** — updated model switching method to match Episode 2.

**Episode 1** — unchanged. Still valid.

---

## Episode Summary

| | Episode 1 | Episode 2 | Episode 3 |
|---|---|---|---|
| Title | 我只说了一句话，它把整个项目重构了 | 两行命令，Claude Code 国内跑起来 | 免费 vs DeepSeek vs Claude，你来判断 |
| Goal | Awareness | Setup | Convert |
| Length | 8 min | 6 min | 8 min |
| Key moment | "我没写一行测试。" [2s pause] | "Continue with Gateway" button | Cost reveal + 53/72/85 |
| Convert to | Follow account | Get DeepSeek Key / visit platform | Pay for better model |

---

## Recording Order

**Do this before recording anything:**
```bash
cd demo-project
npm install
npm test         # confirm: 0% coverage, this is your opening frame
```

**Record in this order:**
1. Episode 2 first — shortest, simplest, builds your confidence
2. Episode 1 — the demo project needs to be fresh/clean
3. Episode 3 last — requires running three models, most editing work

**For each episode:**
- Record screen first, no talking
- Add voiceover after watching your own recording
- Edit in Jianying (剪映)

---

## The Two Commands (keep these handy)

```bash
# DeepSeek (use in Episode 2 + Episode 3)
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_API_KEY=sk-你的DeepSeek_Key

# Claude via your platform (use in Episode 3)
export ANTHROPIC_BASE_URL=https://你的平台域名
export ANTHROPIC_API_KEY=你的平台Key

# Make permanent
echo 'export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic' >> ~/.zshrc
echo 'export ANTHROPIC_API_KEY=你的Key' >> ~/.zshrc
source ~/.zshrc
```

---

## Files in This Package

| File | Use |
|---|---|
| `episode1-script.md` | EP1 voiceover + filming notes |
| `episode2-script.md` | EP2 voiceover + config reference |
| `episode3-script.md` | EP3 voiceover + three-task guide |
| `README.md` | This file |

## Other Files You Have

| File | Use |
|---|---|
| `demo-project-final.zip` | The project used in all three episodes |
| `cline-vs-claudecode-demo.md` | Bonus segment for Episode 1 Part 2 |
| `claude-code-mac/linux/windows.zip` | Installer packages (for description links) |

---

Ship it. Fix it later.
