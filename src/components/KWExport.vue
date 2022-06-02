<style lang="less" scoped>
/deep/ .vxe-grid--toolbar-wrapper {
  display: none;
}
</style>

<template>
  <a-modal :title="state.title" :visible="true" :maskClosable="true"
           :confirmLoading="state.confirmLoading" :destroyOnClose="state.destroyOnClose" width="800px" @ok="emit('finish')"
           @cancel="emit('finish')"

  >
    <div >
      <a-progress :percent="state.percentage"/>
      <p>请求条数：{{ state.total }} ,已获取的条数：{{ state.allRsq }}</p>
      <a-button @click.native.prevent="downSelectExport" type="link">导出选中</a-button>
      <k-table style="height: 400px;" :tableViewVo="tableViewVo">
        <!--      <template #toolbar_buttons>-->
        <!--        <div class="toolbar-buttons">-->
        <!--          <a-button type="primary" >批量关闭</a-button>-->
        <!--        </div>-->
        <!--      </template>-->
      </k-table>
      <!--        <a-empty style="padding: 24px"/>-->
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import format from "../common/format";
import {h, onMounted, reactive, resolveComponent} from "vue";
import {TableViewVo} from "@/common/tableViewVo";
import {VxeGridProps} from "vxe-table";
import {message} from "ant-design-vue";
import {ApiBase, errorCheck} from "@/common/api";
import * as XLSX from "xlsx"

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))

const emit = defineEmits(["finish","export"]);
const props = defineProps({
  // 单次请求重试次数
  httpRequestNub: {
    type: Number,
    default: 5
  },
  // 一次导出条数
  number: {
    type: Number,
    default: 5000
  },
  // 导出方法
  type: {
    type: Number,
    default: 0 // 0为原生导出， 1为table自带导出
  },
  exportModel:{
    type:Object,
    default:()=>[]
  }
})

const exportModel:any = reactive(props.exportModel)
// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  {type: 'checkbox', width: '60'},
  {title: '', type: 'seq', width: '60'},
  {
    title: '请求状态',
    field: 'requestState',
    minWidth: '160',
    formatter: ({cellValue}) => state.requestState[cellValue]
  },
  {title: '条数', field: 'rsq', minWidth: '100', formatter: ({row}) => row.rsq.length},
  {
    title: '操作', width: '80', fixed: 'right',slots:{
      default:({row})=>[
        h(resolveComponent('KTableAutoBtn'), {
          toolTipText:"下载",
          iconType:"icon-xiazaidaoru",
          iconColor:"#1890FF",
          onClick: () => {
            downExport(row.rsq)
          }
        }),
      ]
    }
  }
]
const state:any = reactive({
  title: '导出',
  message: "开始准备导出",
  total: 0,
  exportDataState: [],
  percentage: 0, // 当前进度
  allRsq: 0, // 总条数
  errorTotal: 0, // 错误计数
  requestState:['未开始','请求中','请求成功','请求失败']
})
// 下载选中
const downSelectExport = ()=>{
  if (tableViewVo.checkList.length<1) {
    message.error('请选择需要下载的数据')
    return false
  }
  let selectData:Array<any> = []
  for (let i = 0; i < tableViewVo.checkList.length; i++) {
    selectData = selectData.concat(state.exportDataState[i].rsq)
    // console.log('我是选中的selectData',selectData)
  }
  downExport(selectData)
}
// 开始下载
const downExport = (row:any)=>{
  emit('export',row)
}
/**
 * 获取数据
 * @param fun [请求方法]
 * @param data [请求的参数]
 * @param name [获取数据后的解析的字段名]
 * @param type [导出类型]
 */
const getAllData = async()=>{
  const data = exportModel.data
  const fun = exportModel.methodWay
  // 重置状态
  reset()
  // tableViewVo.showExport = true
  state.errorTotal = 0
  // 获取总条数
  const total = await getTotal(fun, data)
  if (total) {
    state.total = total
    state.percentage = state.percentage + 2 // 增加进度
  } else {
    message.info('总条数获取错误')
    return
  }
  // 每页5000条，计算出需要查询多少次
  const getCount = Math.ceil(state.total / props.number)
  // 每次请求成功后增加的进度
  const percentageUnit = 95 / getCount

  // 重置导出状态
  state.exportDataState = [];
  // 生成导出配置文件
  for (let i = 1; i <= getCount; i++) {
    const param = JSON.parse(JSON.stringify(data));
    param.page = i
    param.row = props.number
    state.exportDataState.push({
      data: param, // 请求参数数据
      requestState: 0, // 请求状态 0：未开始，1：请求中，2：请求成功，3：请求失败
      rsq: [] // 请求返回数据
    })
  }

  // 开始请求
  for (let i = 1; i <= getCount; i++) {
    state.errorTotal = 0
    state.exportDataState[i - 1].requestState = 1
    data.page = i
    data.row = props.number
    const pageData = await getDataPage(fun, data)
    /* console.log('this.allRsq11',this.allRsq)
    console.log('this.pageData',pageData) */
    if (pageData) {
      //cwen 应对data.records
      if (pageData.records) {
        state.exportDataState[i - 1].rsq = pageData.records
        state.exportDataState[i - 1].requestState = 2
        state.allRsq = state.allRsq+ pageData.records.length
      } else {
        state.exportDataState[i - 1].rsq = pageData
        state.exportDataState[i - 1].requestState = 2
        state.allRsq = state.allRsq+ pageData.length

      }
      // console.log('this.allRsq22',this.allRsq)
    } else {
      state.$message.error(`第${i}条获取失败`)
      state.exportDataState[i - 1].requestState = 3
    }
    state.percentage = state.percentage + percentageUnit
  }
  tableViewVo.vxeGridProps.data = state.exportDataState
  state.percentage = 100
}
// 分页获取数据
const getDataPage = async(fun:Function, data:any)=>{
  state.errorTotal++
  if (state.errorTotal >= 5) {
    return false
  }
  const {result,error} = await ApiBase(fun(data))
  if (result.code===0){
    return result.data
  }
  else return null
}
// 获取总条数
const getTotal = async(fun:Function, data:any)=>{
  state.errorTotal++
  if (state.errorTotal >= 5) {
    return false
  }
  data.page = 1
  data.row = 9999999
  const {result,error} = await ApiBase(fun(data))
  if (result.code===0){
    return result.total
  }
  else return null
}
const reset = ()=>{
  state.total = 0
  state.allRsq = 0
  state.percentage = 0 // 当前进度
  tableViewVo.vxeGridProps.data = []
}

//数据格式化
const dataFormat = (pageData:Array<object>)=>{

}

onMounted(async()=>{
  console.log('exportModel.checkList',exportModel)
  if (exportModel.selectData?.length>0){
    state.total = exportModel.selectData.length
    state.allRsq = state.total
    tableViewVo.vxeGridProps.data = [
      {
        rsq:exportModel.selectData,
        requestState:2
      }
    ]
  }
  else getAllData()
})
</script>
