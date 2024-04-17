<script setup lang="ts">

const props = defineProps({
  toolTipText: String
})

const emit = defineEmits(['click'])

const onClick = () => {
  emit('click')
}

</script>

<template>
  <k-table-opt-btn :toolTipText="props?.toolTipText ?? '编辑'" @click="onClick" :use-tool="false">
    <span class="text">{{props?.toolTipText ?? '编辑'}}</span>
<!--    <icon-font type="icon-bianji" style="color: #1890ff;font-size: 18px"></icon-font>-->
  </k-table-opt-btn>
</template>
<style lang="less" scoped>
.text {
  color: var(--ant-color-primary);
}
</style>