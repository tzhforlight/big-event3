import { ElMessage, ElMessageBox } from 'element-plus'

export const useMessage = () => {
  function confirm(content: string, tip: string, onConfirm: () => Promise<void> | void) {
    return ElMessageBox.confirm(content, tip || '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      closeOnClickModal: false, // 新增：禁止点击遮罩层关闭
      closeOnPressEscape: false, // 新增：禁止ESC关闭
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          try {
            if (onConfirm) {
              await onConfirm()
            }
            done()
          } catch {
            instance.confirmButtonLoading = false
          } finally {
            instance.confirmButtonLoading = false
          }
        } else {
          if (instance.confirmButtonLoading) {
            ElMessage({
              message: '任务执行中，禁止关闭/取消',
              type: 'warning',
            })
            return
          }
          done()
          ElMessage({
            message: '取消',
            type: 'info',
          })
        }
      },
    })
  }

  return { confirm }
}
