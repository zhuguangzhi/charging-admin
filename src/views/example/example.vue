<script setup lang="ts">
import { h, ref, reactive, onMounted } from "vue"
import { TableViewVo } from "@/common/tableViewVo"
import { VxeGridProps } from "vxe-table"
import { account } from '@/store'

const accountStore = account()

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({id: 'example'})))

// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  { type: "seq", width: 50 },
  { field: "name", title: "name" },
  { field: "sex", title: "sex", showHeaderOverflow: true },
  { field: "address", title: "Address", showOverflow: true }
]

// 重写此方法请求表格数据
tableViewVo.getDataFun = (param) => {
  console.log('TableView', param)
  tableViewVo.loading = true
  setTimeout(() => {
    let data: any = JSON.parse(JSON.stringify(tableViewVo.vxeGridProps.data))
    data.push({ name: '1111', sex: '男', address: '地址1111' })
    tableViewVo.vxeGridProps.data = data

    tableViewVo.total = tableViewVo?.vxeGridProps?.data?.length ?? 0
    tableViewVo.loading = false
  }, 1000)
}

onMounted(() => {
  tableViewVo.search()
})

let visibleModel = ref(false)
const testClick = () => {
  visibleModel.value = true
}

const vFocus = {
  mounted(el:any) {
    console.log("自定义指令: mounted", el)
  },
  updated(el:any){
    console.log("自定义指令: updated", el)
  }
}

// let kTableContent = ref(null)
// const getContainer = () => {
//   const app = document.body
//   console.log('app', app)
//   return app
// }

</script>

<template>
  <div class="k-table-content" ref="kTableContent">
    <div class="k-table-content-form">
      <k-table-form :tableViewVo="tableViewVo">
        <a-form layout="inline" :model="tableViewVo.form">
          <a-form-item label="用户名">
            <a-input v-model:value="tableViewVo.form.user" placeholder="Username"></a-input>
          </a-form-item>
          <a-form-item label="密码">
            <a-input v-model:value="tableViewVo.form.user2" placeholder="Password"></a-input>
          </a-form-item>
        </a-form>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
      <template #toolbar_buttons>
        <div class="toolbar-buttons">
          <a-button type="primary" @click="testClick">测试按钮</a-button>
        </div>
      </template>
    </k-table>
    <a-modal v-model:visible="visibleModel" title="Basic Modal">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>

</style>
