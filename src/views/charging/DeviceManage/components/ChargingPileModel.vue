<style scoped lang="less">
.ChargingPileModel {
  max-height: 40vh;
  overflow-y: scroll;
}
/deep/ .ant-input-number {
  width: 100%;
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
        class="ChargingPileModel"
        :label-col="formEvent.labelCol"
        :wrapper-col="formEvent.wrapperCol"
    >

      <a-form-item label="充电桩名" name="name">
        <a-input v-model:value="form.name" placeholder="请输入充电桩名称"/>
      </a-form-item>
      <a-form-item label="设备编号" name="code">
        <a-input v-model:value="form.code" placeholder="请输入充电桩名称"/>
      </a-form-item>
      <a-form-item label="充电口数量" >
        <a-input-number id="inputNumber" v-model:value="form.portNum" :min="0" :max="99" />
      </a-form-item>
      <a-form-item label="充电桩品牌">
        <a-select
            v-model:value="form.brand"
            placeholder="请选择充电桩品牌"
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
      <a-form-item label="充电桩地址" name="address">
        <a-input v-model:value="form.address" placeholder="请输入充电桩地址"/>
      </a-form-item>
      <a-form-item label="充电桩经度" name="longitude">
        <a-input v-model:value="form.longitude" placeholder="请输入充电桩经度"/>
      </a-form-item>
      <a-form-item label="充电桩纬度" name="latitude">
        <a-input v-model:value="form.latitude" placeholder="请输入充电桩纬度"/>
      </a-form-item>
      <a-form-item label="最大功率(Kw)" >
        <a-input-number v-model:value="form.maxPower" :min="0" :max="999" />
      </a-form-item>
      <a-form-item label="最小功率(Kw)">
        <a-input-number v-model:value="form.minPower" :min="0" :max="999" />
      </a-form-item>
      <a-form-item label="最大电压(V)" >
        <a-input-number v-model:value="form.maxVoltage" :min="0" :max="999" />
      </a-form-item>
      <a-form-item label="最小电压(V)">
        <a-input-number v-model:value="form.minVoltage" :min="0" :max="999" />
      </a-form-item>
      <a-form-item label="充电桩类型" name="type">
        <a-select
            v-model:value="form.type"
            placeholder="请选择充电桩类型"
        >
          <a-select-option :value="12">汽车慢充充电桩</a-select-option>
          <a-select-option :value="14">汽车快充充电桩</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="充电方式">
        <a-select
            v-model:value="form.rechargeMode"
            placeholder="请选择充电桩充电方式"
        >
          <a-select-option v-for="(item,index) in format.RechargeType" :key="index" :value="item.key">{{item.label}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="充电站">
        <a-select
            v-model:value="form.stationId"
            placeholder="请选择充电站"
        >
          <a-select-option
              v-for="(item, index) in chargingStationList"
              :key="index"
              :value="item.id"
          >
            {{ item.name }}
          </a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="标签">
        <a-select
            v-model:value="form.tag"
            mode="tags"
            style="width: 100%"
            placeholder="请输入需要添加的标签"
        ></a-select>
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
let form: any = reactive<object>(Object.assign({
      name: '',
      brand: 1,
      type: 14,
      memo: '',
      stationId: null,
      latitude: null,
      longitude: null,
      code: '',
      portNum:0,
      maxPower:0,
      minPower:0,
      maxVoltage:0,
      minVoltage:0,
      tag:'',
      rechargeMode:1,
    }, formEvent.formData)
)
if (form.tag){
  form.tag = form.tag.replace(/^(\s|,)+|(\s|,)+$/g, '').split(',')
}else {
  form.tag = []
}

let formRef: any = ref(null)

let rules: object = reactive({
  name: RulesList.notNull('请输入充电桩名称'),
  brand: RulesList.notNull('请输入充电桩品牌'),
  longitude: { required: true,message: '请输入充电桩经度', trigger: 'blur' },
  latitude: { required: true,message: '请输入充电桩纬度', trigger: 'blur' },
  code: RulesList.notNull('请输入设备编号'),
});
let error: boolean = ref(false).value;
let errorMsg: string = ref('').value;

let chargingStationList:any = ref<Object>([])

const getChargingStation = async () => {
  const result = await formEvent.onMethodsApi(ChargingApi.GetAllStation,{page: 1, row: 9999,tenantId:form.tenantId},{confirmLoading_:false})
  if (result) {
    chargingStationList.value = result.data
  }
}

const onConfirm = () => {
  formRef.value.validate().then(() => {
    if (formEvent.type === 'modify') {
      //  修改
      onChangePile()
    } else {
      //  新增
      onAddPile()
    }
  })
};
const onAddPile = async () => {
  const res = await formEvent.onMethodsApi(ChargingApi.AddDevice,{...form,tag:form.tag.join()},{message_:'新增中'})
  if (res) {
    message.success('创建成功')
    formEvent.show = false
    emit('finish')
  }
}
const onChangePile = async () => {
  const res = await formEvent.onMethodsApi(ChargingApi.EditDevice,{...form,tag:form.tag.join()},{message_:'修改中'})
  if (res) {
    message.success('修改成功')
    formEvent.cancel()
    emit('finish')
  }
}
const onCancel = () => {
  form = {}
  formEvent.cancel()
}
onMounted(() => {
  getChargingStation()
})
</script>
