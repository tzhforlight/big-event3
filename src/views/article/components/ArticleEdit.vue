<template>
  <el-drawer :title="articleId ? '编辑文章' : '发布文章'" direction="rtl" v-model="visibleDrawer">
    <el-form ref="formRef" :model="formModel" label-width="80px" :rules="rules">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <el-select v-model="formModel.cate_id" placeholder="请选择文章分类">
          <el-option
            v-for="item in props.cateList"
            :key="item.cate_id"
            :label="item.cate_name"
            :value="item.cate_id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="img">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="unUploadFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <div v-else class="avatar-uploader-icon">
            <el-icon><Plus /></el-icon>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content" style="width: 468px">
        <QuillEditor
          :key="articleId"
          v-model:content="formModel.content"
          contentType="html"
          theme="snow"
          placeholder="请输入文章内容"
          class="article-editor"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublishArticle(1)">发布</el-button>
        <el-button type="info" @click="onPublishArticle(0)">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup lang="ts">
import { artArticleInfoService, artPublishArticleService } from '@/api/user'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElIcon, ElMessage } from 'element-plus'
import { defineExpose, onUnmounted, ref } from 'vue'
import type { Article, ArticleCategory } from '@/api/user'
import type { UploadFile } from 'element-plus'

const props = defineProps({
  cateList: {
    type: Array<Partial<ArticleCategory>>,
  },
})

const visibleDrawer = ref(false)
const formRef = ref()
const articleId = ref()
const formModel = ref<Partial<Article>>({
  title: '', //文章标题
  cate_id: undefined, //文章分类
  img: '', //文章封面
  content: '', //文章内容
  state: '', //文章状态 0-未发布 1-已发布
})

const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'change' }],
  cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
  img: [{ required: true, message: '请选择文章封面', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
}

const imageUrl = ref()
// 存储待上传的文件
const pendingFile = ref<File | null>(null)
// 存储创建的blob URLs，用于组件卸载时清理
const blobUrls = ref<string[]>([])

const unUploadFile = (file: UploadFile) => {
  // 立即创建一个临时的blob URL用于预览显示
  const blobUrl = URL.createObjectURL(file.raw!)
  imageUrl.value = blobUrl
  // 存储blob URL以便后续清理
  blobUrls.value.push(blobUrl)
  // 存储实际文件，将在发布时上传
  pendingFile.value = file.raw!
  console.log('pendingFile.value', pendingFile.value)
  // 设置一个特殊标记而不是清空，以通过表单验证
  // 这个值不会被发送到服务器，因为我们会在提交时特殊处理
  if (file) {
    formModel.value.img = '__has_image_file__'
  } else {
    formModel.value.img = ''
  }
}

// const beforeAvatarUpload = (file:File) => {
//   const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
//   const isLt2M = file.size / 1024 / 1024 < 2

//   if (!isJPG) {
//     ElMessage.error('上传头像图片只能是 JPG或PNG 格式!')
//   }
//   if (!isLt2M) {
//     ElMessage.error('上传头像图片大小不能超过 2MB!')
//   }
//   return isJPG && isLt2M
// }

const resetForm = () => {
  formModel.value = {
    title: '',
    cate_id: undefined,
    img: '',
    content: '',
    state: '',
  }
  imageUrl.value = '' // 同时重置imageUrl
}

const open = async (row: Article) => {
  console.log('发布率')
  formRef.value?.resetFields()
  // 先设置抽屉可见，确保组件完全渲染
  visibleDrawer.value = true
  articleId.value = row.id

  // 重置表单数据
  resetForm()

  // 如果是编辑模式，获取文章数据
  if (row.id) {
    try {
      const res = await artArticleInfoService(row.id)

      // 确保数据正确映射到表单中
      formModel.value = {
        ...res,
        // 确保分类ID正确设置
        cate_id: res.cate_id || undefined,
      }
      // 添加后端服务器基础URL前缀，确保图片正确加载
      const baseURL = 'http://localhost:3001'
      imageUrl.value = res.img && !res.img.startsWith('http') ? `${baseURL}${res.img}` : res.img
    } catch (error) {
      console.log('根据id获取文章数据失败', error)
    }
  } else {
    // 新增文章时清空图片
    imageUrl.value = ''
  }
}

const emit = defineEmits(['success'])
//发布
const onPublishArticle = async (state: number) => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (error) {
    console.error('表单验证失败', error)
    ElMessage.error('表单验证失败，请检查输入')
    return
  }

  try {
    // 如果有图片文件要上传，使用FormData和专门的上传处理
    if (pendingFile.value) {
      const formData = new FormData()
      formData.append('title', formModel.value.title || '')
      formData.append('cate_id', String(formModel.value.cate_id))
      formData.append('content', formModel.value.content || '')
      // 确保state作为字符串传递
      formData.append('state', String(state))
      formData.append('img', pendingFile.value)

      // 如果是编辑模式，还需要传递文章ID
      if (articleId.value) {
        formData.append('id', articleId.value)
      }

      await artPublishArticleService(formData)
    } else {
      // 如果没有文件上传，直接传递普通对象
      const submitData = {
        ...formModel.value,
        state: String(state),
        cate_id: Number(formModel.value.cate_id),
      }
      console.log('submitData', submitData)
      // 如果是编辑模式且没有上传新图片，但有原有图片路径，保留它
      if (articleId.value && !pendingFile.value && imageUrl.value) {
        submitData.img = imageUrl.value
      }

      // 移除特殊标记，避免发送到服务器
      if (submitData.img === '__has_image_file__') {
        // delete submitData.img
        submitData.img = ''
      }

      await artPublishArticleService(submitData)
    }

    // 上传成功后清除待上传文件
    pendingFile.value = null
    ElMessage.success(state === 1 ? '文章发布成功' : '文章保存成功')
    emit('success')
    visibleDrawer.value = false
  } catch (error) {
    console.log('文章发布失败', error)
  }
}
// 组件卸载时清理blob URLs，防止内存泄漏
onUnmounted(() => {
  blobUrls.value.forEach((url) => {
    URL.revokeObjectURL(url)
  })
})

defineExpose({ open })
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #000;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #000;
  width: 240px;
  height: 240px;
  line-height: 240px;
  text-align: center;
  background-color: #f5f7fa;
}

.avatar-uploader-icon .el-icon {
  font-size: 48px;
  color: #909399;
}
.avatar {
  width: 240px;
  height: 240px;
  display: block;
}

.article-editor {
  height: 200px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

/* .article-editor :deep(.ql-toolbar) {
  width: 468px;
  box-sizing: border-box;
  padding: 8px 12px;
}

.article-editor :deep(.ql-container) {
  height: 200px;
  width: 468px;
  box-sizing: border-box;
  clear: both;
} */
</style>
