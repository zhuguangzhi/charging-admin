<style scoped lang="less">
</style>

<template>
  <a-modal
      :title="formEvent.title"
      :visible="true"
      :maskClosable="true"
      :width="formEvent.width"
      :confirm-loading = "formEvent.confirmLoading"
      @cancel="onCancel()"
      @ok="onConfirm()"
  >
    <a-alert v-if="error" type="error" :message="errorMsg" banner/>
    <a-form
        :model="form"
        ref="formRef"
        :rules="rules"
        :label-col="formEvent.labelCol"
        :wrapper-col="formEvent.wrapperCol"
        style="max-height: 50vh;overflow-y: scroll"
    >
      <a-form-item label="APP编号" name="appId">
        <a-input v-model:value="form.appId" placeholder="请输入微信商户APP编号"/>
      </a-form-item>
      <a-form-item label="微信商户名" name="name">
        <a-input v-model:value="form.name" placeholder="请输入微信商户名"/>
      </a-form-item>
      <a-form-item label="微信商户编号" name="mchId">
        <a-input v-model:value="form.mchId" placeholder="请输入微信商户编号"/>
      </a-form-item>
      <a-form-item label="微信商户Key" name="mchKey">
        <a-input v-model:value="form.mchKey" placeholder="请输入微信商户Key"/>
      </a-form-item>
      <a-form-item label="密钥" name="secret">
        <a-input v-model:value="form.secret" placeholder="请输入密钥"/>
      </a-form-item>
      <a-form-item label="类型" name="type">
        <a-select
            :default-value="form.type"
            placeholder="请选择类型"
            @change = "selectChange"
        >
          <a-select-option :value="1">小程序</a-select-option>
          <a-select-option :value="2">公众号</a-select-option>

        </a-select>
      </a-form-item>
      <a-form-item label="备注" name="memo">
        <a-textarea
            v-model:value="form.memo"
            placeholder="请输入备注内容"
            :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormEvent} from './form'
import RulesList from "@/common/rules";
import {ApiBase, errorCheck, AdminApi, RoleApi, WeChartMerchantApi} from "@/common/api";
import {message, notification} from "ant-design-vue";
import md5 from "js-md5";

const emit = defineEmits(["finish"]);

const props = defineProps({
  formEvent: FormEvent as object,
})

//按钮加载loading

const formEvent = props.formEvent as FormEvent

let form: any = reactive<object>(Object.assign({
      appId: "",
      name: "",
      mchId: "",
      mchKey: "",
      secret: '',
      type: 1,
      memo: "",
    }, formEvent.formData))

form.password = ""
const checkPassword = () => {
  if (form.password !== form.diffPassword)
    return Promise.reject(new Error('两次密码不一致'))
  else
    return Promise.resolve()
}
let rules: any = reactive({
  appId: RulesList.notNull('请输入微信商户APP编号'),
  name: RulesList.notNull('请输入微信商户名'),
  mchId: RulesList.notNull('请输入微信商户编号'),
  mchKey: RulesList.notNull('请输入微信商户Key'),
  secret: RulesList.notNull('请输入密钥'),
});

let error: boolean = ref(false).value;
let errorMsg: string = ref('').value;

const formRef:any = ref(null)

const selectChange = (e:any)=>{
  form.type = e
}
const onConfirm = () => {
  formRef.value.validate().then(()=>{
    if (formEvent.type === "add")
      onAddAdmin()
    else onEditAdmin()
  })
};
//添加
const onAddAdmin = async () => {
  const res = await formEvent.onMethodsApi(WeChartMerchantApi.AddWeChartMerchant,{...form},{message_:'新增中'})
  if (res) {
    message.success("创建成功")
    emit("finish")
  }
  formEvent.close()
}
//修改
const onEditAdmin = async () => {
  const res = await formEvent.onMethodsApi(WeChartMerchantApi.EditWeChartMerchant,{...form},{message_:'修改中'})

  if (res) {
    message.success('修改成功')
    emit("finish")
    formEvent.close()
  }
}
const onCancel = () => {
  form = {}
  formEvent.close()

}
</script>
