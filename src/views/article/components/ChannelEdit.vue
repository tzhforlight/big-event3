<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加分类'" width="25%">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name" minlength="1" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" minlength="1" maxlength="15"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { artAddChannelService, artEditChannelService } from '@/api/user'
import { ref } from 'vue'
import type { ArticleCategory } from '@/api/user'

const dialogVisible = ref(false)
const formRef = ref()

const formModel = ref<Partial<ArticleCategory>>({
  id: undefined,
  cate_name: '',
  cate_alias: '',
})

const rules = {
  cate_name: [
    {
      required: true,
      message: '请输入分类名称',
      trigger: 'blur',
    },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur',
    },
  ],
  cate_alias: [
    {
      required: true,
      message: '请输入分类别名',
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur',
    },
  ],
}

const open = (row: ArticleCategory) => {
  dialogVisible.value = true
  // 重置表单验证状态
  if (formRef.value) {
    formRef.value?.resetFields()
  }
  if (row) {
    formModel.value = { ...row }
  }
}

const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value?.validate()
  try {
    // formModel.value.id
    //   ? await artEditChannelService(formModel.value)
    //   : await artAddChannelService(formModel.value)
    if (formModel.value.id) {
      await artEditChannelService(formModel.value)
    } else {
      await artAddChannelService(formModel.value)
    }
    emit('success')
    dialogVisible.value = false
  } catch (err) {
    console.log('提交失败', err)
  }
}

defineExpose({ open })
</script>
