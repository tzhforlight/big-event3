// 兼容方案：使用项目统一的缓存工具
import { cache } from '@/utils/cache'

/**
 * 缓存Hook - 提供向后兼容的缓存接口
 * 推荐使用新的cache工具类
 */
export const useCache = () => {
  return {
    set: cache.set,
    get: cache.get,
    delete: cache.remove,
    clear: cache.clear,
    has: cache.has,
  }
}
