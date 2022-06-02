<script setup lang="ts">
import { h, ref, reactive, onMounted, resolveComponent } from "vue"
import { TableViewVo } from "@/common/tableViewVo"
import { VxeGridProps } from "vxe-table"
import {FormEvent} from './components/form'
import {ApiBase, Merchant, PayPackage} from "@/common/api";
import {message} from "ant-design-vue";
import PayPackageModel from './components/PayPackageModel.vue'
import format from "@/common/format";

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent:FormEvent = reactive<FormEvent>(new FormEvent());

// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  {type: 'checkbox', width: '60'},
  { field: "id", title: "套餐编号", showHeaderOverflow: true },
  { field: "name", title: "套餐", showHeaderOverflow: true },
  { field: "cost", title: "金额(元)", showOverflow: true ,
    // slots:{
    //   default:({row})=>{
    //     let money = format.moneyNubOverView(parseInt(row.cost))
    //     return [money.toString()]
    //   }
    // },
    formatter:({cellValue})=>format.moneyNubOverView(parseInt(cellValue))
  },
  {
    field: "status", title: "状态", minWidth: '120', slots: {
      default: ({row}) => {
        return [
          h(resolveComponent('a-tag'),
              {color: row.state == 1 ? 'green' : 'red'},
              () => row.state === 1 ? '已启用' : '已禁用')
        ];
      }
    },
    formatter:({cellValue})=>cellValue === 1 ? '已启用' : '已禁用'
  },
  {
    title: '操作', field: 'allowance', fixed: 'right', width: '160', slots: {
      default: ({row}) => {
        return [
          h('div', {
            className: "k-table-content-operation"
          }, [
            h(resolveComponent('KTableEditBtn'), {
              toolTipText: '修改', onClick: () => {
                formEvent.onModify("修改缴费套餐",row,'modify')
              }
            }),
            h(resolveComponent('KTableStatusBtn'), {
              onClick: async () => {
                row.state = row.state == 1 ? 2 : 1
                let res = await tableViewVo.onApi(PayPackage.EditPackageState,{
                  ids: [row.id],
                  state: row.state
                })
                if (res!=='') {
                  message.success('修改成功')
                } else row.state = row.state == 1 ? 2 : 1
              }
            }),
            h(resolveComponent('KTableDeleteBtn'), {
              onConfirm: () => {
                tableViewVo.onApi(PayPackage.DeletePackage,row)
              }
            }),
          ])
        ]
      }
    }
  }
]

// 重写此方法请求表格数据
tableViewVo.getDataFun = async (param) => {
  param.tenantId = tableViewVo.tenantCode
  tableViewVo.getMethods = PayPackage.GetAllPackage
  return await ApiBase(PayPackage.GetAllPackage({...param}))

}
onMounted(() => {
  tableViewVo.search()
})
//禁用 / 启用
const EditStatus = async (status:number) => {
  console.log(tableViewVo.checkList)

  if (tableViewVo.checkList.length<1) return false
  let res = await tableViewVo.onApi(PayPackage.EditPackageState,{
    ids: tableViewVo.checkList.map((item:any)=>item.id),
    state: status
  })
  if (res){
    message.success('操作成功')
  }
}
//删除
const onDelete = async ()=>{
  if (tableViewVo.checkList.length<1) {
    message.error('请选择套餐')
    return false
  }
  let res = await tableViewVo.onApi(PayPackage.DeletePackageBatches,{
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
          <a-form-item label="套餐编号">
            <a-input v-model:value="tableViewVo.form.id" placeholder="套餐编号"></a-input>
          </a-form-item>
          <a-form-item label="套餐名">
            <a-input v-model:value="tableViewVo.form.name" placeholder="套餐名"></a-input>
          </a-form-item>
        </a-form>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
      <template #toolbar_buttons>
        <div class="toolbar-buttons">
          <a-button type="primary" @click="formEvent.onModify('新增套餐',{tenantId:tableViewVo.tenantCode},'add')">新增套餐</a-button>
          <a-button type="primary" @click="EditStatus(2)">禁用</a-button>
          <a-button type="primary" @click="EditStatus(1)">启用</a-button>
          <a-button type="primary" danger>
            <a-popconfirm title="确认删除吗？" @confirm="onDelete">
              删除
            </a-popconfirm>
          </a-button>
        </div>
      </template>
    </k-table>
    <pay-package-model v-if="formEvent.show" :formEvent="formEvent" @finish="tableViewVo.reFresh()"/>

  </div>
</template>

<style lang="less">
.k-table-content-operation{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
