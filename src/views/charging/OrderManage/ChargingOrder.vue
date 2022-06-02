<script setup lang="ts">
import { h, ref, reactive, onMounted, resolveComponent } from "vue"
import { TableViewVo } from "@/common/tableViewVo"
import { VxeGridProps } from "vxe-table"
import {FormEvent} from '../components/form'
import {ApiBase, errorCheck, Merchant, OrderApi} from "@/common/api";
import OrderDetail from './components/OrderDetail.vue'
import format from "@/common/format";

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent:FormEvent = reactive<FormEvent>(new FormEvent());
let formData:Object = {}

tableViewVo.showMord = true
//订单详情
let orderDetails = reactive({
  showModal:false,
  orderId:0
})
// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  { field: "dealno", title: "订单编号", minWidth:"240",showHeaderOverflow: true },
  { field: "outDealno", title: "三方订单编号",minWidth:"240", showHeaderOverflow: true },
  { field: "gunDevCode", title: "充电枪编号", minWidth:"240",showHeaderOverflow: true },
  { field: "carUserId", title: "车辆用户编号", minWidth:"240",showHeaderOverflow: true },
  { field: "pay", title: "已支付金额", minWidth:"160",showHeaderOverflow: true ,
    formatter:({cellValue})=>cellValue/100 + '元'
  },
  { field: "stationName", title: "充电站名称", minWidth:"160",showHeaderOverflow: true },
  { field: "stationId", title: "充电站编号", minWidth:"240",showHeaderOverflow: true },
  { field: "istrict", title: "区域",minWidth:"160", showHeaderOverflow: true },
  { field: "berthName", title: "泊位号",minWidth:"240", showOverflow: true },
  { field: "operateType", title: "运营类型",minWidth:"160", showOverflow: true,
    formatter:({cellValue})=>(format.operateType.find(item=>item.key==cellValue) as formatType).label
  },
  { field: "createdTime", title: "创建时间",minWidth:"160", showOverflow: true },
  { title: '操作', field: 'allowance', fixed: 'right', width: '120', slots: { default: ({row}) => {
        return [
          h('div', {
            className: "k-table-content-operation"
          }, [
            // h(resolveComponent('KTableEditBtn'), {
            //   toolTipText: '修改', onClick: () => {
            //     formEvent.onModify("修改管理员",row,'modify')
            //   }
            // }),
            h(resolveComponent('KTableDetailBtn'), {
              toolTipText:"订单详情",
              iconType:"icon-jiaoseguanli",
              iconColor:"#B291DA",
              onClick: () => {
                orderDetails.showModal = true
                orderDetails.orderId = row.id
              }
            }),
            h(resolveComponent('KTableDeleteBtn'), {
              iconType:"icon-guanbi1",
              toolTipText:"关闭订单",
              title:"确定该关闭订单吗？",
              onConfirm: () => {
                tableViewVo.onApi(OrderApi.CloseOrder,row)
              }
            }),
          ])
          ]
      } } }
]

// 重写此方法请求表格数据
tableViewVo.getDataFun = async (param) => {
  param.tenantId = tableViewVo.tenantCode
  tableViewVo.getMethods = OrderApi.GetAllRealtimeOrder
  return await ApiBase(OrderApi.GetAllRealtimeOrder({...param}))

}
const timeData = reactive([])
// 日期发生改变
const onChange = (dates:any, dateStrings:any)=>{
  // console.log('From: ', dates[0], ', to: ', dates[1]);
  console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  tableViewVo.form.createdTimeBegin = dateStrings[0];
  tableViewVo.form.createdTimeEnd = dateStrings[1];
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
          <a-form-item label="订单编号">
            <a-input v-model:value="tableViewVo.form.dealno" placeholder="订单编号"></a-input>
          </a-form-item>
          <a-form-item label="三方订单编号">
            <a-input v-model:value="tableViewVo.form.outDealno" placeholder="三方订单编号"></a-input>
          </a-form-item>
          <a-form-item label="充电站名称">
            <a-input v-model:value="tableViewVo.form.stationName" placeholder="充电站名称"></a-input>
          </a-form-item>
        </a-form>
        <template v-if="tableViewVo.isMore" v-slot:moreSearch>
          <a-form-item label="时间">
            <a-range-picker
                :ranges="format.ranges"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-model="timeData"
                @change="onChange"
            />
          </a-form-item>
        </template>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
<!--      <template #toolbar_buttons>-->
<!--        <div class="toolbar-buttons">-->
<!--          <a-button type="primary" >批量关闭</a-button>-->
<!--        </div>-->
<!--      </template>-->
    </k-table>
    <order-detail v-if="orderDetails.showModal" :orderDetails="orderDetails" @cancel="()=>orderDetails.showModal = false"
             @finish="tableViewVo.reFresh()"/>
  </div>
</template>

<style lang="less">
.k-table-content-operation{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
