import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layout/LayoutContainer.vue'),
    redirect: '/article/channel',
    meta: {
      title: '首页',
      requiresAuth: true,
    },
    children: [
      {
        path: '/article/manage',
        name: 'articleManage',
        component: () => import('@/views/article/ArticleManage.vue'),
        meta: {
          title: '文章管理',
          requiresAuth: true,
        },
      },
      {
        path: '/article/channel',
        name: 'articleChannel',
        component: () => import('@/views/article/ArticleChannel.vue'),
        meta: {
          title: '文章分类',
          requiresAuth: true,
        },
      },
      {
        path: '/user/profile',
        name: 'userProfile',
        component: () => import('@/views/user/UserProfile.vue'),
        meta: {
          title: '基本资料',
          requiresAuth: true,
        },
      },
      {
        path: '/user/avatar',
        name: 'userAvatar',
        component: () => import('@/views/user/UserAvatar.vue'),
        meta: {
          title: '更换头像',
          requiresAuth: true,
        },
      },
      {
        path: '/user/password',
        name: 'userPassword',
        component: () => import('@/views/user/UserPassword.vue'),
        meta: {
          title: '修改密码',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    name: 'notFound',
    component: () => import('@/views/error/NotFound.vue'),
    meta: {
      title: '404 Not Found',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 登录访问拦截
import { useUserStore } from '@/stores/modules/user'

router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 大事件` : '大事件'

  // 在路由守卫中获取store实例
  const userStore = useUserStore()
  const isLoggedIn = userStore.isLoggedIn
  // 需要认证的页面检查
  const requiresAuth = to.meta.requireAuth !== false // 使用正确的meta字段名

  if (requiresAuth && !isLoggedIn && to.path !== '/login') {
    console.log('未登录状态，重定向到登录页')
    next('/login')
  } else if (isLoggedIn && to.path === '/login') {
    console.log('已登录状态，重定向到首页')
    next('/')
  } else {
    // 正常放行
    next()
  }
})

export default router
