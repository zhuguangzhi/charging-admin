//路由Router名需跟路由表中path路径相同。否则导航头部无法正常显示
window.$$router = [
  {
    name: '首页', tag: '$cdgl', router: 'home', isRouter: true, 
    children: [
      { name: '充电站全景', router: 'ChargingStationMap', icon: 'icon-dituleiditu', authority: 'cdzqj' },
      { name: '商户管理', router: 'MerchantManage', icon: 'icon-shanghuguanli', authority: 'shgl' },
      { name: '管理员', path:"group:admin", icon: 'icon-guanliyuan', authority: 'gly',children: [
          { name: '管理员管理', router: 'AdminManage', icon: 'icon-guanliyuan', authority: 'gly-glygl' },
          { name: '角色管理', router: 'RoleManage', icon: 'icon-jiaose', authority: 'gly-jsgl' },
          { name: '微信多商户', router: 'WeChatMerchant', icon: 'icon-shanghuguanli', authority: 'gly-wxdsh' },
        ] },
      { name: '车主管理', router: 'CarUserManage', icon: 'icon-chezhufuwu', authority: 'czgl' },
      { name: '设备管理',path: 'group:device', icon: 'icon-chongdianzhuang3', authority: 'sbgl',
        children: [
          { name: '充电站管理', router: 'ChargingStation', icon: 'icon-tingchechang11', authority: 'sbgl-chargingStation' },
          { name: '充电桩管理', router: 'ChargingPile', icon: 'icon-chongdianzhuang3', authority: 'sbgl-chargingPile' },
          { name: '充电枪管理', router: 'ChargingGun', icon: 'icon-diandongchechongdian', authority: 'sbgl-chargingGun' },
          { name: '泊位管理', router: 'Berth', icon: 'icon-boweibangding-copy', authority: 'sbgl-berth' },
        ]

      },
      { name: '订单管理', path:"group:order", icon: 'icon-dingdan1', authority: 'ddgl' ,
        children: [
          { name: '充电中订单', router: 'ChargingOrder', icon: 'icon-dingdanchulizhong', authority: 'ddgl-chrging' },
          { name: '已完成订单', router: 'ChargingFinishOrder', icon: 'icon-baoxiandingdan', authority: 'ddgl-finish' },
          { name: '缴费记录管理', router: 'PaymentRecord', icon: 'icon-dingdan1', authority: 'ddgl-payment' },
          { name: '账单管理', router: 'BillManage', icon: 'icon-huaban37fuben2', authority: 'ddgl-bill' },

          // { name: '优惠详情管理', router: 'DiscountDetails', icon: 'icon-quanxian2-copy', authority: '*' },
          { name: '退款记录管理', router: 'RefundOrder', icon: 'icon-dingdantuikuan', authority: 'ddgl-refund' },
        ]
      },
      { name: '充电套餐管理', router: 'ChargingPackageManage', icon: 'icon-taocanxinxi', authority: 'cdtc' },
      { name: '收费规则管理', router: 'ChargingRuleManage', icon: 'icon-guize', authority: 'sfgz',},
      // { name: '微信支付接入', router: 'WeChatApi', icon: 'icon-guize', authority: '*' },
    ]
  }
]

window.$$config = {
  title: "充电桩管理平台",
  baseUrl: "http://localhost:8080/api",
  logo: "https://static.zysmartparking.com/logotext.png"
}