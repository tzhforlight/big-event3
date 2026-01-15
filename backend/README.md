# Big Event 后端API

基于Node.js + Express + MySQL的用户认证系统后端。

## 功能特性

- 用户注册
- 用户登录
- JWT身份验证
- 密码加密存储
- 输入验证
- 错误处理

## 技术栈

- **运行环境**: Node.js
- **Web框架**: Express.js
- **数据库**: MySQL
- **身份验证**: JWT (JSON Web Token)
- **密码加密**: bcryptjs
- **输入验证**: express-validator
- **CORS**: cors

## 项目结构

```
backend/
├── config/              # 配置文件
│   └── database.js      # 数据库连接配置
├── controllers/         # 控制器
│   └── userController.js # 用户相关逻辑
├── models/              # 数据模型
│   └── User.js         # 用户模型
├── routes/              # 路由
│   └── userRoutes.js   # 用户相关路由
├── server.js           # 主服务器文件
├── init-db.js          # 数据库初始化脚本
├── package.json        # 项目依赖
└── .env.example        # 环境变量示例
```

## API接口

### 用户注册
- **POST** `/api/reg`
- **请求体**:
  ```json
  {
    "username": "testuser",
    "password": "123456",
    "repassword": "123456"
  }
  ```

### 用户登录
- **POST** `/api/login`
- **请求体**:
  ```json
  {
    "username": "testuser",
    "password": "123456"
  }
  ```
- **响应**:
  ```json
  {
    "message": "登录成功",
    "data": {
      "token": "eyJhbGc...",
      "user": {
        "id": 1,
        "username": "testuser"
      }
    }
  }
  ```

## 安装和运行

### 1. 安装依赖
```bash
cd backend
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env` 并修改相关配置：
```bash
cp .env.example .env
```

### 3. 创建数据库
在MySQL中创建数据库：
```sql
CREATE DATABASE big_event;
```

### 4. 初始化数据库
```bash
node init-db.js
```

### 5. 启动服务器
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务器将在 `http://localhost:3000` 启动。

## 环境变量配置

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 3000 |
| NODE_ENV | 运行环境 | development |
| DB_HOST | 数据库主机 | localhost |
| DB_USER | 数据库用户 | root |
| DB_PASSWORD | 数据库密码 | 空 |
| DB_NAME | 数据库名 | big_event |
| JWT_SECRET | JWT密钥 | your-super-secret-jwt-key... |
| CORS_ORIGIN | 允许的CORS源 | http://localhost:5173 |

## 注意事项

1. 在生产环境中，请务必将 `JWT_SECRET` 改为一个强密码
2. 确保MySQL服务正在运行
3. 数据库用户需要有创建表的权限
4. 建议在生产环境中使用HTTPS