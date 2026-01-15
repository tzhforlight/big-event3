const { pool } = require('../config/database')

class ArticleCategory {
  // 初始化数据库表
  static async initTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS article_categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        cate_name VARCHAR(50) NOT NULL UNIQUE,
        cate_alias VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `

    try {
      await pool.execute(sql)
      console.log('文章分类表初始化成功')
    } catch (error) {
      console.error('文章分类表初始化失败:', error)
      throw error
    }
  }

  // 获取所有分类
  static async getAll() {
    const sql = 'SELECT * FROM article_categories ORDER BY id ASC'
    try {
      const [rows] = await pool.execute(sql)
      return rows
    } catch (error) {
      console.error('获取文章分类失败:', error)
      throw error
    }
  }

  // 根据ID获取分类
  static async findById(id) {
    const sql = 'SELECT * FROM article_categories WHERE id = ?'
    try {
      const [rows] = await pool.execute(sql, [id])
      return rows[0] || null
    } catch (error) {
      console.error('根据ID获取文章分类失败:', error)
      throw error
    }
  }

  // 创建新分类
  static async create(data) {
    // 兼容前端传递的字段名：cate_name 和 cate_alias
    const { cate_name, cate_alias } = data
    // 使用适当的字段值，如果cate_name/cate_alias存在则使用它们
    const categoryName = cate_name
    const categoryAlias = cate_alias
    const sql = 'INSERT INTO article_categories (cate_name, cate_alias) VALUES (?, ?)'

    try {
      const [result] = await pool.execute(sql, [categoryName, categoryAlias])
      return {
        id: result.insertId,
        cate_name: categoryName,
        cate_alias: categoryAlias,
        created_at: new Date(),
      }
    } catch (error) {
      console.error('创建文章分类失败:', error)
      throw error
    }
  }

  // 更新分类
  static async update(id, data) {
    // 兼容前端传递的字段名：cate_name 和 cate_alias
    const { cate_name, cate_alias } = data
    // 使用适当的字段值，如果cate_name/cate_alias存在则使用它们
    const categoryName = cate_name
    const categoryAlias = cate_alias
    const sql = 'UPDATE article_categories SET cate_name = ?, cate_alias = ? WHERE id = ?'

    try {
      const [result] = await pool.execute(sql, [categoryName, categoryAlias, id])
      return result
    } catch (error) {
      console.error('更新文章分类失败:', error)
      throw error
    }
  }

  // 删除分类
  static async delete(id) {
    const sql = 'DELETE FROM article_categories WHERE id = ?'

    try {
      const [result] = await pool.execute(sql, [id])
      return result
    } catch (error) {
      console.error('删除文章分类失败:', error)
      throw error
    }
  }
}

// 添加兼容方法，作为getAll的别名
ArticleCategory.getAllCategories = ArticleCategory.getAll

module.exports = ArticleCategory
