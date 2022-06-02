<script setup lang="ts">
import { message } from 'ant-design-vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  toolTipText: {
    type: String,
    default: "删除"
  },
  title: String,
  disabled: {
    type: Boolean,
    default: false
  },
  iconType:{
    type:String,
    default:()=>'icon-shanchu2'
  }
})

// const emit = defineEmits(['click'])

// const onClick = () => {
//   emit('click')
// }

let emit = defineEmits(['confirm', 'cancel'])

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  message.warning('取消' + props?.toolTipText ?? '')
  emit('cancel')
}

</script>

<template>
  <a-popconfirm
    class="k-delete-btn"
    :disabled="props.disabled"
    :title="props?.title ?? '确认删除吗？'"
    @confirm="confirm"
    @cancel="cancel">
    <template #icon><question-circle-outlined style="color: red" /></template>
    <k-table-opt-btn :toolTipText="props?.toolTipText ?? ''">
      <icon-font :type="iconType" style="color: #ed6f6f;"></icon-font>
    </k-table-opt-btn>
  </a-popconfirm> 
</template>