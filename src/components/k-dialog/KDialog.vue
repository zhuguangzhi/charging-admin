<script setup lang="ts">
import { DialogViewVo } from './dialogViewVo'
import {watchEffect} from "vue"

const props = defineProps({
  dialogView: {
    type: DialogViewVo,
    default () {
      return new DialogViewVo({})
    }
  }
})
</script>

<template>
  <a-modal
    :destroyOnClose="props.dialogView.destroyOnClose"
    v-model:visible="props.dialogView.visible"
    :title="props?.dialogView?.title"
    @ok="(e: any) => props?.dialogView?.onOk(e)"
    @cancel="props?.dialogView.onCancel()"
    :confirmLoading="props?.dialogView.confirmLoading"
    :wrapClassName="props?.dialogView?.fullScreen ? 'fullScreenWrap' : (props?.dialogView?.wrapClass ? props?.dialogView?.wrapClass : '')"
    :width="props?.dialogView.width"
    :maskClosable="props?.dialogView.maskClosable"
    :cancelText="props?.dialogView.cancelText"
    :okText="props?.dialogView.okText">
      <slot></slot>
  </a-modal>
</template>

<style scoped lang="scss">
</style>
