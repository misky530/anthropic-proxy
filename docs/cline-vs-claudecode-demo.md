# Cline vs Claude Code — Side-by-Side Comparison Demo
## Same Model, Same Bug, Completely Different Results

**Video placement:** Episode 1, Part 2 (3:00–5:00) — "How It Differs from Other Tools"  
**Screen layout:** Left = Cline + DeepSeek V2, Right = Claude Code + DeepSeek V2  
**Key message:** The model is not the variable. The tool's working method is.

---

## The Bug Scenario

**File:** `src/utils/userService.js`  
**Symptom:** Running the test suite crashes with `TypeError: validateUserName is not a function`

### Layer 1 — Surface Bug (Cline will fix this)
```javascript
// WRONG — function name is misspelled
const { validateEmail, validatePassword, validateUserName } = require('./validator')
//                                        ↑ Should be: validateUsername
```
Cline sees the TypeError, fixes the function name, reports "done."  
**The code now runs. But it's still broken.**

### Layer 2 — Hidden Bug (only caught by running tests)
```javascript
// WRONG — arguments are in the wrong order
if (!validateUsername(email, username)) {
//                    ↑ passing email where username should go
//   validateUsername only uses the first argument
//   Result: email string passes username validation
//   Real username is NEVER checked
```

**What this means after Cline's "fix":**
- Empty username → registers successfully ⚠️
- 30-character username → registers successfully ⚠️  
- 2-character username → registers successfully ⚠️
- Normal username "张三" → **rejected** ⚠️ (completely backwards)

The user validation is 100% broken. Cline never found out because it never ran the tests.

---

## Recording Setup

### What you need open simultaneously

**Left screen — Cline:**
- Cline extension in VS Code
- Model: DeepSeek V2 (or V2.5)
- Project: demo-project open
- Terminal showing: `npm test` output (5 failures)

**Right screen — Claude Code / Claude Desktop:**
- Claude Desktop, Code tab, connected to your gateway
- Same project: demo-project
- Same terminal view

### Starting state (confirm before recording)
```bash
cd demo-project
npm test -- --testPathPattern=userService
```

Expected output:
```
FAIL src/utils/userService.test.js
  ✕ 正常用户注册成功        ← TypeError: validateUserName is not a function
  ✓ 邮箱格式错误时拒绝
  ✕ 用户名过短时拒绝
  ✕ 空用户名时拒绝
  ✕ 超长用户名时拒绝
  ✕ 批量校验返回正确结果

Tests: 5 failed, 2 passed, 7 total
```

This is your opening frame. Both sides start here.

---

## Exact Prompts — Copy Paste, Do Not Retype

### Prompt for Cline (left screen)
```
src/utils/userService.js 里有一个 bug 导致测试失败，
错误信息是 TypeError: validateUserName is not a function
请帮我修复这个 bug
```

### Prompt for Claude Code (right screen)
```
src/utils/userService.js 里有 bug，运行 npm test 会报错，
请自己找到问题，修复，然后跑测试确认全部通过
```

**Key difference in the prompts:**
- Cline prompt: tells it exactly what the error is (simulating what a developer would do)
- Claude Code prompt: tells it the goal, not the error (Agentic mode)

---

## Expected Behavior

### Cline (left screen)
```
Step 1: Reads userService.js
Step 2: Finds "validateUserName" — not exported from validator.js
Step 3: Changes it to "validateUsername"
Step 4: Reports: "Fixed the bug. The function name was misspelled."
Step 5: STOPS. Never runs the tests.

Result: Code appears fixed. Tests still fail on 4 out of 7 cases.
```

**The moment to capture on camera:**  
After Cline says "done", you run `npm test` manually.  
5 tests still fail. The hidden bug is still there.  
**Freeze on this failure output for 2 seconds.**

### Claude Code (right screen)
```
Step 1: Reads userService.js
Step 2: Finds "validateUserName" — fixes function name
Step 3: RUNS npm test automatically
Step 4: Sees 4 tests still failing
Step 5: Reads the failures — notices argument order is wrong
Step 6: Fixes: validateUsername(email, username) → validateUsername(username)
Step 7: RUNS npm test again
Step 8: All 7 tests pass ✅
Step 9: Reports: "Fixed two issues: 1) function name, 2) argument order"
```

**The moment to capture on camera:**  
All 7 tests pass. Coverage report appears.  
**Freeze on "7 passed" for 2 seconds.**

---

## The Numbers Side by Side

| | Cline | Claude Code |
|---|---|---|
| Bug 1 found | ✅ | ✅ |
| Bug 2 found | ❌ | ✅ |
| Tests run automatically | ❌ | ✅ |
| Final test result | 5 failed, 2 passed | 7 passed, 0 failed |
| Ready to ship | ❌ No | ✅ Yes |
| Model used | DeepSeek V2 | DeepSeek V2 |

**Same model. Same bug. Completely different outcome.**

---

## Voiceover Script for This Segment

| Timecode | Line | Note |
|---|---|---|
| 3:00 | 来，做个真实对比。左边 Cline，右边 Claude Code，同一个模型，同一个 bug。 | show both screens |
| 3:10 | 先看测试结果——5 个失败，2 个通过。这是起点。 | freeze on test output |
| 3:17 | 给两个工具同样的任务：修复这个 bug。同时开始。 | paste both prompts |
| 3:25 | Cline 找到了——函数名拼错了，改过来，说修好了。 | show Cline output |
| 3:33 | 我跑一下测试看看。 | run npm test on left |
| 3:37 | 还是 5 个失败。 | **freeze 2 seconds** |
| 3:42 | 它修完就停了，从来没跑过测试。 | |
| 3:48 | 右边，Claude Code。它改完函数名之后，自己跑了测试。 | show right screen |
| 3:55 | 发现还有问题——参数顺序传反了。继续修。 | |
| 4:02 | 再跑一次测试。 | |
| 4:06 | 7 个全过。 | **freeze 2 seconds** |
| 4:12 | 同一个模型。左边交付的是一个还在报错的代码，右边交付的是通过所有测试的代码。 | |
| 4:22 | 工具的差距，有时候比模型的差距更大。 | **pause 1 second** |

---

## Filming Notes

**Most important frame:** Side-by-side at 3:37  
Left: `5 failed, 2 passed`  
Right: `7 passed, 0 failed`  
Same model. Let the numbers sit for 3 seconds before continuing.

**Do not editorialize.** Don't say "Cline is bad."  
Say "它修完就停了" — factual, not judgmental.  
The viewer draws their own conclusion. That's more persuasive.

**If Cline actually runs the tests** (behavior may vary):  
That's fine — it means the hidden bug is even harder to detect.  
Adjust the voiceover: "它跑了测试，但没发现第二个问题" and show which tests still fail.

**Recording order:**  
Record Cline first (shorter, finishes faster).  
Then record Claude Code (longer process, more steps to capture).  
Edit together in post.

---

## Files Involved

| File | Purpose |
|---|---|
| `src/utils/userService.js` | Contains both bugs — the demo target |
| `src/utils/userService.test.js` | 7 tests — Claude Code uses these to verify |
| `src/utils/validator.js` | Has `validateUsername` (correct name) |

---

*AI Coding Gateway Series · Episode 1 Comparison Demo*
