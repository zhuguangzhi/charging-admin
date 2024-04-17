<script setup lang="ts">
import KPopupInstance from "@/components/k_popup/KPopupVo";

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
    default: 'middle'
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
  // message.warning('取消' + props.text ?? '')
  KPopupInstance.open.value = false
  emit('cancel')
}
function openPopup() {
  KPopupInstance.openCall({
    title: '批量删除',
    msg: props.title,
    onOk: confirm,
    onClose: cancel,
  })
}
</script>

<template>
  <a-button :disabled="props.disabled" :type="props.type" :size="props.size" :danger="props.danger" @click="openPopup">
    {{ text }}
  </a-button>
</template>