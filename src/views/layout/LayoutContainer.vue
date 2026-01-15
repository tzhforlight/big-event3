<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside_logo"></div>
      <el-menu
        background-color="#232323"
        text-color="#fff"
        active-text-color="#ffd04b"
        :default-active="$route.path"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <!-- <el-main class="layout-main" background-color="#000000">
      <router-view></router-view>
    </el-main> -->
    <el-container class="layout-main">
      <el-header>
        <div style="margin-left: auto; display: flex; align-items: center; gap: 10px">
          <el-dropdown placement="bottom-end" @command="handleCommand">
            <span class="el-dropdown__box">
              <el-avatar
                :src="
                  userStore.userInfo.avatar
                    ? `${baseUrl}${userStore.userInfo.avatar}`
                    : defaultUserAvatar
                "
              />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
                <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div>
            <strong>{{ userStore.userName }}</strong>
          </div>
        </div>
      </el-header>
      <el-main class="el-main">
        <router-view></router-view>
      </el-main>
      <el-footer>大事件 ©2023 Created by 黑马程序员</el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

import defaultUserAvatar from '@/assets/logo.png'
import { useUserStore } from '@/stores'
import {
  Crop,
  EditPen,
  Management,
  Promotion,
  SwitchButton,
  User,
  UserFilled,
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()
const baseUrl = 'http://localhost:3001'

const handleCommand = (key: string) => {
  switch (key) {
    case 'profile':
      // 跳转到基本资料页面
      router.push('/user/profile')
      break
    case 'avatar':
      // 跳转到更换头像页面
      router.push('/user/avatar')
      break
    case 'password':
      // 跳转到重置密码页面
      router.push('/user/password')
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          ElMessage.success('退出登录成功')
          // 退出
          userStore.logout()
          router.push('/login')
        })
        .catch(() => {
          // 用户点击取消按钮，不执行任何操作
          ElMessage.info('已取消退出登录')
        })
      break
  }
}
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  // background-color: aqua;

  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }
      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
