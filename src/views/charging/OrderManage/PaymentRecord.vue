<script setup lang="ts">
import {h, ref, reactive, onMounted, resolveComponent} from "vue"
import {TableViewVo} from "@/common/tableViewVo"
import {VxeGridProps} from "vxe-table"
import {FormEvent} from '../components/form'
import {ApiBase, errorCheck, OrderApi} from "@/common/api";
import format from "@/common/format";

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent: FormEvent = reactive<FormEvent>(new FormEvent());
let formData: Object = {}
tableViewVo.showMord = true
//退款

// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  {field: "id", title: "缴费记录编号", minWidth: "240", showHeaderOverflow: true},
  {field: "billId", title: "账单编号", minWidth: "240", showHeaderOverflow: true},
  // {field: "discountsId", title: "优惠编号", minWidth: "240", showHeaderOverflow: true},
  {field: "payDealno", title: "支付单号", minWidth: "240", showHeaderOverflow: true},
  {field: "outDealno", title: "三方单号", minWidth: "240", showHeaderOverflow: true},
  {field: "stationMac", title: "充电站编号", minWidth: "240", showHeaderOverflow: true},
  {field: "stationName", title: "充电站名称", minWidth: "240", showHeaderOverflow: true},
  {field: "pay", title: "预支付金额（分）", minWidth: "140", showHeaderOverflow: true,
    formatter:({cellValue})=>cellValue/100 + '元'
  },
  {field: "amount", title: "账单金额（分）", minWidth: "140", showHeaderOverflow: true,
    formatter:({cellValue})=>cellValue/100 + '元'
  },
  {
    field: "state", title: "支付状态", minWidth: "240", showHeaderOverflow: true,
    slots: {
      default: ({row}) => {
        return [
          h(resolveComponent('a-tag'),
              {color: row.state == 1 ? 'yellow' : row.state == 2 ? 'green' : 'red'},
              () => {
                let res = format.billPayType.find(item => item.key === row.state) as formatType
                return res.label
              }
          )
        ];
      }
    },
    formatter:({cellValue})=>(format.billPayType.find(item => item.key === cellValue) as formatType).label
  },
  {
    field: "refundState", title: "退款状态", minWidth: "240", showHeaderOverflow: true,
    slots: {
      default: ({row}) => {
        return [
          h(resolveComponent('a-tag'),
              {color: row.refundState == 2 ? 'yellow' : row.refundState == 3 ? 'green' : 'red'},
              () => {
                let res = format.refundType.find(item => item.key === row.refundState) as formatType
                return res.label
              }
          )
        ];
      }
    },
    formatter:({cellValue})=>(format.refundType.find(item => item.key === cellValue) as formatType).label

  },
  {
    field: "type", title: "支付类型", minWidth: "240", showHeaderOverflow: true,
    // slots: {
    //   default: ({row}) => {
    //     let res = format.payTypeOptions.find(item => item.key === row.type) as formatType
    //     return [res.label]
    //   }
    // },
    formatter:({cellValue})=>(format.payTypeOptions.find(item => item.key === cellValue) as formatType).label

  },
  {field: "paySource", title: "支付来源", minWidth: "160", showHeaderOverflow: true,
    // formatter:({cellValue})=>(format.payTypeOptions.find(item => item.key === cellValue) as formatType).label
  },
  {field: "channel", title: "支付渠道", minWidth: "240", showHeaderOverflow: true,
    // slots:{
    //   default: ({row}) => {
    //     let res = format.payChannel.find(item=>item.key===row.channel) as formatType
    //     return [res.label]
    //   }
    // },
    formatter:({cellValue})=>(format.payChannel.find(item => item.key === cellValue) as formatType).label

  },
  {field: "userId", title: "用户Id", minWidth: "240", showHeaderOverflow: true},
  {field: "mchId", title: "商户号", minWidth: "240", showHeaderOverflow: true},
  // { field: "bankType", title: "支付银行", minWidth:"160",showHeaderOverflow: true,},
  {field: "createdTime", title: "创建时间", minWidth: "160", showOverflow: true},
  {field: "memo", title: "备注", minWidth: "240", showOverflow: true},

]

// 重写此方法请求表格数据
tableViewVo.getDataFun = async (param) => {
  param.tenantId = tableViewVo.tenantCode
  tableViewVo.getMethods = OrderApi.GetAllBill
  return await ApiBase(OrderApi.GetAllBill({...param}))

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
          <a-form-item label="账单编号">
            <a-input v-model:value="tableViewVo.form.id" placeholder="账单编号"></a-input>
          </a-form-item>
          <a-form-item label="支付单号">
            <a-input v-model:value="tableViewVo.form.payDealno" placeholder="支付单号"></a-input>
          </a-form-item>
          <a-form-item label="三方订单编号">
            <a-input v-model:value="tableViewVo.form.outDealno" placeholder="三方订单编号"></a-input>
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
