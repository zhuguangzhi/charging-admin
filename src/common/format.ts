// 方法为页面中常用格式化方法
import XEUtils from 'xe-utils'
import moment from 'moment'
import * as fieldConfig from "./fieldConfig"

type formatNameProps = keyof typeof fieldConfig
type formatProps = {[name: string]:{key:number | string,label:string}[]}
const formats:formatProps = {
  ...fieldConfig
}


// 指定属性的key所对应的label
export const getLabel = (obj:formatNameProps,key:number|string)=>{
  const list = formats[obj]
  return list.find(item=>item.key===key)?.label || ''
}
export const getKey = (obj:formatNameProps,label:string)=>{
  const list = formats[obj]
  return list.find(item=>item.label===label)?.key || ''
}

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

/* ---------------------------------------------------金额转换---------------------------------------- */
// 金额格式化
const money = ({cellValue}:any) =>  cellValue ? cellValue + '元' : '0元'

const moneyNub = (value:number) =>  value ? (value / 100).toFixed(2) : 0
const moneyNubOverView = (value:number) =>  value ? (value / 100).toFixed(2) : 0

// 保留两位小数
const nubFmt = ({cellValue}:any) =>  cellValue ? cellValue.toFixed(2) : 0

// 不显示元
function moneynoYuan(cellValue:any){
  console.log('--------',cellValue)
  if(cellValue == 0 || cellValue == null){
   return '0'
  }
  return cellValue * 100
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
// 防止导出excel被科学计数法
function Unscience({cellValue}:any){
  if(cellValue){
    return cellValue + "\t"
  }
}


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
  getNowFormatDate,//当前时间 yyyy-MM-dd hh:mm:ss
  ranges,
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
  moneynoYuan,//元转分，不带单位
  nubFmt,
  dataSum,//数据求和
  getCharacters,//将字符串数字换位文字
}

export default format
