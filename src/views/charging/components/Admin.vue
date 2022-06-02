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
    >
      <a-form-item label="管理员姓名" name="name">
        <a-input v-model:value="form.name" placeholder="管理员姓名"/>
      </a-form-item>
      <a-form-item label="管理员用户名" name="username">
        <a-input v-model:value="form.username" placeholder="管理员用户名"/>
      </a-form-item>
      <a-form-item label="联系方式" name="phone">
        <a-input v-model:value="form.phone" placeholder="请输入联系方式"/>
      </a-form-item>
      <a-form-item label="地址" name="addr">
        <a-input v-model:value="form.addr" placeholder="地址"/>
      </a-form-item>
<!--      <a-form-item label="密码" v-if="formEvent.type==='add'" name="password" autocomplete="off" :hideRequiredMark="true">-->
<!--        <a-input v-model:value="form.password" type="password" placeholder="请输入密码"/>-->
<!--      </a-form-item>-->
<!--      <a-form-item label="确认密码" v-if="formEvent.type==='add'" name="diffPassword">-->
<!--        <a-input v-model:value="form.diffPassword" type="password" placeholder="请确认密码"/>-->
<!--      </a-form-item>-->
<!--      <a-form-item label="密码" v-if="formEvent.type==='modify'" name="changePassword" autocomplete="off" :hideRequiredMark="true">-->
<!--        <a-input v-model:value="form.password" type="password" placeholder="请输入密码"/>-->
<!--      </a-form-item>-->
<!--      <a-form-item label="确认密码" v-if="formEvent.type==='modify'" name="changeDiffPassword">-->
<!--        <a-input v-model:value="form.diffPassword" type="password" placeholder="请确认密码"/>-->
<!--      </a-form-item>-->
      <a-form-item label="邮箱">
        <a-input v-model:value="form.email" placeholder="邮箱"/>
      </a-form-item>
      <a-form-item label="性别" name="sex">
        <a-select
            :default-value="form.sex"
            placeholder="请选择性别"
            @change = "selectChange"
        >
          <a-select-option :value="0">女</a-select-option>
          <a-select-option :value="1">男</a-select-option>
          <a-select-option :value="2">未知</a-select-option>

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
import {reactive, ref} from "vue";
import {FormEvent} from './form'
import RulesList from "@/common/rules";
import {ApiBase, errorCheck, AdminApi,RoleApi} from "@/common/api";
import {message, notification} from "ant-design-vue";
import md5 from "js-md5";

const emit = defineEmits(["finish"]);

const props = defineProps({
  formEvent: FormEvent as object,
})

//按钮加载loading

const formEvent = props.formEvent as FormEvent

let form: any = reactive<object>(Object.assign({
      name: "",
      username: "",
      phone: "",
      addr: "",
      sex: 1,
      memo: "",
      password: "",
      type: 1,
  email:""
    }, formEvent.formData)
)

form.password = ""
// const checkPassword = () => {
//   if (form.password !== form.diffPassword)
//     return Promise.reject(new Error('两次密码不一致'))
//   else
//     return Promise.resolve()
// }
let rules: any = reactive({
  id: RulesList.notNull('请输入商户Id'),
  name: RulesList.username,
  username: RulesList.username,
  addr: RulesList.notNull('请输入商户地址'),
  phone: RulesList.phone,
  // password: RulesList.password(),
  // diffPassword: [
  //   {required: true, message: "密码不能为空", trigger: 'blur'},
  //   {validator: checkPassword, trigger: 'blur'}
  // ],
  // changeDiffPassword:[
  //   {validator: checkPassword, trigger: 'blur'}
  // ],
  // changePassword:RulesList.password(false),
});

let error: boolean = ref(false).value;
let errorMsg: string = ref('').value;

const selectChange = (e:any)=>{
  form.sex = e
}
const formRef:any = ref(null)
const onConfirm = () => {
  formRef.value.validate().then(()=>{
    if (formEvent.type === "add")
      onAddAdmin()
    else onEditAdmin()
  })
};
//添加商户
const onAddAdmin = async () => {
  // if (form.password!=='') form.password = md5(md5(form.password))
  const res = await formEvent.onMethodsApi(AdminApi.AddAdmin,{...form},{message_:'新增中'})
  // const {result, error} = await ApiBase(AdminApi.AddAdmin({...form}), {showLoading: true})
  if (res) {
    message.success("创建成功")
    emit("finish")
    formEvent.close()
  }
}
//修改商户
const onEditAdmin = async () => {
    delete form.password
  const res = await formEvent.onMethodsApi(AdminApi.EditAdmin,{...form},{message_:'修改中'})

  if (res) {
    message.success('修改成功')
    emit("finish")
    formEvent.close()

  }
}
const onCancel = () => {
  form = {}
  formEvent.cancel()
}
</script>
