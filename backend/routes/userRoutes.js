const express = require('express')
const { body } = require('express-validator')
const userController = require('../controllers/userController')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

// 注册路由
router.post(
  '/reg',
  [
    body('username')
      .isLength({ min: 3, max: 20 })
      .withMessage('用户名长度必须在3-20个字符之间')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('用户名只能包含字母、数字和下划线'),
    body('password').isLength({ min: 6 }).withMessage('密码长度至少为6个字符'),
    body('repassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('两次输入的密码不一致'),
  ],
  userController.register,
)

// 登录路由
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('password').notEmpty().withMessage('密码不能为空'),
  ],
  userController.login,
)

// 获取用户信息路由（需要身份验证）
router.get('/my/userinfo', authenticateToken, userController.getUserInfo)

// 更新用户信息路由（需要身份验证）
router.put(
  '/my/userinfo/update',
  authenticateToken,
  [
    // 所有字段都是可选的，只有当用户提供且值不为空时才会验证
    body('nickname')
      .if((value) => value && value.trim() !== '')
      .isLength({ min: 1, max: 50 })
      .withMessage('昵称长度必须在1-50个字符之间'),
    body('email')
      .if((value) => value && value.trim() !== '')
      .isEmail()
      .withMessage('邮箱格式不正确'),
    // body('avatar')
    //   .if((value) => value && value.trim() !== '')
    //   .isURL()
    //   .withMessage('头像必须是有效的URL地址'),
    body('password')
      .if((value) => value && value.trim() !== '')
      .isLength({ min: 6 })
      .withMessage('密码长度至少为6个字符'),
  ],
  userController.updateUserInfo,
)

// 更新用户头像路由（需要身份验证）
// 导入上传中间件
const upload = require('../middleware/upload')

router.post(
  '/my/avatar/update',
  authenticateToken,
  // 使用upload.single('avatar')处理单个文件上传，字段名为avatar
  upload.single('avatar'),
  userController.updateUserAvatar,
)

// 更新用户密码路由（需要身份验证）
router.post(
  '/my/password/update',
  authenticateToken,
  [
    body('old_pwd').notEmpty().withMessage('旧密码不能为空'),
    body('new_pwd')
      .notEmpty().withMessage('新密码不能为空')
      .isLength({ min: 6 }).withMessage('新密码长度至少为6个字符')
      .custom((value, { req }) => {
        if (value === req.body.old_pwd) {
          throw new Error('新密码不能与原密码相同');
        }
        return true;
      })
  ],
  userController.updatePassword,
)

module.exports = router
