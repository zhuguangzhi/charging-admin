<script setup lang="ts">
import {reactive, onMounted} from "vue"
import {TableViewVo} from "@/common/tableViewVo"
import {VxeGridProps} from "vxe-table"
import {CarUserApi} from "@/common/api";

import {getLabel} from "@/common/format";

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
tableViewVo.tenantCode = ''
tableViewVo.useExport = true


// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  {field: "id", title: "用户编号", minWidth: "240", showHeaderOverflow: true},
  // {field: "username", title: "用户名", minWidth: "160", showHeaderOverflow: true},
  // {field: "name", title: "姓名", minWidth: "160", showHeaderOverflow: true},
  // {field: "nickname", title: "昵称", minWidth: "160", showHeaderOverflow: true},
  // {field: "openId", title: "微信公众号oppId", minWidth: "240", showHeaderOverflow: true},
  {field: "appletOpenId", title: "微信小程序oppId", minWidth: "240", showHeaderOverflow: true},
  {field: "phone", title: "联系电话", minWidth: "160", showHeaderOverflow: true},
  {field: "sex", title: "性别", minWidth: "140", showHeaderOverflow: true,
    // slots:{
    //   default: ({row}) => {
    //     return [format.sexType[row.sex].label]
    //   }
    // },
    formatter:({cellValue})=>getLabel('sexType',cellValue)
  },
  {field: "userType", title: "用户类别", minWidth: "140", showHeaderOverflow: true,
    // slots:{
    //   default: ({row}) => {
    //     let res = format.userType.find(item=>item.key===row.userType) as {key:number,label:string}
    //     return [res?.label]
    //   }},
    formatter:({cellValue})=>getLabel('userType',cellValue)
  },

]

// 重写此方法请求表格数据
tableViewVo.getDataFun = async (param) => {
  tableViewVo.getMethods = CarUserApi.GetAllUser
  return await CarUserApi.GetAllUser({...param}).base()
}
onMounted(() => {
  tableViewVo.search()
})

</script>

<template>
  <div class="k-table-content">
    <div class="k-table-content-form">
      <k-table-form :tableViewVo="tableViewVo">
        <a-form layout="inline" :model="tableViewVo.form">
          <a-form-item label="">
            <a-input v-model:value="tableViewVo.form.id" placeholder="用户编号" allowClear></a-input>
          </a-form-item>
          <a-form-item label="">
            <a-input v-model:value="tableViewVo.form.phone" placeholder="联系电话" allowClear></a-input>
          </a-form-item>
        </a-form>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
      <!--      <template #toolbar_buttons>-->
      <!--        <div class="toolbar-buttons">-->
      <!--          <a-button type="primary" >批量关闭</a-button>-->
      <!--        </div>-->
      <!--      </template>-->
    </k-table>
    <!--    <order-detail v-if="orderDetails.showModal" :orderDetails="orderDetails" @cancel="()=>orderDetails.showModal = false"-->
    <!--                  @finish="tableViewVo.reset()"/>-->

  </div>

</template>

<style lang="less">
.k-table-content-operation {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
