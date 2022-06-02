<script setup lang="ts">

import { message } from 'ant-design-vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'

let props = defineProps({
  title: {
    type: String,
    default: '确定删除吗？'
  },
  text: {
    type: String,
    default: '删除'
  },
  size: {
    type: String,
    default: 'small'
  },
  type: {
    type: String,
    default: 'primary'
  },
  danger: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

let emit = defineEmits(['confirm', 'cancel'])

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  message.warning('取消' + props.text ?? '')
  emit('cancel')
}

</script>

<template>
  <a-popconfirm
    class="k-delete-btn"
    :disabled="props.disabled"
    :title="props.title"
    @confirm="confirm"
    @cancel="cancel">
    <template #icon><question-circle-outlined style="color: red" /></template>
    <a-button :disabled="props.disabled" :type="props.type" :size="props.size" :danger="props.danger">
      {{ text }}
    </a-button>
  </a-popconfirm> 
</template>