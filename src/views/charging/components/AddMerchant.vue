<!--新增商户-->
<style scoped lang="less">
</style>

<template>
  <a-modal
      :title="formEvent.title"
      :visible="true"
      :maskClosable="true"
      :confirm-loading = "formEvent.confirmLoading"
      :width="formEvent.width"
      @cancel="formEvent.cancel()"
      @ok="onConfirm()"
  >
    <a-alert v-if="error" type="error" :message="errorMsg" banner/>
    <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :label-col="formEvent.labelCol"
        :wrapper-col="formEvent.wrapperCol"
    >
      <a-form-item label="商户名" name="name">
        <a-input v-model:value="form.name" placeholder="商户名"/>
      </a-form-item>
      <a-form-item label="商户编码" name="tenantCode">
        <a-input v-model:value="form.tenantCode" placeholder="商户编码"/>
      </a-form-item>

      <a-form-item label="备注" name="memo">
        <a-textarea
            v-model:value="form.memo"
            placeholder="备注"
            :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {FormEvent} from './form'
import RulesList from "@/common/rules";
import {ApiBase, errorCheck, Merchant} from "@/common/api";
import {message,notification} from "ant-design-vue";

const emit = defineEmits(["finish"]);

const props: any = defineProps({
  formEvent: FormEvent as object,
})

const formRef:any = ref(null)
const formEvent: any = props.formEvent as FormEvent

let form:any = reactive<object>(Object.assign({
  name: "",
  tenantCode: "",
  memo: "",
},formEvent.formData)
)


let rules: object = reactive({
  name: RulesList.username,
});
let error: boolean = ref(false).value;
let errorMsg: string = ref('').value;

const onConfirm = () => {
  formRef.value.validate().then(()=>{
    if (formEvent.type === "add")
      onAddMerchant()
    else onEditMerchant()
  })

};
//添加商户
const onAddMerchant = async () => {
  const res = await formEvent.onMethodsApi(Merchant.AddMerchant,{...form},{message_:'新增中'})
  // const {result, error} = await ApiBase(Merchant.AddMerchant({...form}), {showLoading: true})
  if (res) {
    notification.open({
      message: '商户创建成功',
      description:
          '已为该商户创建超级管理员，请在管理员管理中查看详情，密码为初始密码，请及时修改'
    })
    emit("finish")
    formEvent.close()
  }
}
//修改商户
const onEditMerchant = async  () => {
  const res = await formEvent.onMethodsApi(Merchant.EditMerchant,{...form},{message_:'修改中'})
  if (res) {
    message.success('修改成功')
    emit("finish")
    formEvent.close()
  }
}
</script>
