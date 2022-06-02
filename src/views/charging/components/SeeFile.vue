<script setup lang="ts">
import {h, reactive, onMounted, resolveComponent} from "vue"
import {TableViewVo} from "@/common/tableViewVo"
import {VxeGridProps} from "vxe-table"
import {ApiBase, errorCheck, WeChartMerchantApi} from "@/common/api";
import {message} from "ant-design-vue";

const emit = defineEmits(["cancel","finish"]);

const props = defineProps({
  fileInfo:{
    type:Object,
    default:()=>{}
  }
})
let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
tableViewVo.tenantCode = ''
tableViewVo.useExport = false
tableViewVo.getData = async ()=>{}
// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [

  {field: "name", title: "证书名", width: '240', showHeaderOverflow: true},
  {field: "url", title: "证书地址", minWidth: '160', showHeaderOverflow: true},
  {
    title: '操作', field: 'allowance', fixed: 'right', width: '180', slots: {
      default: ({row}) => {
        return [
            h('a',{
              href:row.url,
              style:"color:blue;cursor: pointer;user-select:none",
              onClick:()=>{

              }
            },'下载')
        ]
      }
    }
  }
]

tableViewVo.total = props.fileInfo.data?.length
tableViewVo.row = 9999

const removeFile = async ()=>{
  const {result,error} = await ApiBase(WeChartMerchantApi.RemoveMerchantFile({
    id:props.fileInfo.id
  }))
  if (errorCheck(result,error)){
    message.success('移除成功')
    emit('finish')
  }
}


onMounted(() => {
  tableViewVo.search()
  tableViewVo.vxeGridProps.data = props.fileInfo.data
})

</script>

<template>
  <a-page-header
      class="file-header"
      title="查看证书"
      @back="() => emit('cancel')"
  >
  <div class="file-content">
    <k-table :tableViewVo="tableViewVo">
      <template #toolbar_buttons>
        <div class="toolbar-buttons">
          <a-button type="primary" @click="removeFile">
            移除凭证
          </a-button>
        </div>
      </template>
    </k-table>

  </div>
  </a-page-header>
</template>

<style lang="less">
.file-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 99;

  .file-content {
    height: calc(100vh - 32px - 16px - 8px - 64px - 40px);
    //box-sizing: border-box;
    .k-table-auto {
      height: 100%!important;
    }
  }
}
</style>
