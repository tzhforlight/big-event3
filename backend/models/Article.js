const { pool } = require('../config/database')

class Article {
  // 获取所有文章列表
  static async getAllArticles(params = {}) {
    try {
      let sql = `
        SELECT a.id, a.title, a.content, a.img, a.pub_date, a.state, 
               ac.cate_name, ac.cate_alias, ac.id as cate_id
        FROM articles a
        LEFT JOIN article_categories ac ON a.cate_id = ac.id
      `

      const conditions = []
      const values = []

      // 添加筛选条件 - 确保所有参数类型正确
      if (params.cate_id) {
        conditions.push('a.cate_id = ?')
        values.push(parseInt(params.cate_id))
      }

      if (params.state !== undefined) {
        conditions.push('a.state = ?')
        values.push(parseInt(params.state))
      }

      if (params.keyword) {
        conditions.push('(a.title LIKE ? OR a.content LIKE ?)')
        values.push(`%${params.keyword}%`, `%${params.keyword}%`)
      }

      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ')
      }

      sql += ' ORDER BY a.pub_date DESC, a.id DESC'

      // 添加分页 - 使用更严格的类型检查和转换
      console.log('传入的分页参数:', { page: params.page, pageSize: params.pageSize })

      const page = parseInt(params.page)
      const pageSize = parseInt(params.pageSize)

      console.log('转换后的分页参数类型:', { page: typeof page, pageSize: typeof pageSize })
      console.log('参数有效性检查:', {
        page: !isNaN(page) && page > 0,
        pageSize: !isNaN(pageSize) && pageSize > 0,
      })

      if (!isNaN(page) && !isNaN(pageSize) && page > 0 && pageSize > 0) {
        const offset = (page - 1) * pageSize
        // 直接将数字拼接到SQL中，避免参数绑定问题
        sql += ` LIMIT ${pageSize} OFFSET ${offset}`
        console.log('添加的分页参数值:', {
          pageSize,
          offset,
          pageSizeType: typeof pageSize,
          offsetType: typeof offset,
        })
      }

      console.log('最终SQL Query:', sql)
      console.log('最终SQL Values:', values)
      console.log(
        'Values类型检查:',
        values.map((val, index) => ({ index, value: val, type: typeof val })),
      )

      const [rows] = await pool.execute(sql, values)
      return rows
    } catch (error) {
      console.error('获取文章列表错误:', error)
      throw error
    }
  }

  // 根据ID获取文章详情
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        `
        SELECT a.id, a.title, a.content, a.img, a.pub_date, a.state,
               ac.cate_name, ac.cate_alias, ac.id as cate_id
        FROM articles a
        LEFT JOIN article_categories ac ON a.cate_id = ac.id
        WHERE a.id = ?
      `,
        [id],
      )
      return rows[0] || null
    } catch (error) {
      console.error('获取文章详情错误:', error)
      throw error
    }
  }

  // 创建新文章
  static async create(articleData) {
    try {
      const { title, content, img, cate_id, state = 0 } = articleData
      const pub_date = articleData.pub_date || new Date()

      const [result] = await pool.execute(
        'INSERT INTO articles (title, content, img, cate_id, pub_date, state) VALUES (?, ?, ?, ?, ?, ?)',
        [title, content, img || null, cate_id, pub_date, state],
      )
      return result.insertId
    } catch (error) {
      console.error('创建文章错误:', error)
      throw error
    }
  }

  // 更新文章
  static async update(id, articleData) {
    try {
      const fields = []
      const values = []

      // 构建更新字段
      if (articleData.title !== undefined) {
        fields.push('title = ?')
        values.push(articleData.title)
      }

      if (articleData.content !== undefined) {
        fields.push('content = ?')
        values.push(articleData.content)
      }

      if (articleData.img !== undefined) {
        fields.push('img = ?')
        values.push(articleData.img)
      }

      if (articleData.cate_id !== undefined) {
        fields.push('cate_id = ?')
        values.push(articleData.cate_id)
      }

      if (articleData.state !== undefined) {
        fields.push('state = ?')
        values.push(articleData.state)
      }

      if (articleData.pub_date !== undefined) {
        fields.push('pub_date = ?')
        values.push(articleData.pub_date)
      }

      if (fields.length === 0) {
        return false
      }

      values.push(id)

      const [result] = await pool.execute(
        `UPDATE articles SET ${fields.join(', ')} WHERE id = ?`,
        values,
      )
      return result.affectedRows > 0
    } catch (error) {
      console.error('更新文章错误:', error)
      throw error
    }
  }

  // 删除文章
  static async delete(id) {
    const sql = 'DELETE FROM articles WHERE id = ?'
    try {
      const [result] = await pool.execute(sql, [id])
      return result
    } catch (error) {
      console.error('删除文章错误:', error)
      throw error
    }
  }

  // 获取文章总数
  static async getTotalCount(params = {}) {
    try {
      let sql = 'SELECT COUNT(*) as total FROM articles a'
      const conditions = []
      const values = []

      // 添加JOIN
      if (params.cate_id || params.keyword) {
        sql += ' LEFT JOIN article_categories ac ON a.cate_id = ac.id'
      }

      // 添加筛选条件
      if (params.cate_id) {
        conditions.push('a.cate_id = ?')
        values.push(params.cate_id)
      }

      if (params.state !== undefined) {
        conditions.push('a.state = ?')
        values.push(params.state)
      }

      if (params.keyword) {
        conditions.push('(a.title LIKE ? OR a.content LIKE ?)')
        values.push(`%${params.keyword}%`, `%${params.keyword}%`)
      }

      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ')
      }

      const [rows] = await pool.execute(sql, values)
      return rows[0].total
    } catch (error) {
      console.error('获取文章总数错误:', error)
      throw error
    }
  }

  // 初始化文章表（如果不存在）
  static async initTable() {
    try {
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS articles (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          content TEXT,
          img VARCHAR(500),
          cate_id INT NOT NULL,
          pub_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          state TINYINT DEFAULT 0 COMMENT '0:未发布,1:已发布',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_cate_id (cate_id),
          INDEX idx_state (state),
          INDEX idx_pub_date (pub_date),
          FOREIGN KEY (cate_id) REFERENCES article_categories(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
      console.log('文章表初始化成功')
    } catch (error) {
      console.error('初始化文章表错误:', error)
      throw error
    }
  }
}

module.exports = Article
