# Episode 3 — Voiceover Script
## "Free vs DeepSeek vs Claude — Same Task, You Judge"

**Platform:** Bilibili (8 min) + Douyin cut (60s)
**Format:** Screen recording + voiceover
**Goal:** Convert viewers to paying users. Numbers speak, you don't editorialize.

---

## The Setup

Same project. Same three tasks. Three models.

| Model | How to switch | Cost |
|---|---|---|
| Free (MiMo/Flash in OpenCode) | Built-in, no config | Free |
| DeepSeek V3 满血 | `deepseek-v3` via `api.deepseek.com/anthropic` | ~¥0.001/1K tokens |
| Claude Sonnet | Your platform key | Higher, most capable |

**Switch between models by changing one line:**
```bash
# DeepSeek
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_API_KEY=你的DeepSeek_Key

# Claude (via your platform)
export ANTHROPIC_BASE_URL=https://你的平台域名
export ANTHROPIC_API_KEY=你的平台Key
```

---

## Pre-Recording Checklist

- [ ] demo-project: `npm test` shows 0% coverage (clean state)
- [ ] Free model ready in OpenCode
- [ ] DeepSeek API key configured and tested
- [ ] Claude via your platform tested
- [ ] Record all three model runs BEFORE editing
- [ ] Note the actual token cost shown after each run

---

## The Three Tasks — Copy Paste Exactly

### Task 1 — Simple
```
把项目里所有 console.log 都删掉，顺便把 var 全换成 const 或 let
（有重新赋值的用 let，否则用 const），不要改业务逻辑，
改完告诉我改了哪些文件
```

### Task 2 — Medium
```
读一下 src/utils 目录，帮我给里面所有函数写单元测试，用 Jest，
要覆盖正常情况和边界情况，写完直接跑，告诉我覆盖率多少
```

### Task 3 — Complex
```
帮我做一次完整的安全审计，读所有源码，找出所有安全隐患，
按高/中/低风险分级，每个问题给出：问题描述、影响范围、修复代码。
最后给一个总结报告
```

---

## Expected Results (for reference)

| | Free Model | DeepSeek V3 | Claude Sonnet |
|---|---|---|---|
| Task 1 — const/let judgment | All → const (wrong) | Correct distinction | Correct + explains |
| Task 2 — coverage | ~45–55% | ~65–75% | ~80–90% |
| Task 3 — issues found | 3–4 | 6–7 | 8–9 |
| Task 3 — report format | Plain list | Structured | Markdown, ready to file |
| Finds validateUsername bug | ❌ | Maybe | ✅ |

---

## Opening — 0:00 to 0:30

> 📹 **Screen:** Show Task 2 coverage numbers side by side — 50% / 72% / 85%

| Timecode | Line | Note |
|---|---|---|
| 0:00 | 上期装好了。这期做个实验。 | |
| 0:05 | 同一个项目，同一个任务，三个模型跑一遍。 | |
| 0:11 | 免费模型、DeepSeek V3、Claude Sonnet。 | |
| 0:17 | 你来判断差多少，值不值得付费。 | no leading |

---

## Part 1 — 0:30 to 2:30: Task 1 — The Subtle Difference

> 📹 **Screen:** Run Task 1 with free model, zoom in on the diff

| Timecode | Line | Note |
|---|---|---|
| 0:30 | 任务一，删 console.log，顺便规范变量声明。简单任务。 | |
| 0:38 | 免费模型跑完了，改了 4 个文件。 | |
| 0:44 | 注意这里——所有 var 都换成了 const。 | zoom in |
| 0:50 | 但有几个变量有重新赋值，应该是 let。 | point at specific line |
| 0:56 | 它没区分，全换 const。能跑，但不够准确。 | |

> 📹 **Screen:** Run same task with DeepSeek V3

| Timecode | Line | Note |
|---|---|---|
| 1:10 | DeepSeek V3，同样的任务。 | |
| 1:15 | 你看——有重赋值的用 let，其他用 const。 | point at diff |
| 1:22 | 它理解了代码的意图，不只是执行规则。 | |

---

## Part 2 — 2:30 to 5:30: Task 2 — The Numbers

> 📹 **Screen:** Run Task 2 with each model, show coverage report after each

| Timecode | Line | Note |
|---|---|---|
| 2:30 | 任务二，给 utils 目录所有函数写单元测试。15 个函数，三个文件。 | |
| 2:40 | 免费模型。 | run, wait, show result |
| 2:55 | 覆盖率：53%。 | **freeze on number** |
| 3:02 | DeepSeek V3。 | run |
| 3:15 | 72%。 | **freeze** |
| 3:20 | Claude Sonnet。 | run |
| 3:38 | 85%。 | **freeze** |
| 3:44 | 53、72、85。 | say slowly, pause after |
| 3:52 | 还有一个细节。 | |
| 3:56 | 这个项目里有一个 bug——validateUsername 的逻辑写反了。 | show the code |
| 4:04 | 正常用户名应该返回 true，它返回 false。 | |
| 4:10 | 免费模型：没发现，测试写错了，还通过了。 | show test |
| 4:18 | Claude：发现了，写了一个预期失败的测试，标注了原因。 | show Claude's test |
| 4:26 | 这就是差距。 | **pause 2 seconds** |

---

## Part 3 — 5:30 to 7:00: Task 3 — The Clearest Gap

> 📹 **Screen:** Run Task 3, show the three reports

| Timecode | Line | Note |
|---|---|---|
| 5:30 | 任务三，安全审计。这个差距最明显。 | |
| 5:37 | 免费模型：发现 3 个问题。 | freeze |
| 5:42 | DeepSeek V3：7 个。 | freeze |
| 5:47 | Claude Sonnet：9 个，3 个高危。 | freeze |
| 5:54 | 3、7、9。 | pause |
| 6:00 | 免费模型漏掉了这个—— | show auth.js line |
| 6:04 | 登录接口把含密码的请求体打印到日志，高危漏洞。 | |
| 6:12 | 再看报告格式。 | |

> 📹 **Screen:** Show Claude's security report full screen — let it speak

| Timecode | Line | Note |
|---|---|---|
| 6:18 | 这是 Claude 的报告。有目录，分级清晰，每个问题有修复代码。 | |
| 6:26 | 可以直接发给 leader 看。 | **pause 2 seconds** |

---

## Ending — 7:00 to 8:00: Cost + CTA

> 📹 **Screen:** Show actual token cost from your platform or DeepSeek dashboard

| Timecode | Line | Note |
|---|---|---|
| 7:00 | 最后说费用。跑完这三个任务，DeepSeek V3 花了多少钱。 | |
| 7:08 | [实际数字] 元。 | **freeze on number** |
| 7:14 | 这些任务，[X] 毛钱。 | let it land |
| 7:20 | 免费模型够入门，DeepSeek 够日常，Claude 做重要项目。 | |
| 7:27 | 你在哪个阶段，用哪个。 | no pressure |
| 7:32 | DeepSeek Key 去 platform.deepseek.com 拿。想统一管理多个模型的，我们平台链接在简介。 | |
| 7:40 | 下期讲进阶用法。关注一下不迷路。 | |

---

## Douyin 60s Cut

| Section | Content | Duration |
|---|---|---|
| Hook | "53、72、85" — three numbers appear | 0:00–0:08 |
| Task 2 | Coverage numbers one by one | 0:08–0:22 |
| Task 3 | "3个、7个、9个安全问题" | 0:22–0:36 |
| Report | Claude's markdown report full screen, 2s pause | 0:36–0:46 |
| Cost | "[X]毛钱" frozen on screen | 0:46–0:53 |
| CTA | "platform.deepseek.com 拿 Key" | 0:53–0:60 |

---

## Three Rules for This Episode

**Rule 1: Never say "免费模型很烂."**
Always: "免费模型够用，但这个任务超出了它的边界。"
Viewer draws the conclusion. More persuasive.

**Rule 2: Four moments of silence.**
- After "53、72、85" — 2 seconds
- After "这就是差距" — 2 seconds
- After showing Claude's report — 2 seconds
- After revealing the cost — 2 seconds
No music. No transition. Just the numbers.

**Rule 3: Show the real cost number.**
Whatever it actually costs — show it.
A surprisingly low number is your best advertisement.
