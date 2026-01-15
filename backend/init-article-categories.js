const ArticleCategory = require('./models/ArticleCategory');

// 初始化文章分类数据
const initArticleCategories = async () => {
  try {
    // 初始化表结构
    await ArticleCategory.initTable();
    console.log('文章分类表初始化完成');

    // 插入测试数据
    const categories = [
      { cate_name: '技术文章', cate_alias: 'tech' },
      { cate_name: '生活随笔', cate_alias: 'life' },
      { cate_name: '学习笔记', cate_alias: 'study' },
      { cate_name: '项目总结', cate_alias: 'project' },
      { cate_name: '工具分享', cate_alias: 'tools' }
    ];

    for (const category of categories) {
      try {
        await ArticleCategory.create(category);
        console.log(`插入分类: ${category.cate_name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`分类已存在: ${category.cate_name}`);
        } else {
          throw error;
        }
      }
    }

    console.log('文章分类数据初始化完成');
    
    // 显示所有分类
    const allCategories = await ArticleCategory.getAllCategories();
    console.log('当前分类列表:');
    allCategories.forEach(category => {
      console.log(`- ${category.cate_name} (${category.cate_alias}) - ID: ${category.id}`);
    });

  } catch (error) {
    console.error('初始化文章分类数据失败:', error);
  }
};

// 如果直接运行此脚本
if (require.main === module) {
  initArticleCategories().then(() => {
    console.log('初始化完成');
    process.exit(0);
  }).catch(error => {
    console.error('初始化失败:', error);
    process.exit(1);
  });
}

module.exports = { initArticleCategories };