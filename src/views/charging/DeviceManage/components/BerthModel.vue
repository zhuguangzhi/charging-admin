<style lang="less">

</style>

<template>
  <a-modal
      :title="formEvent.title"
      :visible="formEvent.show"
      :maskClosable="true"
      :width="formEvent.width"
      :confirm-loading="formEvent.confirmLoading"
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

      <a-form-item label="泊位名" name="name">
        <a-input v-model:value="form.name" placeholder="请输入泊位名"/>
      </a-form-item>
      <a-form-item label="泊位经度" name="longitude">
        <a-input v-model:value="form.longitude" placeholder="请输入泊位经度"/>
      </a-form-item>
      <a-form-item label="泊位纬度" name="latitude">
        <a-input v-model:value="form.latitude" placeholder="请输入泊位纬度"/>
      </a-form-item>
<!--      <a-form-item label="绑定设备">-->
<!--        <a-select-->
<!--            v-model:value="form.devCode"-->
<!--            mode="multiple"-->
<!--            style="width: 100%"-->
<!--            placeholder="请选择设备(可通过设备编号查找)"-->
<!--        >-->
<!--          <a-select-option v-for="(item) in chargingGunList" :key="item.id" :value="item.id">-->
<!--          {{item.name}}-->
<!--          </a-select-option>-->
<!--        </a-select>-->
<!--      </a-form-item>-->
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
import {BerthApi, ChargingApi} from "@/common/api";
import {message} from "ant-design-vue";

const emit = defineEmits(["finish"]);
const props = defineProps({
  formEvent: FormEvent as object,
})

const formEvent = props.formEvent as FormEvent
let formRef: any = ref(null)
let form: any = reactive<object>(Object.assign({
      name: '',
      memo: '',
      longitude: '',
      latitude: '',
      type:'11',
    }, formEvent.formData)
)

let rules: object = reactive({
  name: RulesList.notNull('请输入泊位名称'),
  longitude: RulesList.notNull('请输入泊位经度'),
  latitude: RulesList.notNull('请输入泊位纬度'),
});
let error: boolean = ref(false).value;
let errorMsg: string = ref('').value;

//确认
const onConfirm = () => {
  formRef.value.validate().then(() => {
    form.latitude = parseFloat(form.latitude)
    form.longitude = parseFloat(form.longitude)
    if (formEvent.type === 'modifyBerth') {
      //  修改
      onChangeBerth()
    } else {
      //  新增
      onAddBerth()
    }
  })
};
const onAddBerth = async () => {
  const res = await formEvent.onMethodsApi(BerthApi.AddBerth,{...form}, {message_: '新增中'})
  if (res) {
    message.success('创建成功')
    formEvent.show = false
    emit('finish')
  }
}
const onChangeBerth = async () => {
  const res = await formEvent.onMethodsApi(BerthApi.EditBerth,{...form}, {message_: '修改中'})
  if (res) {
    message.success('修改成功')
    formEvent.close()
    emit('finish')
  }
}
const onCancel = () => {
  form = {}
  formEvent.close()
}
onMounted(() => {
})
</script>
