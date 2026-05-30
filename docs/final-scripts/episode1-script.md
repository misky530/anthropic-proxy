# Episode 1 — Voiceover Script
## "I Said One Sentence, It Rewrote the Entire Project"

**Platform:** Bilibili (8 min) + Douyin cut (60s)  
**Format:** Screen recording + voiceover (no on-camera)  
**Goal:** Awareness. Make viewers feel "I need to try this." Convert to: follow account.

---

## Pre-Recording Checklist

- [ ] demo-project open in terminal, `npm test` showing 0% coverage
- [ ] OpenCode or Claude Desktop ready with API connected
- [ ] Screen resolution 1920×1080, font size increased to 150%
- [ ] Quiet room, microphone tested
- [ ] Record screen first, voiceover after

---

## Opening — 0:00 to 0:30 (Screen only, NO voiceover)

> 📹 **Screen:** Open terminal in demo-project. Paste this exact prompt and press Enter:
>
> ```
> 读一下 src 目录，帮我给 utils 里所有函数写单元测试，用 Jest，跑完告诉我覆盖率
> ```
>
> Speed up 4x: AI reads files → writes tests → runs Jest → coverage report appears.  
> **Freeze on the coverage numbers.**

**Captions (no voiceover):**
- 0:00 — `「我只说了一句话」`
- 0:15 — `「它自己干了这些」`
- 0:28 — `「这不是剪辑」`

---

## Part 1 — 0:30 to 3:00: What Is It

> 📹 **Screen:** Stay in terminal, show the output while talking

| Timecode | Line | Note |
|---|---|---|
| 0:30 | 先说清楚它是什么。 | pause 0.5s |
| 0:34 | Claude Code，Anthropic 出的，跑在终端里的 AI 编程工具。 | |
| 0:40 | 注意，它不是 Cursor，不是 Copilot。 | emphasize |
| 0:44 | Cursor 是帮你补全代码——你还是在写，它在旁边给建议。 | |
| 0:50 | Claude Code 是另一种东西。你告诉它目标，它自己决定怎么做。 | |
| 0:57 | 读哪些文件，改哪里，怎么测试，它全自己来。你只管最后验收。 | |
| 1:05 | 这叫 Agentic 模式，AI 编程的下一个阶段。 | pause 1s |

> 📹 **Screen:** Show the coverage report from the opening demo

| Timecode | Line | Note |
|---|---|---|
| 1:15 | 你看，我就给了它一句话—— | slow down |
| 1:18 | 「读一下 src 目录，帮我给 utils 里所有函数写单元测试，用 Jest，跑完告诉我覆盖率」 | read slowly, caption syncs |
| 1:28 | 然后它开始自己读文件。 | |
| 1:32 | 自己分析每个函数，自己写测试，自己跑，最后告诉我覆盖率 78%。 | |
| 1:40 | 我没写一行测试。 | **pause 2 seconds — most powerful line in the video** |

---

## Part 2 — 3:00 to 5:00: How It Differs from Other Tools

> 📹 **Screen:** Show a simple split caption or text comparison

| Timecode | Line | Note |
|---|---|---|
| 3:00 | 来，我做个对比，让你感受一下区别在哪。 | |
| 3:05 | Cursor、Copilot 这类工具——你是司机，它是副驾驶。 | |
| 3:11 | 它给建议，你决定要不要，代码还是你一行行写。 | |
| 3:17 | Claude Code——你说目的地，它自己开车。 | pause |
| 3:22 | 你等它到了，看一眼没跑偏，完事。 | |
| 3:27 | 不是说哪个更好，是两种完全不同的工作方式。 | |
| 3:33 | 如果你还没试过 Agentic 模式，你真的应该试试。 | genuine, not sales-y |

> 📹 **Screen:** Paste the bug-finding prompt, show AI locating the file on its own

```
登录接口报 401，帮我找原因，自己看代码、自己跑测试，修好了告诉我改了哪里
```

| Timecode | Line | Note |
|---|---|---|
| 3:45 | 你看这个，我告诉它登录接口有 bug，没有说在哪个文件。 | |
| 3:51 | 它自己去找，自己定位，自己改，然后告诉我改了哪里。 | |
| 3:58 | 这个体验跟补全代码完全是两回事。 | |

---

## Part 3 — 5:00 to 7:00: Three Real Scenarios

> 📹 **Screen:** Show the coverage numbers, the bug fix diff, the security report

| Timecode | Line | Note |
|---|---|---|
| 5:00 | 给你看三个真实用法。 | speed up slightly |
| 5:04 | 有人用它一天重构了一个烂了三年的老项目。 | |
| 5:09 | 有人用它帮产品经理直接生成可运行的原型，不用写一行代码。 | |
| 5:15 | 有人用它把单元测试覆盖率从 20% 提到 80%，自己没写一行。 | |
| 5:22 | 这些不是段子，是真实的工作流。 | |

---

## Ending — 7:00 to 8:00: Hook for Episode 2

> 📹 **Screen:** Show Claude Desktop briefly — the "Continue with Gateway" screen

| Timecode | Line | Note |
|---|---|---|
| 7:00 | 好消息。 | pause |
| 7:03 | 国内用这个工具，原来有两个障碍——账号和 API。 | |
| 7:09 | Anthropic 在今年四月，官方解决了这个问题。 | |
| 7:15 | Claude 官方客户端现在支持第三方推理，不需要登录，不需要海外账号。 | |
| 7:22 | 下一期，我手把手带你配好它，10 分钟跑起来，国内直连。 | |
| 7:28 | 安装包在简介，先下载着，下期见。 | clean ending |

---

## Douyin 60s Cut

| Section | Content | Duration |
|---|---|---|
| Hook | Coverage numbers frozen on screen, caption "我只说了一句话" | 0:00–0:08 |
| Core | "它不是 Cursor，不是 Copilot" → "我没写一行测试" [2s pause] | 0:08–0:30 |
| Scenario | Three real scenarios, fast | 0:30–0:45 |
| CTA | "下一期，手把手带你配好它，10 分钟跑起来" | 0:45–0:60 |

---

## Key Filming Notes

**The single most important moment:** `1:40 — 「我没写一行测试。」`  
Say it. Stop. Say nothing for 2 seconds. Let the coverage numbers on screen do the work.  
Do not add music. Do not add a transition. Just silence.

**Tone throughout:** You're telling a friend about something cool you found, not teaching a class.  
Replace "大家好，今天我们来介绍" with just starting on the content.

**Pace:** Fast overall, but slow down on the prompt text at 1:18 and on "我没写一行测试" at 1:40.  
Contrast in pace = contrast in emphasis.
