// 用户服务模块
// 负责用户注册流程的校验和处理

const { validateEmail, validatePassword, validateUserName } = require('./validator')
//                                        ↑ Bug 1（表面）：函数名拼错
//                                          正确应该是 validateUsername
//                                          Cline 会看到报错，修成 validateUsername，认为搞定了

/**
 * 注册新用户
 */
function registerUser(username, email, password) {
  if (!validateEmail(email)) {
    return { success: false, error: '邮箱格式不正确' }
  }

  if (!validatePassword(password)) {
    return { success: false, error: '密码至少需要8位' }
  }

  // Bug 2（隐藏）：参数传反了，把 email 传给了 validateUsername
  // validateUsername 检查长度 3-20，email 也在这个范围内所以不会报错
  // 但真正的 username 根本没被校验，逻辑完全混乱
  // 这个 bug 修完 Bug 1 之后代码能跑，但结果是错的
  if (!validateUserName(email, username)) {
    //              ↑ 修完 Bug 1 后变成 validateUsername(email, username)
    //                validateUsername 只用第一个参数，传的是 email
    //                导致：超长 username 能注册，空 username 也能注册
    return { success: false, error: '用户名格式不正确' }
  }

  return {
    success: true,
    user: { username, email, createdAt: new Date().toISOString() }
  }
}

function validateUserList(users) {
  return users.map(user => ({
    email: user.email,
    username: user.username,
    valid: registerUser(user.username, user.email, user.password).success,
    result: registerUser(user.username, user.email, user.password)
  }))
}

module.exports = { registerUser, validateUserList }
