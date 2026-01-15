import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 用户信息类型
export interface UserInfo {
  id?: number
  username?: string
  nickname?: string
  email?: string
  avatar?: string
  role?: string
  [key: string]: unknown
}

// 登录数据类型
export interface LoginData {
  user: UserInfo
  permissions?: string[]
}

// 创建user store
export const useUserStore = defineStore(
  'big-user',
  () => {
    // 状态 - 不再存储token，只存储非敏感用户信息
    const userInfo = ref<UserInfo>({})
    const permissions = ref<string[]>([])
    const lastLoginTime = ref<number | null>(null)

    // 计算属性 - 不再依赖token判断登录状态，而是根据userInfo是否存在
    const isLoggedIn = computed(() => Object.keys(userInfo.value).length > 0)
    const userRole = computed(() => userInfo.value?.role || 'user')
    const userName = computed(() => userInfo.value?.username || '')

    // 方法 - 移除token相关方法
    const setUserInfo = (u: UserInfo) => {
      // 移除敏感信息
      const { ...safeUserInfo } = u || {}
      userInfo.value = safeUserInfo
    }

    const setPermissions = (perms: string[]) => {
      permissions.value = perms
    }

    const updateLastLoginTime = () => {
      lastLoginTime.value = Date.now()
    }

    // 登录方法 - 不再处理token
    const login = (userData: LoginData) => {
      setUserInfo(userData.user)
      setPermissions(userData.permissions || [])
      updateLastLoginTime()
    }

    // 登出方法 - 移除 router.push，改为在组件中处理导航
    const logout = () => {
      userInfo.value = {}
      permissions.value = []
      lastLoginTime.value = null
    }

    // 更新用户信息
    const updateUserInfo = (updates: Partial<UserInfo>) => {
      // 确保不添加敏感信息
      const { ...safeUpdates } = updates || {}
      userInfo.value = { ...userInfo.value, ...safeUpdates }
    }

    return {
      // 状态 - 不再返回token
      userInfo,
      permissions,
      lastLoginTime,
      // 计算属性
      isLoggedIn,
      userRole,
      userName,
      // 方法 - 移除token相关方法
      setUserInfo,
      setPermissions,
      updateLastLoginTime,
      login,
      logout,
      updateUserInfo,
    }
  },
  {
    persist: {
      key: 'big-user',
      storage: localStorage, // 只存储非敏感用户信息
      pick: ['userInfo', 'permissions', 'lastLoginTime'], // 不再持久化token，使用pick替代paths
    },
  },
)
