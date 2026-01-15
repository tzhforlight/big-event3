<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="from">
      <el-form
        v-if="isRegister"
        ref="registerForm"
        size="large"
        autocomplete="off"
        :model="fromModel"
        :rules="rules"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="fromModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="fromModel.password"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="fromModel.repassword"
            :prefix-icon="Lock"
            placeholder="请再次输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" auto-insert-space class="button" @click="register"
            >注册</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">← 返回</el-link>
        </el-form-item>
      </el-form>

      <el-form
        v-else
        ref="loginForm"
        size="large"
        autocomplete="off"
        :model="fromModel"
        :rules="rules"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="fromModel.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="fromModel.password"
            placeholder="请输入密码"
            type="password"
            :prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="button" @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import type { RegisterRequest, UserInfo } from '@/api/user'
import { userLoginService, userRegisterService } from '@/api/user'
import { useUserStore } from '@/stores/modules/user'
import type { FormInstance } from 'element-plus'
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userStore = useUserStore()
const isRegister = ref(false)
const registerForm = ref<FormInstance>()
const loginForm = ref<FormInstance>()
const fromModel = ref<RegisterRequest>({
  username: '',
  password: '',
  repassword: '',
})

const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
    {
      min: 5,
      max: 10,
      message: '用户名必须是5-10位字符',
      trigger: 'blur',
    },
  ],
  password: [
    {
      // 1.非空校验
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
    {
      // 2.正则校验
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位非空字符',
      trigger: 'blur',
    },
  ],
  repassword: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位非空字符',
      trigger: 'blur',
    },
    {
      // 3.自定义校验
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (value !== fromModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}
//注册
const register = async () => {
  try {
    await registerForm.value?.validate()
    // 确保repassword不为undefined
    const registerData: RegisterRequest = {
      username: fromModel.value.username,
      password: fromModel.value.password,
      repassword: fromModel.value.repassword || '',
    }
    await userRegisterService(registerData)
    ElMessage.success('注册成功')
    isRegister.value = false
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error('注册失败，请检查输入信息')
  }
}

//登录
const login = async () => {
  try {
    await loginForm.value?.validate()

    // 调用登录API
    const res = await userLoginService(fromModel.value)
    console.log('登录结果', res)

    // 使用优化后的Pinia store存储登录信息
    userStore.login({
      user: res?.user as UserInfo,
      permissions: [], // 后端不返回permissions，使用空数组
    })

    ElMessage.success('登录成功')
    console.log('登录成功，用户信息:', userStore.userInfo)

    // 确保在状态更新后再跳转
    await nextTick()
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查用户名和密码')
  }
}
</script>

<style scoped lang="scss">
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/login-title.png');
    background-size: cover;
    border-radius: 0 20px 20px 0;
  }
}
.from {
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
  .title {
    margin: 0 auto;
  }
  .button {
    width: 100%;
  }
  .flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
