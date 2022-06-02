<template>
  <a-modal
      :title="'详情'"
      :visible="true"
      :maskClosable="true"
      okText="了解了"
      @cancel="emit('finish')"
      @ok = "emit('finish')"
  >
    <div style="max-height: 45vh;overflow-y: scroll">
      <a-descriptions :column='1' bordered>
        <a-descriptions-item v-for="(item,index) in detailList.data" :key="index"
                             :label="item.label">{{item.value}}</a-descriptions-item>
      </a-descriptions>
      <a-descriptions v-show="detailList.data.children"
                      :title = "child.name"
                      v-for="(child,index) in detailList.data.children"
                      :key="index"
                      :column='1' bordered
                      style="margin-top: 8px"
      >
        <a-descriptions-item v-for="(item,key) in child.list" :key="key"
                             :label="item.label">{{item.value}}</a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive} from "vue";

const emit = defineEmits(["finish"]);

const props= defineProps({
  detailList:{
    type:Object,
    default:()=>{}
  },
})

const detailList:any = reactive(props.detailList)
console.log(detailList)

</script>

<style scoped lang="less">
</style>