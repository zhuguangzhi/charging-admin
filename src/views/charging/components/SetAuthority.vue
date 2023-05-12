<style lang="less">
</style>

<template>
  <a-modal
      title="分配权限(分配成功后会自动退出登录)"
      :visible="authorityData.showModal"
      :maskClosable="true"
      width="600px"
      @cancel="onCancel()"
      @ok="onConfirm()"
      :confirm-loading = "confirmLoading"
  >
    <a-tree
        v-model:checkedKeys="checkedKeys"
        checkable
        ref="treeRef"
        :tree-data="authority.AuthorityTree()"
        @check="onCheckTree"
    ></a-tree>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {ApiBase, errorCheck, AdminApi, RoleApi} from "@/common/api";
import {Authority} from "@/common/AuthorityConfig";
import {message} from "ant-design-vue";

const emit = defineEmits(["finish","cancel"]);
const confirmLoading = ref(false)

const props = defineProps({
  authorityData:{
    type:Object,
    default:()=>{}
  },
})
const treeRef = ref([])
let authority:Authority = reactive<Authority>(new Authority()) as  Authority
let checkedKeys: any = ref([])
const onCheckTree = (e:any) => {
  if (e[e.length-1]==='*'){
  //  选中了所有权限
    checkedKeys.value = ["*"]
    authority.changDisable(true)

  }else {
    authority.changDisable(false)
  }
}
//绑定权限
// const test = [
//   {
//     description:"管理员",
//     name:"gly",
//   },{
//     description:"充电站全景",
//     name:"cdzqj",
//   },
//   {
//     description:'管理员管理',
//     name:'gly-glygl',
//   },
//   {
//     description:'角色管理',
//     name:'gly-jsgl',
//   },
//   {
//     description:'微信多商户',
//     name:'gly-wxdsh',
//   },
//   {
//     description: '泊位管理',
//     name: 'sbgl-berth',
//   },
//
// ]

const onConfirm = async  () => {
  // if (checkedKeys.value.length===0) {
  //   message.error('请选择绑定的权限')
  //   return false
  // }
  confirmLoading.value = true
  const {result,error} = await ApiBase(RoleApi.BindRolePermission({roleId:props.authorityData.data.id,permissionNames:checkedKeys.value}))
  // const {result,error} = await ApiBase(RoleApi.AddRolePermission([...test]))
  if (errorCheck(result,error)){
    message.success('配置成功')
    emit('finish')
    emit('cancel')
  }
  confirmLoading.value = false
};
const onCancel = ()=>{
  emit('cancel')
};


</script>
