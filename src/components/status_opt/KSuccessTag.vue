<script setup lang="ts">

const props = defineProps({
  text: String
})

</script>

<template>
  <!-- <a-tag color="success">
    <template #icon>
      <antd-icon :icon="props.icon || 'check-circle-outlined'"></antd-icon>
    </template>
    {{ props.text || '正常' }}
  </a-tag> -->
  <span class="success-tag">
    {{ props.text || '正常' }}
  </span>
</template>

<style lang="less" scoped>
.success-tag {
  min-width: 64px;
  padding: 0 12px;
  height: 28px;
  background: var(--ant-color-primary-10);
  color: var(--ant-color-primary);
  border-radius: 14px;
  font-size: 14px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.success-tag::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  background: var(--ant-color-primary);
  border-radius: 50%;
  margin-right: 6px;
}
</style>