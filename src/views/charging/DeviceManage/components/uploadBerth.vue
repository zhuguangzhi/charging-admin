<style scoped lang="less">
</style>

<template>
  <div>
    <a-modal
        :title="state.title"
        :visible="true"
        :maskClosable="state.maskClosable"
        :confirmLoading="state.confirmLoading"
        :destroyOnClose="state.destroyOnClose"
        @ok="onConfirm"
        @cancel="()=>{
          emit('cancel')
        }"
    >
      <a-upload-dragger
          accept=".xlsx, .xlc, .xlm, .xls"
          :multiple="false"
          action=""
          :showUploadList="false"
          :beforeUpload="beforeUpload"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined />
        </p>
        <p class="ant-upload-text">单击或拖动文件到此区域上载</p>
        <p class="ant-upload-hint">
          支持单个文件上传。 只能上传xlsx文件，且不超过500kb
        </p>
      </a-upload-dragger>
      点击下载导入<a-button type="link" @click="exportExcel">模板</a-button>
      <a-progress :percent="state.percent" />
      <a-alert
          v-if="state.percent >= 100"
          message="验证成功"
          description="数据验证成功，请点击确定按钮进行提交."
          type="success"
          show-icon
      />
      <a-alert
          v-if="state.error"
          message="验证出错"
          :description="state.errmsg"
          type="error"
          show-icon
      />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { file2Xce } from '@/utils/xlsxUtil';
import rules from "@/common/rules";
import {reactive} from "vue";
import {message, notification} from "ant-design-vue";
import {ApiBase, BerthApi, errorCheck} from "@/common/api";
import {InboxOutlined} from "@ant-design/icons-vue";
import * as XLSX from "xlsx";

const emit = defineEmits(['finish','cancel'])

const state:any = reactive({
  title: '批量添加',
  uploadColumn: {
    name: { field: '泊位名', rule: rules.notNull('泊位名不能为空') },
    stationName: { field: '充电站名'},
    status: { field: '车位状态',rule: rules.isNum},
    enabled: { field: '运营状态',rule: rules.isNum },
    devCode: { field: '设备编号' },
    type: { field: '车位类型',rule: rules.isNum },
    longitude: { field: '经度',rule: rules.isNum },
    latitude: { field: '纬度' ,rule: rules.isNum},
    memo: { field: '备注' },
  },
  tableDataUpload: [],
  percent: 0,
  error: false,
  errmsg: '数据验证出错',
  tableData: ['XXXXXX',
    'XXXX电站名（非必选）',
    '（非必选）1：有车 、2：无车','运营状态 （非必选）1：以启用 、2：以禁用',
    'XXXXXXX（非必选）',
    '（非必选）1：地磁、2：抓拍机、3：入口相机、4：出口相机、5：POS机、6：高位视频、7：低位视频、8：道闸、9：地锁、10：巡检车、11：充电桩',
      '101.26384',
      '23.328492',
      '备注（非必选）',
  ],
})

//导出的方法
const exportExcel = ()=>{
  const tHeader = ['泊位名','充电站名', '车位状态', '运营状态', '设备编号', '车位类型','经度','纬度', '备注'];
  // 上面设置Excel的表格第一行的标题
  const filterVal = ['name','stationName', 'status', 'enabled', 'devCode','type','longitude','latitude', 'memo'];
  // 上面的index、nickName、name是tableData里对象的属性
  const list = state.tableData; //把data里的tableData存到list
  const data = [tHeader,state.tableData];
  //1. 新建一个工作簿
  let workbook = XLSX.utils.book_new();
  //2.1 aoa_to_sheet 把数组转换为工作表
  let sheet1 = XLSX.utils.aoa_to_sheet(data);
  //3.在工作簿中添加工作表
  XLSX.utils.book_append_sheet(workbook, sheet1, 'sheetName1'); //工作簿名称
  XLSX.writeFile(workbook, '添加泊位模板.xlsx'); // 保存的文件名
}

const formatJson = (filterVal:any, jsonData:any)=>{
  return jsonData.map((v:any) => filterVal.map((j:number) => v[j]));
}

const beforeUpload = (file:any, fileList:Array<any>)=>{
  const fileSplit = file.name.split('.');
  const types = fileSplit[fileSplit.length - 1];
  const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt'].some(
      (item) => item === types
  );
  file2Xce(file).then(async (tabJson:any) => {
    console.log('解析的数据', tabJson[0]);
    // 初始化
    state.tableDataUpload = [];
    state.percent = 0;
    state.error = false;
    try {
      if (tabJson && tabJson.length > 0) {
        if (tabJson[0].sheet) {
          // sheet1 数据
          const dataSheet1 = tabJson[0].sheet;
          const unit = 99 / dataSheet1.length;
          // 遍历 sheet1 数据
          for (let i = 0; i < dataSheet1.length; i++) {
            let data:any = {};
            for (let key of Object.keys(state.uploadColumn)) {
              let item = state.uploadColumn[key];
              const value = dataSheet1[i][item.field]; // 数据
              if (item.rule) {
                // 需要进行权限验证
                const validator = await rules.rule(item.rule, value);
                console.log('-----validator',validator)
                // 如果验证不通过则抛出异常
                if (validator) {
                  throw '第' + (i + 1) + '行' + validator;
                }
              }
              data[key] = value ? `${value}` : undefined;
            }
            state.tableDataUpload.push(data);
            state.percent = state.percent + unit;
          }
          state.percent = 100;
          // 结束
          console.log('tableDataUpload', state.tableDataUpload);
        }
      }
    } catch (error) {
      state.errmsg = error;
      state.error = true;
      // message.error('上传失败')
    }
  });
  return false;
}
const onConfirm = async()=>{
  if (state.tableDataUpload.length > 0) {
    state.confirmLoading = true;
    const {result,error} = await ApiBase(BerthApi.AddBerthBatches(state.tableDataUpload))
    if (errorCheck(result,error)){
      message.success('添加成功！')
      emit('finish')
      emit('cancel')
    }
    state.confirmLoading = false;
  }
}
</script>