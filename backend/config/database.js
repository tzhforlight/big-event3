require('dotenv').config();
const mysql = require('mysql2/promise');

// 显示数据库配置（调试用）
console.log('数据库配置:');
console.log('- 主机:', process.env.DB_HOST || 'localhost');
console.log('- 用户:', process.env.DB_USER || 'root');
console.log('- 密码:', process.env.DB_PASSWORD ? '已设置' : '未设置');
console.log('- 数据库:', process.env.DB_NAME || 'big_event');

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
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection
};