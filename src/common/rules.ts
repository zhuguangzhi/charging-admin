import XEUtils from 'xe-utils'

const checkphone =(rule:string,value:string) =>{
  if(!(/^1[3456789]\d{9}$/.test(value))){
    return Promise.reject(new Error('请输入有效的手机号'));
  }else {
    return Promise.resolve();
  }
}

// 域名
// /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
const checkdomain =(rule:string,value:string) =>{
  if(!(/^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]+$/.test(value))){
    return Promise.reject(new Error('请输入正确的域名'));
  }else{
    return Promise.resolve();
  }
}

// 身份证号\d{17}[0-9Xx]|\d{15}
const checkIsCard =(rule:string,value:string) =>{
  if(!(/\d{17}[0-9Xx]|\d{15}/.test(value))){
    return Promise.reject(new Error('请输入正确的身份证号'));
  }else{
    return Promise.resolve();
  }
}

// 用户编号 ^[a-zA-Z]\w{5,17}$
const userNumber =(rule:string,value:string) =>{
  if(!(/^[a-zA-Z]\w{3,20}$/.test(value))){
    return Promise.reject(new Error('字母开头3-20个字符'));
  }else{
    return Promise.resolve();
  }
}

// 邮箱
const checkemail =(rule:string,value:string) =>{
  if (!value) {
    return Promise.resolve()
  } else if(!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value))){
    return Promise.reject(new Error('请输入正确的邮箱地址'))
  }else{
    return Promise.resolve()
  }
}

// 是否判断
const checkState =(rule:string,value:string | number) =>{
  if (value == '1' || value == '2' || value == '3' || value == 1 || value == 2 || value == 3) {
    return Promise.resolve()
  } else {
    return Promise.reject(new Error("状态类型不正确"))
  }
}

// 数字
const checkNum =(rule:string,value:any, callback: Function) =>{
  // value = 'ahah'
  // value = parseFloat(value)
  // console.log('--ahah--',rule,isNaN(value),value)
  if (value==undefined){
    console.log('----')
    callback()
    return false
  }
  if (!isNaN(value)) {
    callback()
  } else {
    callback(new Error("数字类型不正确"))
    // return Promise.reject(new Error("状态类型不正确"))
  }
}

// 检查服务器类型
const checkServeType =(rule:string,value:string) =>{
  if (value == '公有云' || value == '私有云' || value == '自建云') {
    return Promise.resolve()
  } else {
    return Promise.reject(new Error("服务器类型不正确"))
  }
}

// 检查IP地址
const checkIp = (rule:string,value:string) =>{
  if (!(/^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/.test(value))) {
    return Promise.reject(new Error('请输入正确的IP地址'))
  } else {
    return Promise.resolve()
  }
}

// 检查公网IP地址
const checkPublicIp = (rule:string,value:string) =>{
  if (!(/^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/.test(value))) {
    return Promise.reject(new Error('请输入正确的IP地址'))
  } else {
    const ipList = value.split('.')
    console.log(ipList[0], ipList[0] != '192', ipList[0] != '172', ipList[0] != '10')
    if (ipList[0] == '192' || ipList[0] == '172' || ipList[0] == '10') {
      return Promise.reject(new Error('该地址为内网地址，请输入正确的公网IP地址'))
    } else {
      return Promise.resolve()
    }
  }
}

// 检查公网IP地址,可以为空
const checkPublicIpNull = (rule:string,value:string) =>{
  if (!(/^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/.test(value))) {
    if (value) {
      return Promise.reject(new Error('请输入正确的IP地址'))
    } else {
      return Promise.resolve()
    }
  } else {
    const ipList = value.split('.')
    console.log(ipList[0], ipList[0] != '192', ipList[0] != '172', ipList[0] != '10')
    if (ipList[0] == '192' || ipList[0] == '172' || ipList[0] == '10') {
      return Promise.reject(new Error('该地址为内网地址，请输入正确的公网IP地址'))
    } else {
      return Promise.resolve()
    }
  }
}

// 检查内网IP地址,可以为空
const checkPrivateIpNull =(rule:string,value:string) =>{
  if (!(/^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/.test(value))) {
    if (value) {
      return Promise.reject(new Error('请输入正确的IP地址'))
    } else {
      return Promise.resolve()
    }
  } else {
    return Promise.resolve()
  }
}

// 密码验证
const validatePsdReg = (rule:string,value:string) => {
  if (value!=null && !/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/.test(value)) {
    return Promise.reject(new Error('请输入6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'))
  } else {
    return Promise.resolve()
  }
}

// 车牌号验证
const carPlateNumber = (rule:string,value:string)  => {
  if (value.length == 8) {
    if (!/^([京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][1-9DF][\dABCDEFGHJKLNMxPQRSTUVWXYZ]{5})$/.test(value)) {
      return Promise.reject(new Error('请输入正确的车牌号'))
    } else {
      return Promise.resolve()
    }
  } else if (value.length == 7) {
    if (!/^([京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][\dABCDEFGHJKLNMxPQRSTUVWXYZ]{5})$/.test(value)) {
      return Promise.reject(new Error('请输入正确的车牌号'))
    } else {
      return Promise.resolve()
    }
  } else {
    return Promise.reject(new Error('请输入正确的车牌号'))
  }
}



// 非空
const notNull = (message:string):object => {
  return [{ required: true, message: message, trigger: 'blur' }]
}
// 密码
const password = (isRequire:Boolean=true)=>{
  if (isRequire){
    return [
      { required: true, message: "密码不能为空", trigger: 'blur' },
      { validator: validatePsdReg, trigger: 'blur' }
    ]
  }else
    return[
      { validator: validatePsdReg, trigger: 'blur' }
    ]
}
// 车牌
const plateNumber = [
  { required: true, message: "车牌号不能为空", trigger: 'blur' },
  { validator: carPlateNumber, trigger: 'blur' }
]
// 用户名
const username = [
  { required: true, message: '请输入用户名', trigger: 'blur' },
  { min: 3, max: 20, message: '长度在3到20个字符', trigger: 'blur' }
]
// 姓名
const name = [
  { required: true, message: '姓名不能为空', trigger: 'blur' },
  { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
]
// 请选择人员类型
const usertype = [{ required: true, message: '请选择人员类型', trigger: 'blur' }]
// 请输入电话号码
const phone = [
  { required: true, message: '手机号码不能为空', trigger: 'blur' },
  { validator: checkphone, trigger: 'blur' }
]
// 域名
const domain = [
  { required: true, message: '请输入正确的域名', trigger: 'blur' },
  { validator: checkdomain, trigger: 'blur' }
]
// 身份证号
const isCard = [
  { required: true, message: '请输入正确的身份证号', trigger: 'blur' },
  { validator: checkIsCard, trigger: 'blur' }
]
// 邮箱
const email = [
  { required: true, message: '请输入正确的身份证号', trigger: 'blur' },
  { validator: checkemail, trigger: 'blur' }
]
// 状态
const state = [
  { required: true, message: '状态不能为空', trigger: 'blur' },
  { validator: checkState, trigger: 'blur' }
]
// 非空数字
const num = [
  { required: true, message: '不是一个有效的数字', trigger: 'blur' },
  { validator: checkNum, trigger: 'blur' }
]
//数字
const isNum = [
  { required: false,message: '不是一个有效的数字', trigger: 'blur' },
  { validator: checkNum, trigger: 'blur' }
]
// 禁止输入汉字
const characters = [
  { required: true, message: '不是一个有效的编号', trigger: 'blur' },
  { validator: validatePsdReg, trigger: 'blur' }
]
// 服务器类型检查
const serveType = [
  { required: true, message: '服务器类型不能为空', trigger: 'blur' },
  { validator: checkServeType, trigger: 'blur' }
]
// 公网IP地址检查
const publicIp = [
  { required: true, message: 'IP地址不能为空', trigger: 'blur' },
  { validator: checkPublicIp, trigger: 'blur' }
]
// IP地址检查
const ip = [
  { required: true, message: 'IP地址不能为空', trigger: 'blur' },
  { validator: checkIp, trigger: 'blur' }
]
// 公网IP地址检查,可以为空
const ipNull = [
  { validator: checkPublicIpNull, trigger: 'blur' }
]
// 内网IP地址检查，可以网孔
const ipPrivateNull = [
  { validator: checkPrivateIpNull, trigger: 'blur' }
]

// 输入框限制
// function inputno(val:any){
//   this.form.no = val.replace(/[`\u4E00-\u9FA5~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g,"");
// }
// 用户编号
const serialNumber = [
  { required: true, message: '用户编号不能为空', trigger: 'blur' },
  { validator: userNumber, trigger: 'blur' }
]

// 权限验证
 const rule = async (rule:any, value:any) => {
  console.log("验证", rule, value)
  for (let i = 0; i < rule.length; i++) {
    if (rule[i].required) {
      // 非空校验
      if (!value) {
        return (rule[i].message || '不能为空')
      }

    }
    if (XEUtils.isFunction(rule[i].validator)) {
      console.log("开始验证")
      const result:any = await validator(rule[i].validator, value)
      if (result) {
        console.log("验证结果", result.message)
        return (result.message || '验证失败')
      }
    }
  }
  return false;
}
function validator (fun:any, value:any) {
  return new Promise(async(resolve, reject) => {
    fun(null, value, (error: Error) => {
      resolve(error)
    })
  })
}

export default{
  notNull,
  password, // 密码
  plateNumber, // 车牌
  username,
  name,
  usertype,
  phone, // 手机号
  domain, // 域名，
  email, // 邮箱,
  state, // 状态  是、否
  serveType, // 服务器类型
  num, // 非空数字
  isNum,//数字
  publicIp, // 公网IP
  ipNull, // 公网IP，可以为空
  ipPrivateNull, // 内网ip地址，可以为空
  ip, // ip地址
  isCard, //身份证号
  serialNumber,//用户编号
  // inputno,
  rule, // 权限验证方法
  characters,//不能输入汉字
}
