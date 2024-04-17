<script setup lang="ts">
import {h, reactive, onMounted, resolveComponent} from "vue"
import {TableViewVo} from "@/common/tableViewVo"
import {VxeGridProps} from "vxe-table"
import AddMerchant from './components/AddMerchant.vue'
import {FormEvent} from './components/form'
import {Merchant} from "@/common/api";
import {message} from "ant-design-vue";
import KDeleteBtn from "@/components/KDeleteBtn.vue";


let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent: FormEvent = reactive<FormEvent>(new FormEvent());

//商户值置空，不展示商户下拉框
tableViewVo.tenantCode = ""
//数据表头
tableViewVo.vxeGridProps.columns = [
  {type: 'checkbox', width: '60'},
  {field: "tenantCode", title: "商户编码",minWidth: '240', showHeaderOverflow: true},
  {field: "name", title: "商户名称",minWidth: '240', showHeaderOverflow: true},
  {
    field: "state", title: "状态",minWidth: '100', slots: {
      default: 'state'
    },
    formatter:({cellValue})=>cellValue===1?'已启用':'已禁用'
  },
  {field: "memo", title: "备注",minWidth: '320', showHeaderOverflow: true},
  {
    title: '操作', field: 'allowance', fixed: 'right', width: '180', slots: {
      default: "operation"
      // default: ({row}) => {
      //   return [
      //     h('div', {
      //       className: "k-table-content-operation"
      //     }, [
      //       h(resolveComponent('KTableEditBtn'), {
      //         toolTipText: '修改', onClick: () => {
      //           formEvent.onModify("修改商户",row,'modify')
      //         }
      //       }),
      //       h(resolveComponent('KTableStatusBtn'), {
      //         onClick: async () => {
      //           row.state = row.state == 1 ? 2 : 1
      //           let res = await tableViewVo.onApi(Merchant.EditMerchantState,{
      //             ids: [row.id],
      //             state: row.state
      //           })
      //           if (res!=='') {
      //             message.success('修改成功')
      //           } else row.state = row.state == 1 ? 2 : 1
      //         }
      //       }),
      //       h(resolveComponent('KTableDeleteBtn'), {
      //         onConfirm: () => {
      //           tableViewVo.onApi(Merchant.DeleteMerchant,row)
      //         }
      //       }),
      //     ])
      //   ]
      // }
    }
  }
]
//数据获取
tableViewVo.getDataFun = async (param: any) => {
  tableViewVo.getMethods = Merchant.GetAllMerchant
  return await Merchant.GetAllMerchant({...param}).base()
}

onMounted(() => {
  tableViewVo.search()
})
//禁用 / 启用
const EditStatusBatch = async (status:number) => {
  if (tableViewVo.checkList.length<1) return false
  let res = await tableViewVo.onApi(Merchant.EditMerchantState,{
    ids: tableViewVo.checkList.map((item:any)=>item.id),
    state: status
  })
  if (res){
    message.success('操作成功')
  }
}
const EditStatus = async (row:any,isCheck:boolean)=>{
  await tableViewVo.onApi(Merchant.EditMerchantState,{
    ids: [row.id],
    state: isCheck?1:2
  })

}
//删除
const onDelete = async ()=>{
  if (tableViewVo.checkList.length<1) {
    message.error('请选择商户')
    return false
  }
  let res = await tableViewVo.onApi(Merchant.DeleteMerchantBatches,{
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
          <a-form-item label="">
            <a-input v-model:value="tableViewVo.form.name" placeholder="商户名" allowClear></a-input>
          </a-form-item>
          <a-form-item label="">
            <a-input v-model:value="tableViewVo.form.tenantCode" placeholder="商户编号" allowClear></a-input>
          </a-form-item>
        </a-form>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
      <template #toolbar_buttons>
        <div class="toolbar-buttons">
          <a-button type="primary" @click="formEvent.onModify('新增商户',{},'add')">新增商户</a-button>
          <a-button type="primary" @click="EditStatusBatch(2)">禁用</a-button>
          <a-button type="primary" @click="EditStatusBatch(1)">启用</a-button>
          <k-delete-btn @confirm="onDelete"/>
        </div>
      </template>
      <template #operation="{row}">
        <KTableEditBtn @click="formEvent.onModify('修改商户',row,'modify')"/>
        <KTableDeleteBtn @confirm="tableViewVo.onApi(Merchant.DeleteMerchant,row)"/>
      </template>
      <template #state="{row}">
        <KSwitchState :value="row['state']==1" @change="(checked)=>EditStatus(row,checked)"></KSwitchState>
      </template>
    </k-table>
    <add-merchant v-if="formEvent.show" :formEvent="formEvent" @finish="tableViewVo.reFresh()"/>
  </div>
</template>

<style lang="less">
.k-table-content-operation {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
