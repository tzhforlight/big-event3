<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" plain :icon="Plus" @click="onPubArticle">发布文章</el-button>
    </template>

    <el-form ref="form" :model="queryParams" label-width="80px" :inline="true">
      <el-form-item label="文章分类">
        <el-select
          v-model="queryParams.cate_id"
          placeholder="请选择分类"
          style="width: 200px"
          clearable
        >
          <el-option
            v-for="item in cateList"
            :key="item.cate_id"
            :label="item.cate_name"
            :value="item.cate_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态" prop="state">
        <el-select
          v-model="queryParams.state"
          placeholder="请选择状态"
          style="width: 200px"
          clearable
        >
          <el-option label="已发布" value="1" />
          <el-option label="未发布" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain :icon="Search" @click="onSearch"> 搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" plain :icon="Refresh" @click="onReset"> 重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 骨架屏显示 -->
    <!-- <SkeletonLoader
      v-if="loading || articleList.length === 0"
      type="list"
      :count="5"
      v-show="articleList.length === 0"
    >
    </SkeletonLoader> -->

    <!-- 实际表格数据 -->
    <!-- <el-table v-else :data="articleList" style="width: 100%" v-model="formModel"> -->
    <el-table :data="articleList" style="width: 100%" v-model="formModel">
      <el-table-column prop="title" label="文章标题" align="center"> </el-table-column>
      <el-table-column prop="cate_name" label="分类" align="center"> </el-table-column>
      <el-table-column prop="pub_date" label="发布时间" align="center">
        <template #default="{ row }">
          {{ formatDate(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" align="center">
        <template #default="{ row }">
          <el-tag type="primary" v-if="row.state === 1">已发布</el-tag>
          <el-tag type="warning" v-if="row.state === 0">未发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="{ row }">
          <el-button type="primary" :icon="Edit" link @click="onEditArticle(row)">编辑</el-button>
          <el-button type="danger" :icon="Delete" link @click="onDelArticle(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      v-model:page-size="queryParams.pageSize"
      v-model:current-page="queryParams.pageNo"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total,sizes, prev, pager, next"
      style="margin-top: 20px; justify-content: flex-end"
      background
    />
  </PageContainer>
  <ArticleEdit ref="articleEditRef" :cateList="cateList" @success="getArticleList"></ArticleEdit>
</template>
<script setup lang="ts">
import { artDeleteArticleService, artGetArticleService, artGetChannelsService } from '@/api/user'
// import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { useMessage } from '@/hooks/web/useMessage.ts'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { ElMessage } from 'element-plus'
import type { Article, ArticleCategory } from '@/api/user'

const message = useMessage()
const cateList = ref<Partial<ArticleCategory>[]>([]) //文章分类列表
const total = ref<number>(0) //文章总数
const articleList = ref<Article[]>([]) //文章列表数据
const loading = ref(false)
const articleEditRef = ref()

interface RawInfo {
  title: string
  cate_name: string
  pub_date: string
  state: number
  id: number
}

const formModel = ref({
  title: '',
  pub_date: '',
  state: 0,
  cate_name: '',
})

const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  cate_id: undefined,
  state: undefined,
})

// 处理每页条数变化
// 时间格式化函数
const formatDate = (dateStr: Date) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const handleSizeChange = (size: number) => {
  queryParams.value.pageSize = size
  getArticleList()
}

// 处理页码变化
const handleCurrentChange = (current: number) => {
  queryParams.value.pageNo = current
  getArticleList()
}

//获取文章分类列表
const getChannelList = async () => {
  try {
    const res = await artGetChannelsService()
    cateList.value =
      res?.map((item) => ({
        cate_id: item.id,
        ...item,
      })) || []
  } catch (err) {
    console.log(err)
  }
}

//获取文章列表
const getArticleList = async () => {
  loading.value = true
  try {
    const res = await artGetArticleService(queryParams.value)
    console.log(res)
    total.value = res?.total || 0
    articleList.value = res?.list || []
  } catch (err) {
    console.log('文章数据请求错误', err)
  } finally {
    loading.value = false
  }
}

//编辑文章
const onEditArticle = async (row: Article) => {
  console.log('row', row)
  articleEditRef.value.open(row)
}

//删除文章
const onDelArticle = async (row: RawInfo) => {
  try {
    await message.confirm('是否删除该文章数据？', '提示', async () => {
      await artDeleteArticleService(row.id)
      ElMessage.success('删除成功')
      getArticleList()
    })
  } catch (error) {
    console.log('请求失败', error)
  }
}

//发布文章
const onPubArticle = () => {
  articleEditRef.value.open({})
  console.log('添加文章')
}

//搜索
const onSearch = () => {
  queryParams.value.pageNo = 1
  getArticleList()
}

//重置
const onReset = () => {
  queryParams.value = {
    pageNo: 1,
    pageSize: 10,
    cate_id: undefined,
    state: undefined,
  }
  getArticleList()
}

onMounted(() => {
  getChannelList() //获取文章分类
  getArticleList() //获取文章数据
})
</script>
<style scoped>
/* 表格骨架屏样式 */
.table-skeleton {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.table-row-skeleton {
  display: flex;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.table-row-skeleton:last-child {
  border-bottom: none;
}

.table-cell-skeleton {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-right: 16px;
  flex: 1;
}

.table-cell-skeleton.title-cell {
  flex: 2;
}

.table-cell-skeleton.action-cell {
  flex: 0.5;
  margin-right: 0;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
