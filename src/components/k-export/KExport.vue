<script setup lang="ts">
import {ExportViewVo} from "@/components/k-export/exportViewVo"
import {onMounted, reactive, ref,computed} from "vue"
import {DialogViewVo} from "@/components/k-dialog/dialogViewVo"
import { CloudSyncOutlined } from '@ant-design/icons-vue'
import dayjs from "dayjs"
import {useRoute, useRouter} from "vue-router"
import {message} from "ant-design-vue";
import {errorCheck} from "@/common/api";


type RowVO = {
  index:number,
  state:1|2|3|4, // 1：待获取 2：获取中 3:成功 4：失败
  num:number,
  disabled:boolean
}

const props = defineProps({
  exportView:ExportViewVo
})
const exportViewVo = props.exportView as ExportViewVo
const emits = defineEmits(['updateClass'])
// exportViewVo.setExportCall = onSetExport

const { meta } = useRoute()
console.log('meta',meta)
const interval = ref<NodeJS.Timeout>()
const xTable = ref()
const dialogViewVo = reactive<DialogViewVo>(new DialogViewVo({title: exportViewVo.title}))
const exportTitle = ref(exportViewVo.fileName?? meta.title)
dialogViewVo.width = '85vw'
dialogViewVo.okText = "导出"
dialogViewVo.cancelText = '取消'
// dialogViewVo.wrapClass = 'formModal'

const tableData = ref<RowVO[]>([])
const pageSize = 5000
const currentPage = ref(1)
const getExportData = ref<any[]>([])
const checkListIndex = ref<number[]>([])
// 获取了多少页的数据
const getSuccessPageNum = ref(0)
const exportLoadingTarget = ref(-1)

dialogViewVo.onCancel = ()=>{
  dialogViewVo.visible = false
  if(interval.value) {
    clearInterval(interval.value)
  }
}
function onSetExport(open:boolean) {
  dialogViewVo.visible = open
  if(open) {
    currentPage.value = 1
    tableData.value = []
    checkListIndex.value = []
    getSuccessPageNum.value = 0
    init()
  }else {
    dialogViewVo.onCancel()
  }
}
async function getData() {
  const len = Math.ceil(exportViewVo.tableViewVo.total/pageSize)
  if(currentPage.value>len) {
    return
  }
  tableData.value[currentPage.value-1].state = 2
  const getRes = await exportViewVo.tableViewVo.getDataFun({
    ...exportViewVo.tableViewVo.form,
    page:currentPage.value,
    row:pageSize
  })
  if(!errorCheck(getRes.result)) {
    tableData.value[currentPage.value-1].state = 4
    tableData.value[currentPage.value-1].index = currentPage.value
    tableData.value[currentPage.value-1].num = 0
  }else {
    tableData.value[currentPage.value-1].state = 3
    tableData.value[currentPage.value-1].index = currentPage.value
    tableData.value[currentPage.value-1].num = getRes.result.data.length
    getExportData.value[currentPage.value-1] = getRes.result.data
    getSuccessPageNum.value++
  }
  currentPage.value++
  interval.value = setTimeout(()=>{
    getData()
  },500)
}
// 获取指定页数的数据
async function getTargetData(page:number) {
  if(tableData.value[page-1].state === 2) return
  tableData.value[page-1].state = 2
  const {result} = await exportViewVo.tableViewVo.getDataFun({
    ...exportViewVo.tableViewVo.form,
    page:page,
    row:pageSize
  })
  if(!errorCheck(result)) {
    tableData.value[page-1].state = 4
    tableData.value[page-1].index = page
    tableData.value[page-1].num = 0
  }else {
    tableData.value[page-1].state = 3
    tableData.value[page-1].index = page
    tableData.value[page-1].num = result.data.length
    getExportData.value[page-1] = result.data
    getSuccessPageNum.value++
  }
}
function init() {
  const len = Math.ceil(exportViewVo.tableViewVo.total/pageSize)
  tableData.value = Array.from({length:len}).map((item,index)=>{
    return {
      index:index+1,
      state:1,
      num: 0,
      disabled:true
    }
  })
  if(len>0) {
    getExportData.value = Array.from({length:len})
    getData()
  }
}
function toggleAllCheckboxEvent(check:boolean,indeterminate:boolean) {
  const $table = xTable.value
  if(!$table) return
  if(check && !indeterminate) {
    tableData.value.forEach((row)=>{
      if(row.state==3) {
        $table.setCheckboxRow(row,true)
        checkListIndex.value.push(row.index)
      }
    })
  }else {
    checkListIndex.value = []
    $table.setAllCheckboxRow(false)
  }
}

function toggleCheckboxEvent (row: RowVO) {
  const $table = xTable.value
  if ($table) {
    $table.toggleCheckboxRow(row)
    const isCheck = $table.isCheckedByCheckboxRow(row)
    if (isCheck) {
      checkListIndex.value.push(row.index)
    } else {
      checkListIndex.value = checkListIndex.value.filter((item) => item !== row.index)
    }
  }
}
// 导出指定数据
async function exportTarget(row:RowVO) {
  exportLoadingTarget.value = row.index
  await sleep(100)
  await exportData(getExportData.value[row.index-1],exportTitle.value+'page'+row.index)
  exportLoadingTarget.value = -1
}
async function exportData(row:any,name=exportTitle.value) {
  await exportViewVo.tableRef.exportData({
    filename: name+'-'+dayjs().format('YYYY-MM-DD HH:mm:ss'),
    type: "csv",
    isHeader: true,
    isFooter: true,
    data: row,
  })
}
// sleep
const sleep = (time:number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

dialogViewVo.onConfirm = async ()=>{
  // checkListIndex去重
  const checkList = Array.from(new Set(checkListIndex.value))
  if(checkList.length==0) {
    message.error('请选择需要下载的数据')
    return
  }
  await sleep(500)
  // 获取getExportData.value中index在checkList的数据
  const exportDataList = getExportData.value.filter((item,index)=>{
    return checkList.includes(index+1)
  })
  await exportData(exportDataList.flat())
}
const getPercent = computed(()=>{
  console.log('exportViewVo.tableViewVo',exportViewVo.tableViewVo)
  return Number((getSuccessPageNum.value/Math.ceil((exportViewVo?.tableViewVo?.total ?? 0)/pageSize)*100).toFixed(2))
})

onMounted(()=>{
  exportViewVo.setExportCall = onSetExport
  emits('updateClass',exportViewVo)
})

</script>

<template>
  <KDialog :dialogView="dialogViewVo" style="max-width: 1200px">
    <div class="export">
      <a-progress :percent="getPercent" stroke-color="#0AB76B"/>
      <div>
        <text>{{`请求条数：${exportViewVo.tableViewVo?.total ?? 0}`}}</text>
      </div>
      <div class="export_table">
        <vxe-table stripe :data="tableData" align="center" ref="xTable">
          <vxe-column type="checkbox" width="80">
            <template #header="{ checked, indeterminate }" >
              <a-checkbox :checked="checked" :indeterminate="indeterminate" @click.stop="toggleAllCheckboxEvent(!checked,indeterminate)"></a-checkbox>
            </template>
            <template #checkbox="{ row, checked }">
              <a-checkbox :checked="checked" :disabled="row.state!=3" @click.stop="toggleCheckboxEvent(row)"></a-checkbox>
            </template>
          </vxe-column>
          <vxe-column type="seq" width="80"></vxe-column>
          <vxe-column field="state" title="请求状态">
            <template #default="{row}:{row:RowVO}">
              <k-custom-tag v-if="row.state===1" color="#F9AE3D" text="待请求"/>
              <k-custom-tag v-else-if="row.state===3" color="#53C21D" text="成功"/>
              <k-custom-tag v-else-if="row.state===4" color="#F56C6C" text="失败"/>
              <IconFont type="icon-jiazai" class="icon" v-else></IconFont>
              <!--            <LoadingOutlined v-else style="font-size: 18px"/>-->
            </template>
          </vxe-column>
          <vxe-column field="num" title="获取数量"></vxe-column>
          <vxe-column title="操作">
            <template #default="{ row }:{row:RowVO}">
              <a-button danger v-if="row.state===4 " @click="getTargetData(row.index)">
                <template #icon><CloudSyncOutlined style="font-size: 18px" /></template>
                <span>重新获取</span>
              </a-button>
              <a-button v-else :disabled="row.state!=3" @click="exportTarget(row)" :loading="row.index===exportLoadingTarget">
                <span>下载</span>
              </a-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>
  </KDialog>
</template>

<style scoped lang="less">
.export {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc((100vh) - 300px);
  padding: 0 24px;
  overflow: hidden;
  &_table {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.icon {
  font-size: 26px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>