<script setup lang="ts">
import { h, ref, reactive, onMounted, resolveComponent } from "vue"
import { TableViewVo } from "@/common/tableViewVo"
import { VxeGridProps } from "vxe-table"
import ChargingGun from  './components/ChargingGunModel.vue'
import {FormEvent} from '../components/form'
import {ApiBase, errorCheck, ChargingApi, BerthApi} from "@/common/api";
import {message} from "ant-design-vue";
import {BrandList} from '@/common/BrandConfig';
import ChargingDetails from './components/ChargingDetails.vue'
import format from "@/common/format";
// import BindBerth from '../components/MoreCheck.vue'

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent:FormEvent = reactive<FormEvent>(new FormEvent());

// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  {type: 'checkbox', width: '60'},
  { field: "code", title: "充电枪编号",minWidth:"240", showHeaderOverflow: true },
  { field: "name", title: "充电枪名称", minWidth:"240",showHeaderOverflow: true },
  { field: "deviceId", title: "充电桩编号",minWidth:"240", showOverflow: true },
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
  { field: "status", title: "使用状态", minWidth:"120",slots:{
      default:({row})=>{
        return [
          h(resolveComponent('a-tag'),
              {color: row.status==1?'green':'red' },
              ()=>format.gunUseStatus(row.status)?.label)
        ];
      }
    },
    formatter:({cellValue})=>(format.gunUseStatus(cellValue) as formatType)?.label
  },
  { field: "type", title: "设备类型",minWidth:"120", showOverflow: true ,
    // slots:{
    //   default:({row})=>{
    //     return [row.type=='13'?'汽车慢充充电枪':'汽车快充充电枪']
    //   }
    // },
    formatter:({cellValue})=>cellValue=='13'?'汽车慢充充电枪':'汽车快充充电枪'
  },
  { field: "brand", title: "充电枪品牌", minWidth:"240",showHeaderOverflow: true ,
    // slots:{
    //   default:({row})=>[
    //     BrandList.find((item:any)=>{
    //       if (item.id===row.brand)
    //         return [item.name]
    //     })?.name || ''
    //   ]
    // },
    formatter:({cellValue})=>(BrandList.find((item:any)=>item.id === cellValue) as {id:number,name:string})?.name || ''
  },
  { field: "address", title: "充电枪地址", minWidth:"240",showHeaderOverflow: true },
  { title: '操作', field: 'allowance', fixed: 'right', minWidth:"240", slots: { default: ({row}) => {
        return [
          h('div',{
            className:"k-table-content-operation"
          },[
            h(resolveComponent('KTableEditBtn'), {
              toolTipText: '修改', onClick: () => {
                formEvent.onModify("修改充电枪",row,'modify')
              }
            }),
            // h(resolveComponent('KTableAutoBtn'), {
            //   toolTipText: '绑定泊位',
            //   iconType:"icon-bangding",
            //   iconColor:"green",
            //   onClick: () => {
            //     formEvent.type="BindBerth"
            //     formEvent.show = true;
            //     formEvent.title = "绑定泊位"
            //     formEvent.formData = row
            //   }
            // }),
            h(resolveComponent('KTableDetailBtn'), {
              toolTipText:"详情",
              iconType:"icon-jiaoseguanli",
              iconColor:"#B291DA",
              onClick: () => {
                if (row.rechargeState==null){
                  message.info('该充电枪暂未接通')
                  return false
                }
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
            h(resolveComponent('KTableDeleteBtn'), {
              onConfirm: () => {
                tableViewVo.onApi(ChargingApi.DeleteDevice,row)
              }
            }),
          ])
        ]
      } } }
]

//展示详情的属性
let detailList:any = reactive<object>({
  showDetails:false,
  data:[]
})

// 数据获取
tableViewVo.getDataFun = async (param:any)=>{
  param.tenantId = tableViewVo.tenantCode
  tableViewVo.getMethods = ChargingApi.GetAllDevice
  return await ApiBase(ChargingApi.GetAllDevice({...param,type:"13,15"}),{showLoading:true})

}

//查看详情
const onSeeDetails = (data:any)=>{
  detailList.showDetails=true
  detailList.data = [
    {
      'label':"名称",
      'value':data.name
    },
    {
      'label':"充电枪编号",
      'value':data.rechargeState.pileDevId || ''
    },
    {
      'label':"充电桩订单编号",
      'value':data.rechargeState.orderId || ''
    },
    {
      'label':"三方订单编号",
      'value':data.rechargeState.outDealno || ''
    },
    {
      'label':"站点编号",
      'value':data.stationId || ''
    },
    {
      'label':"当前电流（单位mA）",
      'value':data.rechargeState.current
    },
    {
      'label':"当前功率（单位w）",
      'value':data.rechargeState.power
    },
    {
      'label':"订单服务费价格（单位：分）",
      'value':data.rechargeState.serviceFeeMoney
    },
    {
      'label':"订单耗电量(单位:度)",
      'value':data.rechargeState.energyConsumed
    },
    {
      'label':"订单充电时长（单位：分钟）",
      'value':data.rechargeState.timeConsumed
    },
    {
      'label':"急停按钮状态",
      'value':data.rechargeState.energyConsumed===1?'已触发':'正常'
    },

    {
      'label':"过载标志位",
      'value':data.rechargeState.flagOverLoad===1?'过载':'正常',
    },
    {
      'label':"过温标志位",
      'value':data.rechargeState.flagOerTemperature===1?'过温':'正常',
    },
    {
      'label':"充电枪状态",
      'value':data.rechargeState.plugIn===0?'未插入':'已插枪',
    },

  ]
}
onMounted(() => {
  tableViewVo.search()
})
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
    message.error('请选择充电枪')
    return false
  }
  let res = await tableViewVo.onApi(ChargingApi.DeleteDeviceBatches,{
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
          <a-form-item label="充电枪编号">
            <a-input v-model:value="tableViewVo.form.code" placeholder="请输入充电枪编号"></a-input>
          </a-form-item>
          <a-form-item label="充电枪名称">
            <a-input v-model:value="tableViewVo.form.name" placeholder="请输入充电枪名称"></a-input>
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
          <a-button type="primary" @click="formEvent.onModify('新增充电枪',{tenantId:tableViewVo.tenantCode},'add')">新增充电枪</a-button>
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
<!--    <bind-berth v-if="formEvent.show && formEvent.type==='BindBerth'" :is-radio="true" :formEvent="formEvent" @cancel="()=>formEvent.show = false"-->
<!--              @finish="tableViewVo.reFresh()"/>-->
    <charging-gun v-if="formEvent.show" :formEvent="formEvent" @finish="tableViewVo.reFresh()"/>

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
