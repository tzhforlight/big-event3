const Article = require('../models/Article')

// 发布/编辑文章控制器
const publishArticle = async (req, res) => {
  try {
    const { title, cate_id, content, state, id } = req.body
    const user_id = req.user.id // 从认证中间件获取用户ID

    // 验证必填字段
    if (!title || !cate_id || !content || !state) {
      return res.status(400).json({ message: '标题、分类、内容和状态为必填项' })
    }

    // 处理图片文件路径
    let imgPath = null
    if (req.file) {
      // 使用相对路径，便于前端访问
      imgPath = `/uploads/${req.file.filename}`
    }

    let result

    // 判断是创建新文章还是编辑现有文章
    if (id) {
      // 编辑模式：先检查文章是否存在且属于当前用户
      const existingArticle = await Article.findById(id)
      if (!existingArticle) {
        return res.status(404).json({ message: '文章不存在' })
      }

      if (existingArticle.user_id !== user_id) {
        return res.status(403).json({ message: '无权修改此文章' })
      }

      // 更新文章数据，只更新提供的字段
      const updateData = { title, cate_id, content, state }
      if (imgPath) {
        updateData.img = imgPath
      }

      result = await Article.update(id, updateData)

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: '文章更新失败' })
      }

      return res.status(200).json({ message: '文章更新成功', data: { id, ...updateData } })
    } else {
      // 创建新模式：使用用户ID和提供的字段创建新文章
      const articleData = {
        title,
        content,
        img: imgPath,
        cate_id,
        state,
        user_id,
      }

      result = await Article.create(articleData)

      return res.status(201).json({
        message: '文章发布成功',
        data: { id: result.insertId, ...articleData },
      })
    }
  } catch (error) {
    console.error('发布/编辑文章失败:', error)
    res.status(500).json({ message: '服务器内部错误', error: error.message })
  }
}

// 获取文章列表控制器
const getArticleList = async (req, res) => {
  try {
    const user_id = req.user.id // 从认证中间件获取用户ID

    // 获取查询参数
    const pageNo = parseInt(req.query.pageNo) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const cate_id = req.query.cate_id
    const state = req.query.state
    const keyword = req.query.keyword

    // 构建查询参数
    const params = {
      page: pageNo,
      pageSize: pageSize,
    }

    if (cate_id) {
      params.cate_id = cate_id
    }

    if (state !== undefined) {
      params.state = state
    }

    if (keyword) {
      params.keyword = keyword
    }

    // 获取文章列表
    const articles = await Article.getAllArticles(params)

    // 获取总数
    const total = await Article.getTotalCount(params)

    return res.status(200).json({
      message: '获取文章列表成功',
      data: {
        list: articles,
        total: total,
        pageNo: pageNo,
        pageSize: pageSize,
      },
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    res.status(500).json({ message: '服务器内部错误', error: error.message })
  }
}

// 获取文章详情控制器
const getArticleInfo = async (req, res) => {
  try {
    const user_id = req.user.id // 从认证中间件获取用户ID
    const articleId = req.query.id // 从查询参数获取文章ID

    // 验证文章ID是否存在
    if (!articleId) {
      return res.status(400).json({ message: '文章ID不能为空' })
    }

    // 获取文章详情
    const article = await Article.findById(articleId)

    if (!article) {
      return res.status(404).json({ message: '文章不存在' })
    }

    return res.status(200).json({
      message: '获取文章详情成功',
      data: article,
    })
  } catch (error) {
    console.error('获取文章详情失败:', error)
    res.status(500).json({ message: '服务器内部错误', error: error.message })
  }
}

//删除文章数据
const deleteArticle = async (req, res) => {
  try {
    // 同时支持路径参数和查询参数获取ID
    const id = req.query.id || req.params.id
    
    // 验证ID是否存在
    if (!id) {
      return res.status(400).json({
        code: 1,
        message: '文章ID不能为空'
      })
    }
    
    const success = await Article.delete(id)
    if (!success) {
      return res.status(404).json({
        code: 1,
        message: '文章不存在',
      })
    }
    res.json({
      code: 0,
      message: '删除文章成功',
    })
  } catch (error) {
    console.error('删除文章错误:', error)
    res.status(500).json({
      code: 1,
      message: '删除文章失败',
      error: error.message,
    })
  }
}

module.exports = {
  publishArticle,
  getArticleList,
  getArticleInfo,
  deleteArticle,
}
