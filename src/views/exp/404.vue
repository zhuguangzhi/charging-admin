<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const backHome = () => {
  router.replace('/')
}
</script>

<template>
  <a-result status="404" title="404" sub-title="页面不存在">
    <template #extra>
      <a-button type="primary" @click="backHome">返回首页</a-button>
    </template>
  </a-result>
</template>
