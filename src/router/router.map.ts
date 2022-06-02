// // 视图组件
// const view = {
//   page: () => import('@/layouts/PageView')
// }

// 路由组件注册
const routerMap = {
  login: {
    path: '/login',
    name: 'Login',
    meta: {
      title: "登录"
    },
    component: () => import('../views/login/Login.vue')
  },
  root: {
    path: '/',
    name: 'Root',
    redirect: '/login'
  },
  home: {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/Home.vue')
  },
  MerchantManage: {
    path: '/MerchantManage',
    name: 'MerchantManage',
    component: () => import('@/views/charging/MerchantManage.vue')
  },
  //管理员管理
  AdminManage: {
    path: '/AdminManage',
    name: 'AdminManage',
    component: () => import('@/views/charging/AdminManage.vue')
  },
  //角色管理
  RoleManage: {
    path: '/RoleManage',
    name: 'RoleManage',
    component: () => import('@/views/charging/RoleManage.vue')
  },
  //微信多商户管理
  WeChatMerchant: {
    path: '/WeChatMerchant',
    name: 'WeChatMerchant',
    component: () => import('@/views/charging/WeChatMerchant.vue')
  },
  //车主管理
  CarUserManage: {
    path: '/CarUserManage',
    name: 'CarUserManage',
    component: () => import('@/views/charging/CarUserManage.vue')
  },
  //充电站全景图
  ChargingStationMap: {
    path: '/ChargingStationMap',
    name: 'ChargingStationMap',
    component: () => import('@/views/charging/DeviceManage/ChargingStationMap.vue')
  },
  //充电站
  ChargingStation: {
    path: '/ChargingStation',
    name: 'ChargingStation',
    component: () => import('@/views/charging/DeviceManage/ChargingStation.vue')
  },
  //充电桩
  ChargingPile: {
    path: '/ChargingPile',
    name: 'ChargingPile',
    component: () => import('@/views/charging/DeviceManage/ChargingPile.vue')
  },
  //充电枪
  ChargingGun: {
    path: '/ChargingGun',
    name: 'ChargingGun',
    component: () => import('@/views/charging/DeviceManage/ChargingGun.vue')
  },
  //泊位
  Berth: {
    path: '/Berth',
    name: 'Berth',
    component: () => import('@/views/charging/DeviceManage/Berth.vue')
  },
  //充电中订单
  ChargingOrder: {
    path: '/ChargingOrder',
    name: 'ChargingOrder',
    component: () => import('@/views/charging/OrderManage/ChargingOrder.vue')
  },
  //已完成订单
  ChargingFinishOrder: {
    path: '/ChargingFinishOrder',
    name: 'ChargingFinishOrder',
    component: () => import('@/views/charging/OrderManage/ChargingFinishOrder.vue')
  },
  //账单管理
  BillManage: {
    path: '/BillManage',
    name: 'BillManage',
    component: () => import('@/views/charging/OrderManage/BillManage.vue')
  },
  //缴费记录管理
  PaymentRecord: {
    path: '/PaymentRecord',
    name: 'PaymentRecord',
    component: () => import('@/views/charging/OrderManage/PaymentRecord.vue')
  },
  //优惠详情管理
  DiscountDetails: {
    path: '/DiscountDetails',
    name: 'DiscountDetails',
    component: () => import('@/views/charging/OrderManage/DiscountDetails.vue')
  },
  //退款记录管理
  RefundOrder: {
    path: '/RefundOrder',
    name: 'RefundOrder',
    component: () => import('@/views/charging/OrderManage/RefundOrder.vue')
  },
  //充电套餐管理
  ChargingPackageManage: {
    path: '/ChargingPackageManage',
    name: 'ChargingRuleManage',
    component: () => import('@/views/charging/ChargingPackageManage.vue')
  },
  //收费规则
  ChargingRuleManage: {
    path: '/ChargingRuleManage',
    name: 'ChargingRuleManage',
    component: () => import('@/views/charging/ChargingRuleManage.vue')
  },
  //微信对接
  WeChatApi: {
    path: '/WeChatApi',
    name: 'WeChatApi',
    component: () => import('@/views/charging/WeChatApi.vue')
  },
  example: {
    path: '/example',
    name: 'example',
    component: () => import('@/views/example/example.vue')
  },
  example2: {
    path: '/example2',
    name: 'example2',
    component: () => import('@/views/example/example2.vue')
  },
  exp404: {
    authority: '*',
    name: 'exp404',
    path: '404',
    component: () => import('@/views/exp/404.vue')
  },
}
export default routerMap
