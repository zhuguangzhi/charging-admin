import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// import 'ant-design-vue/dist/antd.dark.css'
// import 'ant-design-vue/dist/antd.variable.min.css' // 2.2.8稳定版未启用

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


import { loadRoutes } from '@/utils/routerUtil'

import '@/components/drag-dialog/index'

// Iconfont
import { createFromIconfontCN } from '@ant-design/icons-vue';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_781407_jek1f7jxa9a.js'
})

const init = (app: any) => {
  app.use(Antd)
  app.use(VXETable)
  app.component('KTable', KTable)
  app.component('KTableForm', KTableForm)
  app.component('KDeleteBtn', KDeleteBtn)
  app.component('KTableOptBtn', KTableOptBtn)
  app.component('KTableEditBtn', KTableEditBtn)
  app.component('KTableDeleteBtn', KTableDeleteBtn)
  app.component('KTableDetailBtn', KTableDetailBtn)
  app.component('KTableStatusBtn', KTableStatusBtn)
  app.component('KTableAutoBtn', KTableAutoBtn)
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