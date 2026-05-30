const express = require('express')
const jwt = require('jsonwebtoken')
const { validateEmail, validatePassword } = require('../utils/validator')

const router = express.Router()
const SECRET = 'hardcoded-secret-very-bad'  // bug: 密钥硬编码

// 模拟用户数据库
const users = [
  { id: 1, email: 'test@example.com', password: 'password123', role: 'user' },
  { id: 2, email: 'admin@example.com', password: 'admin123', role: 'admin' }
]

// 登录接口 - 有 bug：密码明文存储、没有 bcrypt
router.post('/login', (req, res) => {
  console.log('login attempt:', req.body)  // bug: 打印了请求体（含密码）

  const { email, password } = req.body

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  // bug: 没有校验 password
  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    // bug: 应该返回 401，这里返回了 400，导致前端判断混乱
    return res.status(400).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '1h' })
  res.json({ token, userId: user.id })
})

// 获取用户信息 - 认证中间件缺失
router.get('/profile', (req, res) => {
  // bug: 没有验证 token，任何人都能访问
  const userId = req.query.userId
  const user = users.find(u => u.id === parseInt(userId))
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ id: user.id, email: user.email, role: user.role })
})

module.exports = router
