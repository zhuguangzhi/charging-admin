<script setup lang="ts">
import { message } from 'ant-design-vue'
import KPopupInstance from "@/components/k_popup/KPopupVo"
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import {ref} from "vue";

const props = defineProps({
  toolTipText: {
    type: String,
    default: "删除"
  },
  title: String,
  msg:String,
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
  KPopupInstance.open.value = false
  emit('cancel')
}

function openPopup() {
  KPopupInstance.openCall({
    title: '删除',
    msg: props.title || props.msg || "确认删除吗?",
    onOk: confirm,
    onClose: cancel,
  })
}
</script>

<template>
    <k-table-opt-btn :toolTipText="props?.toolTipText ?? '删除'" @click="openPopup" :use-tool="false">
      <span style="color: #FF7875">{{props?.toolTipText ?? '删除'}}</span>
<!--      <icon-font :type="iconType" style="color: #ed6f6f;font-size: 18px"></icon-font>-->
    </k-table-opt-btn>
</template>