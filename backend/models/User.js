const { pool } = require('../config/database')

class User {
  // 根据用户名查找用户
  static async findByUsername(username) {
    try {
      const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username])
      return rows[0] || null
    } catch (error) {
      console.error('查找用户错误:', error)
      throw error
    }
  }

  // 根据ID查找用户（包含密码字段用于验证）
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, password, nickname, email, avatar, created_at, updated_at FROM users WHERE id = ?',
        [id],
      )
      return rows[0] || null
    } catch (error) {
      console.error('查找用户错误:', error)
      throw error
    }
  }

  // 创建新用户
  static async create(userData) {
    try {
      const { username, password } = userData
      const [result] = await pool.execute(
        'INSERT INTO users (username, password, created_at) VALUES (?, ?, NOW())',
        [username, password],
      )
      return result.insertId
    } catch (error) {
      console.error('创建用户错误:', error)
      throw error
    }
  }

  // 更新用户信息
  static async update(id, updateData) {
    try {
      // 构建更新语句
      const fields = []
      const values = []

      if (updateData.nickname !== undefined) {
        fields.push('nickname = ?')
        values.push(updateData.nickname)
      }

      if (updateData.email !== undefined) {
        fields.push('email = ?')
        values.push(updateData.email)
      }

      if (updateData.avatar !== undefined) {
        fields.push('avatar = ?')
        values.push(updateData.avatar)
      }

      if (updateData.password !== undefined) {
        fields.push('password = ?')
        values.push(updateData.password)
      }

      // 如果没有要更新的字段，直接返回
      if (fields.length === 0) {
        return
      }

      // 添加用户ID到参数列表
      values.push(id)

      await pool.execute(
        `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
        values,
      )
    } catch (error) {
      console.error('更新用户信息错误:', error)
      throw error
    }
  }

  // 初始化用户表（如果不存在）
  static async initTable() {
    try {
      // 首先检查表是否存在，然后添加缺少的字段
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          nickname VARCHAR(50),
          email VARCHAR(100),
          avatar VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)

      // 尝试添加缺失的字段（如果表已存在但缺少字段）
      try {
        await pool.execute('ALTER TABLE users ADD COLUMN nickname VARCHAR(50)')
      } catch (e) {
        // 字段已存在时忽略错误
      }

      try {
        await pool.execute('ALTER TABLE users ADD COLUMN email VARCHAR(100)')
      } catch (e) {
        // 字段已存在时忽略错误
      }

      try {
        await pool.execute('ALTER TABLE users ADD COLUMN avatar VARCHAR(255)')
      } catch (e) {
        // 字段已存在时忽略错误
      }

      console.log('用户表初始化成功')
    } catch (error) {
      console.error('初始化用户表错误:', error)
      throw error
    }
  }
}

module.exports = User
