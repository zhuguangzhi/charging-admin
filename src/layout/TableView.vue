<script setup lang="ts">
import { h, ref, reactive, onMounted, resolveComponent } from "vue"
import { TableViewVo } from "@/common/tableViewVo"
import { VxeGridProps } from "vxe-table"
import DialogView from "./DialogView.vue"
import { DialogViewVo } from "@/common/dialogViewVo"

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({id: 'tableview'}), { showMord: true }))



// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  { type: "seq", width: 50 },
  { field: "name", title: "name", slots: {
    default: ({row}) => {
      return [
        h(
          resolveComponent('a-button'),
          {
            onClick: () => {
              row.address = "123456"
            }
          },
          () => "123"
        )
      ]
    }
  } },
  { field: "sex", title: "sex", showHeaderOverflow: true },
  { field: "sex", title: "sex", showHeaderOverflow: true },
  { field: "address", title: "Address", showOverflow: true },
  { title: '操作', field: 'allowance', fixed: 'right', width: '122', slots: { default: ({row}) => {
    return [
      // h(
      //   resolveComponent('k-delete-btn'),
      //   {
      //     onConfirm: () => {
      //       console.log('确认')
      //     }
      //   },
      //   () => "操作按钮"
      // ),
      // h(resolveComponent('icon-font'), { type: "icon-bianji", style: { color: "#1890ff", cursor: "pointer" } }),
      h(resolveComponent('KTableEditBtn'), { onClick: () => { console.log('点击了编辑按钮') } }),
      h(resolveComponent('a-divider'), { type: "vertical" }),
      h(resolveComponent('KTableDeleteBtn'), { onConfirm: () => { console.log('点击了删除按钮') } }),
      h(resolveComponent('a-divider'), { type: "vertical" }),
      h(resolveComponent('KTableDetailBtn'), { onClick: () => { console.log('点击了查看详情按钮') } }),
      h(resolveComponent('a-divider'), { type: "vertical" }),
      h(resolveComponent('KTableStatusBtn'), { onClick: () => { console.log('点击了状态按钮') } }),
      // h(
      //   resolveComponent('k-delete-btn'),
      //   {
      //     onConfirm: () => {
      //       console.log('确认')
      //     }
      //   },
      //   () => "操作按钮"
      // )
    ]
  } } }
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


let dialogViewVo: DialogViewVo = reactive<DialogViewVo>(new DialogViewVo())

const open = () => {
  console.log()
  dialogViewVo.show()
}

</script>

<template>
  <div class="k-table-content">
    <div class="k-table-content-form">
      <k-table-form :tableViewVo="tableViewVo">
        <a-form layout="inline" :model="tableViewVo.form">
          <slot name="search">
            <a-form-item label="用户名">
              <a-input v-model:value="tableViewVo.form.user" placeholder="Username"></a-input>
            </a-form-item>
            <a-form-item label="密码">
              <a-input v-model:value="tableViewVo.form.user2" placeholder="Password"></a-input>
            </a-form-item>
            <a-form-item label="用户名">
              <a-input v-model:value="tableViewVo.form.user" placeholder="Username"></a-input>
            </a-form-item>
          </slot>
          <template v-if="tableViewVo.isMore">
            <a-form-item label="密码">
              <a-input v-model:value="tableViewVo.form.user2" placeholder="Password"></a-input>
            </a-form-item>
            <a-form-item label="用户名">
              <a-input v-model:value="tableViewVo.form.user" placeholder="Username"></a-input>
            </a-form-item>
            <a-form-item label="密码">
              <a-input v-model:value="tableViewVo.form.user2" placeholder="Password"></a-input>
            </a-form-item>
            <a-form-item label="用户名">
              <a-input v-model:value="tableViewVo.form.user" placeholder="Username"></a-input>
            </a-form-item>
            <a-form-item label="密码">
              <a-input v-model:value="tableViewVo.form.user2" placeholder="Password"></a-input>
            </a-form-item>
          </template>
        </a-form>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
      <template #toolbar_buttons>
        <div class="toolbar-buttons">
          <a-button type="primary" @click="open">打开弹窗</a-button>
        </div>
      </template>
    </k-table>
    
    <DialogView :dialogViewVo="dialogViewVo" @success="tableViewVo.reFresh()"></DialogView>
    
  </div>
</template>

<style lang="less" scoped>

</style>
