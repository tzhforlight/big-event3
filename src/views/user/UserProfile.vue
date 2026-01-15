<template>
  <page-container title="用户信息">
    <el-form ref="formRef" :model="formModel" label-width="80px" style="width: 400px">
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="formModel.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formModel.nickname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formModel.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<script setup lang="ts">
import { userUpdateInfoService } from '@/api/user'
import { useUserStore } from '@/stores/modules/user'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { UserInfo } from '@/api/user'

const userStore = useUserStore()

const formRef = ref()
const formModel = ref<Partial<UserInfo>>({
  username: '',
  nickname: '',
  email: '',
})

const resetForm = () => {
  console.log(formRef)
}

const submitForm = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (error) {
    console.error('表单验证失败', error)
    ElMessage.error('表单验证失败，请检查输入')
    return
  }
  try {
    await userUpdateInfoService(formModel.value)
    userStore.updateUserInfo(formModel.value)

    ElMessage.success('更新用户信息成功')
  } catch (error) {
    console.error('更新用户信息失败', error)
    return
  }
}

onMounted(() => {
  formModel.value = { ...userStore.userInfo }
  console.log('formModel.value ', formModel.value)
})
</script>

<style scoped></style>
