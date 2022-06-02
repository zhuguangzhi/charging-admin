<style scoped lang="less">
</style>

<template>
  <a-modal
      :title="formEvent.title"
      :visible="true"
      :maskClosable="true"
      :width="formEvent.width"
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
      <a-form-item label="套餐名" name="name">
        <a-input v-model:value="form.name" placeholder="请输入套餐名"/>
      </a-form-item>
      <a-form-item label="套餐金额(元)" name="cost">
        <a-input :default-value="form.cost/100" @change="moneyChange" placeholder="请输入套餐金额"/>
      </a-form-item>
<!--      <a-form-item label="备注" name="memo">-->
<!--        <a-textarea-->
<!--            v-model:value="form.memo"-->
<!--            placeholder="备注内容"-->
<!--            :auto-size="{ minRows: 3, maxRows: 5 }"-->
<!--        />-->
<!--      </a-form-item>-->
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormEvent} from './form'
import RulesList from "@/common/rules";
import {PayPackage} from "@/common/api";
import {message} from "ant-design-vue";
import format from "@/common/format";

const emit = defineEmits(["finish"]);

const props = defineProps({
  formEvent: FormEvent as object,
})

const formEvent = props.formEvent as FormEvent

let form: any = reactive<object>(Object.assign({
      name: "",
      cost: "",
    }, formEvent.formData)
)
form.password = ""

let rules: any = reactive({
  name: RulesList.username,
  cost: RulesList.notNull('请输入金额'),
});

let error: boolean = ref(false).value;
let errorMsg: string = ref('').value;

const formRef:any = ref(null)
//金额改变
const moneyChange = (e:any) => {
  setTimeout(()=>{
    form.cost = e.target._value
  },0)
}

const onConfirm = () => {
  formRef.value.validate().then(()=>{
    if (formEvent.type === "add")
      onAddPackage()
    else onEditPackage()
  })
};
//添加
const onAddPackage = async () => {
  const res = await formEvent.onMethodsApi(PayPackage.AddPackage,({...form,cost:format.moneynoYuan(form.cost)}), {message_:'新增中'})
  if (res) {
    message.success("创建成功")
    emit("finish")
  }
  formEvent.close()
}
//修改
const onEditPackage = async () => {
  const res = await formEvent.onMethodsApi(PayPackage.EditPackage,({...form,cost:format.moneynoYuan(form.cost)}), {message_:'修改中'})
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
