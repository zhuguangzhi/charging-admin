<script setup lang="ts">

const props = defineProps({
  text: String,
  icon: {
    type: String,
    default: 'close-circle-outlined'
  }
})

</script>

<template>
  <a-tag color="error">
    <template #icon v-if="props.icon">
      <antd-icon :icon="props.icon || 'close-circle-outlined'"></antd-icon>
    </template>
    {{ props.text || '错误' }}
  </a-tag>
  <!-- <div class="error-tag">
    {{ props.text || '错误' }}
  </div> -->
</template>

<!-- <style lang="less" scoped>
.error-tag {
  width: 64px;
  height: 28px;
  background: rgba(255,121,29,0.05);
  color: #FF791D;
  border-radius: 14px;
  font-size: 14px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.error-tag::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  background: #FF791D;
  border-radius: 50%;
  margin-right: 6px;
}
</style> -->