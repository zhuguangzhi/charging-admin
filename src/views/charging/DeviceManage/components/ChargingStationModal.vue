<style scoped lang="less">
.formModel {
  max-height: 40vh;
  overflow-y: scroll;
}
</style>

<template>
  <a-modal
      :title="formEvent.title"
      :visible="formEvent.show"
      :maskClosable="true"
      :width="formEvent.width"
      @cancel="onCancel()"
      @ok="onConfirm()"
      :confirm-loading = "formEvent.confirmLoading"
  >
    <a-alert v-if="error" type="error" :message="errorMsg" banner/>
    <a-form
        :model="form"
        :rules="rules"
        ref="formRef"
        :label-col="formEvent.labelCol"
        :wrapper-col="formEvent.wrapperCol"
        class="formModel"
    >
      <a-form-item label="充电站名" name="name">
        <a-input v-model:value="form.name" placeholder="请输入充电站名"/>
      </a-form-item>
      <a-form-item label="所属省份" name="province">
        <a-input v-model:value="form.province" placeholder="请输入所属省份"/>
      </a-form-item>
      <a-form-item label="所属城市" name="city">
        <a-input v-model:value="form.city" placeholder="请输入所属城市"/>
      </a-form-item>
      <a-form-item label="所属区域" name="district">
        <a-input v-model:value="form.district" placeholder="请输入所属区域"/>
      </a-form-item>
      <a-form-item label="所属道路" name="road">
        <a-input v-model:value="form.road" placeholder="请输入所属道路"/>
      </a-form-item>
      <a-form-item label="详细地址" name="address">
        <a-input v-model:value="form.address" placeholder="请输入详细地址"/>
      </a-form-item>
      <a-form-item label="经度" name="longitude">
        <a-input v-model:value="form.longitude" placeholder="请输入经度"/>
      </a-form-item>
      <a-form-item label="纬度" name="latitude">
        <a-input v-model:value="form.latitude" placeholder="请输入纬度"/>
      </a-form-item>
      <a-form-item label="充电站规模">
        <a-select
            :default-value="form.scale"
            placeholder="请选择规模"
        >
          <a-select-option :value="1">小型充电站</a-select-option>
          <a-select-option :value="2">中型充电站</a-select-option>
          <a-select-option :value="3">大型充电站</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="运营类型">
        <a-select
            :default-value="form.operateType"
            placeholder="请选择类型"
        >
          <a-select-option :value="1">自营</a-select-option>
<!--          <a-select-option :value="2">三方</a-select-option>-->
<!--          <a-select-option :value="3">通用</a-select-option>-->
<!--          <a-select-option :value="4">宇视</a-select-option>-->
        </a-select>
      </a-form-item>
      <a-form-item label="更新类型">
        <a-select
            :default-value="form.updateType"
            placeholder="请选择类型"
        >
          <a-select-option :value="1">自动更新</a-select-option>
          <a-select-option :value="2">固定更新</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="备注" name="memo">
        <a-textarea
            v-model:value="form.memo"
            placeholder="备注内容"
            :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref} from "vue";
import { FormEvent } from '../../components/form'
import RulesList from "@/common/rules";
import {ChargingApi} from "@/common/api";
import {message} from "ant-design-vue";

const props = defineProps({
  formEvent:FormEvent as object,
})
const formRef:any = ref(null)
const formEvent = props.formEvent as FormEvent
let form: any = reactive<object>(Object.assign({
  name:"",
  province:"",
  city:"",
  district:"",
  road:"",
  address:"",
  longitude:"",
  latitude:"",
  scale:1,
  operateType:1,
  updateType:1,
  type:2,
  memo:"",
    }, formEvent.formData)
)

let rules: object = reactive({
  province: RulesList.notNull('请输入省份'),
  city: RulesList.notNull('请输入城市'),
  district: RulesList.notNull('请输入区域'),
  address: RulesList.notNull('请输入详细地址'),
  road: RulesList.notNull('请输入所属道路'),
  name: RulesList.notNull('请输入充电站名'),
});
let error: boolean = ref(false).value;
let errorMsg: string = ref('').value;

const emit = defineEmits(["finish"]);

const onConfirm = () => {
  formRef.value.validate().then(() => {
    if (formEvent.type === "add")
      onAddStation()
    else onEditStation()
  })

};
const onAddStation = async ()=>{
  const res = await formEvent.onMethodsApi(ChargingApi.AddStation,{...form},{message_:'新增中'})

  if (res) {
    message.success("创建成功")
    emit("finish")
    formEvent.cancel()
  }
}
const onEditStation = async ()=>{
  const res = await formEvent.onMethodsApi(ChargingApi.EditStation,{...form},{message_:'修改中'})

  if (res) {
    message.success('修改成功')
    emit("finish")
    formEvent.cancel()
  }
}

const onCancel = () => {
  form = {}
  formEvent.cancel()
}
</script>
