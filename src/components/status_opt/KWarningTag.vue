<script setup lang="ts">

const props = defineProps({
  text: String,
  icon: {
    type: String,
    default: 'exclamation-circle-outlined'
  }
})

</script>

<template>
  <a-tag color="warning">
    <template #icon v-if="props.icon">
      <antd-icon :icon="props.icon || 'exclamation-circle-outlined'"></antd-icon>
    </template>
    {{ props.text || '警告' }}
  </a-tag>
</template>