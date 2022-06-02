<script setup lang="ts">
import {useRouter} from 'vue-router'
import {account} from '@/store'
import {loadMenu, loadRoutes} from '@/utils/routerUtil'
import {ApiBase, errorCheck, Login} from '@/common/api'
import LoginItem from "@/views/login/components/LoginItem.vue";
import {onMounted, reactive, ref} from "vue";
import {read, remove, write} from "../../common/commonFun/local"
import md5 from 'js-md5'
import { message } from 'ant-design-vue'
import { UserOutlined,IdcardOutlined,LockOutlined} from '@ant-design/icons-vue'

const accountStore = account()
const router = useRouter()

// console.log('window.$$config.logo', window.$$config.logo)
const logo = window.$$logo;
const title:any = window.$$title;
let user: any = reactive<Object>({
  username: "",
  password: "",
  tenantCode: "",
})
const checked = ref<Boolean>(true)
let loading = ref<Boolean>(false)
const rules = reactive<Object>({
  username: [
    {required: true, message: '请输入用户名！', trigger: 'blur'},
  ],
  // password: [
  //   {required: true, message: '请输入密码！', trigger: 'blur'},
  //   {min: 3, max: 20, message: '长度请控制在3-20个字符', trigger: 'blur'}
  // ],
  tenantCode: [
    {required: true, message: '请输入商户编号！', trigger: 'blur'},
    {min: 3, max: 20, message: '长度请控制在3-20个字符', trigger: 'blur'}
  ]
})

// 账号密码初始化
const loginInfo = read('loginInfo')
if (loginInfo.username) {
  user = reactive({
    ...loginInfo
  })
}
//记住密码框勾选
const changRemPass = (e:any) => { checked.value = e.target.checked }

const home = async (tenantCode:string|number) => {
  // console.log('accountStore', accountStore.setPermissions)
  // await accountStore.setPermissions(['home'])
  const RouterList = JSON.parse(JSON.stringify(window.$$router))
  const routes = await loadRoutes(router, RouterList)
  await loadMenu(router, RouterList, false)

  //商户管理权限
  const tenantId = account().getTenant

  if (tenantId != tenantCode) {
    account().setTenantBoss(false)
  }
  else {
    account().setTenantBoss(true)
  }
  await router.push(routes[0].children[0].path)



}

const example2 = () => {
  router.push('/example2')
}

const login = async () => {
  loading.value = true
  const {result,error} = await ApiBase(Login({
    username: user.username,
    password: md5(md5(user.password)),
    tenantCode: user.tenantCode
  }), {showLoading: true})
  if (errorCheck(result,error)) {
    console.log('login',result)
    if (checked.value) {
      //  记住密码
      write('loginInfo', user)
    } else {
      remove('loginInfo')
    }
    //  信息存储在store中
    await accountStore.setAdminInfo(result.data.admin);
    await accountStore.setToken(result.data.token)
    await accountStore.setTenantInfo(result.data.tenant)
    await accountStore.setRoles(result.data.roles)
    await accountStore.setPermissions(result.data.permissions)
    await home(user.tenantCode)
  }
  loading.value=false

}

onMounted(() => {
  document.onkeydown = (event) => {
    const e = event || window.event
    if (e && e.keyCode == 13) {
      //回车键的键值为13
      login();
    }
  }
})

</script>

<template>

  <div class="login">
    <div class="login-box">
      <div class="login-icon-content">
        <LoginItem style="transform:scale(0.7)"></LoginItem>
      </div>
      <div class="login-card">
        <div class="login-card-title">
          <img v-if="logo" :src="logo" alt="">
           <span v-else class="font">{{ title }}</span>
        </div>
        <div class="login-card-form">
          <a-form :model="user" :rules="rules" style="width: 100%" @finish="login">
            <a-form-item name="tenantCode" class="login-card-form-item">
              <a-input v-model:value="user.tenantCode" placeholder="商户编号" size="large">
                <template #prefix>
                  <idcard-outlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="username" class="login-card-form-item">
              <a-input v-model:value="user.username" placeholder="用户名" size="large">
                <template #prefix>
                  <user-outlined type="user" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input v-model:value="user.password" type="password" placeholder="密码"
                       size="large">
                <template #prefix>
                  <lock-outlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-checkbox :checked="checked" :defaultChecked="checked"
                          @click="changRemPass">
                记住密码
              </a-checkbox>
            </a-form-item>
            <a-form-item>
              <a-button html-type="submit" type="primary" :loading="loading" class="login-form-button" size="large">
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.login {
  width: 100%;
  height: 100%;
  background: url("../../assets/login/bg04.jpg") 0 0 no-repeat;
  background-size: 100% 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .login-box {
    position: relative;
    top: 0;
    bottom: 0;
    width: 100%;
    max-width: 1620px;
    height: 100%;
  }

  &-icon-content {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .login-card {
    box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.16);
    width: 464px;
    height: 440px;
    background: #fff;
    border-radius: 5px;
    background-repeat: repeat-x;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 64px;
    top: calc(50% - 220px);

    /deep/ .ant-row {
      margin-bottom: 16px;
    }

    &-title {
      display: flex;
      //  background-color: aquamarine;
      width: 200px;
      justify-content: center;
      align-items: center;
      margin: 20px 0;

      img {
        width: 100%;
        height: 100%;
      }
    }

    &-title {
      margin-top: 32px;
      margin-bottom: 32px;
      font-size: 24px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 45px;
      color: rgba(4, 92, 151, 1);
      text-align: left;
    }

    &-form {
      flex-grow: 5;
      width: 90%;
      display: flex;
      height: 300px;
      flex-direction: column;

      .login-form {
        max-width: 300px;
      }

      .login-form-forgot {
        float: right;
      }

      .login-form-button {
        width: 100%;
      }

      .login-bottom {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        justify-content: space-between;

        .rem {
          font-weight: bold;
          align-self: flex-end;
          color: rgba(102, 102, 102, 1) !important;
          font-size: 15px;
        }
      }
    }
  }

}

// 移动端
@media only screen and (min-device-width: 350px) and (max-device-width: 768px) {
  .login {
    width: 100%;
    height: 100%;
    background: url("../../assets/login/bg04.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .login-box {
      position: relative;
      top: 0;
      bottom: 0;
      width: 100%;
      max-width: 1620px;
      height: 100%;
    }

    &-icon-content {
      display: none;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    .login-card {
      box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.16);
      width: calc(100% - 32px);
      right: 16px;
      background: #fff;
      border-radius: 5px;
      background-repeat: repeat-x;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: calc(50% - 220px);

      /deep/ .ant-row {
        margin-bottom: 16px;
      }

      &-title {
        display: flex;
        width: 200px;
        justify-content: center;
        align-items: center;
        margin: 20px 0;

        img {
          width: 100%;
          height: 100%;
        }
      }

      &-title {
        margin-top: 32px;
        margin-bottom: 32px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 45px;
        color: rgba(4, 92, 151, 1);
        text-align: left;
      }

      &-form {
        flex-grow: 5;
        width: 90%;
        display: flex;
        height: 300px;
        margin-top: 16px;
        flex-direction: column;

        .login-form {
          max-width: 300px;
        }

        .login-form-forgot {
          float: right;
        }

        .login-form-button {
          width: 100%;
        }

        .login-bottom {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          justify-content: space-between;

          .rem {
            font-weight: bold;
            align-self: flex-end;
            color: rgba(102, 102, 102, 1) !important;
            font-size: 15px;
          }
        }
      }

    }
  }
}
</style>
