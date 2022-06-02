<style scoped lang="less">
</style>

<template>
  <a-modal
      title="绑定证书"
      :visible="true"
      :maskClosable="true"
      :width="formEvent.width"
      :confirm-loading = "formEvent.confirmLoading"
      @cancel="onCancel()"
      @ok="onConfirm()"
  >
    <a-upload-dragger
        v-model:fileList="form.fileList"
        name="file"
        :multiple="true"
        :action="WeChartMerchantApi.UploadMerchantFileUrl()"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined></inbox-outlined>
      </p>
      <p class="ant-upload-text">点击或拖拽到此处上传文件</p>
      <p class="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
    </a-upload-dragger>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormEvent} from './form'
import { WeChartMerchantApi} from "@/common/api";
import { InboxOutlined } from '@ant-design/icons-vue';
import {message} from "ant-design-vue";

const emit = defineEmits(["finish"]);

const props = defineProps({
  formEvent: FormEvent as object,
})

const formEvent = props.formEvent as FormEvent

let form: any = reactive<object>(Object.assign({
      fileList:[]
    }, formEvent.formData)
)

//绑定信息
const onConfirm = async () => {
  if (form.fileList.length<3){
    message.error('请补全文件')
    return false
  }
  const res = await formEvent.onMethodsApi(WeChartMerchantApi.UploadMerchantCertificate,{id:form.id,data:[
      {...form.fileList[0].response.data[0]},
      {...form.fileList[1].response.data[0]},
      {...form.fileList[2].response.data[0]},
    ]},{message_:'绑定中'})
  if (res) {
    message.success("绑定成功")
    emit("finish")
    formEvent.close()
  }
}


const onCancel = () => {
  form = {}
  formEvent.cancel()
}
</script>
