import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// import 'ant-design-vue/dist/antd.dark.css'
// import 'ant-design-vue/dist/antd.variable.min.css' // 2.2.8稳定版未启用
import 'animate.css';
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

import '@/store'

import XEUtils  from 'xe-utils'
import VXETable from 'vxe-table'
// import 'vxe-table/lib/style.css'
import '@/assets/css/vxe-table.scss'

// 表格全局参数
VXETable.setup({})

import '../assets/css/global.less'
import '../assets/css/reset.less'

import router from '../router/index'

import KTable from '@/components/KTable.vue'
import KTableForm from '@/components/KTableForm.vue'
import KDeleteBtn from '@/components/KDeleteBtn.vue'
import KTableOptBtn from '@/components/KTableOptBtn.vue'
import KTableEditBtn from '@/components/KTableEditBtn.vue'
import KTableDeleteBtn from '@/components/KTableDeleteBtn.vue'
import KTableStatusBtn from '@/components/KTableStatusBtn.vue'
import KTableDetailBtn from '@/components/KTableDetailBtn.vue'
import KTableAutoBtn from '@/components/KTableAutoBtn.vue'
import KSwitchState from '@/components/status_opt/switch_state.vue'
import KPopup from "@/components/k_popup/KPopup.vue"
import KCustomTag from "@/components/status_opt/KCustomTag.vue"
import KSuccessTag from "@/components/status_opt/KSuccessTag.vue"
import KErrorTag from "@/components/status_opt/KErrorTag.vue"
import KDialog from "@/components/k-dialog/KDialog.vue";


import { loadRoutes } from '@/utils/routerUtil'

import '@/components/drag-dialog/index'

// Iconfont
import { createFromIconfontCN } from '@ant-design/icons-vue';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_781407_j27mov2x81q.js'
})

const init = (app: any) => {
  app.use(Antd)
  app.use(VXETable)
  app.component('KTable', KTable)
  app.component('KDialog', KDialog)
  app.component('KCustomTag',KCustomTag)
  app.component('KSuccessTag',KSuccessTag)
  app.component('KErrorTag',KErrorTag)
  app.component('KTableForm', KTableForm)
  app.component('KDeleteBtn', KDeleteBtn)
  app.component('KTableOptBtn', KTableOptBtn)
  app.component('KTableEditBtn', KTableEditBtn)
  app.component('KTableDeleteBtn', KTableDeleteBtn)
  app.component('KTableDetailBtn', KTableDetailBtn)
  app.component('KTableStatusBtn', KTableStatusBtn)
  app.component('KTableAutoBtn', KTableAutoBtn)
  app.component('KSwitchState', KSwitchState)
  app.component('KPopup', () => KPopup)
  app.component('IconFont', IconFont)
  app.config.globalProperties.$XEUtils = XEUtils
  app.config.globalProperties.$window = window
  
  const store = createPinia()
  store.use(piniaPluginPersist)
  app.use(store)
  // 添加路由
  loadRoutes(router, null)
  app.use(router)
}

export default init;