const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/userRoutes')
const articleCategoryRoutes = require('./routes/articleCategoryRoutes')
const articleRoutes = require('./routes/articleRoutes')
const ArticleCategory = require('./models/ArticleCategory')
const Article = require('./models/Article')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(
  cors({
    origin: [
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:8085',
    ],
    credentials: true,
  }),
)
app.use(cookieParser()) // 解析Cookie
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// 提供静态文件访问，用于访问上传的图片
app.use('/uploads', express.static(__dirname + '/uploads'))

// 路由
app.use('/api', userRoutes)
app.use('/api', articleCategoryRoutes)
app.use('/api', articleRoutes)

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: 'API连接正常', timestamp: new Date().toISOString() })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: '请求的资源不存在' })
})

// 初始化数据库表
async function initializeDatabase() {
  try {
    await ArticleCategory.initTable()
    await Article.initTable()
    console.log('数据库表初始化完成')
  } catch (error) {
    console.error('数据库表初始化失败:', error)
  }
}

app.listen(PORT, async () => {
  console.log(`服务器运行在端口 ${PORT}`)
  await initializeDatabase()
})

module.exports = app
