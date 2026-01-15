<template>
  <page-container title="密码管理">
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="100px"
      style="width: 400px"
      :rules="rules"
    >
      <el-form-item label="输入旧密码" prop="oldPassword">
        <el-input
          v-model="formModel.oldPassword"
          type="password"
          placeholder="请输入旧密码"
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="输入新密码" prop="newPassword">
        <el-input
          v-model="formModel.newPassword"
          type="password"
          placeholder="请输入新密码"
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input
          v-model="formModel.confirmPassword"
          type="password"
          placeholder="请确认新密码"
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<script setup lang="ts">
// TODO: 实现密码管理功能
import { userUpdatePassService } from '@/api/user'
// import { useUserStore } from '@/stores/modules/user'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
// const userStore = useUserStore()
const formRef = ref(null)
const formModel = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'change' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须为6-15个非空字符',
      trigger: 'change',
    },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'change' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须为6-15个非空字符',
      trigger: 'change',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'change' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须为6-15个非空字符',
      trigger: 'change',
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      message: '两次输入密码不一致',
      trigger: 'change',
    },
  ],
}

const resetForm = () => {
  formModel.value = {
    oldPassword: '',
    newPassword: '',
    rePassword: '',
  }
  formRef.value.resetFields()
}
const submitForm = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (error) {
    console.error('表单验证失败', error)

    return
  }
  try {
    await userUpdatePassService({
      old_pwd: formModel.value.oldPassword,
      new_pwd: formModel.value.newPassword,
    })
    ElMessage.success('更新密码成功')
    resetForm()
  } catch (error) {
    console.error('密码更新失败', error)
    // ElMessage.error(error.response?.data?.message || '密码更新失败，请稍后重试')
  }
}
</script>

<style scoped></style>
