<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  checkedText: {
    type: String,
    default: '启用'
  },
  unCheckedText: {
    type: String,
    default: '禁用'
  }
})
const emits = defineEmits(['change'])
function changValue(isCheck:boolean) {
  emits('change',isCheck)
}
</script>

<template>
  <div>
    <a-switch :checked-children="checkedText" :un-checked-children="unCheckedText" :checked="value" @change="changValue" />
  </div>
</template>

<style scoped lang="less">

</style>