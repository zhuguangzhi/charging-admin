<script setup lang="ts">

const props = defineProps({
  toolTipText: String,
  iconType:{
    default:()=>'icon-bianji',
    type:String
  },
  iconColor:{
    default:()=>'#1890ff',
    type:String
  }
})

const emit = defineEmits(['click'])

const onClick = () => {
  emit('click')
}

</script>

<template>
  <k-table-opt-btn :toolTipText="props?.toolTipText" @click="onClick">
    <icon-font :type="props.iconType" :style="{color: props.iconColor}"></icon-font>
  </k-table-opt-btn>
</template>