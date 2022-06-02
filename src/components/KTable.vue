<script setup lang="ts">
import {reactive, ref, useSlots} from "vue"
import { TableViewVo } from '@/common/tableViewVo'
import KWExport from '@/components/KWExport.vue'
import { VxeTableInstance, VxeButtonEvents } from 'vxe-table'
const slots = useSlots()

const props = defineProps({
  tableViewVo: {
    type: TableViewVo,
    default () {
      return new TableViewVo({})
    }
  }
})

const exportModel:any = reactive({
  show:false,
  data:[],
  methodWay:null,
  selectData:[],
  // column:(props.tableViewVo.vxeGridProps.columns as any).map((item:any)=>item.title)
})

const  onExport = ()=> {
  exportModel.show = true
  exportModel.data = {
    page: 1,
    row: 999999,
    tenantId: props.tableViewVo?.tenantCode,
    ...props.tableViewVo?.form
  }
  exportModel.methodWay = props.tableViewVo?.getMethods
  exportModel.selectData = props.tableViewVo.checkList
  // if (exportModel.column[0] == undefined) {
  //   exportModel.column.splice(0,1)
  // }
}

  const selectChangeEvent = ({$table}: any) => {
    (props.tableViewVo as any).checkList = $table.getCheckboxRecords()
  }

//  导出表格
const xTable = ref({} as VxeTableInstance)
const onExportTable:VxeButtonEvents.Click = (row:any)=>{
  const $table = xTable.value
  $table.exportData({
    data: row,
  })
}

</script>

<template>
  <div class="k-table" :class="{'k-table-auto': props.tableViewVo.heightFull}">
    <a-spin :spinning="props.tableViewVo.loading">
      <vxe-grid ref="xTable" v-bind="props.tableViewVo.vxeGridProps" @checkbox-all="selectChangeEvent" @checkbox-change="selectChangeEvent" >
        <template #toolbar_buttons>
         <div style="display: flex;align-items: center">
           <slot name="toolbar_buttons"></slot>
           <a-button v-if="props.tableViewVo.useExport" @click="onExport">导出</a-button>
         </div>
        </template>
        <!-- <template #tools_buttons>
          <icon-font type="icon-bianji"></icon-font>
        </template> -->
        <template #empty>
          <a-empty />
        </template>
        <template #pager>
          <div class="k-table-page">
            <a-pagination
              show-quick-jumper
              :page-size="props.tableViewVo.row"
              :total="props.tableViewVo.total"
              @change="(page: number) => props.tableViewVo.onPageChange(page)"
              :show-size-changer="true"
              @showSizeChange="(current:number, pageSize:number) => props.tableViewVo.onPageSizeChange(pageSize, current)"
              :page-size-options="['10', '20', '50', '100']"
            />
          </div>
        </template>
      </vxe-grid>
    </a-spin>
    <k-w-export v-if="exportModel.show" @finish="exportModel.show=false" :exportModel = "exportModel" @export="onExportTable"/>
  </div>
</template>

<style scoped lang="less">
// 如果需要表格高度铺满，需要增加这个css
.k-table{
  // 去掉toobar边框
  :deep(.vxe-toolbar.is--perfect) {
    border: none;
  }
  :deep(.ant-divider-vertical){
    margin: 0 2px;
  }
}
.k-table-auto{
  flex: 1;
  :deep(.ant-spin-nested-loading){
    height: 100%;
    position: relative;
  }
  :deep(.ant-spin-container){
    height: 100%;
    flex: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
.k-table-page{
  padding: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: end;
}
</style>
