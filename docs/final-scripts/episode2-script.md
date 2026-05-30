# Episode 2 — Voiceover Script
## "2 Lines of Config, Claude Code Runs in China"

**Platform:** Bilibili (6 min) + Douyin cut (60s)
**Format:** Screen recording + voiceover
**Goal:** Get viewers to set up and use the tool. Convert to: follow + visit platform.

---

## The Core Message This Episode

DeepSeek officially supports Anthropic API format.  
Base URL: `https://api.deepseek.com/anthropic`  
This means Claude Desktop and Claude Code work with DeepSeek directly — no proxy, no VPN, no overseas account.

**Two lines. That's it.**

```bash
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_API_KEY=你的DeepSeek_Key
```

---

## Pre-Recording Checklist

- [ ] DeepSeek account ready at platform.deepseek.com (registered + credited)
- [ ] DeepSeek API Key copied
- [ ] Claude Desktop installed, Developer Mode enabled
- [ ] demo-project folder open in terminal
- [ ] Screen 1920×1080, font size 150%
- [ ] `npm test` confirmed showing 0% coverage (clean starting state)

---

## Opening — 0:00 to 0:20

> 📹 **Screen:** Terminal. Two lines typed. Claude starts. Freeze.

| Timecode | Line | Note |
|---|---|---|
| 0:00 | 上期看了 Claude Code 能干什么，这期解决国内用的问题。 | |
| 0:07 | 结论先说：就两行命令。 | |
| 0:11 | 配完，国内直连，人民币充值，不需要任何其他东西。 | |

---

## Part 1 — 0:20 to 1:30: Why This Works

> 📹 **Screen:** Show DeepSeek API docs page — the Anthropic API section

| Timecode | Line | Note |
|---|---|---|
| 0:20 | DeepSeek 官方，最近支持了 Anthropic API 格式。 | show docs URL |
| 0:28 | 意思是：Claude Code 原本只认 Anthropic 的接口。 | |
| 0:34 | 现在 DeepSeek 也说同样的语言了。 | |
| 0:40 | 直接配 DeepSeek 的地址，Claude Code 完全不知道区别，正常运行。 | |
| 0:48 | 不需要中间层，不需要代理，DeepSeek 国内直连，人民币充值。 | |
| 0:56 | 这是 DeepSeek 官方文档，不是破解，不是绕过，官方支持的。 | point at docs |

---

## Part 2 — 1:30 to 3:30: Live Demo — Claude Desktop

> 📹 **Screen:** Claude Desktop configuration, step by step

| Timecode | Line | Note |
|---|---|---|
| 1:30 | 先演示 Claude Desktop，图形界面，最简单。 | |
| 1:36 | 打开，Help → Troubleshooting → Enable Developer Mode。 | slow, captions follow |
| 1:44 | 重启完，Developer → Configure Third-Party Inference。 | |
| 1:52 | Provider 选 Gateway。 | |
| 1:56 | Base URL 填：https://api.deepseek.com/anthropic | show in caption |
| 2:04 | API Key 填你在 DeepSeek 平台拿到的 Key。 | |
| 2:11 | Add Model，填 deepseek-v4-pro。 | |
| 2:17 | Apply locally，等它重启。 | |

> 📹 **Screen:** "Continue with Gateway" appears on start screen

| Timecode | Line | Note |
|---|---|---|
| 2:25 | 你看，这里没有登录。Continue with Gateway。 | **pause 1 second** |
| 2:30 | 进来了。 | understated |

---

## Part 3 — 3:30 to 5:00: Live Demo — Claude Code CLI

> 📹 **Screen:** Terminal, two export commands, then `claude`

| Timecode | Line | Note |
|---|---|---|
| 3:30 | 如果你喜欢终端，Claude Code CLI 更简单。就两行。 | |
| 3:37 | 第一行，设置 BASE_URL。 | type as you speak |

```bash
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
```

| Timecode | Line | Note |
|---|---|---|
| 3:44 | 第二行，设置 API Key。 | |

```bash
export ANTHROPIC_API_KEY=你的DeepSeek_Key
```

| Timecode | Line | Note |
|---|---|---|
| 3:50 | 输 claude，回车。 | |
| 3:54 | 起来了。 | pause, let it sink in |
| 3:58 | 给它一个任务试试。 | paste task prompt |

> 📹 **Screen:** Paste the Task 1 prompt from demo-project, show it running

```
把项目里所有 console.log 都删掉，顺便把 var 全换成 const 或 let，
不要改业务逻辑，改完告诉我改了哪些文件
```

| Timecode | Line | Note |
|---|---|---|
| 4:10 | 它自己读文件，自己改，自己告诉我结果。 | |
| 4:18 | 国内，DeepSeek，直连，没有任何绕弯。 | |

---

## Part 4 — 5:00 to 6:00: Where to Get the Key + Platform CTA

> 📹 **Screen:** Show platform.deepseek.com registration, then your platform

| Timecode | Line | Note |
|---|---|---|
| 5:00 | API Key 去哪拿？platform.deepseek.com，注册，充值，创建 Key，10 分钟搞定。 | show the page |
| 5:10 | 如果你想同时用 Claude、GPT、Qwen 多个模型，不想管多个账号，我们平台提供统一入口。 | natural mention |
| 5:18 | 链接在简介，一个 Key，所有模型，按量计费。 | |
| 5:25 | 下一期，同一个任务，免费模型、DeepSeek、Claude 三个跑一遍，你来判断差多少。 | hook for ep3 |
| 5:32 | 下期见。 | |

---

## Douyin 60s Cut

| Section | Content | Duration |
|---|---|---|
| Hook | Two lines in terminal, Claude starts | 0:00–0:08 |
| Why | "DeepSeek 官方支持 Anthropic 格式" + show docs | 0:08–0:20 |
| Demo | Config walkthrough 2x speed | 0:20–0:45 |
| Key moment | "Continue with Gateway" — pause 2s | 0:45–0:52 |
| CTA | "Key 在 platform.deepseek.com" | 0:52–0:60 |

---

## The Two Commands — Permanent Reference

**Claude Desktop (GUI):**
```
Gateway Base URL: https://api.deepseek.com/anthropic
API Key: your DeepSeek key
Model: deepseek-v4-pro
```

**Claude Code CLI:**
```bash
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_API_KEY=你的DeepSeek_Key
claude
```

**Make these permanent (add to ~/.zshrc or ~/.bashrc):**
```bash
echo 'export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic' >> ~/.zshrc
echo 'export ANTHROPIC_API_KEY=你的Key' >> ~/.zshrc
source ~/.zshrc
```

---

## Key Filming Note

**This episode is short. Keep it under 6 minutes.**  
The simpler it looks, the more people will try it.  
Every extra step you show = viewers who give up.

The entire value proposition is: **two lines**. Show that clearly and stop.
