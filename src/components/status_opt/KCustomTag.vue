<template>
  <span ref="customTag" class="custom-tag" :style="cssVar">
    {{ props.text || '正常' }}
  </span>
</template>

<script setup lang="ts">
import {computed, defineProps, nextTick, ref, watch} from "vue"

const props = defineProps({
  text: String,
  color: {
    type:String,
    required:true
  }
})
const customTag = ref()
const cssVar = computed(() => {
  return {
    '--primaryColor': props.color,
  }
})
// 将颜色转换为 RGB 格式
function colorToRgb(color:string) {
  const tempElem = document.createElement("div")
  tempElem.style.color = color
  document.body.appendChild(tempElem)
  const computedColor = getComputedStyle(tempElem).color
  document.body.removeChild(tempElem)
  return computedColor.replace(/rgb/i, "rgba").replace(")", ", 0.1)")
}
watch(()=>props.color,(value)=>{
  nextTick(()=>{
    customTag.value.style.backgroundColor=colorToRgb(value)
  })
},{immediate:true})
</script>

<style lang="scss" scoped>
@function rgba-dynamic($color, $alpha) {
  @return rgba($color, $alpha);
}

.custom-tag {
  min-width: 64px;
  height: 28px;
  padding: 0 12px;
  box-sizing: border-box;
  color: var(--primaryColor);
  border-radius: 14px;
  font-size: 14px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.custom-tag::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  background: var(--primaryColor);
  border-radius: 50%;
  margin-right: 6px;
}
</style>
