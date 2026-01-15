import router from '@/router'
import { useUserStore } from '@/stores/modules/user.js'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 使用环境变量中的API基础URL，如果未设置则使用默认值
const baseURL = import.meta.env.VITE_API_BASE_URL
const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000,
  withCredentials: true, // 允许跨域请求携带Cookie
})

// 不要在模块级别初始化 Store，改为在拦截器中获取
// const useStore = useUserStore() // 删除这行

instance.interceptors.request.use(
  (config) => {
    // 防止重复请求
    // const requestKey = generateReqKey(config)
    // console.log('请求key:', requestKey)
    // if (pendingRequests.has(requestKey)) {
    //   config.cancelToken = new CancelToken((cancel) => {
    //     cancel('重复请求已取消')
    //   })
    // } else {
    //   config.cancelToken =
    //     config.cancelToken ||
    //     new CancelToken((cancel) => {
    //       pendingRequests.set(requestKey, cancel)
    //     })
    // }

    // // 添加时间戳防止缓存
    // if (config.method?.toLowerCase() === 'get') {
    //   config.params = { ...config.params, _t: Date.now() }
    // }

    // 已迁移到HttpOnly Cookie认证，不再需要手动设置Authorization头

    // 设置请求开始时间（用于超时重试）
    // config.metadata = { startTime: Date.now() }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 成功响应处理
    const { data } = response

    // 特殊处理登录响应，保持原始结构返回
    if (data.message === '登录成功' && data.user) {
      return data
    }
    // 特殊处理注册响应
    else if (data.message === '用户注册成功' && data.data) {
      return data.data
    }
    // 其他成功响应处理
    else if (data.data) {
      return data.data
    } else if (data.code === 0 || data.code === 200 || data.success === true) {
      return data.data || data
    } else if (response.status === 200) {
      // 直接返回响应体，确保登录响应的完整结构
      return data
    } else {
      ElMessage.warning(data.message || '操作失败')
      return Promise.reject(data)
    }
  },
  async (error) => {
    if (error.response?.status === 401) {
      // 在错误处理中获取 Store
      const useStore = useUserStore()
      // 使用logout方法清除用户状态，而不是已移除的setToken
      useStore.logout()
      router.push('/login')
    }
    ElMessage.error(error.response?.data?.message || '服务异常')
    return Promise.reject(error)
  },
)

// 请求工具方法
export const request = {
  // GET请求
  get: (url, params, config) => instance.get(url, { params, ...config }),

  // POST请求
  post: (url, data, config) => instance.post(url, data, config),

  // PUT请求
  put: (url, data, config) => instance.put(url, data, config),

  // DELETE请求
  delete: (url, config) => instance.delete(url, config),

  // 上传文件
  upload: (url, file, data = {}) => {
    const formData = new FormData()
    formData.append('file', file)
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })

    return instance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // 下载文件
  download: (url, params, filename) => {
    return instance
      .get(url, {
        params,
        responseType: 'blob',
      })
      .then((response) => {
        const blob = new Blob([response])
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
        return response
      })
  },

  // 取消所有pending请求
  cancelAll: () => {
    // TODO: 实现取消所有pending请求的逻辑
    console.log('取消所有请求功能待实现')
  },
}

export default instance
