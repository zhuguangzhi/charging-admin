// 方法为页面中常用格式化方法
import XEUtils from 'xe-utils'
import moment from 'moment'

const ranges = {
  '24小时': [moment(moment().subtract(1, 'days')), moment()],
  '今天': [moment(moment().startOf('day')), moment().endOf('day')],
  '本月': [moment().startOf('month'), moment().endOf('month')],
  '近7天': [moment().subtract(7, 'days'), moment()],
  '近1个月': [moment().subtract(1, 'month'), moment()],
}

/* -------------------------------------------日期转换---------------------------------------------- */
// 时间日期格式化
const dayTime = ({cellValue}:any) => { return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss') }
const formatDay = ({cellValue}:any) => { return XEUtils.toDateString(cellValue, 'yyyy-MM-dd') }
const formatMonth = ({cellValue}:any) => { return XEUtils.toDateString(cellValue, 'yyyy-MM') }

// 秒转时分秒
const second2Time = (s:any) => {
  const hour = parseInt(String(s / 3600))
  const minute = parseInt(String((s % 3600) / 60))
  const second = parseInt(String((s % 3600) % 60))
  return s ? hour + '小时' + minute + '分钟' + second + '秒' : '-'
}

// 秒转时分秒 // HH:mm:ss
const second2TimeStr = ({ cellValue }:any) => {
  const hour = parseInt(String(cellValue / 3600))
  const minute = parseInt(String((cellValue % 3600) / 60))
  const second = parseInt(String((cellValue % 3600) % 60))
  return cellValue ? hour + ':' + minute + ':' + second : '00:00:00'
}
function durationFormat({ cellValue }:any) {
  //cwen  为null时，返回0秒
  if(cellValue == null){
    return '0秒'
  }
  // 时长格式化
  return parseInt(String(cellValue / 86400)) > 0
    ? `${parseInt(String(cellValue / 86400))}天${parseInt(
      String((cellValue % 86400) / 3600)
    )}时`
    : parseInt(String(cellValue / 3600)) > 0
      ? `${parseInt(String(cellValue / 3600))}时${parseInt(
        String((cellValue % 3600) / 60)
      )}分钟`
      : parseInt(String(cellValue / 60)) > 0
        ? `${parseInt(String(cellValue / 60))}分钟`
        : `${cellValue}秒`;
}
function durationFormatTwo({cellValue}:any) {
  //cwen  为null时，返回0分钟
  if(cellValue == null){
    return '0分钟'
  }
  let cellValueTwo = cellValue * 60
  // 时长格式化
  return parseInt(String(cellValueTwo / 86400)) > 0
    ? `${parseInt(String(cellValueTwo / 86400))}天${parseInt(
      String((cellValueTwo % 86400) / 3600)
    )}时`
    : parseInt(String(cellValueTwo / 3600)) > 0
      ? `${parseInt(String(cellValueTwo / 3600))}时${parseInt(
        String((cellValueTwo % 3600) / 60)
      )}分钟`
      : parseInt(String(cellValueTwo / 60)) > 0
        ? `${parseInt(String(cellValueTwo / 60))}分钟`
        : `${cellValueTwo}秒`;
}

/* ---------------------------------------------------金额转换---------------------------------------- */
// 金额格式化
const money = ({cellValue}:any) =>  cellValue ? cellValue + '元' : '0元'

const moneyNub = (value:number) =>  value ? (value / 100).toFixed(2) : 0
const moneyNubOverView = (value:number) =>  value ? (value / 100).toFixed(2) : 0

// 保留两位小数
const nubFmt = ({cellValue}:any) =>  cellValue ? cellValue.toFixed(2) : 0

function moneyYuan({cellValue}:any){
  if(cellValue == 0 || cellValue == null){
   return '0元'
  }
  return (cellValue * 100).toFixed(2) + '元'
}
// 优惠金额
function preferentialMoney(aomunt:number,pay:number){
  if(aomunt == 0 || aomunt == null){
    aomunt = 0
  }
  if(pay == 0 || pay == null){
    pay = 0
  }
  if(pay > aomunt){
    return '0元'
  }
  return ((aomunt - pay) / 100).toFixed(2) + '元'
}
// 不显示元
function moneynoYuan(cellValue:any){
  console.log('--------',cellValue)
  if(cellValue == 0 || cellValue == null){
   return '0'
  }
  return cellValue * 100
}
// 计算未收
function notReceive(data1:any,data2:any){
  if (data1 != null && data2 != null) {
    if (data1 - data2 > 0) {
      return (data1 - data2) / 100;
    } else {
      return '0';
    }
  }
}

// 汇总数据的和
const dataSum = (data1:any,data2:any,data3:any,data4:any,data5:any,data6:any,data7:any,data8:any,data9:any,data10:any,data11:any,data12:any,data13:any,data14:any,data15:any,data16:any,data17:any,data18:any) =>{
  let sum = 0
  let dataList = []
  dataList.push(data1,data2,data3,data4,data5,data6,data7,data8,data9,data10,data11,data12,data13,data14,data15,data16,data17,data18)
  // console.log('dataList',dataList)
  dataList.forEach(item=>{
    if(item != null){
      sum += item
    }
  })
  return (sum / 100).toFixed(2)
}

/* ------------------------------------------------数据状态--------------------------------------- */
// 欠费状态（1:未缴 2:完成 3:免单 4:缴费中 5.补缴超时"）
const arrearState = [
  { label: '未缴', key: 1 },
  { label: '完成', key: 2 },
  { label: '免单', key: 3 },
  { label: '缴费中', key: 4 },
  { label: '补缴超时', key: 5 },
]
// 退款状态
const refundState = [
  { label: '未退款', key: 1 },
  { label: '部分退款', key: 2 },
  { label: '全额退款', key: 3 },
]
// 退款渠道
const refundChannel = [
  { label: '微信', key: 'WeChat' },
  { label: '支付宝', key: 'ALiPay' },
  { label: '现金', key: 'Cash' },
  { label: '钱包', key: 'Wallet' },
  { key:'GZBank',label:'贵州银行聚合支付'},
  { key:'GZCheckStand',label:'贵州银行快捷支付' },
  { key:'GZNon',label:'贵州银行无感支付'},
]

const plateColor = [
  { label: '蓝牌', key: 'blue' },
  { label: '绿牌', key: 'green' },
  { label: '黄牌', key: 'yellow' },
  { label: '黑牌', key: 'black' },
  { label: '白牌', key: 'white' },
  { label: '其他', key: 'other' },
]
// 停车场类别
const category = [
  { label: '一类', key: '1' },
  { label: '二类', key: '2' },
  { label: '三类', key: '3' },
  { label: '夜间', key: '4' },
  { label: '错时', key: '5' },
]

// 返回停车类别
const getCategory = (type:any)=>{
  let optionKey = ''
  category.forEach(item=>{
    if(item.key == type){
      optionKey = item.label
    }
  })
  return optionKey
}

// 防止导出excel被科学计数法
function Unscience({cellValue}:any){
  if(cellValue){
    return cellValue + "\t"
  }
}

// 管理员类型
const adminType = [
  { label: '管理员', key: 0 },
  { label: '收费员', key: 1 },
  { label: '巡检员', key: 2 },
  { label: '体验账号', key: 3 }
]

// 管理员状态
const adminValid = [
  { label: '启用', key: 1 },
  { label: '停用', key: 0 }
]
// 在线状态
const isOnline = [
  { label: '在线', key: 1 },
  { label: '离线', key: 2 }
]
// 无感支付签约状态
const nonState = [
  { label: '签约', key: 1 },
  { label: '未签约', key: 2 }
]

// 性别
const sexType = [
  { label: '女', key: 0 },
  { label: '男', key: 1 },
  { label: '未知', key: 2 },

]

// 取证类型
const evidenceType = [
  { label: '入场取证', key: 0 },
  { label: '场中取证', key: 1 },
  { label: '离场取证', key: 2 }
]
// 签到签退
const isInType = [
  { label: '未签到', key: 1 },
  { label: '已签到', key: 2 },
  { label: '迟到', key: 3 }
]
// 签到签退
const isOutType = [
  { label: '未签退', key: 1 },
  { label: '已签退', key: 2 },
  { label: '早退', key: 3 }
]

// 取证来源
const confirmTypeOptions = [
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
const payChannel = [
  { key:'WeChat',label:'微信' },
  { key:'ALiPay',label:'支付宝' },
  { key:'Cash',label:'现金' },
  { key:'Wallet',label:'钱包' },
  { key:'GZBank',label:'贵州银行聚合支付'},
  { key:'GZCheckStand',label:'贵州银行快捷支付' },
  { key:'GZNon',label:'贵州银行无感支付'},
  { key:'ETCArrear',label:'ETC无感支付'},
]
// 处理结果
const isSolve = [
  { key:1,label:'未解决' },
  { key:2,label:'已解决' },
  { key:3,label:'已过期' },
]

// 账单支付状态
const billPayType = [
  { key:1,label:'等待支付' },
  { key:2,label:'支付成功' },
  { key:3,label:'支付失败' },
  { key:4,label:'支付超时' }
]
// 退款状态
const refundType = [
  { key:1,label:'未退款' },
  { key:2,label:'部分退款' },
  { key:3,label:'全额退款' },
]

// 返回取证来源
const TimeOption = (type:any)=>{
  let optionKey = ''
  confirmTypeOptions.forEach(item=>{
    if(item.key == type){
      optionKey = item.label
    }
  })
  return optionKey
}
// 区域级别
const RegionalJB = [
  {key:'district',label:'区级/县级'},
  {key:'street',label:'街道/乡镇'}
]
// 设备状态
const ShebStatus = [
  { key: 1, label: "启用" },
  { key: 2, label: "停用" },
]

const getNowFormatDate = ()=>{
  const date = new Date();
  let seperator1 = "-";
  let seperator2 = ":";
  let month = date.getMonth() + 1 as Number|String;
  let strDate = date.getDate() as Number|String;
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  return date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
}

// 设备类型
const ShetYpe = [
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
// 设备类型英文
const equipmentLabel = [
  { key: '1', label: "geo"},
  { key: '2', label: "gate"},
  { key: '3', label: "gate"},
  { key: '4', label: "gate"},
  { key: '5', label: "pos"},
  { key: '6', label: "highVideo"},
  { key: '7', label: "lowVideo"},
  { key: '9', label: "parkLock"},
  { key: '10', label: "inspectCar"},
]

// 告警事件
const errorEvent = [
  { key: 1, label: "重复入场"},
  { key: 2, label: "车牌不一致"},
  { key: 3, label: "金额有误"},
  { key: 4, label: "地磁误检"},
  { key: 5, label: "无驶入"},
  { key: 6, label: "无驶离"},
  { key: 7, label: "取证时间异常 "},
]

// 优惠活动类型
const certificateStatus = [
  { key: 1, label: "金额券" },
  { key: 2, label: "次卷" },
]
// 优惠券类型
const CouponType = [
  { key: 0, label: "注册送" },
  { key: 1, label: "充值送" },
  { key: 2, label: "平台送" },
]
// 支付类型 (1:PDA离场支付 2:欠费补缴 3.PDA预缴费 4.钱包充值 5.公众号缴费)
const payTypeOptions = [
  { key: 1, label: "PDA离场支付" },
  { key: 2, label: "欠费补缴" },
  { key: 3, label: "PDA预缴费" },
  { key: 4, label: "钱包充值" },
  { key: 5, label: "公众号缴费" },
  { key: 6, label: "系统操作" },
  { key: 7, label: "微信小程序缴费" },
]

// 支付来源  H5 APP POS WXH5
const paySource = [
  { key: 'H5', label: "浏览器" },
  { key: 'APP', label: "App" },
  { key: 'POS', label: "POS机" },
  { key: 'WXH5', label: "公众号" },
  { key: 'NON', label: "无感支付" },
]

// 结单来源
const statementSource = [
  { key: 1, label: "管理员" },
  { key: 2, label: "巡检员" },
  { key: 3, label: "收费员" },
  { key: 4, label: "第三方" },
  { key: 5, label: "地磁 " },
  { key: 6, label: "巡检车 " },
  { key: 7, label: "低位视频 " },
  { key: 8, label: "高位视频 " },
  { key: 9, label: "POS  " },
  { key: 10, label: "抓拍机 " },
  { key: 11, label: "地锁 " },
  { key: 200, label: "其他 " },
]

// 变更来源
const changeSource = [
  { key: 1, label: "管理员" },
  { key: 2, label: "巡检员" },
  { key: 3, label: "收费员" },
  { key: 4, label: "第三方" },
  { key: 5, label: "地磁 " },
  { key: 6, label: "巡检车 " },
  { key: 7, label: "低位视频 " },
  { key: 8, label: "高位视频 " },
  { key: 9, label: "POS  " },
  { key: 10, label: "抓拍机 " },
  { key: 11, label: "地锁 " },
  { key: 200, label: "其他 " },
]

// 返回缴费类型
const PayOption = (type:any)=>{
  let optionKey = ''
  payTypeOptions.forEach(item=>{
    if(item.key == type){
      optionKey = item.label
    }
  })
  return optionKey
}

// 支付网关
const gatewayOptions = [
  { key: "alipay", label: "支付宝" },
  { key: "wechat", label: "微信" },
  { key: "abc", label: "农行" },
  { key: "hxb", label: "华夏银行" },
  { key: "userpay", label: "钱包" },
  { key: "cardpay", label: "储值卡" },
  { key: "cash", label: "现金" },
  { key: "sgcc", label: "国网" },
  { key: "ckej", label: "城客e家" },
  { key: "heemoney", label: "洪城一卡通" },
  { key: "ums", label: "银联商务" },
  { key: "open", label: "第三方" }
]

// 订单操作详情操作 1.创建订单 2.入场取证 3.场中取证 4.离场取证 5.欠费离场 6.缴费 7.完成订单 8.关闭订单 9.异常订单 10.自动终止异常订单 11.退款 12.订单修改
const orderMotion = [
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


// 返回操作类型
const getOrderMotion = (type:any)=>{
  let optionKey = ''
  orderMotion.forEach(item=>{
    if(item.key == type){
      optionKey = item.label
    }
  })
  return optionKey
}

//订单变更状态  变更后状态 1:待取证 2:停车中 3:待结单 4:完成订单 5:已关闭 6:异常 7:欠费离场
const stateAfter = [
  { key: 1, label: "充电中" },
  { key: 2, label: "充电完成" },
  { key: 3, label: "用户终止充电" },
  { key: 4, label: "设备终止充电" },
  { key: 5, label: "未开始充电" },
]
// 停车场运营类型
const operateType = [
  { key: 1, label: "自营" },
{ key: 2, label: "三方" },
]

// 返回操作类型
const getStateAfter = (type:any)=>{
  let optionKey = ''
  stateAfter.forEach(item=>{
    if(item.key == type){
      optionKey = item.label
    }
  })
  return optionKey
}


// 停车场规模
const parkScale = [
  {
    key:1,
    label:'小型充电站'
  },
  {
    key:2,
    label:'中型充电站'
  },
  {
    key:3,
    label:'大型充电站'
  },
]
// 停车场类型
const parkType = [
  {
    key:1,
    label:'路边泊位'
  },
  {
    key:2,
    label:'停车场'
  },
  {
    key:3,
    label:'综合类型'
  },
    {
      key:99,
      label:'其他'
    },
]

// 通过 ,1,3, 获取汉字字符串
const getCharacters = (str:any)=>{
  if(str){
    str = str.split(',')
    str = str.filter((item:any)=>item.trim().length != 0)
    str = str.map((item:number|string)=>{
      if (item == 1) {
        return (item = '重复入场');
      } else if (item == 2) {
        return (item = '车牌不一致');
      } else if (item == 3) {
        return (item = '金额有误');
      } else if (item == 4) {
        return (item = '地磁误检');
      } else if (item == 5) {
        return (item = '无驶入');
      } else if (item == 6) {
        return (item = '无驶离');
      } else if (item == 7) {
        return (item = '取证时间异常');
      }
    })
    str = str.join(',')
    console.log(str)
    return str
  }
  return ''
}

/**
 * 通过Key获取Value
 * @param data
 * @param {*} key
 * @param {*} defVal 默认值
 */
const getValueByKey = (data:any, key:any, defVal:any) => {
  if (data) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (item.key == key) {
        return item.label
      }
    }
  }
  return defVal || ''
}
// 根据id获取商户名
const getNameById = (data:any, key:any, defVal:any) => {
  if (data) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (item.key == key) {
        return item.name
      }
    }
  }
  return defVal || ''
}
// 日志类型
const logType = [
  { label: '管理平台', key: 1, },
  { label: 'PDA', key: 2, },
]
// 工单List状态
const workState = [
  { label: '开启', key: 1, },
  { label: '处理中', key: 2, },
  { label: '已解决', key: 3, },
  { label: '关闭', key: 4 },
  { label: '待确认', key: 5 }
]
// 工单类型
const workType = [
  { label: '设备问题', key: 5, },
  { label: '订单问题', key: 1, },
  { label: '其他问题', key: 4, }
]
// 工单优先级
const workPriroity = [
  { label: '立即处理', key: 1, },
  { label: '重要', key: 2, },
  { label: '一般', key: 3, },
  { label: '提醒', key: 4, }
]
// 实名认证状态
const authentication = [
  { key: 0, label: "已认证" },
  { key: 1, label: "未认证" },
]
// 车辆认证状态
const Carauthentication = [
  { key: 1, label: "未认证" },
  { key: 2, label: "认证中" },
  { key: 3, label: "已认证" },
  { key: 4, label: "认证失败" },
]
// 注册方式
const Registration = [
  { key: 1, label: "APP" },
  { key: 2, label: "浏览器" },
  { key: 3, label: "微信小程序" },
]

// 审核结果
const Reviewresults = [
  { key: 0, label: "审核中" },
  { key: 1, label: "已通过" },
  { key: 2, label: "未通过" },
]
// 订单状态
const orderstatus = [
  { key: 2, label: "已完成" },
  { key: 1, label: "未完成" },
]

// 申诉状态
const complaintStatus = [
  { key: 1, label: "待处理" },
  { key: 2, label: "申诉成功" },
  { key: 3, label: "申诉驳回" },
  { key: 4, label: "审核中" },
]

// 审核状态
const auditState = [
  { key: 1, label: "待处理" },
  { key: 2, label: "同意" },
  { key: 3, label: "驳回" }
]

// 审核类型  1退款 2发卷 3修改驶入时间 4关闭订单 5修改欠费
const auditType = [
  { key: 1, label: "退款" },
  { key: 2, label: "发优惠券" },
  { key: 3, label: "修改驶入时间" },
  { key: 4, label: "关闭订单" },
  { key: 5, label: "修改欠费" }
]
// 申请原因 reason 99 其他
const auditReason = [
  { key: 1, label: "订单计时错误" },
  { key: 2, label: "订单计费错误" },
  { key: 3, label: "重复收费" },
  { key: 4, label: "缴费后还显示欠费" },
  { key: 99, label: "其他原因" },
]
// 审核来源 1订单申诉 2管理员主动发起 99其他
const auditSource = [
  { key: 1, label: "订单申诉" },
  { key: 2, label: "管理员发起" },
  { key: 99, label: "其他" },
]

// 地锁开关状态
const lockStatus = [
  { key: 1, label: "开门" },
  { key: 2, label: "关门" },
  { key: 3, label: "停止" }
]

// 停车订单状态
const stopOderStatus = [
  { key: 1, label: "待取证" },
  { key: 2, label: "停车中" },
  { key: 3, label: "待结单" },
  { key: 4, label: "完成订单" },
  { key: 5, label: "已关闭" },
  { key: 6, label: "异常" },
  { key: 7, label: "欠费离场" },
]
// 交易类型
const Transaction = [
  { key: 2, label: "已完成" },
  { key: 1, label: "未完成" },
]
// 发票类型
const Invoicetype = [
  { key: 2, label: "驶出" },
  { key: 1, label: "驶入" },
  { key: 3, label: "欠费补缴" },
]
// 取用状态
const Accessstatus = [
  { key: 1, label: "已领取" },
  { key: 2, label: "已使用" },
  { key: 3, label: "已过期" },
  { key: 4, label: "已锁定" },
]
// 状态
const Newstate = [
  { key: 1, label: "未发布" },
  { key: 2, label: "已发布" },
  { key: 3, label: "已关闭" },
]
// 运营状态
const Operatingstate = [
  { key: 1, label: "启用" },
  { key: 2, label: "停用" },
]
// 月卡状态
const Monthstatus = [
  { key: 0, label: "暂无月卡" },
  { key: 1, label: "已有月卡" },
  { key: 2, label: "月卡过期" },
]
// 车辆类型
const Vehicletype = [
  { key: 1, label: "会员车辆" },
  { key: 2, label: "临时车辆" },
]
// 可用状态
const Availablestatus = [
  { key: 0, label: "可用" },
  { key: 1, label: "不可用" },
]
// 用户消费支付类型
const businesstype = [
  { key: 1, label: "PDA离场支付" },
  { key: 2, label: "欠费补缴" },
  { key: 3, label: "PDA预缴费" },
  { key: 4, label: "钱包充值" },
  { key: 5, label: "公众号缴费" },
]

/** ---------------月卡---------------  */
// 月卡套餐类型
const cardPackageType = [
  { key: 2, label: "自选月卡" },
  { key: 1, label: "固定月卡" }
]

// 月卡开通渠道
const cardSource = [
  { key: 1, label: "管理平台" },
  { key: 2, label: "公众号" }
]

// 月卡支付状态 1等待支付 2支付完成 3超时
const cardPayState = [
  { key: 1, label: "等待支付" },
  { key: 2, label: "支付完成" },
  { key: 3, label: "超时" }
]

// 通过Value获取Key
const getKeyByValue = (data:any, value:any, defVal:any=null) => {
  if (data) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (item.key == value) {
        return item.label
      }
    }
  }
  return defVal || ''
}


// 四舍五入 保留两位小数
const rounding = (num:any) => {
  return num = Number(num).toFixed(2);

}

// 用户类别
const userType = [
  { key: 1, label: "手机用户" },
  { key: 2, label: "微信公众号" },
  { key: 3, label: "微信小程序" },
  { key: 4, label: "支付宝生活号（公众号）" },
  { key: 5, label: "支付宝小程序" },
]

const gunStatus = [
  {key:0,label:'空闲'},
  {key:1,label:'充电中'},
  {key:2,label:'充电结束'},
  {key:3,label:'车端暂停充电'},
]
//充电枪使用状态
const gunUseStatus = (state:number=0)=>{
  return gunStatus.find(item=> item.key === state)
}
//退款来源
const amendSource = [
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
const RechargeType = [
  {key:1,label:'直流快充'},
  {key:2,label:'直流慢充'},
  {key:3,label:'交流快充'},
  {key:4,label:'交流慢充'},
]

//计费类型标识
const billType = [
  {
    key:1,
    label:"平台计费"
  },
  {
    key:2,
    label:"三方计费"
  }
]

//遍历数组获取指定的类型值
const ForMapArray = (arr:Array<any>,target:Array<formatType>)=>{
  let schema:Array<any> =[]
  arr.forEach(item=>{
    if (item){
      let res = target.find((val:any)=>val.key==item)
      schema.push(res)
    }

  })
  return schema
}

const format = {
  ForMapArray,//数组遍历
  billType,//计费类型标识
  RechargeType,
  getNowFormatDate,//当前时间 yyyy-MM-dd hh:mm:ss
  gunUseStatus,//充电状态
  ranges,
  auditState, // 审核状态
  auditType, // 审核类型
  auditSource, // 审核来源
  auditReason, // 审核申请原因
  lockStatus, // 地锁状态
  businesstype,//用户消费支付类型
  Carauthentication,// 车辆状态
  Availablestatus,// 可用状态
  Vehicletype,//车辆类型
  Monthstatus,//月卡状态
  stopOderStatus,//停车订单状态
  Operatingstate,//运营状态
  Newstate,//发布状态
  Accessstatus,//取用状态
  CouponType,//优惠卷类型
  Invoicetype,//发票类型
  Transaction,//交易类型
  orderstatus,//订单状态
  complaintStatus,//申诉状态
  Reviewresults,//审核结果
  payChannel,//支付渠道
  paySource,//支付来源
  statementSource,//结单来源
  changeSource,//变更来源
  logType,//日志类型
  arrearState,//欠费类型
  equipmentLabel,//设备类型英文，方便数据视图
  errorEvent,// 告警事件
  billPayType,//账单支付状态
  refundType,//退款状态
  nonState,//无感支付签约状态
  getNameById,//根据id获取商户name
  Unscience,//防止导出excel被科学计数法
  dayTime, // 时间日期格式化
  formatDay, //时间格式化（只保留日期）
  formatMonth, //时间格式化（只保留月份）
  second2Time, // 秒转时分秒
  second2TimeStr,
  money, // 分转元 带单位
  // string,
  moneyNub, // 分转元 不带单位
  moneyNubOverView, // 分转元 整数
  moneyYuan, //元转分，带单位
  moneynoYuan,//元转分，不带单位
  nubFmt,
  preferentialMoney,//计算优惠金额
  notReceive,//未收
  getValueByKey,
  getKeyByValue,
  TimeOption, //获取时间来源
  PayOption, //获取缴费类型
  getCategory,//获取停车类别
  getOrderMotion,//订单操作类型
  getStateAfter,//订单停车状态改变
  durationFormatTwo,//分钟转换
  durationFormat,//分钟转换
  dataSum,//数据求和
  getCharacters,//将字符串数字换位文字
  isSolve,//是否解决
  refundState,//退款状态
  refundChannel,//退款渠道
  isInType,//签到
  isOutType,//签退
  isOnline,//在线状态
  plateColor, // 车牌颜色
  // berthType, // 泊位类型
  sexType, // 性别
  adminType, // 管理员类型
  adminValid, // 管理员状态
  stateAfter, //订单状态
  operateType,//停车场运营类型
  authentication, //实名认证状态
  Registration, //注册方式
  evidenceType,//取证状态
  confirmTypeOptions, // 取证来源
  payTypeOptions, // 缴费类型
  gatewayOptions, // 支付网关
  certificateStatus,//优惠活动类型
  parkScale,//停车场规模
  parkType,//停车场类型
  category, //路段类别
  workState, // 工单状态
  workPriroity, // 工单优先级
  workType, // 工单类型
  ShebStatus, // 设备状态
  ShetYpe, // 设备类型
  RegionalJB, // 区域级别
  cardPackageType, // 月卡类型
  cardSource, // 月卡开通渠道
  cardPayState, // 月卡支付状态
  rounding, //四舍五入 保留两位小数
  userType,//用户类别
  amendSource,//退款来源
}

export default format
