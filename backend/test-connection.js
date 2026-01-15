require('dotenv').config();
const mysql = require('mysql2/promise');

// 显示实际的数据库配置
console.log('环境变量加载状态:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '已设置' : '未设置');
console.log('DB_NAME:', process.env.DB_NAME);

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'big_event',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
async function testConnection() {
  try {
    console.log('\n正在尝试连接数据库...');
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功！');
    
    // 测试查询
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('数据库查询测试:', rows[0].result);
    
    connection.release();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.error('错误代码:', error.code);
    throw error;
  } finally {
    await pool.end();
  }
}

testConnection();