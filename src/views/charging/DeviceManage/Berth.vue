<script setup lang="ts">
import { h, ref, reactive, onMounted, resolveComponent } from "vue"
import { TableViewVo } from "@/common/tableViewVo"
import { VxeGridProps } from "vxe-table"
import ChargingGun from  './components/ChargingGunModel.vue'
import {FormEvent} from '../components/form'
import {ApiBase, ChargingApi, BerthApi, OrderApi} from "@/common/api";
import {message} from "ant-design-vue";
import format from "@/common/format";
import BerthModel from './components/BerthModel.vue'
import BindDev from '../components/MoreCheck.vue'
import UploadBerth from "./components/uploadBerth.vue";

let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent:FormEvent = reactive<FormEvent>(new FormEvent());

// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [
  {type: 'checkbox', width: '60'},
  { field: "name", title: "泊位名",minWidth:"240", showHeaderOverflow: true },
  { field: "stationName", title: "充电站名",minWidth:"240", showHeaderOverflow: true },
  { field: "status", title: "车位状态", minWidth:"120",
    slots:{
      default:({row})=>{
        return [
          h(resolveComponent('a-tag'),
              {color: row.status==1?'green':'red' },
              ()=>row.status===1?'有车':'无车')
        ];
      }
    },
  formatter:({cellValue})=>cellValue===1?"有车":"无车"
  },
  { field: "enabled", title: "运营状态", minWidth:"120",slots:{
      default:({row})=>{
        return [
          h(resolveComponent('a-tag'),
              {color: row.enabled==1?'green':'red' },
              ()=>row.enabled===1?'已启用':'已禁用')
        ];
      }
    },
    formatter:({cellValue})=>cellValue===1?"已启用":"已禁用"
  },
  { field: "devCode", title: "绑定设备编号",minWidth:"240", showHeaderOverflow: true,slots:{
    default:({row})=>{
      if (row.devCode)
        return row.devCode.replace(/^(\s|,)+|(\s|,)+$/g, '')
      else return []
    }
    }
  },
  { field: "type", title: "车位类型", minWidth:"240",showHeaderOverflow: true ,
    formatter:({cellValue})=>{
      let res = format.ForMapArray(cellValue.split(','),format.ShetYpe)
      return res.map(item=>item.label).join()
      // return res.map(item=>item.label).join()
    }
  },
  { field: "longitude", title: "经度", minWidth:"140",showHeaderOverflow: true },
  { field: "latitude", title: "纬度", minWidth:"140",showHeaderOverflow: true },
  { field: "memo", title: "备注", minWidth:"240",showHeaderOverflow: true },
  { title: '操作', field: 'allowance', fixed: 'right', minWidth:"240", slots: { default: ({row}) => {
        return [
          h('div',{
            className:"k-table-content-operation"
          },[
            h(resolveComponent('KTableEditBtn'), {
              toolTipText: '修改',
              onClick: () => {
                row.longitude = row.longitude.toString()
                row.latitude = row.latitude.toString()
                formEvent.onModify("修改泊位",row,'modifyBerth')
              }
            }),
            h(resolveComponent('KTableAutoBtn'), {
              toolTipText: '绑定设备',
              iconType:"icon-bangding",
              iconColor:"green",
              onClick: () => {
                formEvent.type="BerthBindDev"
                formEvent.show = true;
                formEvent.title = "绑定设备"
                formEvent.formData = row
              }
            }),
            h(resolveComponent('KTableDeleteBtn'), {
              iconType:"icon-jiebang",
              title:"确定解绑该设备吗？",
              toolTipText: '解绑',
              onConfirm: () => {
                onUnboundDevice(row)
              }
            }),
            h(resolveComponent('KTableStatusBtn'), {
              onClick: async () => {
                row.enabled = row.enabled==1?2:1
                let res = await tableViewVo.onApi(BerthApi.EditBerthState,{
                  ids: [row.id],
                  enabled: row.enabled
                })
                if (res!=='') {
                  message.success('修改成功')
                } else row.enabled = row.enabled==1?2:1
              }
            }),
            h(resolveComponent('KTableDeleteBtn'), {
              onConfirm: () => {
                tableViewVo.onApi(BerthApi.DeleteBerth,row)
              }
            }),

          ])
        ]
      } } }
]


// 数据获取
tableViewVo.getDataFun = async (param:any)=>{
  param.tenantId = tableViewVo.tenantCode
  tableViewVo.getMethods = BerthApi.GetAllBerth
  return await ApiBase(BerthApi.GetAllBerth({...param}))
}

onMounted(() => {
  tableViewVo.search()
})

//批量新增泊位
let BerthBatches = ref(false)

//禁用 / 启用
const EditStatus = async (status:number) => {
  if (tableViewVo.checkList.length<1) return false
  let res = await tableViewVo.onApi(BerthApi.EditBerthState,{
    ids: tableViewVo.checkList.map((item:any)=>item.id),
    enabled: status
  })
  if (res){
    message.success('操作成功')
  }
}
//解绑
const onUnboundDevice = async (row:any)=>{
  if (!row.devCode){
    message.error('该泊位暂未绑定设备')
    return false
  }
  let res = await formEvent.onMethodsApi(BerthApi.UnBindBerth,{
    berthId:row.id,
    deviceCodes:row.devCode.split(',')
  },{message_:'解绑中'})
  if (res) {
    message.success('解绑成功')
    tableViewVo.reFresh()
  }
}

//删除
const onDelete = async ()=>{
  if (tableViewVo.checkList.length<1) {
    message.error('请选择充泊位')
    return false
  }
  let res = await tableViewVo.onApi(BerthApi.DeleteBatchesBerth,{
    ids: tableViewVo.checkList.map((item:any)=>item.id),
  })
  if (res){
    message.success('删除成功')
  }
}
</script>

<template>
  <div class="k-table-content">
    <div class="k-table-content-form">
      <k-table-form :tableViewVo="tableViewVo">
        <a-form layout="inline" :model="tableViewVo.form">
          <a-form-item label="泊位编号">
            <a-input v-model:value="tableViewVo.form.id" placeholder="请输入泊位编号"></a-input>
          </a-form-item>
          <a-form-item label="充电站名">
            <a-input v-model:value="tableViewVo.form.stationName" placeholder="请输入充电站名"></a-input>
          </a-form-item>
          <a-form-item label="绑定设备编号">
            <a-input v-model:value="tableViewVo.form.devCode" placeholder="请输入绑定设备编号"></a-input>
          </a-form-item>
        </a-form>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
      <template #toolbar_buttons>
        <div class="toolbar-buttons">
          <a-button type="primary" @click="formEvent.onModify('新增泊位',{tenantId:tableViewVo.tenantCode},'addBerth')">新增泊位</a-button>
          <a-button type="primary" @click="formEvent.onModify('新增充电枪',{tenantId:tableViewVo.tenantCode},'add')">新增充电枪</a-button>
          <a-button type="primary" @click="BerthBatches=true">导入泊位</a-button>
          <a-button type="primary" @click="EditStatus(2)">禁用</a-button>
          <a-button type="primary" @click="EditStatus(1)">启用</a-button>
          <a-button type="primary" danger>
            <a-popconfirm title="确认删除吗？" @confirm="onDelete">
              删除
            </a-popconfirm>
          </a-button>
        </div>
      </template>
    </k-table>
    <bind-dev v-if="formEvent.show && formEvent.type==='BerthBindDev'" :is-radio="true" :formEvent="formEvent" @cancel="()=>formEvent.show = false"
              @finish="tableViewVo.reFresh()"/>
    <charging-gun v-else-if="formEvent.show && formEvent.type==='add'" :formEvent="formEvent" @finish="tableViewVo.reFresh()"/>
    <berth-model v-else-if="formEvent.show && (formEvent.type==='addBerth' || formEvent.type==='modifyBerth')" :formEvent="formEvent" @finish="tableViewVo.reFresh()"/>
    <upload-berth v-if="BerthBatches" @cancel="BerthBatches=false" @finish="tableViewVo.reFresh()"/>
  </div>
</template>

<style lang="less">
.k-table-content-operation{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
