<script setup lang="ts">
import {h, reactive, onMounted, resolveComponent} from "vue"
import {TableViewVo} from "@/common/tableViewVo"
import {VxeGridProps} from "vxe-table"
import {FormEvent} from './components/form'
import {ApiBase, AdminApi, errorCheck, Merchant} from "@/common/api";
import {message} from "ant-design-vue";
import Admin from './components/Admin.vue'
import Format from "@/common/format";
import SetRole from './components/MoreCheck.vue'
import md5 from "js-md5";


let tableViewVo: TableViewVo = reactive<TableViewVo>(new TableViewVo(reactive<VxeGridProps>({}),))
let formEvent: FormEvent = reactive<FormEvent>(new FormEvent());
// 重写此属性定义表格显示列
tableViewVo.vxeGridProps.columns = [

  {type: 'checkbox', width: '60'},
  {field: "id", title: "编号", minWidth: '180', showHeaderOverflow: true},
  {field: "name", title: "姓名", minWidth: '120', showHeaderOverflow: true},
  {field: "username", title: "用户名", minWidth: '120', showHeaderOverflow: true},
  {
    field: "status", title: "状态", minWidth: '120', slots: {
      default: ({row}) => {
        return [
          h(resolveComponent('a-tag'),
              {color: row.state == 1 ? 'green' : 'red'},
              () => row.state === 1 ? '已启用' : '已禁用')
        ];
      }
    },
    formatter:({cellValue})=>cellValue === 1 ? '已启用' : '已禁用'
  },
  {
    field: "sex", title: "性别", minWidth: '80', showOverflow: true, slots: {
      default: ({row}) => {
        return [Format.sexType[row.sex].label]
      }
    },
    formatter:({cellValue})=>Format.sexType[cellValue].label
  },
  {field: "phone", title: "联系电话", minWidth: '120', showOverflow: true},
  {field: "addr", title: "地址", minWidth: '280', showOverflow: true},
  {
    field: "roleList", title: "角色", minWidth: '240', showOverflow: true,
    // slots: {
    //   default: ({row}) => row.roleList.map((item: any) => (item.name + ' '))
    // },
    formatter:({row})=>row.roleList.map((item: any) => (item.name + ' '))
  },
  {field: "email", title: "邮箱", minWidth: '240', showOverflow: true},

  {
    title: '操作', field: 'allowance', fixed: 'right', minWidth: '180', slots: {
      default: ({row}) => {
        return [
          h('div', {
            className: "k-table-content-operation"
          }, [
            h(resolveComponent('KTableEditBtn'), {
              toolTipText: '修改', onClick: () => {
                formEvent.onModify("修改管理员",row,'modify')
              }
            }),
            h(resolveComponent('KTableAutoBtn'), {
              toolTipText:"角色配置",
              iconType:"icon-jiaoseguanli",
              iconColor:"#B291DA",
              onClick: () => {
                formEvent.type="Admin"
                formEvent.show = true;
                formEvent.title = "角色分配（该操作完成后会自动退出登录）"
                formEvent.formData = row
              }
            }),
            h(resolveComponent('KTableAutoBtn'), {
              toolTipText:"修改密码",
              iconType:"icon-suodakaimima-copy",
              iconColor:"#28A745",
              onClick: () => {
                passwordOption.showModel = true
                passwordOption.adminId = row.id
              }
            }),
            h(resolveComponent('KTableStatusBtn'), {
              onClick: async () => {
                row.state = row.state == 1 ? 2 : 1
                let res = await tableViewVo.onApi(AdminApi.EditAdminState,{
                  ids: [row.id],
                  state: row.state
                })
                if (res!=='') {
                  message.success('修改成功')
                } else row.state = row.state == 1 ? 2 : 1
              }
            }),
            h(resolveComponent('KTableDeleteBtn'), {
              onConfirm: () => {
                tableViewVo.onApi(AdminApi.DeleteAdmin,row)
              }
            }),
          ])
        ]
      }
    }
  }
]

let passwordOption = reactive({
  showModel:false,
  password:'',
  checkPassword:'',
  loading:false,
  adminId:null,
})
// 数据获取
tableViewVo.getDataFun = async (param: any) => {
  param.tenantId = tableViewVo.tenantCode
  tableViewVo.getMethods = AdminApi.GetAllAdmin
  return await ApiBase(AdminApi.GetAllAdmin({...param}))
}

onMounted(() => {
  tableViewVo.search()
})

const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
//禁用 / 启用
const EditStatus = async (status:number) => {
  if (tableViewVo.checkList.length<1) return false
  let res = await tableViewVo.onApi(AdminApi.EditAdminState,{
    ids: tableViewVo.checkList.map((item:any)=>item.id),
    state: status
  })
  if (res){
    message.success('操作成功')
  }
}
//删除
const onDelete = async ()=>{
  if (tableViewVo.checkList.length<1) {
    message.error('请选择管理员')
    return false
  }
  let res = await tableViewVo.onApi(AdminApi.DeleteBatchesAdmin,{
    ids: tableViewVo.checkList.map((item:any)=>item.id),
  })
  if (res){
    message.success('删除成功')
  }
}

//修改密码
const EditPassword = async ()=>{
  if(passwordOption.password.length<3||passwordOption.password.length>16){
    message.error('密码过短或过长')
    return false
  }
  else if (passwordOption.password!==passwordOption.checkPassword){
    message.error('两次密码不一致')
    return false
  }
  passwordOption.loading = true
  const {result,error} = await ApiBase(AdminApi.EditAdminPassword({
    adminId:passwordOption.adminId,
    password:md5(md5(passwordOption.password))
  }))
  if (errorCheck(result,error)){
    passwordOption.showModel = false;
    message.success('密码修改成功')
    tableViewVo.reFresh()
  }
  passwordOption.loading = false
}

</script>

<template>
  <div class="k-table-content">
    <div class="k-table-content-form">
      <k-table-form :tableViewVo="tableViewVo">
        <a-form layout="inline" :model="tableViewVo.form">
          <a-form-item label="管理员姓名">
            <a-input v-model:value="tableViewVo.form.name" placeholder="管理员姓名"></a-input>
          </a-form-item>
          <a-form-item label="管理员用户名">
            <a-input v-model:value="tableViewVo.form.username" placeholder="管理员用户名"></a-input>
          </a-form-item>
          <a-form-item label="管理员编号">
            <a-input v-model:value="tableViewVo.form.id" placeholder="管理员编号"></a-input>
          </a-form-item>
        </a-form>
      </k-table-form>
    </div>
    <k-table :tableViewVo="tableViewVo">
      <template #toolbar_buttons>
        <div class="toolbar-buttons">
          <a-button type="primary" @click="formEvent.onModify('新增管理员',{tenantId:tableViewVo.tenantCode},'add')">新增管理员</a-button>
          <a-button type="primary" @click="EditStatus(2)">禁用</a-button>
          <a-button type="primary" @click="EditStatus(1)">启用</a-button>
          <a-button type="primary" danger>
            <a-popconfirm title="确认删除吗？" @confirm="onDelete">
              删除
            </a-popconfirm>
          </a-button>
        </div>
      </template>
    </k-table>
    <SetRole v-if="formEvent.show && formEvent.type==='Admin'" :formEvent="formEvent" @cancel="()=>formEvent.show = false"
             @finish="tableViewVo.reFresh()"/>
    <admin v-else-if="formEvent.show" :formEvent="formEvent" @finish="tableViewVo.reFresh()"/>

    <a-modal
        title="修改密码"
        :visible="passwordOption.showModel"
        :maskClosable="true"
        :confirm-loading = "passwordOption.loading"
        @cancel="passwordOption.showModel=false"
        @ok="EditPassword()"
    >
      <a-form :label-col="formEvent.labelCol"
              :wrapper-col="formEvent.wrapperCol">
        <a-form-item label="密码">
          <a-input type="password"  v-model:value="passwordOption.password" placeholder="请输入密码"/>
        </a-form-item>
        <a-form-item label="确认密码">
          <a-input type="password" v-model:value="passwordOption.checkPassword" placeholder="请输入确认密码"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less">
.k-table-content-operation {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
