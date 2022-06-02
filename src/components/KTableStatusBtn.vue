<script setup lang="ts">

import {message} from "ant-design-vue";
import { QuestionCircleOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  toolTipText: String,
  title: String,
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click','cancel'])

const confirm = () => {
  emit('click')
}

</script>

<template>
  <a-popconfirm
      class="k-delete-btn"
      :disabled="props.disabled"
      :title="props?.title ?? '确认修改吗？'"
      @confirm="confirm">
    <template #icon><question-circle-outlined style="color: red" /></template>
  <k-table-opt-btn :toolTipText="props?.toolTipText ?? '状态'">
    <icon-font type="icon-ecs-running" style="color: #1890ff;"></icon-font>
  </k-table-opt-btn>
  </a-popconfirm>
</template>