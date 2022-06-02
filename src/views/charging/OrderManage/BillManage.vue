<script setup lang="ts">
import {h, ref, reactive, onMounted, resolveComponent} from "vue"
import {TableViewVo} from "@/common/tableViewVo"
import {VxeGridProps} from "vxe-table"
import {FormEvent} from '../components/form'
import {ApiBase, errorCheck, Merchant, OrderApi} from "@/common/api";
import {message} from "ant-design-vue";
import format from "@/common/format";

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent: FormEvent = reactive<FormEvent>(new FormEvent());
let formData: Object = {}

tableViewVo.showMord = true
//订单详情
// let orderDetails = reactive({
//   showModal:false,
//   orderId:0
// })
//退款
let refund = reactive({
  isRefund: false,
  refundMoney: '',
  refundId: '',
  refundMemo:''
})
// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  {field: "id", title: "账单编号", minWidth: "240", showHeaderOverflow: true},
  {field: "payDealno", title: "支付编号", minWidth: "240", showHeaderOverflow: true},
  {field: "outDealno", title: "三方订单编号", minWidth: "240", showHeaderOverflow: true},
  {field: "refundId", title: "退款编号", minWidth: "240", showHeaderOverflow: true},
  {
    field: "pay", title: "预支付金额", minWidth: "140", showHeaderOverflow: true,
    // slots: {
    //   default: ({row}) => [(row.pay / 100).toString()]
    // },
    formatter:({cellValue})=>cellValue/100 + '元'
  },
  {field: "amount", title: "账单金额", minWidth: "140", showHeaderOverflow: true,
    // slots:{
    //   default:({row})=>[(row.amount/100).toString()]
    // }，
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
    //     let res = format.payTypeOptions.find(item => item.key === row.type) as { key: number, label: string }
    //     return [res.label]
    //   }
    // },
    formatter:({cellValue})=>(format.payTypeOptions.find(item => item.key === cellValue) as formatType).label

  },
  {field: "paySource", title: "支付来源", minWidth: "160", showHeaderOverflow: true},
  {
    field: "channel", title: "支付渠道", minWidth: "240", showHeaderOverflow: true,
    // slots: {
    //   default: ({row}) => {
    //     let res = format.payChannel.find(item => item.key === row.channel) as formatType
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
  {
    title: '操作', field: 'allowance', fixed: 'right', width: '120', slots: {
      default: ({row}) => {
        return [
          h('div', {
            className: "k-table-content-operation"
          }, [
            // h(resolveComponent('KTableEditBtn'), {
            //   toolTipText: '修改', onClick: () => {
            //     formEvent.onModify("修改管理员",row,'modify')
            //   }
            // }),
            // h(resolveComponent('KTableDetailBtn'), {
            //   toolTipText: "账单详情",
            //   iconType: "icon-jiaoseguanli",
            //   iconColor: "#B291DA",
            //   onClick: () => {
            //     // orderDetails.showModal = true
            //     // orderDetails.orderId = row.id
            //   }
            // }),
            h(resolveComponent('KTableAutoBtn'), {
              toolTipText: "退款",
              iconType: "icon-tuikuan",
              iconColor: "#B291DA",
              onClick: () => {
                refund.isRefund = true
                refund.refundId = row.id
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
  tableViewVo.getMethods = OrderApi.GetAllBill
  return await ApiBase(OrderApi.GetAllBill({...param}))

}
//退款
const onRefund = async () => {
  console.log('refund', refund)
  if (refund.refundMoney === '') {
    message.error('请输入退款金额')
    return false
  }
  const {result, error} = await ApiBase(OrderApi.RefundBill({
        id: refund.refundId,
        refundSum: Number(refund.refundMoney)*100,
        refundTime: format.getNowFormatDate()
      }
  ))
  if (errorCheck(result, error)) {
    message.success('退款成功')
    refund.refundMoney = ''
    tableViewVo.reset()
  }
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
    <a-modal
        title="退款"
        :visible="refund.isRefund"
        :maskClosable="true"
        @cancel="()=>refund.isRefund = false"
        @ok="onRefund()"
    >
      <a-input v-model:value="refund.refundMoney" placeholder="请输入退款金额"/>
      <a-input style="margin-top: 24px" v-model:value="refund.refundMemo" placeholder="备注"/>

    </a-modal>
  </div>

</template>

<style lang="less">
.k-table-content-operation {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
