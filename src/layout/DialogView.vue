<script setup lang="ts">
import { h, ref, reactive, onMounted, resolveComponent } from "vue"
import { DialogViewVo } from "@/common/dialogViewVo"

const props = defineProps({
  dialogViewVo: DialogViewVo
})

const emit = defineEmits(['success'])

// 这个一定要声明，不然TS会报错
const dialogViewVo = props.dialogViewVo as DialogViewVo
// 重写show方法
dialogViewVo.show = () => {
  dialogViewVo.visible = true
  console.log("重写show方法")
}
// 重写确认按钮点击方法
dialogViewVo.onConfirm = async (e:any) => {
  console.log("重写onConfirm方法")
  await wait(1000)
  dialogViewVo.visible = false
  emit('success')
}

// 同步等待
const wait = async (time: number) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null)
    }, time)
  })
}

</script>

<template>
  <a-modal
    v-model:visible="dialogViewVo.visible"
    :title="dialogViewVo.title"
    @ok="(e: any) => dialogViewVo.onOk(e)"
    @cancel="dialogViewVo.onCancel()"
    :confirmLoading="dialogViewVo.confirmLoading"
    :width="dialogViewVo.width"
    :maskClosable="dialogViewVo.maskClosable"
    :cancelText="dialogViewVo.cancelText"
    :okText="dialogViewVo.okText"
    >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>

<style lang="less" scoped>

</style>
