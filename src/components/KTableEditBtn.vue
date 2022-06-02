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
  <k-table-opt-btn :toolTipText="props?.toolTipText ?? '编辑'" @click="onClick">
    <icon-font type="icon-bianji" style="color: #1890ff;"></icon-font>
  </k-table-opt-btn>
</template>