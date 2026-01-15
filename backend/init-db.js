const { testConnection } = require('./config/database');
const User = require('./models/User');

async function initDatabase() {
  try {
    console.log('开始初始化数据库...');
    
    // 测试数据库连接
    await testConnection();
    
    // 初始化用户表
    await User.initTable();
    
    console.log('数据库初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

// 运行初始化
initDatabase();