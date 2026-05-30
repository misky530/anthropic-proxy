// userService 单元测试
// 这个文件是 Claude Code 用来验证修复结果的

const { registerUser, validateUserList } = require('./userService')

describe('registerUser', () => {
  test('正常用户注册成功', () => {
    const result = registerUser('张三', 'zhangsan@example.com', 'password123')
    expect(result.success).toBe(true)
    expect(result.user.username).toBe('张三')
  })

  test('邮箱格式错误时拒绝', () => {
    const result = registerUser('张三', 'not-an-email', 'password123')
    expect(result.success).toBe(false)
    expect(result.error).toContain('邮箱')
  })

  test('密码过短时拒绝', () => {
    const result = registerUser('张三', 'test@example.com', '123')
    expect(result.success).toBe(false)
    expect(result.error).toContain('密码')
  })

  test('用户名过短时拒绝（少于3字符）', () => {
    const result = registerUser('ab', 'test@example.com', 'password123')
    expect(result.success).toBe(false)
    expect(result.error).toContain('用户名')
  })

  test('空用户名时拒绝', () => {
    const result = registerUser('', 'test@example.com', 'password123')
    expect(result.success).toBe(false)
  })

  test('超长用户名时拒绝（超过20字符）', () => {
    const result = registerUser('x'.repeat(25), 'test@example.com', 'password123')
    expect(result.success).toBe(false)
  })
})

describe('validateUserList', () => {
  test('批量校验返回正确结果', () => {
    const users = [
      { username: '王五', email: 'wangwu@example.com', password: 'pass12345' },
      { username: 'ab', email: 'short@example.com', password: 'pass12345' },
    ]
    const results = validateUserList(users)
    expect(results[0].valid).toBe(true)
    expect(results[1].valid).toBe(false)
  })
})
