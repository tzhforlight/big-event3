const express = require('express');
const ArticleCategoryController = require('../controllers/articleCategoryController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 获取所有文章分类 - 不需要认证
router.get('/my/cate/list', async (req, res) => {
  await ArticleCategoryController.getAllCategories(req, res);
});

// 获取单个分类详情 - 不需要认证
router.get('/my/cate/:id', async (req, res) => {
  await ArticleCategoryController.getCategoryById(req, res);
});

// 编辑分类 - 需要认证 (匹配前端API路径) - 这个路由要放在 /my/cate/:id 之前
router.put('/my/cate/info', authenticateToken, async (req, res) => {
  // 从请求体中获取id
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      code: 1,
      message: '分类ID不能为空'
    });
  }
  // 将id添加到params中，以便复用现有的updateCategory方法
  req.params.id = id;
  await ArticleCategoryController.updateCategory(req, res);
});

// 创建分类 - 需要认证
router.post('/my/cate', authenticateToken, async (req, res) => {
  await ArticleCategoryController.createCategory(req, res);
});

// 添加分类 - 需要认证 (匹配前端API路径)
router.post('/my/cate/add', authenticateToken, async (req, res) => {
  await ArticleCategoryController.createCategory(req, res);
});

// 更新分类 - 需要认证
router.put('/my/cate/:id', authenticateToken, async (req, res) => {
  await ArticleCategoryController.updateCategory(req, res);
});

// 删除分类 - 需要认证 (匹配前端API路径，使用查询参数)
router.delete('/my/cate/del', authenticateToken, async (req, res) => {
  // 从查询参数中获取id
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      code: 1,
      message: '分类ID不能为空'
    });
  }
  // 将id添加到params中，以便复用现有的deleteCategory方法
  req.params.id = id;
  await ArticleCategoryController.deleteCategory(req, res);
});

// 删除分类 - 需要认证
router.delete('/my/cate/:id', authenticateToken, async (req, res) => {
  await ArticleCategoryController.deleteCategory(req, res);
});

module.exports = router;