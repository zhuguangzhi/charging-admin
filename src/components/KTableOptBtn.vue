<script setup lang="ts">import { number } from 'vue-types';


const props = defineProps({
  toolTipPlacement: String,
  toolTipText: String,
  mouseEnterDelay: Number
})

const emit = defineEmits(['click'])
const onClick = () => {
  emit('click')
}

</script>

<template>
  <a-tooltip :placement="props?.toolTipPlacement ?? 'top'" :mouseEnterDelay="props?.mouseEnterDelay ?? 0.8">
    <template #title>
      <span>{{ props?.toolTipText ?? '' }}</span>
    </template>
    <div style="padding: 0 8px;display: inline-block;cursor: pointer;" @click="onClick">
      <slot></slot>
    </div>
  </a-tooltip>
</template>