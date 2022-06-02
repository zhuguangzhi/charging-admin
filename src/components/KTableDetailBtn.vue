<script setup lang="ts">

const props = defineProps({
  toolTipText: String,
  iconColor:{
    type:String,
    default:()=>'#1890ff'
  }
})

const emit = defineEmits(['click'])

const onClick = () => {
  emit('click')
}

</script>

<template>
  <k-table-opt-btn :toolTipText="props?.toolTipText ?? '查看详情'" @click="onClick">
    <icon-font type="icon-xiangqing" :style="{color:props.iconColor}"></icon-font>
  </k-table-opt-btn>
</template>