const { testConnection } = require('./config/database');

// 简单的数据库连接测试
async function testDBConnection() {
  console.log('正在测试数据库连接...');
  console.log('数据库配置:');
  console.log('- 主机:', process.env.DB_HOST || 'localhost');
  console.log('- 用户:', process.env.DB_USER || 'root');
  console.log('- 数据库:', process.env.DB_NAME || 'big_event');
  
  try {
    await testConnection();
    console.log('✅ 数据库连接成功！');
  } catch (error) {
    console.error('❌ 数据库连接失败！');
    console.error('错误信息:', error.message);
    console.error('错误代码:', error.code);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n🔧 解决方案:');
      console.error('1. 检查数据库用户名和密码是否正确');
      console.error('2. 确保 MySQL 服务正在运行');
      console.error('3. 检查用户是否有访问权限');
      console.error('4. 尝试重置 root 密码');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n🔧 解决方案:');
      console.error('1. 确保 MySQL 服务正在运行');
      console.error('2. 检查数据库主机地址是否正确');
      console.error('3. 检查数据库端口是否开放');
    }
  }
}

testDBConnection();