const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/User')

const userController = {
  // 更新用户信息
  async updateUserInfo(req, res) {
    try {
      // 检查验证错误
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message:
            errors
              .array()
              .map((e) => e.msg)
              .join(', ') + '，请检查输入数据并重新提交。',
          errors: errors.array(),
        })
      }

      // 从JWT令牌中获取用户ID
      const userId = req.user.userId

      // 获取请求体中的更新字段
      const { nickname, email } = req.body

      // 准备更新数据
      const updateData = {}

      // 只添加非undefined的字段
      if (nickname !== undefined) updateData.nickname = nickname
      if (email !== undefined) updateData.email = email
      // if (avatar !== undefined) updateData.avatar = avatar

      // 如果更新密码，需要加密
      // if (password !== undefined && password) {
      //   updateData.password = await bcrypt.hash(password, 10)
      // }

      // 执行更新
      await User.update(userId, updateData)

      // 获取更新后的用户信息
      const updatedUser = await User.findById(userId)

      res.json({
        message: '用户信息更新成功',
        data: {
          id: updatedUser.id,
          username: updatedUser.username,
          nickname: updatedUser.nickname || '',
          email: updatedUser.email || '',
          // avatar: updatedUser.avatar || '',
        },
      })
    } catch (error) {
      console.error('更新用户信息错误:', error)
      res.status(500).json({
        message: '更新用户信息失败，请稍后重试',
      })
    }
  },

  // 用户注册
  async register(req, res) {
    try {
      // 检查验证错误
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: '输入数据验证失败',
          errors: errors.array(),
        })
      }

      const { username, password } = req.body

      // 检查用户名是否已存在
      const existingUser = await User.findByUsername(username)
      if (existingUser) {
        return res.status(409).json({
          message: '用户名已存在',
        })
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10)

      // 创建新用户
      const userId = await User.create({
        username,
        password: hashedPassword,
      })

      res.status(201).json({
        message: '用户注册成功',
        data: {
          id: userId,
          username,
        },
      })
    } catch (error) {
      console.error('注册错误:', error)
      res.status(500).json({
        message: '注册失败，请稍后重试',
      })
    }
  },

  // 用户登录
  async login(req, res) {
    try {
      // 检查验证错误
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: '输入数据验证失败',
          errors: errors.array(),
        })
      }

      const { username, password } = req.body

      // 查找用户
      const user = await User.findByUsername(username)
      if (!user) {
        return res.status(401).json({
          message: '用户名或密码错误',
        })
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({
          message: '用户名或密码错误',
        })
      }

      // 生成JWT令牌
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' },
      )

      // 设置HttpOnly Cookie存储token
      res.cookie('token', token, {
        httpOnly: true, // 防止XSS攻击，禁止JavaScript访问
        secure: process.env.NODE_ENV === 'production', // 生产环境使用HTTPS
        sameSite: 'lax', // 防止CSRF攻击
        maxAge: 24 * 60 * 60 * 1000, // 24小时过期
        path: '/api', // 只在/api路径下发送
      })

      // 响应体中不再包含token和敏感信息
      // 直接创建安全的用户信息对象，不使用解构赋值以避免变量重复声明
      const safeUser = {
        // id: user.id,
        username: user.username,
        email: user.email || '',
        nickname: user.nickname || '',
        avatar: user.avatar || '',
      }

      // 移除敏感信息后返回用户数据，不返回token
      res.json({
        message: '登录成功',
        user: safeUser,
      })
    } catch (error) {
      console.error('登录错误:', error)
      res.status(500).json({
        message: '登录失败，请稍后重试',
      })
    }
  },

  // 获取用户信息
  async getUserInfo(req, res) {
    try {
      // 从JWT令牌中获取用户ID
      const userId = req.user.userId

      // 查找用户信息
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({
          message: '用户不存在',
        })
      }

      res.json({
        message: '获取用户信息成功',
        data: {
          id: user.id,
          username: user.username,
          email: user.email || '',
          nickname: user.nickname || '',
          avatar: user.avatar || '',
          createTime: user.create_time,
        },
      })
    } catch (error) {
      console.error('获取用户信息错误:', error)
      res.status(500).json({
        message: '获取用户信息失败，请稍后重试',
      })
    }
  },

  // 更新用户头像
  async updateUserAvatar(req, res) {
    try {
      // 从JWT令牌中获取用户ID
      const userId = req.user.userId
      console.log('用户ID:', userId)

      // 检查是否有文件上传
      if (!req.file) {
        return res.status(400).json({
          message: '请选择要上传的头像文件',
        })
      }

      console.log('上传的文件信息:', req.file)

      // 构建头像URL路径（相对于服务器地址）
      // 注意：这里使用/uploads作为静态文件路径，与server.js中的配置保持一致
      const avatarUrl = `/uploads/${req.file.filename}`
      console.log('构建的头像URL:', avatarUrl)

      // 准备更新数据
      const updateData = { avatar: avatarUrl }

      // 执行更新
      console.log('准备更新用户头像...')
      await User.update(userId, updateData)
      console.log('用户头像更新成功')

      // 获取更新后的用户信息
      console.log('获取更新后的用户信息...')
      const updatedUser = await User.findById(userId)

      if (!updatedUser) {
        return res.status(404).json({
          message: '用户不存在',
        })
      }

      res.json({
        message: '用户头像更新成功',
        data: {
          id: updatedUser.id,
          username: updatedUser.username,
          avatar: updatedUser.avatar || '',
        },
      })
    } catch (error) {
      console.error('更新用户头像错误:', error.message)
      console.error('错误堆栈:', error.stack)

      // 如果是multer上传错误，返回更具体的错误信息
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: '文件大小超过限制，最大允许5MB',
        })
      } else if (error.message.includes('只允许上传图片文件')) {
        return res.status(400).json({
          message: error.message,
        })
      }

      res.status(500).json({
        message: '更新用户头像失败，请稍后重试',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      })
    }
  },

  // 更新用户密码
  async updatePassword(req, res) {
    try {
      // 检查验证错误
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message:
            errors
              .array()
              .map((e) => e.msg)
              .join(', ') + '，请检查输入数据并重新提交。',
          errors: errors.array(),
        })
      }

      // 从JWT令牌中获取用户ID
      const userId = req.user.userId

      // 获取请求体中的密码字段
      const { old_pwd, new_pwd } = req.body

      // 验证字段是否存在
      if (!old_pwd || !new_pwd) {
        return res.status(400).json({
          message: '旧密码和新密码不能为空',
        })
      }
      const currentUser = await User.findById(userId)
      if (!currentUser) {
        return res.status(404).json({
          message: '用户不存在',
        })
      }

      // 验证旧密码是否正确
      const isOldPasswordValid = await bcrypt.compare(old_pwd, currentUser.password)
      if (!isOldPasswordValid) {
        return res.status(400).json({
          message: '原密码输入错误',
        })
      }

      // 验证新密码格式
      if (new_pwd.length < 6) {
        return res.status(400).json({
          message: '新密码长度至少为6个字符',
        })
      }

      // 新密码不能与旧密码相同
      if (old_pwd === new_pwd) {
        return res.status(400).json({
          message: '新密码不能与原密码相同',
        })
      }

      // 加密新密码
      const hashedPassword = await bcrypt.hash(new_pwd, 10)

      // 准备更新数据
      const updateData = { password: hashedPassword }

      // 执行更新
      await User.update(userId, updateData)

      res.json({
        message: '密码修改成功',
        data: {
          id: currentUser.id,
          username: currentUser.username,
        },
      })
    } catch (error) {
      console.error('更新用户密码错误:', error)
      res.status(500).json({
        message: '更新用户密码失败，请稍后重试',
      })
    }
  },
}

module.exports = userController
