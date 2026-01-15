const ArticleCategory = require('../models/ArticleCategory');

class ArticleCategoryController {
  // 获取所有文章分类
  static async getAllCategories(req, res) {
    try {
      const categories = await ArticleCategory.getAllCategories();
      res.json({
        code: 0,
        message: '获取分类列表成功',
        data: categories
      });
    } catch (error) {
      console.error('获取分类列表错误:', error);
      res.status(500).json({
        code: 1,
        message: '获取分类列表失败',
        error: error.message
      });
    }
  }

  // 获取单个分类详情
  static async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await ArticleCategory.findById(id);
      
      if (!category) {
        return res.status(404).json({
          code: 1,
          message: '分类不存在'
        });
      }

      res.json({
        code: 0,
        message: '获取分类详情成功',
        data: category
      });
    } catch (error) {
      console.error('获取分类详情错误:', error);
      res.status(500).json({
        code: 1,
        message: '获取分类详情失败',
        error: error.message
      });
    }
  }

  // 创建新分类
  static async createCategory(req, res) {
    try {
      const { cate_name, cate_alias } = req.body;

      // 参数验证
      if (!cate_name || !cate_alias) {
        return res.status(400).json({
          code: 1,
          message: '分类名称和别名不能为空'
        });
      }

      const categoryId = await ArticleCategory.create({
        cate_name: cate_name.trim(),
        cate_alias: cate_alias.trim()
      });

      res.json({
        code: 0,
        message: '创建分类成功',
        data: { id: categoryId }
      });
    } catch (error) {
      console.error('创建分类错误:', error);
      
      // 处理重复键错误
      if (error.code === 'ER_DUP_ENTRY') {
        const field = error.sqlMessage.includes('cate_name') ? '分类名称' : '分类别名';
        return res.status(409).json({
          code: 1,
          message: `${field}已存在`
        });
      }

      res.status(500).json({
        code: 1,
        message: '创建分类失败',
        error: error.message
      });
    }
  }

  // 更新分类
  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { cate_name, cate_alias } = req.body;

      // 参数验证
      if (!cate_name || !cate_alias) {
        return res.status(400).json({
          code: 1,
          message: '分类名称和别名不能为空'
        });
      }

      const success = await ArticleCategory.update(id, {
        cate_name: cate_name.trim(),
        cate_alias: cate_alias.trim()
      });

      if (!success) {
        return res.status(404).json({
          code: 1,
          message: '分类不存在'
        });
      }

      res.json({
        code: 0,
        message: '更新分类成功'
      });
    } catch (error) {
      console.error('更新分类错误:', error);
      
      // 处理重复键错误
      if (error.code === 'ER_DUP_ENTRY') {
        const field = error.sqlMessage.includes('cate_name') ? '分类名称' : '分类别名';
        return res.status(409).json({
          code: 1,
          message: `${field}已存在`
        });
      }

      res.status(500).json({
        code: 1,
        message: '更新分类失败',
        error: error.message
      });
    }
  }

  // 删除分类
  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const success = await ArticleCategory.delete(id);

      if (!success) {
        return res.status(404).json({
          code: 1,
          message: '分类不存在'
        });
      }

      res.json({
        code: 0,
        message: '删除分类成功'
      });
    } catch (error) {
      console.error('删除分类错误:', error);
      res.status(500).json({
        code: 1,
        message: '删除分类失败',
        error: error.message
      });
    }
  }
}

module.exports = ArticleCategoryController;