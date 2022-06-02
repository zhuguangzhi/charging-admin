<style lang="less">
.setRoleModel {
  height: 40vh;
  overflow-y: scroll;
  .ant-checkbox-group-item,
  .ant-radio-wrapper{
    padding-bottom: 8px;
  }
}
.setCheckBox {
  display: flex;
  align-items: center;
  &-check {
    width: auto;
    white-space: nowrap;
    margin-right: 16px;
  }
}
</style>

<template>
  <a-modal
      :title="formEvent.title"
      :visible="formEvent.show"
      :maskClosable="true"
      width="600px"
      @cancel="onCancel()"
      @ok="onConfirm()"
      :confirm-loading = "confirmLoading"
  >
    <div class="setCheckBox">
      <a-checkbox
          :disabled="props.isRadio"
          v-model:checked="check.checkAll"
          :indeterminate="check.indeterminate"
          @change="onCheckAllChange"
          class="setCheckBox-check"
      >
        全选
      </a-checkbox>
      <a-input-search class="setCheckBox-input" v-model:value="searchValue" placeholder="输入名称搜索" />

    </div>
    <a-divider />
    <div class="setRoleModel" v-if="check.list.length>0">
      <a-radio-group v-if="props.isRadio" style="display: flex;flex-direction: column" v-model:value="check.checkedList">
        <a-radio v-for="row in check.list" :key="row.value" :value="row.value">
          <span>{{row.label}}</span>
          <span v-if="row.bindBerth" style="color: #999999;font-size: 12px">（已绑定{{row.bindBerth}}）</span>
        </a-radio>
      </a-radio-group>
      <a-checkbox-group v-else style="display: flex;flex-direction: column" v-model:value="check.checkedList" :options="check.list" >

      </a-checkbox-group>
    </div>
    <div v-else>
      <a-empty description="暂无可配置项" />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {AdminApi, BerthApi, ChargingApi, ChargingRuleApi, RoleApi} from "@/common/api";
import {message} from "ant-design-vue";
import {FormEvent} from './form'


type DataType={
  showModal:Boolean,
  data:any,
  type:string
}

const emit = defineEmits(["finish","cancel"]);
const confirmLoading = ref(false)


const props = defineProps({
  formEvent: FormEvent as object,
  isRadio:{
    type:Boolean,
    default:()=>false
  }
})
const formEvent = props.formEvent as FormEvent;


const check:any = reactive({
  indeterminate: true,
  checkAll: false,
  checkedList: [],
  list: []
});
let listCopy:any = []
//搜索条件
const searchValue = ref<string>('');
//搜索监听
watch(searchValue, value => {
  if (!(searchValue as any)._value){
    console.log(listCopy)
    check.list = listCopy
    return false
  }
  check.list = check.list
      .map((item: any) => {
        if (item.label.indexOf(value) > -1) {
          console.log('---', item)
          return item;
        }
        return null;
      })
      .filter((item: any, i: number, self: any) => item && self.indexOf(item) === i);
  searchValue.value = value;
});

//当前商户编号
const currentTenantCode = formEvent.formData.tenantId

class ListApi{
  static async getList(type:string,param:object={page:1,row:9999,tenantId:currentTenantCode}){
    //获取角色权限
    if (type==="Admin") return this.commonApi(RoleApi.GetAllRole,{...param})
    //获取收费规则
    else if (type==='PileRule') return this.commonApi(ChargingRuleApi.GetAllRule,param)
    //  获取设备
    else if (type==='BerthBindDev')
      return await this.commonApi(ChargingApi.UnBindBerth, Object.assign(param, {
        type: "1,2,3,4,5,6,7,8,9,10,11,13,15",
      }))
  // //  获取泊位信息
  //   else if (type==='BindBerth') return this.commonApi()
  }
  static bindList(type:string,param:object={tenantId:currentTenantCode}){
    //  绑定角色
    if (type==="Admin") return this.commonApi(AdminApi.BindAdminRole,{
      ...param,
      "adminId": formEvent.formData.id,
      "roleIds": check.checkedList
    },'绑定中')
    //  绑定规则
    else if (type==='PileRule') return this.commonApi(ChargingApi.BindRule,{
      ...param,
      'deviceIds':[formEvent.formData.id],
      'ruleId':check.checkedList
    },'绑定中')
    //  绑定设备
    else if (type==='BerthBindDev') return this.commonApi(BerthApi.BindBerth,{
      ...param,
      'deviceCode':check.checkedList,
      'berthIds':[formEvent.formData.id]
    },'绑定中')
  }

  private static async commonApi(url:any,param:object,message_:string='获取中'){
    return await formEvent.onMethodsApi(url,{...param},{message_})
  }

}

onMounted(()=>{
  getRoleList()
})

// 数据获取
const getRoleList = async ()=>{
  const result:any = await ListApi.getList(formEvent.type)
  if(result){
    check.list = []
    await result.data.forEach((item:any)=>{
      check.list.push({
        value:item.id,
        label:item.name,
        bindBerth:item.berthList?.join() || ''
      })
    })
    listCopy = JSON.parse(JSON.stringify(check.list))
  }
}
//全选改变
const onCheckAllChange = (e: any) => {
  check.checkAll=e.target.checked
  check.checkedList=e.target.checked ? check.list.map((item:any)=>item.value) : [];
  check.indeterminate=false;
};
watch(
    () => check.checkedList,
    (val:any) => {
      check.indeterminate = !!val.length && val.length < check.list.length;
      check.checkAll = val.length === check.list.length;
    },
);
const onConfirm = async () => {
  if (check.checkedList.length<1){
    message.error('请选择配置')
    return false;
  }
  const result:any = await ListApi.bindList(formEvent.type)
  if (result){
    message.success('绑定成功')
    emit('cancel')
    emit('finish')
  }
};
const onCancel = ()=>{
  emit('cancel')
};


</script>
