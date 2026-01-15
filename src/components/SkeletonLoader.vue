<template>
  <div class="skeleton-container" :class="{ 'skeleton-custom': type === 'custom' }">
    <!-- 卡片类型骨架屏 -->
    <div v-if="type === 'card'" class="skeleton-card">
      <div v-if="hasAvatar" class="skeleton-avatar"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-description"></div>
      </div>
    </div>

    <!-- 列表类型骨架屏 -->
    <div v-else-if="type === 'list'" class="skeleton-list">
      <div
        v-for="index in Math.min(count || 5, 10)"
        :key="index"
        class="skeleton-list-item"
        :class="{ 'has-avatar': hasAvatar }"
      >
        <div v-if="hasAvatar" class="skeleton-avatar-small"></div>
        <div class="skeleton-content">
          <!-- <div class="skeleton-title"></div>
          <div class="skeleton-title"></div> -->
          <div class="skeleton-description"></div>
        </div>
      </div>
    </div>

    <!-- 文章列表类型骨架屏 -->
    <div v-else-if="type === 'article'" class="skeleton-article-list">
      <div v-for="index in Math.min(count || 5, 10)" :key="index" class="skeleton-article-item">
        <div class="skeleton-article-title"></div>
        <div class="skeleton-article-meta">
          <div class="skeleton-meta-item"></div>
          <div class="skeleton-meta-item"></div>
          <div class="skeleton-meta-item"></div>
        </div>
      </div>
    </div>

    <!-- 自定义类型骨架屏 -->
    <div v-else-if="props.type === 'custom'">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// export default {
//   name: 'SkeletonLoader',
// }

const props = defineProps({
  // 骨架屏类型: card, list, article, custom
  type: {
    type: String,
    default: 'card',
    validator: (value: string) => ['card', 'list', 'article', 'custom'].includes(value),
  },
  // 显示数量（用于列表类型）
  count: {
    type: Number,
    default: 5,
  },
  // 是否显示头像
  hasAvatar: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.skeleton-container {
  width: 100%;
  overflow: hidden;
}

/* 骨架屏基础样式 */
.skeleton-avatar,
.skeleton-avatar-small,
.skeleton-title,
.skeleton-description,
.skeleton-article-title,
.skeleton-meta-item {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 卡片类型 */
.skeleton-card {
  display: flex;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skeleton-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 16px;
}

.skeleton-content {
  flex: 1;
}

.skeleton-title {
  height: 24px;
  width: 60%;
  margin-bottom: 12px;
}

.skeleton-description {
  height: 16px;
  width: 80%;
  margin-bottom: 8px;
}

.skeleton-description:last-child {
  margin-bottom: 0;
  width: 100%;
}

/* 列表类型 */
.skeleton-list {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-list-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.skeleton-list-item:last-child {
  border-bottom: none;
}

.skeleton-list-item.has-avatar .skeleton-content {
  margin-left: 16px;
}

.skeleton-avatar-small {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

/* 文章列表类型 */
.skeleton-article-list {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-article-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.skeleton-article-item:last-child {
  border-bottom: none;
}

.skeleton-article-title {
  height: 28px;
  width: 80%;
  margin-bottom: 16px;
}

.skeleton-article-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.skeleton-meta-item {
  height: 16px;
  width: 100px;
}

/* 表格样式适配 */
:deep(.el-table__body-wrapper) {
  min-height: 200px;
}
</style>
