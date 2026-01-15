const express = require('express')
const router = express.Router()
const {
  publishArticle,
  getArticleList,
  getArticleInfo,
  deleteArticle,
} = require('../controllers/articleController')
const { authenticateToken } = require('../middleware/auth')
const upload = require('../middleware/upload')

// 使用认证中间件保护所有文章相关路由
router.use(authenticateToken)

// 发布/编辑文章接口
// 使用 multer 中间件处理单个文件上传，字段名为 'img'
router.post('/my/article/add', upload.single('img'), publishArticle)

// 获取文章列表接口
router.get('/my/article/list', getArticleList)

// 获取文章详情接口
router.get('/my/article/info', getArticleInfo)
// 删除文章接口 - 支持动态路径参数
router.delete('/my/article/del/:id', deleteArticle)

// 删除文章接口 - 支持查询参数
router.delete('/my/article/del', deleteArticle)

module.exports = router
