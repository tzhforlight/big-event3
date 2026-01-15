<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel" plain :icon="Plus"> 添加分类 </el-button>
    </template>

    <el-table :data="channelList" v-loading="loading">
      <el-table-column type="index" label="序号" align="center" width="100"> </el-table-column>
      <el-table-column prop="cate_name" label="分类名称" align="center"> </el-table-column>
      <el-table-column prop="cate_alias" label="分类别名" align="center"> </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <div style="display: flex; justify-content: center; align-items: center">
            <el-button :icon="Edit" type="primary" @click="onEditChannel(row)" link>编辑</el-button>
            <el-button :icon="Delete" type="danger" @click="onDelChannel(row)" link>删除</el-button>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <ChannelEdit ref="dialogRef" @success="getChannelList"></ChannelEdit>
  </page-container>
</template>

<script setup lang="ts">
import { artDeleteChannelService, artGetChannelsService } from '@/api/user'
import { useMessage } from '@/hooks/web/useMessage.ts'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import ChannelEdit from './components/ChannelEdit.vue'
import type { ArticleCategory } from '@/api/article'

const channelList = ref<ArticleCategory[]>([])
const loading = ref(false)
const dialogRef = ref()
// const pageContainerRef = ref()
const message = useMessage()

//获取文章分类
const getChannelList = async () => {
  loading.value = true
  try {
    const res = await artGetChannelsService()
    channelList.value = res
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const onEditChannel = (row: ArticleCategory) => {
  dialogRef.value.open(row)
}

const onDelChannel = (row: ArticleCategory) => {
  message.confirm('你确认删除该条信息?', '提示', async () => {
    try {
      await artDeleteChannelService(row.id)
      ElMessage.success('删除成功')
      await getChannelList()
    } catch (err) {
      console.log('删除失败', err)
    }
  })
}

const onAddChannel = () => {
  dialogRef.value.open({})
}

onMounted(() => {
  getChannelList()
})
</script>

<style scoped></style>
