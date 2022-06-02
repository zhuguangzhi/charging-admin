<template>
  <a-modal
      :title="state.title"
      :visible="orderDetails.showModal"
      :maskClosable="true"
      :confirmLoading="state.confirmLoading"
      width="1260px"
  >
    <a-spin tip="加载中..." :spinning="state.loading">
      <div class="detailsbox">
        <div class="detone">
          <a-timeline v-if="state.orderList.length > 0">
            <a-timeline-item
                class="timeline"
                v-for="(item, index) in state.orderList"
                :key="index"
            >
              <p style="color: #909399">{{ item.createdTime }}</p>
              <p>
                <span>操作：</span>
                <span>{{ format.getOrderMotion(item.motion) }}</span>
              </p>
              <p>
                <span>变更人：</span>
                <span>{{ item.operator }}</span>
              </p>
              <p>
                <span>现状态: </span>
                <span>{{ format.getStateAfter(item.stateAfter) }}</span>
              </p>
              <kw-plate
                  class="detail-plate"
                  :plate="state.detailPlate"
                  :color="state.detailColor"
              ></kw-plate>
            </a-timeline-item>
          </a-timeline>
          <div class="nodata-box" v-else>暂无数据</div>
        </div>
        <div class="dettable">
          <div class="dettable-ex" style="margin: 0">
            <div class="dettable-title">充电信息</div>
            <div class="dettable-table">
              <a-table
                  size="small"
                  :columns="state.parkcolumns"
                  :data-source="state.parkdata"
                  :scroll="{ x: 'calc(1300px)' }"
                  :rowKey="(val:any)=>val.id"
              >
              </a-table>
            </div>
          </div>

          <div class="dettable-ex">
            <div class="dettable-title">账单信息</div>
            <div class="dettable-table">
              <a-table
                  size="small"
                  :columns="state.statementcolumns"
                  :data-source="state.parkdata[0]?.billList"
                  :scroll="{ x: 'calc(1300px)' }"
                  bordered
                  :rowKey="(val:any)=>val.id"
              >
                <template slot="source" v-slot:default="source">
                  <span>{{ format.TimeOption(source) }}</span>
                </template>
              </a-table>
            </div>
          </div>
          <div class="dettable-ex" v-if="state.parkdata[0]?.gunDevice">
            <div class="dettable-title">充电枪信息</div>
            <div class="dettable-table">
              <a-table
                  size="small"
                  :columns="state.gunDetailcolumns"
                  :data-source="state.parkdata[0].gunDevice"
                  bordered
                  :rowKey="(val:any)=>val.id"
              >
                <template slot="type" v-slot:default="type">
                  <span>{{ format.PayOption(type) }}</span>
                </template>
              </a-table>

            </div>
          </div>
          <div class="dettable-ex">
            <div class="dettable-title">缴费信息</div>
            <div class="dettable-table">
              <a-table
                  size="small"
                  :columns="state.paycolumns"
                  :data-source="state.parkdata[0]?.payRecordList"
                  bordered
                  :rowKey="(val:any)=>val.id"
              >
                <template slot="type" v-slot:default="type">
                  <span>{{ format.PayOption(type) }}</span>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import {TableViewVo} from "@/common/tableViewVo"
import KwPlate from '../../../../components/KwPlate.vue';
import {onMounted, reactive} from "vue";
import {VxeGridProps} from "vxe-table";
import format from "@/common/format";
import {ApiBase, errorCheck,OrderApi} from "@/common/api";

const props = defineProps({
  orderDetails:{
    type:Object,
    default:()=>{}
  }
})
const orderDetails = reactive(props.orderDetails)
let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
const state = reactive({
  title: '详情',
  loading: true,//请求加载状态
  // 获取订单变更数据
  orderList: [] as any,
  // 车牌号
  detailPlate: '',
  // 车牌颜色
  detailColor: '',
  // 充电信息
  parkcolumns: [
    {
      title: '车牌号',
      className: 'column-money',
      dataIndex: 'plate',
    },
    {
      title: '充电站',
      dataIndex: 'stationName',
    },
    {
      title: '充电枪编号',
      dataIndex: 'gunDevCode',
      // scopedSlots: {customRender: 'name'},
    },
    {
      title: '充电时长（分钟）',
      className: 'column-money',
      dataIndex: 'duration',
    },
    {
      title: '已支付金额',
      dataIndex: 'pay',
      customRender:({text}:any)=>(text/100+'元')
    },{
      title: '应缴费用',
      dataIndex: 'payable',
      customRender:({text}:any)=>(text/100+'元')
    },{
      title: '退款金额',
      dataIndex: 'refund',
      customRender:({text}:any)=>(text/100+'元')
    },
  ],
  // 充电枪信息
  gunDetailcolumns: [
    {
      title: '名称',
      className: 'column-money',
      dataIndex: 'name',
    },
    {
      title: '地址',
      dataIndex: 'address',
      // scopedSlots: {customRender: 'name'},
    },
    {
      title: '实时电流',
      className: 'column-money',
      dataIndex: 'rechargeState.current',
    },
    {
      title: '实时电压',
      dataIndex: 'rechargeState.power',
    }
  ],
  // 账单信息 billList
  statementcolumns: [
    {
      title: '账单编号',
      dataIndex: 'id',
    },
    {
      title: '支付编号',
      dataIndex: 'payDealno',
    },
    {
      title: '第三方账单编号',
      dataIndex: 'outDealno',
    },
    {
      title: '支付来源',
      dataIndex: 'paySource',
    },{
      title: '账单金额',
      dataIndex: 'amount',
      customRender:({text}:any)=>(text/100+'元')

    },{
      title: '创建时间',
      dataIndex: 'createdTime',
    },
  ],
  //btnLoading
  confirmLoading:false,
  // 缴费信息 payRecordList
  paycolumns: [
    {
      title: '缴费记录流水号',
      dataIndex: 'dealno',
    },
    {
      title: '缴费金额',
      dataIndex: 'amount',
      customRender:({text}:any)=>(text/100+'元')
    },
    {
      title: '缴费形式',
      dataIndex: 'channel',
    },{
      title: '记录时间',
      dataIndex: 'updatedTime',
    },
    {
      title: '备注',
      dataIndex: 'memo',
    },
  ],
  // 表单数据
  parkdata: [] as any,
})
const getOrderDetails = async ()=>{
  state.confirmLoading = true
  const {result,error} = await ApiBase(OrderApi.GetOrderDetail({id:orderDetails.orderId}))
  if (errorCheck(result,error)){
    console.log('getOrderDetails',result)
    state.orderList = result.data?.orderChangeList
    state.detailPlate = result.data?.plate
    state.detailColor = result.data?.color
    state.parkdata.push({...result.data})
    if (state.parkdata[0].gunDevice)
      state.parkdata[0].gunDevice = [state.parkdata[0]?.gunDevice]
    state.loading = false
  }
  state.confirmLoading = false

}


onMounted(()=>{
  getOrderDetails()
})
</script>
<style scoped lang="less">
/deep/ .ant-empty-image {
  display: none;
}

/deep/ .ant-empty-normal {
  margin: 0;
}

.detailsbox {
  width: 100%;
  height: 450px;
  // background-color: tomato;
  display: flex;

  .detone {
    width: 25%;
    // background-color: turquoise;
    overflow: auto;
  }

  .dettable {
    width: 75%;
    // background-color: violet;
    overflow: auto;

    .dettable-ex {
      // height: 97px;
      // overflow: hidden;
      margin-top: 20px;
      // background-color: wheat;
      .dettable-title {
        color: #000;
        font-weight: bolder;
        margin: 5px;
      }
    }
  }
}

.timeline {
  line-height: 25px;
  position: relative;

  .detail-plate {
    position: absolute;
    top: 6px;
    right: 20px;
  }
}

.details-media {
  margin-top: 20px;
  width: 100%;
  height: 320px;
  // background-color: tomato;
  display: flex;

  .detimg {
    width: 13%;
    height: 100%;
    margin-left: 5px;
    // background-color: turquoise;
    div {
      &:first-child {
        color: #606266;
        text-align: center;
      }

      &:last-child {
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: calc(100% - 21px);
          cursor: pointer;
        }
      }
    }
  }
}

// 暂无数据的提示框
.nodata-box {
  width: 100%;
  height: 50px;
  // background-color: aqua;
  font-size: 22px;
  font-weight: 500;
  color: #888;
  text-align: center;
  line-height: 70px;
}

// 加载的状态
.example {
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
}

// 去除表格的分页器
/deep/ .ant-table-pagination.ant-pagination {
  display: none;
}

/deep/ .ant-table-thead {
  background-color: #e8eaec;
}
</style>