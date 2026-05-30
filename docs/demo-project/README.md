# AI Coding Gateway 演示项目

这是一个 Node.js 后端服务，包含用户认证、价格计算、输入校验等功能模块。
项目存在若干技术债和 Bug，专门用于演示 AI 编程工具的能力。

## 项目结构

```
src/
├── index.js              # Express 服务器入口
├── api/
│   └── auth.js           # 登录认证接口
└── utils/
    ├── validator.js       # 输入校验（email、密码、用户名）
    ├── calculator.js      # 价格计算（折扣、税费、合计）
    └── helpers.js         # 通用工具（ID生成、数组处理等）
```

## 快速开始

```bash
npm install
npm start        # 启动服务，端口 3000
npm test         # 运行测试 + 查看覆盖率
```

## 已知问题（技术债清单）

### 代码规范
- 所有工具函数使用 `var` 而非 `const/let`
- 多处遗留 `console.log` 调试语句（validator.js、calculator.js、helpers.js、auth.js）

### Bug 清单
| 文件 | 函数 | 问题描述 |
|------|------|---------|
| validator.js | `validatePassword` | 未处理 null/undefined，直接调用 .length 会报错 |
| validator.js | `validateUsername` | 逻辑写反：正常用户名（3-20字符）返回 false |
| validator.js | `sanitizeInput` | XSS 防护不完整，只替换了 `<` 和 `>` 的第一次出现 |
| calculator.js | `applyDiscount` | 折扣率无范围校验，传入 >100 会让金额变负数 |
| calculator.js | `formatCurrency` | 未处理非数字输入，会直接报错 |
| helpers.js | `chunk` | size <= 0 时死循环，程序卡死 |
| auth.js | `/login` | 登录失败返回 400，应该是 401 |
| auth.js | `/login` | console.log 打印了包含密码的 req.body |
| auth.js | `/profile` | 未验证 token，任何人都能访问 |

### 安全隐患
- JWT 密钥硬编码为字符串常量
- 密码明文存储和比对（未使用 bcrypt）
- 登录接口打印含密码的请求体

### 缺少测试
- utils 目录下所有函数均无单元测试
- 当前测试覆盖率：0%
