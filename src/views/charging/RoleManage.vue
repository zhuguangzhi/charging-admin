<script setup lang="ts">
import { h, ref, reactive, onMounted, resolveComponent } from "vue"
import { TableViewVo } from "@/common/tableViewVo"
import { VxeGridProps } from "vxe-table"
import Role from  './components/Role.vue'
import {FormEvent} from './components/form'
import {ApiBase, errorCheck, Merchant, RoleApi} from "@/common/api";
import {account} from "@/store";
import SetAuthority from './components/SetAuthority.vue'
import {message} from "ant-design-vue";

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent:FormEvent = reactive<FormEvent>(new FormEvent());

// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  { field: "id", title: "角色编号",minWidth:'240', showHeaderOverflow: true },
  { field: "name", title: "角色名称",minWidth:'160', showHeaderOverflow: true },
  { field: "creatorName", title: "创建者",minWidth:'160', showHeaderOverflow: true },
  { field: "role", title: "角色权限",minWidth:'240', showOverflow: true,
    // slots:{
    // default:({row})=>{
    //   if(row.permissionEntityList!==null)
    //     return [row.permissionEntityList.map((item:any)=>item.description)]
    //   else return []
    // }
    // } ,
    formatter:({row})=>row.permissionEntityList?.map((item:any)=>item.description) || []
  },
  { field: "description", title: "角色描述",minWidth:'240', showHeaderOverflow: true },

  { field: "memo", title: "备注",minWidth:'240',  showOverflow: true },
  { title: '操作', field: 'allowance', fixed: 'right', minWidth:'160',  slots: { default: ({row}) => {
        return [
          h('div',{
            className:"k-table-content-operation"
          },[
            h(resolveComponent('KTableEditBtn'), {
              toolTipText: '修改', onClick: () => {
                formEvent.onModify("角色修改",row,'modify')
              }
            }),
            h(resolveComponent('KTableAutoBtn'), {
              toolTipText:"角色配置",
              iconType:"icon-quanxian",
              iconColor:"#B291DA",
              onClick: () => {
                authorityData.data = row
                authorityData.showModal=true
              }
            }),
            h(resolveComponent('KTableDeleteBtn'), {
              onConfirm: () => {
                tableViewVo.onApi(RoleApi.DeleteRole,row)
              }
            }),
          ])
        ]
      } } }
]


//权限配置
let authorityData:any = reactive<Object>({
  showModal:false,
  data:{}
})
// 数据获取
tableViewVo.getDataFun = async (param:any)=>{
  param.tenantId = tableViewVo.tenantCode
  tableViewVo.getMethods = RoleApi.GetAllRole
  return await ApiBase(RoleApi.GetAllRole({...param}),{showLoading:true})

}
onMounted(() => {
  tableViewVo.search()
})
//删除
const onDelete = async ()=>{
  if (tableViewVo.checkList.length<1) {
    message.error('请选择角色')
    return false
  }
  let res = await tableViewVo.onApi(RoleApi.DeleteBatchesRole,{
    ids: tableViewVo.checkList.map((item:any)=>item.id),
  })
  if (res){
    message.success('删除成功')
  }
}

</script>

<template>
  <div class="k-table-content">
    <div class="k-table-content-form">
      <k-table-form :tableViewVo="tableViewVo">
        <a-form layout="inline" :model="tableViewVo.form">
          <a-form-item label="角色名">
            <a-input v-model:value="tableViewVo.form.name" placeholder="角色名"></a-input>
          </a-form-item>
          <a-form-item label="角色编号">
            <a-input v-model:value="tableViewVo.form.id" placeholder="角色编号"></a-input>
          </a-form-item>
        </a-form>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
      <template #toolbar_buttons>
        <div class="toolbar-buttons">
          <a-button type="primary" @click="formEvent.onModify('新增角色',{tenantId:tableViewVo.tenantCode},'add')">新增角色</a-button>
          <a-button type="primary" danger>
            <a-popconfirm title="确认删除吗？" @confirm="onDelete">
              删除
            </a-popconfirm>
          </a-button>
        </div>
      </template>
    </k-table>
    <role  v-if="formEvent.show" :formEvent="formEvent" @finish="tableViewVo.reFresh()"/>
    <set-authority :authorityData="authorityData" @finish="tableViewVo.reFresh()" @cancel = "()=>authorityData.showModal = false"/>
  </div>
</template>

<style lang="less">
.k-table-content-operation{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
