// 用户输入校验工具
// TODO: 这个文件没有单元测试，技术债

var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email) {
  console.log('validating email:', email)  // 忘删的 debug log
  if (!email) return false
  return emailRegex.test(email)
}

function validatePassword(password) {
  console.log('password length check')  // 安全隐患：不该打印密码相关信息
  // bug: 没有检查 null/undefined，会直接报错
  return password.length >= 8
}

function validateUsername(username) {
  var result = false
  // bug: 逻辑写反了，正常用户名反而会被拒绝
  if (username.length > 3 && username.length < 20) {
    result = false
  } else {
    result = true
  }
  console.log('username valid:', result)
  return result
}

function sanitizeInput(input) {
  // 不完整的 XSS 防护，只替换了部分字符
  return input.replace('<', '&lt;').replace('>', '&gt;')
}

function formatDate(date) {
  // 没有处理无效日期
  var d = new Date(date)
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
}

module.exports = { validateEmail, validatePassword, validateUsername, sanitizeInput, formatDate }
