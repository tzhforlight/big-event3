const jwt = require('jsonwebtoken')

// JWT验证中间件 - 从Cookie获取token
const authenticateToken = (req, res, next) => {
  // 从Cookie中获取token
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({
      message: '访问令牌缺失',
    })
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.user = decoded // 将解码的用户信息附加到请求对象
    next() // 继续执行下一个中间件
  } catch (error) {
    console.error('JWT验证错误:', error)
    // 如果token无效，清除Cookie
    res.clearCookie('token', {
      path: '/api',
      sameSite: 'lax',
    })
    return res.status(403).json({
      message: '访问令牌无效或已过期',
    })
  }
}

module.exports = { authenticateToken }
