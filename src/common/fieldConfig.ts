//退款来源
export const amendSource = [
  {key:1,label:'管理员'},
  {key:2,label:'巡检员'},
  {key:3,label:'收费员'},
  {key:4,label:'第三方'},
  {key:5,label:'地磁'},
  {key:6,label:'巡检车'},
  {key:7,label:'低位视频'},
  {key:8,label:'高位视频'},
  {key:9,label:'POS'},
  {key:10,label:'抓拍机'},
  {key:11,label:'车位地锁'},
  {key:12,label:'充电桩'},
  {key:13,label:'用户支付'},
  {key:200,label:'其他'},
]
// 支付类型 (1:PDA离场支付 2:欠费补缴 3.PDA预缴费 4.钱包充值 5.公众号缴费)
export const payTypeOptions = [
  { key: 1, label: "PDA离场支付" },
  { key: 2, label: "欠费补缴" },
  { key: 3, label: "PDA预缴费" },
  { key: 4, label: "钱包充值" },
  { key: 5, label: "公众号缴费" },
  { key: 6, label: "系统操作" },
  { key: 7, label: "微信小程序缴费" },
]
export const RechargeType = [
  {key:1,label:'汽车交流充电桩'},
  {key:2,label:'汽车交流充电桩'},
  {key:3,label:'两轮车充电桩'}
]
//计费类型标识
export const billType = [
  {
    key:1,
    label:"平台计费"
  },
  {
    key:2,
    label:"三方计费"
  }
]
// 用户类别
export const userType = [
  { key: 1, label: "手机用户" },
  { key: 2, label: "微信公众号" },
  { key: 3, label: "微信小程序" },
  { key: 4, label: "支付宝生活号（公众号）" },
  { key: 5, label: "支付宝小程序" },
]

export const gunStatus = [
  {key:0,label:'空闲'},
  {key:1,label:'充电中'},
  {key:2,label:'充电结束'},
  {key:3,label:'车端暂停充电'},
]
// 性别
export const sexType = [
  { label: '女', key: 0 },
  { label: '男', key: 1 },
  { label: '未知', key: 2 },

]
// 取证来源
export const confirmTypeOptions = [
  { key: "1", label: "管理员"},
  { key: "2", label: "巡检员"},
  { key: "3", label: "收费员" },
  { key: "4", label: "第三方" },
  { key: "5", label: "地磁" },
  { key: "6", label: "巡检车" },
  { key: "7", label: "低位视频" },
  { key: "8", label: "高位视频" },
  { key: "9", label: "POS" },
  { key: "10", label: "抓拍机" },
  { key: "11", label: "地锁" },
  { key: "12", label: "汽车慢充充电桩" },
  { key: "13", label: "汽车慢充充电枪" },
  { key: "14", label: "汽车快充充电桩" },
  { key: "14", label: "汽车快充充电枪" },
  { key: "200", label: "其他" }
]
// 支付渠道
export const payChannel = [
  { key:'WeChat',label:'微信' },
  { key:'ALiPay',label:'支付宝' },
  { key:'Cash',label:'现金' },
  { key:'Wallet',label:'钱包' },
  { key:'GZBank',label:'贵州银行聚合支付'},
  { key:'GZCheckStand',label:'贵州银行快捷支付' },
  { key:'GZNon',label:'贵州银行无感支付'},
  { key:'ETCArrear',label:'ETC无感支付'},
]
// 账单支付状态
export const billPayType = [
  { key:1,label:'等待支付' },
  { key:2,label:'支付成功' },
  { key:3,label:'支付失败' },
  { key:4,label:'支付超时' }
]
// 退款状态
export const refundType = [
  { key:1,label:'未退款' },
  { key:2,label:'部分退款' },
  { key:3,label:'全额退款' },
]
// 设备类型
export const ShetYpe = [
  { key: 1, label: "地磁设备"},
  { key: 2, label: "抓拍机"},
  { key: 3, label: "入口相机"},
  { key: 4, label: "出口相机"},
  { key: 5, label: "PDA"},
  { key: 6, label: "高位视频 "},
  { key: 7, label: "低位视频"},
  { key: 8, label: "道闸"},
  { key: 9, label: "地锁"},
  { key: 10, label: "巡检车"},
  { key: 11, label: "充电桩"},
]
// 订单操作详情操作 1.创建订单 2.入场取证 3.场中取证 4.离场取证 5.欠费离场 6.缴费 7.完成订单 8.关闭订单 9.异常订单 10.自动终止异常订单 11.退款 12.订单修改
export const orderMotion = [
  { key: 0, label: "创建订单" },
  { key: 1, label: "充电中" },
  { key: 2, label: "充电完成" },
  { key: 3, label: "用户终止充电" },
  { key: 4, label: "设备终止充电" },
  { key: 5, label: "设备请求超时" },
  { key: 6, label: "预缴费支付失败关闭订单" },
  { key: 7, label: "关闭订单" },
  { key: 8, label: "完成支付" },
  { key: 9, label: "未插枪" },
  { key: 10, label: "车端未启动充电" },
  { key: 11, label: "急停按钮触发" },
  { key: 12, label: "管理员终止充电" },
]
//订单变更状态  变更后状态 1:待取证 2:停车中 3:待结单 4:完成订单 5:已关闭 6:异常 7:欠费离场
export const stateAfter = [
  { key: 1, label: "充电中" },
  { key: 2, label: "充电完成" },
  { key: 3, label: "用户终止充电" },
  { key: 4, label: "设备终止充电" },
  { key: 5, label: "未开始充电" },
]
// 停车场运营类型
export const operateType = [
  { key: 1, label: "自营" },
  { key: 2, label: "三方" },
]
