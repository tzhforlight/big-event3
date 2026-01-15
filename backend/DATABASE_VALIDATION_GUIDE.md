# 数据库连接验证指南

## ✅ 验证结果

数据库连接已成功建立！

## 🔍 验证方法

### 方法1：使用测试脚本（推荐）
```bash
node test-connection.js
```

### 方法2：使用初始化脚本
```bash
node init-db.js
```

### 方法3：启动服务器验证
```bash
node server.js
```

## 📋 验证步骤

1. **检查环境变量配置**
   - 确保 `.env` 文件存在
   - 检查数据库配置信息是否正确

2. **测试数据库连接**
   - 运行测试脚本验证连接
   - 检查控制台输出信息

3. **验证数据库操作**
   - 测试基本查询（如 SELECT 1+1）
   - 验证表结构创建

## 🔧 常见问题解决

### 连接失败问题

1. **Access denied for user**
   - 检查用户名和密码是否正确
   - 确保用户有访问权限
   - 检查 MySQL 服务是否运行

2. **ECONNREFUSED**
   - 确保 MySQL 服务正在运行
   - 检查数据库主机地址和端口
   - 验证防火墙设置

3. **Unknown database**
   - 手动创建数据库
   ```sql
   CREATE DATABASE big_event;
   ```

### 环境变量问题

确保 `.env` 文件包含正确的配置：
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=big_event
```

## 📊 连接成功指标

- ✅ 控制台显示 "数据库连接成功"
- ✅ 查询测试返回正确结果
- ✅ 无错误代码抛出
- ✅ 服务器正常启动

## 🚀 下一步操作

1. 运行数据库初始化
2. 启动后端服务器
3. 测试 API 接口
4. 连接前端应用