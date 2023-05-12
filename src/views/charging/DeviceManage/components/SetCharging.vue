<style lang="less">
.charging-header{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 99;
.charging-content {
  height: calc(100vh - 32px - 16px - 8px - 64px - 40px);
  //box-sizing: border-box;
}
}
.setRoleModel {
  height: 40vh;
  overflow-y: scroll;
  .ant-checkbox-group-item {
    padding-bottom: 8px;
  }
}

</style>
<template>
  <a-page-header
      class="charging-header"
      :title="chargingData.name"
      sub-title="该设备下所有子设备"
      @back="() => emit('cancel')"
  >
    <div class="charging-content">
      <k-table style="height: 100%" :tableViewVo="tableView">
        <template #toolbar_buttons>
          <div class="toolbar-buttons">
            <a-button v-if="chargingData.type === 'pile'" type="primary" @click="onBindGun()">绑定充电枪</a-button>
            <a-button v-else type="primary" @click="onBindPile()">绑定充电桩</a-button>
            <a-button v-if="chargingData.type === 'pile'" @click="formEvent.onModify('新增充电枪',{tenantId:tableView.tenantCode,deviceId:chargingData.chargingId},'add')">新增充电枪</a-button>
            <a-button v-else @click="formEvent.onModify('新增充电桩',{tenantId:tableView.tenantCode,stationId:chargingData.chargingId},'add')">新增充电桩</a-button>
          </div>

        </template>
      </k-table>
    </div>
  </a-page-header>
  <a-modal
      title="绑定"
      :visible="isBind"
      :maskClosable="true"
      width="600px"
      @cancel="isBind = false"
      @ok="onConfirmBind"
      :confirm-loading = "formEvent.confirmLoading"
  >
    <a-checkbox
        v-model:checked="checkForm.checkAll"
        :indeterminate="checkForm.indeterminate"
        @change="onCheckAllChange"
    >
      全选
    </a-checkbox>
    <a-divider />
    <div class="setRoleModel">
      <a-checkbox-group v-if="checkForm.list.length>0" style="display: flex;flex-direction: column" v-model:value="checkForm.checkedList" :options="checkForm.list" />
      <a-empty v-else description="暂无未绑定的设备" />
    </div>
  </a-modal>
  <charging-gun v-if="formEvent.show && chargingData.type==='pile'" :formEvent="formEvent" @finish="tableView.reFresh()"/>
  <charging-pile v-if="formEvent.show && chargingData.type==='station'" :formEvent="formEvent" @finish="tableView.reFresh()"/>
  <charging-details v-if="detailList.showDetails" :detailList="detailList" @finish = "()=>{detailList.showDetails = false}"/>
</template>

<script setup lang="ts">
import { TableViewVo } from "@/common/tableViewVo"
import {h, onMounted, reactive, ref, resolveComponent, watch} from "vue";
import {VxeGridProps} from "vxe-table";
import {ApiBase, ChargingApi,errorCheck} from "@/common/api";
import {FormEvent} from "@/views/charging/components/form";
import {message} from "ant-design-vue";
import ChargingGun from "./ChargingGunModel.vue"
import ChargingPile from "./ChargingPileModel.vue"
import {BrandList} from '@/common/BrandConfig'
import ChargingDetails from "./ChargingDetails.vue";


let tableView: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
const emit = defineEmits(["finish",'cancel']);
let formEvent:FormEvent = reactive<FormEvent>(new FormEvent());
//展示详情的属性
let detailList:any = reactive<object>({
  showDetails:false,
  data:[]
})

type chargingDataType = {
  type:string,
  name:string,
  showModal:boolean
  chargingId:number | string
}
type changeType = {
  indeterminate:boolean,
  checkAll:boolean,
  checkedList:Number[] | Object[],
  list:Object[]
}
let isBind = ref(false)
const props = defineProps({
  ChargingData:Object
})
const chargingData:chargingDataType = props.ChargingData as chargingDataType
const checkForm:changeType = reactive<changeType>({
  indeterminate: true,
  checkAll: false,
  checkedList: [],
  list: []
});
// 重写此属性定义表格显示列
if (chargingData.type==='station'){
  tableView.vxeGridProps.columns = [
    { field: "code", title: "充电桩编号",minWidth:"240", showHeaderOverflow: true },
    { field: "name", title: "充电桩名称", minWidth:"240",showHeaderOverflow: true },
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
    { field: "type", title: "设备类型",minWidth:"120", showOverflow: true ,
      // slots:{
      //   default:({row})=>{
      //     return [row.type=='12'?'汽车慢充充电桩':'汽车快充充电桩']
      //   }
      // },
      formatter:({cellValue})=>cellValue=='12'?'汽车慢充充电桩':'汽车快充充电桩'
    },
    { field: "brand", title: "品牌", minWidth:"240",showHeaderOverflow: true,
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
    { title: '操作', field: 'allowance', fixed: 'right', width:"140", slots: { default: ({row}) => {
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
              h(resolveComponent('KTableDetailBtn'), {
                toolTipText:"详情",
                iconType:"icon-jiaoseguanli",
                iconColor:"#B291DA",
                onClick: () => {
                  onSeeDetails(row)
                }
              }),
              h(resolveComponent('KTableDeleteBtn'), {
                iconType:"icon-jiebang",
                title:"确定解绑该设备吗？",
                toolTipText: '解绑',
                onConfirm: () => {
                  onUnboundDevice(row.id)
                }
              }),
            ])
          ]
        } } }
  ]
}else {
  tableView.vxeGridProps.columns = [
    { field: "code", title: "充电枪编号",minWidth:"240", showHeaderOverflow: true },
    { field: "name", title: "充电枪名称", minWidth:"240",showHeaderOverflow: true },
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
    { field: "type", title: "设备类型",minWidth:"120", showOverflow: true ,
      // slots:{
      //   default:({row})=>{
      //     return [row.type=='13'?'汽车慢充充电枪':'汽车快充充电枪']
      //   }
      // },
      formatter:({cellValue})=>cellValue=='13'?'汽车慢充充电枪':'汽车快充充电枪'

    },
    { field: "brand", title: "品牌", minWidth:"240",showHeaderOverflow: true,
      // slots:{
      // default:({row})=>[
      //   BrandList.find((item:any)=>{
      //     if (item.id===row.brand)
      //       return [item.name]
      //   })?.name || ''
      // ]
      // }
      formatter:({cellValue})=>(BrandList.find((item:any)=>item.id === cellValue) as {id:number,name:string})?.name || ''
    },
    { title: '操作', field: 'allowance', fixed: 'right', width:"140", slots: { default: ({row}) => {
          return [
            h('div',{
              className:"k-table-content-operation"
            },[
              h(resolveComponent('KTableEditBtn'), {
                toolTipText: '修改', onClick: () => {
                  formEvent.onModify("修改充电枪",row,'modify')
                }
              }),
              h(resolveComponent('KTableDetailBtn'), {
                toolTipText:"详情",
                iconType:"icon-jiaoseguanli",
                iconColor:"#B291DA",
                onClick: () => {
                  if (row.rechargeState==null){
                    message.info('该枪暂未使用哦')
                    return false
                  }
                  onSeeDetails(row)
                }
              }),
              h(resolveComponent('KTableDeleteBtn'), {
                iconType:"icon-jiebang",
                title:"确定解绑该设备吗？",
                toolTipText: '解绑',
                onConfirm: () => {
                  onUnboundDevice(row.id)
                }
              }),
            ])
          ]
        } } }
  ]
}

// 数据绑定
tableView.getData = async (param:any)=>{
  type QueryType={id?:string|number,stationId?:string|number}
  let query:QueryType = {}

  if (chargingData.type==='station')  query.stationId=chargingData.chargingId as string|number
  else query.id = chargingData.chargingId as string|number
  tableView.getMethods = ChargingApi.GetAllDevice
  const result =await formEvent.onMethodsApi(ChargingApi.GetAllDevice,{...query})
  if (result) {
    let data: any = JSON.parse(JSON.stringify(tableView.vxeGridProps.data))
    await result.data.forEach((item:any)=>{
      data.push(item)
    });
    if (chargingData.type==='pile')  tableView.vxeGridProps.data = data[0].deviceList
    else tableView.vxeGridProps.data = data
    tableView.total = result.total
    tableView.row = 9999;
  }
}

//获取未绑定的设备
const getNoBindDevice = async (type:string)=>{
  checkForm.list = []
  const result = await formEvent.onMethodsApi(ChargingApi.GetAllDevice,{page:1,row:9999,unBindDev:chargingData.type === 'pile',unBindStation:chargingData.type === 'station',type},{confirmLoading_:false})
  if(result){
    result.data.forEach((item:any)=>{
      checkForm.list.push({
        label:item.name,
        value:item.id
      })
    })
  }
}
//全选改变
const onCheckAllChange = (e: any) => {
  console.log(checkForm.list)
  checkForm.checkAll=e.target.checked
  checkForm.checkedList=e.target.checked ? checkForm.list.map((item:any)=>item.value) : [];
  checkForm.indeterminate=false;
};
watch(
    () => checkForm.checkedList,
    (val:any) => {
      checkForm.indeterminate = !!val.length && val.length < checkForm.list.length;
      checkForm.checkAll = val.length === checkForm.list.length;
    },
);

//查看详情
const onSeeDetails = (data:any)=>{
  detailList.showDetails = true;
  if (chargingData.type==='station'){
    detailList.data = [
      {
        'label':"名称",
        'value':data.name
      },
      {
        'label':"站点编号",
        'value':data.stationId
      },
      {
        'label':"编号",
        'value':data.code
      },
      {
        'label':"状态",
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

    ]
  }
  else {
    detailList.data = [
      {
        'label':"名称",
        'value':data.name
      },
      {
        'label':"充电枪唯一编号",
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
        'value':data.rechargeState.energyConsumed===0?'正常':'已触发'
      },

      {
        'label':"过载标志位",
        'value':data.rechargeState.flagOverLoad===0?'正常':'过载',
      },
      {
        'label':"过温标志位",
        'value':data.rechargeState.flagOerTemperature===0?'正常':'过温',
      },
      {
        'label':"充电枪状态",
        'value':data.rechargeState.plugIn===0?'未插入':'已插枪',
      },

      {
        'label':"经纬度",
        'value':data.longitude+' - '+data.latitude
      },
    ]
  }
}

//绑定充电枪
const onBindGun = ()=>{
  isBind.value=true
  getNoBindDevice("13,15")
}
//绑定充电桩
const onBindPile = ()=>{
  isBind.value=true
  getNoBindDevice("12,14")
}
//确定绑定
const onConfirmBind = async ()=>{
  if (checkForm.checkedList.length<1){
    message.error('请选择绑定设备！')
    return false;
  }
  //绑定充电枪
  if (chargingData.type==='pile')
    await formEvent.onMethodsApi(ChargingApi.BindDevice,{oneId:chargingData.chargingId,moreIds:checkForm.checkedList},{message_:'绑定中'})
  //绑定充电桩
  else
    await formEvent.onMethodsApi(ChargingApi.BindStation,{stationId:chargingData.chargingId,devIds:checkForm.checkedList},{message_:'绑定中'})

  isBind.value = false
  tableView.reset()

}
//解绑
const onUnboundDevice = async (id:number|string)=>{
  if (chargingData.type==='pile'){
    await formEvent.onMethodsApi(ChargingApi.UnBindDevice,{ids:[id]},{message_:'解绑中'})
  }
  else {
    //站点解绑
    await formEvent.onMethodsApi(ChargingApi.UnBindStation,{ids:[id]},{message_:'解绑中'})
  }
  tableView.reset()
}
onMounted(()=>{
  tableView.search()
})
</script>
