<script setup lang="ts">
// import { h, ref, reactive, onMounted } from "vue"
// import { VxeGridProps } from "vxe-table"
import zhCN from 'ant-design-vue/es/locale/zh_CN'

</script>

<template>
  <!-- <div id="app"> -->
  <a-config-provider :locale="zhCN">
    <router-view/>
  </a-config-provider>
  <!-- </div> -->
</template>

<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: left;
  width: 100%;
  height: 100%;
}
</style>
