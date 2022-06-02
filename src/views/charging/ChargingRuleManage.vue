<script setup lang="ts">
import { h, ref, reactive, onMounted, resolveComponent,getCurrentInstance } from "vue"
import { TableViewVo } from "@/common/tableViewVo"
import { VxeGridProps } from "vxe-table"
import {FormEvent} from './components/form'
import BillingRuleEdit from './components/BillingRuleEdit.vue'
import {ApiBase, ChargingRuleApi, Merchant} from "@/common/api";
import {message} from "ant-design-vue";
import ChargingDetails from './DeviceManage/components/ChargingDetails.vue'
import format from "@/common/format";

//详情
const detailList:any = reactive({
  showDetails:false,
  data:[] as Array<object>
})

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent:FormEvent = reactive<FormEvent>(new FormEvent());
// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  {type: 'checkbox', width: '60'},
  { field: "id", title: "规则编号", minWidth: '240' },
  { field: "name", title: "规则名称",minWidth: '160' },
  { field: "free", title: "免费时间（分钟）", minWidth: '180' },
  { field: "kilowatt", title: "免费电量（度）", minWidth: '180' },
  { field: "billType", title: "计费类型", minWidth: '200' ,
    // slots:{
    // default:({row})=>[
    //     (format.billType.find(item=>item.key===row.billType) as formatType).label
    // ]
    // },
    formatter:({cellValue})=>(format.billType.find(item=>item.key===cellValue) as formatType).label
  },
  { field: "memo", title: "备注", minWidth: '320' },
  { title: '操作', field: 'allowance', fixed: 'right', minWidth: '120', slots: { default: ({row}) => {
        return [
          h('div',{
            className:"k-table-content-operation"
          },[
            h(resolveComponent('KTableEditBtn'), {
              toolTipText: '修改', onClick: () => {
                formEvent.onModify("修改规则",row,'modify')
              }
            }),
            h(resolveComponent('KTableDetailBtn'), {
              toolTipText:"详情",
              iconType:"icon-jiaoseguanli",
              iconColor:"#B291DA",
              onClick: () => {
                onSeeDetails(row)
              }
            }),
            h(resolveComponent('KTableDeleteBtn'), {
              onConfirm: () => {
                tableViewVo.onApi(ChargingRuleApi.DeleteRule,row)
              }
            }),
          ])
        ]
      } } }
]

// 重写此方法请求表格数据
tableViewVo.getDataFun = async (param:any)=>{
  param.tenantId = tableViewVo.tenantCode
  tableViewVo.getMethods = ChargingRuleApi.GetAllRule
  return await ApiBase(ChargingRuleApi.GetAllRule({...param}),{showLoading:true})


}
const instance:any= getCurrentInstance()
onMounted(() => {
  tableViewVo.search()
})
//查看详情
const onSeeDetails = (data:any)=>{
  detailList.showDetails = true
  detailList.data = [
    {label:'规则名',value:data.name},
    {label:'规则编号',value:data.id},
    {label:'免费时长（分钟）',value:data.free},
    {label:'免费电量（度）',value:data.kilowatt},
    {label:'计费类型',value:data.billType===1?'平台计费':'三方计费'},
  ]
  if (data.ruleChargeList.length>0){
    detailList.data.children = []
    data.ruleChargeList.forEach((item:any)=>{
      detailList.data.children.push(
          {
            name:item.name,
            list:[
              {label:'收费配置编号',value:item.id},
              {label:'开始时间',value:item.startTime},
              {label:'结束时间',value:item.endTime},
              {label:'计费模式',value:item.cycle===1?'按电量':'按时间'},
              {label:'单价(元/度或元/时)',value:item.cost/100},
              {label:'服务费(元/度或元/时)',value:item.fee/100},
            ]
          }
      )
    })

  }
}
//删除管理员
const onDelete = async ()=>{
  if (tableViewVo.checkList.length<1) {
    message.error('请选择管理员')
    return false
  }
  let res = await tableViewVo.onApi(ChargingRuleApi.DeleteRuleBatches,{
    ids: tableViewVo.checkList.map((item:any)=>item.id),
  })
  if (res){
    message.success('删除成功')
  }
}
const onAddBillRule = () => {
  formEvent.open=()=>{
    formEvent.show = true;
    formEvent.formData = {};
  }
  formEvent.open()
}
</script>

<template>
  <div class="k-table-content">
    <div class="k-table-content-form">
      <k-table-form :tableViewVo="tableViewVo">
        <a-form layout="inline" :model="tableViewVo.form">
          <a-form-item label="规则编号">
            <a-input v-model:value="tableViewVo.form.id" placeholder="规则编号"></a-input>
          </a-form-item>
          <a-form-item label="规则名">
            <a-input v-model:value="tableViewVo.form.name" placeholder="规则名"></a-input>
          </a-form-item>
        </a-form>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
      <template #toolbar_buttons>
        <div class="toolbar-buttons">
          <a-button type="primary" @click="formEvent.onModify('新增规则',{tenantId:tableViewVo.tenantCode},'add')">新增规则</a-button>
          <a-button type="primary" danger>
            <a-popconfirm title="确认删除吗？" @confirm="onDelete">
              删除
            </a-popconfirm>
          </a-button>
        </div>
      </template>
    </k-table>
    <billing-rule-edit @finish="tableViewVo.reFresh()" :formEvent="formEvent" v-if="formEvent.show"/>
    <charging-details v-if="detailList.showDetails" :detailList="detailList" @finish = "()=>{detailList.showDetails = false}"/>
  </div>
</template>

<style lang="less">
.k-table-content-operation{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
