<style lang="less">

</style>

<template>
  <a-modal
      :title="formEvent.title"
      :visible="formEvent.show"
      :maskClosable="true"
      :width="formEvent.width"
      :confirm-loading = "formEvent.confirmLoading"
      @cancel="onCancel()"
      @ok="onConfirm()"
  >
    <a-alert v-if="error" type="error" :message="errorMsg" banner/>
    <a-form
        :model="form"
        :rules="rules"
        ref="formRef"
        :label-col="formEvent.labelCol"
        :wrapper-col="formEvent.wrapperCol"
    >

      <a-form-item label="充电枪名" name="name">
        <a-input v-model:value="form.name" placeholder="请输入充电枪名称"/>
      </a-form-item>
<!--      <a-form-item label="充电枪品牌" name="brand">-->
<!--        <a-input v-model:value="form.brand" placeholder="请输入充电枪品牌"/>-->
<!--      </a-form-item>-->
      <a-form-item label="充电枪编码" name="name">
        <a-input v-model:value="form.code" placeholder="请输入充电枪名称"/>
      </a-form-item>
      <a-form-item label="充电枪类型" name="type">
        <a-select
            v-model:value="form.type"
            placeholder="请选择充电枪类型"
        >
          <a-select-option :value="13">汽车慢充充电枪</a-select-option>
          <a-select-option :value="15">汽车快充充电枪</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="充电方式">
        <a-select
            v-model:value="form.rechargeMode"
            placeholder="请选择充电方式"
        >
          <a-select-option v-for="(item,index) in format.RechargeType" :key="index" :value="item.key">{{item.label}}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="充电枪品牌">
          <a-select
              v-model:value="form.brand"
              placeholder="请选择充电枪品牌"
          >
            <a-select-option
                v-for="(item, index) in BrandList"
                :key="index"
                :value="item.id"
            >
              {{ item.name }}
            </a-select-option
            >
          </a-select>
      </a-form-item>
      <a-form-item label="充电桩" >
        <a-select
            v-model:value="form.deviceId"
            placeholder="请选择充电桩"
        >
          <a-select-option
              v-for="(item, index) in chargingPileList"
              :key="index"
              :value="item.id"
          >
            {{ item.name }}
          </a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="泊位" >
        <a-select
            v-model:value="form.deviceId"
            placeholder="请选择泊位"
        >
          <a-select-option
              v-for="(item, index) in chargingPileList"
              :key="index"
              :value="item.id"
          >
            {{ item.name }}
          </a-select-option
          >
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
import {onMounted, reactive, ref} from "vue";
import {FormEvent} from '../../components/form'
import RulesList from "@/common/rules";
import {ChargingApi} from "@/common/api";
import {message} from "ant-design-vue";
import {BrandList} from "@/common/BrandConfig"
import format from "@/common/format";

const emit = defineEmits(["finish"]);
const props = defineProps({
  formEvent: FormEvent as object,
})

const formEvent = props.formEvent as FormEvent
let formRef: any = ref(null)
let form: any = reactive<object>(Object.assign({
      name: '',
      brand: 1,
      type: 15,
      memo: '',
  deviceId:null,
  rechargeMode:1,
    }, formEvent.formData)
)

let rules: object = reactive({
  name: RulesList.notNull('请输入充电枪名称'),
  brand: RulesList.notNull('请输入充电枪品牌'),
});
let error: boolean = ref(false).value;
let errorMsg: string = ref('').value;

let chargingPileList:any = ref<Object>([])

const getChargingPile = async () => {
  const res = await formEvent.onMethodsApi(ChargingApi.GetAllDevice,{page: 1, row: 9999,type:"12,14",tenantId:form.tenantId},{confirmLoading_:false})
  if (res) {
    chargingPileList.value = res.data
  }
}

const onConfirm = () => {
  formRef.value.validate().then(() => {
    if (formEvent.type === 'modify') {
      //  修改
      onChangeGun()
    } else {
      //  新增
      onAddGun()
    }
  })
};
const onAddGun = async () => {
  const res = await formEvent.onMethodsApi(ChargingApi.AddDevice,{...form},{message_:'新增中'})

  if (res) {
    message.success('创建成功')
    formEvent.show = false
    emit('finish')
  }
}
const onChangeGun = async () => {
  const res = await formEvent.onMethodsApi(ChargingApi.EditDevice,{...form},{message_:'修改中'})
  if (res) {
    message.success('修改成功')
    formEvent.close()
    emit('finish')
  }
}
const onCancel = () => {
  form = {}
  formEvent.cancel()
}
onMounted(()=>{
  getChargingPile()
})
</script>
