<script setup lang="ts">
import {h, reactive, onMounted, resolveComponent} from "vue"
import {TableViewVo} from "@/common/tableViewVo"
import {VxeGridProps} from "vxe-table"
import {FormEvent} from './components/form'
import {ApiBase, AdminApi, WeChartMerchantApi, Merchant,} from "@/common/api";
import WeChatModel from './components/WeChatModel.vue'
import BindFile from './components/BindFile.vue'
import SeeFile from './components/SeeFile.vue'
import {message} from "ant-design-vue";


let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent: FormEvent = reactive<FormEvent>(new FormEvent());

let FileData = reactive({
  show:false,
  id:null,
  data:[]
})
// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [

  {type: 'checkbox', width: '60'},
  {field: "appId", title: "微信商户APP编号", minWidth: '240', showHeaderOverflow: true},
  {field: "name", title: "微信商户名", minWidth: '160', showHeaderOverflow: true},
  {field: "mchId", title: "微信商户编号", minWidth: '160', showHeaderOverflow: true},
  {field: "mchKey", title: "微信商户Key", minWidth: '240', showHeaderOverflow: true},
  {field: "secret", title: "密钥", minWidth: '240', showHeaderOverflow: true},
  {
    field: "type", title: "类型", minWidth: '120',
    slots: {
      default: ({row}) => {
        return [
          h(resolveComponent('a-tag'),
              {color: row.type == 1 ? 'green' : 'blue'},
              () => row.type === 1 ? '小程序' : '公众号')
        ];
      }
    },
    formatter:({cellValue})=>cellValue===1 ? '小程序' : '公众号'
  },
  {field: "createdTime", title: "创建时间", minWidth: '240', showOverflow: true},
  {field: "memo", title: "备注", minWidth: '240', showOverflow: true},

  {
    title: '操作', field: 'allowance', fixed: 'right', minWidth: '180', slots: {
      default: ({row}) => {
        return [
          h('div', {
            className: "k-table-content-operation"
          }, [
            h(resolveComponent('KTableEditBtn'), {
              toolTipText: '修改', onClick: () => {
                formEvent.onModify("修改微信商户", row, 'modify')
              }
            }),
            h(resolveComponent('KTableAutoBtn'), {
              toolTipText: "证书上传",
              iconType: "icon-shoufeibiaozhun",
              onClick: () => {
                formEvent.type="bindFile"
                formEvent.show = true;
                formEvent.title = "绑定规则"
                formEvent.formData = row
              }
            }),
            h(resolveComponent('KTableDetailBtn'), {
              toolTipText: "查看证书",
              iconColor: row.accessoryList?"#1890ff":"#cccccc",
              onClick: () => {
                if (!row.accessoryList) {
                  message.error('请添加证书！')
                  return false
                }
                FileData.show=true
                FileData.data = row.accessoryList
                FileData.id = row.id
              }
            }),

            h(resolveComponent('KTableDeleteBtn'), {
              onConfirm: async() => {
                await tableViewVo.onApi(WeChartMerchantApi.DeleteWeChartMerchant, row)
              }
            }),
          ])
        ]
      }
    }
  }
]

// 数据获取
tableViewVo.getDataFun = async (param: any) => {
  param.tenantId = tableViewVo.tenantCode
  tableViewVo.getMethods = WeChartMerchantApi.GetAllWeChartMerchant
  return await ApiBase(WeChartMerchantApi.GetAllWeChartMerchant({...param}))
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
          <a-form-item label="微信商户APP编号">
            <a-input v-model:value="tableViewVo.form.appid" placeholder="微信商户APP编号"></a-input>
          </a-form-item>
          <a-form-item label="微信商户名">
            <a-input v-model:value="tableViewVo.form.name" placeholder="微信商户名"></a-input>
          </a-form-item>
          <a-form-item label="微信商户编号">
            <a-input v-model:value="tableViewVo.form.mchId" placeholder="商户编号"></a-input>
          </a-form-item>
        </a-form>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
      <template #toolbar_buttons>
        <div class="toolbar-buttons">
          <a-button type="primary" @click="formEvent.onModify('新增微信商户',{tenantId:tableViewVo.tenantCode},'add')">
            新增微信商户
          </a-button>
        </div>
      </template>
    </k-table>

    <bind-file v-if="formEvent.show && formEvent.type==='bindFile'" :formEvent="formEvent" @finish="tableViewVo.reFresh()"/>
    <we-chat-model v-else-if="formEvent.show" :formEvent="formEvent" @finish="tableViewVo.reFresh()"/>
    <see-file v-if="FileData.show" :fileInfo="FileData" @finish = "tableViewVo.reFresh()" @cancel="FileData.show=false"/>

  </div>
</template>

<style lang="less">
.k-table-content-operation {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
