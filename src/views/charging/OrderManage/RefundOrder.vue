<script setup lang="ts">
import {h, ref, reactive, onMounted, resolveComponent} from "vue"
import {TableViewVo} from "@/common/tableViewVo"
import {VxeGridProps} from "vxe-table"
import {ApiBase, errorCheck, OrderApi} from "@/common/api";

import format from "@/common/format";

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))

tableViewVo.showMord = true
// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  {field: "id", title: "退款记录编号", minWidth: "240", showHeaderOverflow: true},
  {field: "payDealno", title: "平台支付单号", minWidth: "240", showHeaderOverflow: true},
  {field: "outDealno", title: "三方退款单号", minWidth: "240", showHeaderOverflow: true},
  {field: "refundDealno", title: "平台退款单号", minWidth: "240", showHeaderOverflow: true},
  {field: "tenantId", title: "商户编号", minWidth: "240", showHeaderOverflow: true},
  {field: "pay", title: "预支付金额", minWidth: "160", showHeaderOverflow: true,
    // slots:{
    //   default:({row})=>[(row.pay/100).toString()]
    // },
    formatter:({cellValue})=>cellValue/100 + '元'
  },
  {field: "amount", title: "实际金额", minWidth: "160", showHeaderOverflow: true,
    // slots:{
    //   default:({row})=>[(row.amount/100).toString()]
    // },
    formatter:({cellValue})=>cellValue/100 + '元'
  },
  {field: "refund", title: "退款金额", minWidth: "160", showHeaderOverflow: true,
    // slots:{
    //   default:({row})=>[(row.refund/100).toString()]
    // },
    formatter:({cellValue})=>cellValue/100 + '元'
  },
  {field: "completeTimeBegin", title: "支付完成时间", minWidth: "160", showHeaderOverflow: true},
  {field: "completeTimeEnd", title: "支付结束时间", minWidth: "160", showHeaderOverflow: true},
  {field: "channel", title: "支付渠道", minWidth: "240", showHeaderOverflow: true,
    // slots:{
    //   default: ({row}) => {
    //     return [(format.payChannel.find(item=>item.key===row.channel) as formatType).label]
    //   }
    // },
    formatter:({cellValue})=>(format.payChannel.find(item=>item.key===cellValue) as formatType).label
  },
  {field: "type", title: "支付类型", minWidth: "240", showHeaderOverflow: true,
    // slots:{
    //   default: ({row}) => {
    //     return [(format.payTypeOptions.find(item=>item.key===row.type) as formatType).label]
    //   }
    // },
    formatter:({cellValue})=>(format.payTypeOptions.find(item=>item.key===cellValue) as formatType).label

  },
  {field: "amendSource", title: "退款来源", minWidth: "140", showHeaderOverflow: true,
    // slots:{
    //   default: ({row}) => {
    //     return [(format.amendSource.find(item=>item.key==row.amendSource) as formatType).label]
    //   }
    // },
    formatter:({cellValue})=>(format.amendSource.find(item=>item.key===cellValue) as formatType)?.label

  },
  {field: "amendId", title: "退款来源编号", minWidth: "240", showHeaderOverflow: true},
  {field: "initTimeBegin", title: "退款发起时间", minWidth: "240", showHeaderOverflow: true},
  {field: "initTimeEnd", title: "退款结束时间", minWidth: "240", showHeaderOverflow: true},
  {field: "memo", title: "备注", minWidth: "160", showHeaderOverflow: true},
]

// 重写此方法请求表格数据
tableViewVo.getDataFun = async (param) => {
  param.tenantId = tableViewVo.tenantCode
  tableViewVo.getMethods = OrderApi.getRefundRecord
  return await ApiBase(OrderApi.getRefundRecord({...param}))
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
          <a-form-item label="退款记录编号">
            <a-input v-model:value="tableViewVo.form.id" placeholder="退款记录编号"></a-input>
          </a-form-item>
          <a-form-item label="平台支付编号">
            <a-input v-model:value="tableViewVo.form.payDealno" placeholder="平台支付编号"></a-input>
          </a-form-item>
          <a-form-item label="平台退款编号">
            <a-input v-model:value="tableViewVo.form.refundDealno" placeholder="平台退款编号"></a-input>
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
