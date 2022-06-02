<style scoped lang="less">
</style>

<template>
  <a-modal
      :title="formEvent.title"
      :visible="true"
      :maskClosable="true"
      :width="formEvent.width"
      @cancel="onCancel()"
      :confirm-loading="formEvent.confirmLoading"
      @ok="onConfirm()"
  >
    <a-alert v-if="error" type="error" :message="errorMsg" banner/>
    <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :label-col="formEvent.labelCol"
        :wrapper-col="formEvent.wrapperCol"
        style="max-height: 40vh;overflow-y: scroll"
    >
      <a-form-item label="角色名" name="name">
        <a-input v-model:value="form.name" placeholder="角色名"/>
      </a-form-item>
      <a-form-item label="角色描述" name="description">
        <a-input v-model:value="form.description" placeholder="角色描述"/>
      </a-form-item>

      <a-form-item label="备注" name="memo">
        <a-textarea
            v-model="form.memo"
            placeholder="备注内容"
            :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref} from "vue";
import { FormEvent } from './form'
import RulesList from "@/common/rules";
import {RoleApi, ApiBase, errorCheck} from "@/common/api";
import {message} from "ant-design-vue";
// import type { FormInstance } from 'ant-design-vue';

const emit = defineEmits(["finish"]);
const formRef:any = ref(null)
const props = defineProps({
  formEvent:FormEvent as object,
})

const formEvent = props.formEvent as FormEvent
let form: any = reactive<object>(Object.assign({
      name: "",
  description:"",
      email:""
    }, formEvent.formData)
)
//modelRef
// const formRef:any = ref<FormInstance >()

let rules: any = reactive({
  name: RulesList.username,
  description: RulesList.notNull('请输入角色描述'),
});
let error: boolean = ref(false).value;
let errorMsg: string = ref('').value;




const onConfirm = () => {
  formRef.value.validate().then(()=>{
    if (formEvent.type === "add")
      onAddRole()
    else onEditRole()
  })

};
const onAddRole = async ()=>{
  const res = await formEvent.onMethodsApi(RoleApi.AddRole,{...form},{message_:'新增中'})
  if (res) {
    await bindAuthority(res.data.id)
  }
  formEvent.close()
}
const bindAuthority = async(id:number|string) => {
  await ApiBase(RoleApi.BindRolePermission({roleId:id,permissionNames:['*']}))
  message.success("创建成功")
  emit("finish")

}
const onEditRole = async ()=>{
  const res = await formEvent.onMethodsApi(RoleApi.EditRole,{...form},{message_:'修改中'})
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
