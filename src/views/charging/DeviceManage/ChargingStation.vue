<script setup lang="ts">
import { h, ref, reactive, onMounted, resolveComponent } from "vue"
import { TableViewVo } from "@/common/tableViewVo"
import { VxeGridProps } from "vxe-table"
import ChargingStation from  './components/ChargingStationModal.vue'
import {FormEvent} from '../components/form'
import {ApiBase, errorCheck, ChargingApi, AdminApi} from "@/common/api";
import SetCharging from './components/SetCharging.vue'
import {message} from "ant-design-vue";
import {BrandList} from "@/common/BrandConfig";

type chargingDataType = {
  type:string,
  name?:string,
  chargingId?:number | string,
  showModal:boolean
  data:object[]
}
let chargingData = reactive<chargingDataType>({
  type:"station",
  name:"",
  showModal:false,
  data:[],
  chargingId:''
})
let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent:FormEvent = reactive<FormEvent>(new FormEvent());
// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  {type: 'checkbox', width: '60'},
  { field: "id", title: "充电站编号",minWidth:'240', showHeaderOverflow: true },
  { field: "name", title: "充电站名称",minWidth:'240', showHeaderOverflow: true },
  { field: "status", title: "状态", minWidth:'120',slots:{
      default:({row})=>{
        return [
          h(resolveComponent('a-tag'),
              {color: row.enabled==1?'green':'red' },
              ()=>row.enabled===1?'已启用':'已禁用')
        ];
      }
    },
    formatter:({cellValue})=>cellValue===1?'已启用':'已禁用'

  },
  { field: "chargingPileSum", title: "绑定桩数量",minWidth:'120', showHeaderOverflow: true },
  { field: "province", title: "所属省",minWidth:'120', showOverflow: true },
  { field: "city", title: "所属市",minWidth:'120', showOverflow: true },
  { field: "district", title: "所属区",minWidth:'120', showOverflow: true },
  { field: "address", title: "详细地址", minWidth:'120',showOverflow: true },
  { field: "road", title: "所属道路",minWidth:'120', showOverflow: true },
  { field: "longitude", title: "经度",minWidth:'120', showOverflow: true },
  { field: "latitude", title: "纬度",minWidth:'120', showOverflow: true },
  { title: '操作', field: 'allowance', fixed: 'right', minWidth:'180', slots: { default: ({row}) => {
        return [
          h('div',{
            className:"k-table-content-operation"
          },[
            h(resolveComponent('KTableEditBtn'), {
              toolTipText: '修改', onClick: () => {
                formEvent.onModify("充电站修改",row,'modify')
              }
            }),
            h(resolveComponent('KTableAutoBtn'), {
              toolTipText:"桩配置",
              iconType:"icon-shezhi2",
              iconColor:"#B291DA",
              onClick: () => {
                chargingData.showModal=true;
                chargingData.name = row.name;
                chargingData.chargingId = row.id
                chargingData.data = row.deviceList || []
              }
            }),
            h(resolveComponent('KTableDeleteBtn'), {
              onConfirm: () => {
                tableViewVo.onApi(ChargingApi.DeleteStation,row)
              }
            }),

          ])
        ]
      } } }
]

onMounted(() => {
  tableViewVo.search()
})

tableViewVo.getDataFun = async (param:any)=>{
  param.tenantId = tableViewVo.tenantCode
  tableViewVo.getMethods = ChargingApi.GetAllStation
  return await ApiBase(ChargingApi.GetAllStation({...param}),{showLoading:true})

}
//删除
const onDelete = async ()=>{
  if (tableViewVo.checkList.length<1) {
    message.error('请选择站点')
    return false
  }
  let res = await tableViewVo.onApi(ChargingApi.DeleteStationBatches,{
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
          <a-form-item label="充电站名">
            <a-input v-model:value="tableViewVo.form.name" placeholder="充电站名"></a-input>
          </a-form-item>
          <a-form-item label="充电站编号">
            <a-input v-model:value="tableViewVo.form.id" placeholder="充电站编号"></a-input>
          </a-form-item>
          <a-form-item label="充电站区域">
            <a-input v-model:value="tableViewVo.form.district" placeholder="充电站区域"></a-input>
          </a-form-item>
        </a-form>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
      <template #toolbar_buttons>
        <div class="toolbar-buttons">
          <a-button type="primary" @click="formEvent.onModify('新增充电站',{tenantId:tableViewVo.tenantCode},'add')">新增充电站</a-button>
          <a-button type="primary" danger>
            <a-popconfirm title="确认删除吗？" @confirm="onDelete">
              删除
            </a-popconfirm>
          </a-button>
        </div>
      </template>
    </k-table>
    <charging-station v-if="formEvent.show" :formEvent="formEvent" @finish="tableViewVo.reFresh()"/>
    <set-charging v-if="chargingData.showModal" :ChargingData="chargingData" @cancel = "()=>chargingData.showModal = false"  @finish = "tableViewVo.reFresh()"></set-charging>
  </div>
</template>

<style lang="less">
.k-table-content-operation{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
