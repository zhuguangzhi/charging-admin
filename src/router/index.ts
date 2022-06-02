import {
  createRouter,
  createWebHashHistory,
} from 'vue-router'
import { formatAuthority } from '@/utils/routerUtil'
import options from './config.async'

/**
 * 初始化路由实例
 * @returns {VueRouter}
 */
function initRouter() {
  formatAuthority(options.routes)
  console.log("options", options)
  // 创建路由对象
  const router = createRouter({
    history: createWebHashHistory(),
    ...options
  })
  console.log("router", options)
  return router
}

const router = initRouter()

export default router

// // history模式
// import {
//   createRouter,
//   createWebHashHistory,
// } from 'vue-router'

// import Example from '../views/example/example.vue'
// import TableView from '@/layout/TableView.vue'

// const routes = [
// // 路由的默认路径
//   {
//     path:'/',
//     redirect:"/login"
//   },
//   {
//     path:'/login',
//     name: 'login',
//     component: () => import('../views/login/Login.vue')
//   },
//   {
//     path: '/example',
//     component: TableView
//   }
// ]

// // 创建路由对象
// const router = createRouter({
//   history: createWebHashHistory(),
//   routes
// })
// export default router