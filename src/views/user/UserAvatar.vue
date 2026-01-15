<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleAvatarSuccess"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <img v-else src="@/assets/logo.png" class="avatar" />
        </el-upload>
        <br />
        <el-button
          size="large"
          type="primary"
          :icon="Plus"
          @click="uploadRef.$el.querySelector('input').click()"
          >选择图片</el-button
        >
        <el-button size="large" type="success" :icon="Upload" @click="onUpload">点击上传</el-button>
      </el-col>
    </el-row>
  </page-container>
</template>

<script setup lang="ts">
import { userUpdateAvatarService } from '@/api/user'
import { useUserStore } from '@/stores/modules/user'
import { Plus, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref, onMounted, onUnmounted } from 'vue'
const imageUrl = ref('')
const uploadRef = ref()
const pendingFile = ref(null) //存储待上传的图片文件
const blobUrl = ref([]) //存储创建的url，用于组件卸载时清理
const baseUrl = 'http://localhost:3001'
const userStore = useUserStore()
const handleAvatarSuccess = (file) => {
  const img = URL.createObjectURL(file.raw)
  blobUrl.value.push(img)
  imageUrl.value = img
  pendingFile.value = file.raw
}
const onUpload = async () => {
  if (!pendingFile.value) {
    ElMessage.error('请选择图片')
    return
  }
  try {
    const formData = new FormData()
    formData.append('avatar', pendingFile.value)
    await userUpdateAvatarService(formData).then((res) => {
      if (res && res.avatar) {
        userStore.updateUserInfo({ avatar: res.avatar })
        ElMessage.success('头像更新成功')
      } else {
        ElMessage.error('更新失败')
      }
    })
  } catch (error) {
    console.log('更新失败', error.message)
  }
}
onMounted(() => {
  // 优先使用用户头像，如果没有则使用默认头像
  if (userStore.userInfo.avatar) {
    imageUrl.value = `${baseUrl}${userStore.userInfo.avatar}`
  } else {
    // 直接使用相对路径引用静态资源
    imageUrl.value = ''
  }
})
onUnmounted(() => {
  blobUrl.value.forEach((url) => {
    URL.revokeObjectURL(url)
  })
})
</script>

<style scoped>
.avatar-uploader .avatar {
  height: 240px;
  width: 240px;
  border-radius: 50%;
  background-color: aqua;
}
</style>
