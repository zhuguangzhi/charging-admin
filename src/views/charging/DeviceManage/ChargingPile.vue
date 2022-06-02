<script setup lang="ts">
import { h, ref, reactive, onMounted, resolveComponent,getCurrentInstance } from "vue"
import { TableViewVo } from "@/common/tableViewVo"
import { VxeGridProps } from "vxe-table"
import ChargingPile from  './components/ChargingPileModel.vue'
import {FormEvent} from '../components/form'
import {ApiBase, errorCheck, ChargingApi, AdminApi} from "@/common/api";
import SetCharging from './components/SetCharging.vue'
import BindRule from '../components/MoreCheck.vue'
import {BrandList} from "../../../../public/BrandConfig";
import {message} from "ant-design-vue";
import ChargingDetails from './components/ChargingDetails.vue'
import format from "@/common/format";


let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent:FormEvent = reactive<FormEvent>(new FormEvent());

type chargingDataType = {
  type:string,
  name?:string,
  chargingId?:number | string,
  showModal:boolean
  data?:object[]
}
let chargingData = reactive<chargingDataType>({
  type:"pile",
  name:"",
  showModal:false,
  chargingId:''
})

//展示详情的属性
let detailList:any = reactive<object>({
  showDetails:false,
  data:[]
})

// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  {type: 'checkbox', width: '60'},
  { field: "code", title: "充电桩编号",minWidth:"240", showHeaderOverflow: true },
  { field: "name", title: "充电桩名称", minWidth:"240",showHeaderOverflow: true },
  { field: "type", title: "设备类型",minWidth:"120", showOverflow: true ,
    // slots:{
    //   default:({row})=>{
    //     return [row.type=='12'?'汽车慢充充电桩':'汽车快充充电桩']
    //   }
    // },
    formatter:({cellValue})=>cellValue=='12'?'汽车慢充充电桩':'汽车快充充电桩'
  },
  { field: "enabled", title: "状态", minWidth:"120",slots:{
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
  { field: "deviceList", title: "绑定枪数",minWidth:"120", showOverflow: true,
    formatter:({cellValue})=>cellValue.length
  },
  { field: "idleGun", title: "可用枪数",minWidth:"120", showOverflow: true },
  { field: "brand", title: "充电桩品牌", minWidth:"240",showHeaderOverflow: true,
    // slots:{
    //   default:({row})=>[
    //     BrandList.find((item:any)=>{
    //       if (item.id===row.brand)
    //         return [item.name]
    //     })?.name || ''
    //   ]
    // } ,
    formatter:({cellValue})=>(BrandList.find((item:any)=>item.id === cellValue) as {id:number,name:string})?.name || ''
  },
  { field: "address", title: "充电桩地址", minWidth:"240",showHeaderOverflow: true },
  { field: "stationId", title: "充电站编号",minWidth:"240", showOverflow: true },
  { field: "tag", title: "标签",minWidth:"240", showOverflow: true ,
    // slots:{
    // default:({row})=>row.tag?.replace(/^(\s|,)+|(\s|,)+$/g, '') || ''
    // },
    formatter:({cellValue})=>cellValue?.replace(/^(\s|,)+|(\s|,)+$/g, '') || ''
  },
  { field: "ruleId", title: "规则编号",minWidth:"240", showOverflow: true },
  { title: '操作', field: 'allowance', fixed: 'right', minWidth:"260", slots: { default: ({row}) => {
        return [
          h('div',{
            className:"k-table-content-operation"
          },[
            h(resolveComponent('KTableEditBtn'), {
              toolTipText: '修改', onClick: () => {
                row.longitude = row.longitude.toString()
                row.latitude = row.latitude.toString()
                formEvent.onModify("修改充电桩",row,'modify')
              }
            }),
            h(resolveComponent('KTableAutoBtn'), {
              toolTipText:"枪配置",
              iconType:"icon-shezhi2",
              iconColor:"#B291DA",
              onClick: () => {
                chargingData.showModal=true;
                chargingData.name = row.name;
                chargingData.chargingId = row.id
                chargingData.data = row.deviceList || []
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
            h(resolveComponent('KTableStatusBtn'), {
              onClick: async () => {
                row.enabled = row.enabled==1?2:1
                let res = await tableViewVo.onApi(ChargingApi.EditDeviceState,{
                  ids: [row.id],
                  enabled: row.enabled
                })
                if (res!=='') {
                  message.success('修改成功')
                } else row.enabled = row.enabled==1?2:1
              }
            }),
            h(resolveComponent('KTableAutoBtn'), {
              toolTipText:"绑定收费规则",
              iconType:"icon-shoufeibiaozhun",
              onClick: () => {
                formEvent.type="PileRule"
                formEvent.show = true;
                formEvent.title = "绑定规则"
                formEvent.formData = row
              }
            }),
            h(resolveComponent('KTableDeleteBtn'), {
              onConfirm: () => {
                tableViewVo.onApi(ChargingApi.DeleteDevice,row)
              }
            }),
          ])
        ]
      } } }
]

// 数据获取
tableViewVo.getDataFun = async (param:any)=>{
  param.tenantId = tableViewVo.tenantCode
  tableViewVo.getMethods = ChargingApi.GetAllDevice
  return await ApiBase(ChargingApi.GetAllDevice({...param,type:"12,14"}))
}
const instance:any= getCurrentInstance()
onMounted(() => {
  tableViewVo.search()
})
//查看详情
const onSeeDetails=(data:any)=>{
  console.log(data)
  detailList.showDetails = true;
  detailList.data = [
    {label:'名称',value:data.name},
    {
      'label':"编号",
      'value':data.code
    },
    {
      'label':"站点编号",
      'value':data.stationId
    },
    {label:'在线状态',value:data.online===1?'在线':'离线'},
    {
      'label':"启用状态",
      'value':data.enabled===1?'已启用':'已禁用'
    },
    {
      'label':"地址",
      'value':data.address
    },
    {
      'label':"品牌",
      'value':BrandList.find((item:any)=>{
        if (item.id===data.brand)
          return [item.name]
      })?.name || ''
    },
    {
      'label':"经纬度",
      'value':data.longitude+' - '+data.latitude
    },
    {
      'label':"端口数",
      'value':data.portNum
    },
    {
      'label':"设备更新时间",
      'value':data.updatedTime
    },
  ]
  if (data.deviceList.length>0){
    detailList.data.children = []
    data.deviceList.forEach((item:any)=>{
      detailList.data.children.push({
        name:item.name,
        list:[
          {label:'编号',value:item.code},
          {label:'在线状态',value:item.online===1?'在线':'离线'},
          {
            'label':"启用状态",
            'value':item.enabled===1?'已启用':'已禁用'
          },
          {
            'label':"使用状态",
            'value':format.gunUseStatus(item.status)?.label
          },
        ]
      })
    })
  }
}
//禁用 / 启用
const EditStatus = async (status:number) => {
  if (tableViewVo.checkList.length<1) return false
  let res = await tableViewVo.onApi(ChargingApi.EditDeviceState,{
    ids: tableViewVo.checkList.map((item:any)=>item.id),
    enabled: status
  })
  if (res){
    message.success('操作成功')
  }
}
//删除
const onDelete = async ()=>{
  if (tableViewVo.checkList.length<1) {
    message.error('请选择充电桩')
    return false
  }
  let res = await tableViewVo.onApi(ChargingApi.DeleteDeviceBatches,{
    ids: tableViewVo.checkList.map((item:any)=>item.id),
  })
  if (res){
    message.success('删除成功')
  }
}
//解绑规则
const UnBindRule = async ()=>{
  if (tableViewVo.checkList.length<1) {
    message.error('请选择充电桩')
    return false
  }
  const {result,error} = await ApiBase(ChargingApi.UnBindRule({
    ids:tableViewVo.checkList.map((item:any)=>item.id)
  }))
  if (errorCheck(result,error)){
    message.success('批量解绑收费规则成功')
    tableViewVo.reFresh()
  }
}
</script>

<template>
  <div class="k-table-content">
    <div class="k-table-content-form">
      <k-table-form :tableViewVo="tableViewVo">
        <a-form layout="inline" :model="tableViewVo.form">
          <a-form-item label="充电桩编号">
            <a-input v-model:value="tableViewVo.form.code" placeholder="请输入充电桩编号"></a-input>
          </a-form-item>
          <a-form-item label="充电桩名称">
            <a-input v-model:value="tableViewVo.form.name" placeholder="请输入充电桩名称"></a-input>
          </a-form-item>
          <a-form-item label="充电站编号">
            <a-input v-model:value="tableViewVo.form.stationId" placeholder="请输入充电站编号"></a-input>
          </a-form-item>
        </a-form>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
      <template #toolbar_buttons>
        <div class="toolbar-buttons">
          <a-button type="primary" @click="formEvent.onModify('新增充电桩',{tenantId:tableViewVo.tenantCode},'add')">新增充电桩</a-button>
          <a-button type="primary" @click="EditStatus(2)">禁用</a-button>
          <a-button type="primary" @click="EditStatus(1)">启用</a-button>
          <a-button type="primary" @click="UnBindRule">解绑规则</a-button>
          <a-button type="primary" danger>
            <a-popconfirm title="确认删除吗？" @confirm="onDelete">
              删除
            </a-popconfirm>
          </a-button>
        </div>
      </template>
    </k-table>
    <bind-rule v-if="formEvent.show && formEvent.type==='PileRule'" :is-radio="true" :formEvent="formEvent" @cancel="()=>formEvent.show = false"
               @finish="tableViewVo.reFresh()"/>
    <charging-pile v-else-if="formEvent.show" :formEvent="formEvent" @finish="tableViewVo.reFresh()"/>
    <set-charging v-else-if="chargingData.showModal" :ChargingData="chargingData" @cancel = "()=>chargingData.showModal = false"  @finish = "tableViewVo.reFresh()"></set-charging>
    <charging-details v-else-if="detailList.showDetails" :detailList="detailList" @finish = "()=>{detailList.showDetails = false}"/>
  </div>
</template>

<style lang="less">
.k-table-content-operation{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
