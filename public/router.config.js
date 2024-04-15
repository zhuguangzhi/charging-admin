//路由Router名需跟路由表中path路径相同。否则导航头部无法正常显示
window.$$router = [
  {
    name: '首页', tag: '$cdgl', router: 'home', isRouter: true, 
    children: [
      { name: '充电站全景', router: 'ChargingStationMap', icon: 'icon-erth', authority: 'cdzqj' },
      { name: '商户管理', router: 'MerchantManage', icon: 'icon-guanliyuan1', authority: 'shgl' },
      { name: '管理员', path:"group:admin", icon: 'icon-manager', authority: 'gly',children: [
          { name: '管理员管理', router: 'AdminManage', authority: 'gly-glygl' },
          { name: '角色管理', router: 'RoleManage', authority: 'gly-jsgl' },
          { name: '微信多商户', router: 'WeChatMerchant', authority: 'gly-wxdsh' },
        ] },
      { name: '车主管理', router: 'CarUserManage', icon: 'icon-yonghuguanli1', authority: 'czgl' },
      { name: '设备管理',path: 'group:device', icon: 'icon-app', authority: 'sbgl',
        children: [
          { name: '充电站管理', router: 'ChargingStation', authority: 'sbgl-chargingStation' },
          { name: '充电桩管理', router: 'ChargingPile', authority: 'sbgl-chargingPile' },
          { name: '充电枪管理', router: 'ChargingGun', authority: 'sbgl-chargingGun' },
          { name: '泊位管理', router: 'Berth', authority: 'sbgl-berth' },
        ]

      },
      { name: '订单管理', path:"group:order", icon: 'icon-dingdan2', authority: 'ddgl' ,
        children: [
          { name: '充电中订单', router: 'ChargingOrder', authority: 'ddgl-chrging' },
          { name: '已完成订单', router: 'ChargingFinishOrder',authority: 'ddgl-finish' },
          { name: '缴费记录管理', router: 'PaymentRecord',authority: 'ddgl-payment' },
          { name: '账单管理', router: 'BillManage',authority: 'ddgl-bill' },

          // { name: '优惠详情管理', router: 'DiscountDetails', icon: 'icon-quanxian2-copy', authority: '*' },
          { name: '退款记录管理', router: 'RefundOrder', authority: 'ddgl-refund' },
        ]
      },
      { name: '充电套餐管理', router: 'ChargingPackageManage', icon: 'icon-shoufeiguizepeizhi', authority: 'cdtc' },
      { name: '收费规则管理', router: 'ChargingRuleManage', icon: 'icon-guizeguanliquanjugongxiang', authority: 'sfgz',},
      // { name: '微信支付接入', router: 'WeChatApi', icon: 'icon-guize', authority: '*' },
    ]
  }
]

window.$$config = {
  title: "充电桩管理平台",
  baseUrl: "http://localhost:8080/api",
  logo: "https://static.zysmartparking.com/logotext.png"
}