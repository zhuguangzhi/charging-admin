import Http from './http'
import {message} from 'ant-design-vue'
import router from "@/router";


const baseApi = () => (window as any).$$Url + '/api/v1'


interface ApiResult {
    result: any,
    error: any
}

// 登陆
export const Login = (p: any) => Http.post(`${baseApi()}/admin/login/admin`, p)
//--------------------------------------商户--------------------------------------’
export const Merchant = {
    GetAllMerchant: (p: any) => Http.get(`${baseApi()}/tenant/pages`, p),
    AddMerchant: (p: any) => Http.post(`${baseApi()}/tenant`, p),
    EditMerchant:(p:any) => Http.put(`${baseApi()}/tenant/${p.id}`, p),
    DeleteMerchant :(p:any) => Http.delete(`${baseApi()}/tenant/${p.id}`, p),
    EditMerchantState:(p:any) => {
        return Http.post(`${baseApi()}/tenant/states`, p)
    },
//    批量删除
    DeleteMerchantBatches:(p:any) => Http.delete(`${baseApi()}/tenant/batches`, p),
}
//--------------------------------------管理员--------------------------------------’
export const AdminApi = {
    GetAllAdmin: (p: any) => Http.get(`${baseApi()}/admin/pages`, p),
    AddAdmin: (p: any) => Http.post(`${baseApi()}/admin`, p),
    EditAdminPassword: (p: any) => Http.post(`${baseApi()}/admin/resets/password`, p),
    EditAdmin:(p:any) => Http.put(`${baseApi()}/admin/${p.id}`, p),
    DeleteAdmin :(p:any) => Http.delete(`${baseApi()}/admin/${p.id}`, p),
    EditAdminState:(p:any) => Http.post(`${baseApi()}/admin/states`, p),
    BindAdminRole:(p:any) => Http.post(`${baseApi()}/admin/set/roles`, p),
    DeleteBatchesAdmin:(p:any) => Http.delete(`${baseApi()}/tenant/batches`, p),
}
//--------------------------------------角色--------------------------------------’
export const RoleApi = {
    GetAllRole: (p: any) =>Http.get(`${baseApi()}/role/pages`, p),
    AddRole: (p: any) => Http.post(`${baseApi()}/role`, p),
    EditRole:(p:any) => Http.put(`${baseApi()}/role/${p.id}`, p),
    DeleteRole :(p:any) => Http.delete(`${baseApi()}/role/${p.id}`, p),
    EditRoleState:(p:any) => Http.post(`${baseApi()}/role/states`, p),
    BindRolePermission:(p:any) => Http.post(`${baseApi()}/role/bind/permission`, p),
    DeleteBatchesRole:(p:any) => Http.delete(`${baseApi()}/tenant/batches`, p),
    AddRolePermission:(p:any) => Http.post(`${baseApi()}/permission/batches`, p),
}
//--------------------------------------设备管理--------------------------------------’
export const ChargingApi = {
    //获取充电站点
    GetAllStation: (p: any) => Http.get(`${baseApi()}/station/pages`, p),
    AddStation: (p: any) => Http.post(`${baseApi()}/station`, p),
    EditStation:(p:any) => Http.put(`${baseApi()}/station/${p.id}`, p),
    DeleteStation :(p:any) => Http.delete(`${baseApi()}/station/${p.id}`, p),
    DeleteStationBatches :(p:any) => Http.delete(`${baseApi()}/station/batches`, p),
    // EditStationState:(p:any) => Http.post(`${baseApi()}/station/states`, p),
    //获取设备
    GetAllDevice: (p: any) => Http.get(`${baseApi()}/device/pages`, p),
    //根据Id获取设备
    GetIdDevice: (p: any) => Http.get(`${baseApi()}/device?${p.id}`, p),
    AddDevice: (p: any) => Http.post(`${baseApi()}/device`, p),
    EditDevice:(p:any) => Http.put(`${baseApi()}/device/${p.id}`, p),
    DeleteDevice :(p:any) => Http.delete(`${baseApi()}/device/${p.id}`, p),
    //批量
    DeleteDeviceBatches :(p:any) => Http.delete(`${baseApi()}/device/batches`, p),
    EditDeviceState:(p:any) => Http.post(`${baseApi()}/device/operate/batches`, p),
//    将多个设备绑定到一个设备上
    BindDevice:(p:any) => Http.post(`${baseApi()}/device/binding/more/one`,p),
    //    将多个设备绑定到站点上
    BindStation:(p:any) => Http.post(`${baseApi()}/station/binds/devs`,p),
    //    将一个收费规则绑定到多个设备上
    BindRule:(p:any)=>Http.post(`${baseApi()}/device/binding/devices/rule`, p),
//   设备解绑
    UnBindDevice:(p:any) => Http.post(`${baseApi()}/device/unbind/devs`,p),
//    站点解绑
    UnBindStation:(p:any)=>Http.post(`${baseApi()}/device/unbind/stations`,p),
//    所有设备绑定泊位情况集合
    UnBindBerth:(p:any)=>Http.get(`${baseApi()}/device/unbind/berth`,p),
    //    批量解绑收费规则
    UnBindRule:(p:any)=>Http.post(`${baseApi()}/device/unbind/rules`,p),
}
//--------------------------------------收费规则--------------------------------------’
export const ChargingRuleApi = {
    GetAllRule: (p: any) => Http.get(`${baseApi()}/rule/pages`, p),
    AddRule: (p: any) => Http.post(`${baseApi()}/rule`, p),
    EditRule:(p:any) => Http.put(`${baseApi()}/rule/${p.id}`, p),
    DeleteRule :(p:any) => Http.delete(`${baseApi()}/rule/${p.id}`, p),
    DeleteRuleBatches :(p:any) => Http.delete(`${baseApi()}/rule/batches`, p),
    EditRuleState:(p:any) => Http.post(`${baseApi()}/rule/states`, p),
}
//--------------------------------------预交费--------------------------------------’
export const PayPackage = {
    GetAllPackage: (p: any) => Http.get(`${baseApi()}/payment/pages`, p),
    AddPackage: (p: any) => Http.post(`${baseApi()}/payment`, p),
    EditPackage:(p:any) => Http.put(`${baseApi()}/payment/${p.id}`, p),
    DeletePackage :(p:any) => Http.delete(`${baseApi()}/payment/${p.id}`, p),
    DeletePackageBatches :(p:any) => Http.delete(`${baseApi()}/payment/batches`, p),
    EditPackageState:(p:any) => Http.post(`${baseApi()}/payment/states`, p),
}
//--------------------------------------车辆用户--------------------------------------’
export const CarUserApi = {
    GetAllUser:(p: any) => Http.get(`${baseApi()}/users/pages`, p),
}
//--------------------------------------订单--------------------------------------’
export const OrderApi = {
    GetAllFinishOrder:(p: any) => Http.get(`${baseApi()}/pile-order/pages/history`, p),
    GetAllRealtimeOrder:(p: any) => Http.get(`${baseApi()}/pile-order/pages/realtime`, p),
    GetOrderDetail:(p: any) => Http.get(`${baseApi()}/pile-order/${p.id}`, p),
    CloseOrder:(p: any) => Http.post(`${baseApi()}/pile-order/close/${p.id}`,p),
//    账单查询
    GetAllBill:(p: any) => Http.get(`${baseApi()}/bill/pages`, p),
//    退款
    RefundBill:(p: any) => Http.post(`${baseApi()}/bill/refund/${p.id}`, p),
    //缴费记录
    getPayRecord:(p: any) => Http.post(`${baseApi()}/payRecord/page`, p),
    //退款记录
    getRefundRecord:(p: any) => Http.get(`${baseApi()}/refundRecord/pages`, p),
}

//--------------------------------------泊位--------------------------------------’
export const BerthApi = {
    GetAllBerth:(p: any) => Http.get(`${baseApi()}/berth/pages`, p),
    AddBerthBatches: (p: any) => Http.post(`${baseApi()}/berth/batches`, p),
    AddBerth: (p: any) => Http.post(`${baseApi()}/berth`, p),
    EditBerth:(p:any) => Http.put(`${baseApi()}/berth/${p.id}`, p),
    DeleteBerth :(p:any) => Http.delete(`${baseApi()}/berth/${p.id}`, p),
    EditBerthState:(p:any) => Http.post(`${baseApi()}/berth/states`, p),
    DeleteBatchesBerth:(p:any) => Http.delete(`${baseApi()}/berth/batches`, p),
    BindBerth:(p:any) => Http.post(`${baseApi()}/berth/binding/devices/berths`, p),
    UnBindBerth:(p:any) => Http.post(`${baseApi()}/berth/un-binding/devices/berths`, p),

}
//--------------------------------------微信多商户--------------------------------------’
export const WeChartMerchantApi = {
    GetAllWeChartMerchant:(p: any) => Http.get(`${baseApi()}/merchantsWechat/pages`, p),
    AddWeChartMerchant:(p: any) => Http.post(`${baseApi()}/merchantsWechat`, p),
    EditWeChartMerchant:(p: any) => Http.put(`${baseApi()}/merchantsWechat/${p.id}`, p),
    DeleteWeChartMerchant:(p: any) => Http.delete(`${baseApi()}/merchantsWechat/${p.id}`, p),
    DeleteWeChartMerchantBatches:(p: any) => Http.delete(`${baseApi()}/merchantsWechat/batches`, p),
    //上传微信商户证书
    UploadMerchantCertificate:(p: any) => Http.post(`${baseApi()}/merchantsWechat/certificate/upload/${p.id}`, p.data),
//    上传证书附件地址
    UploadMerchantFileUrl:() => `${baseApi()}/accessory/upload/files`,
    //    移除微信凭证
    RemoveMerchantFile:(p:any) => Http.post(`${baseApi()}/merchantsWechat/certificate/clear/${p.id}`,p),
}


/**
 * api请求处理方法,封装返回数据格式
 */
export const ApiFormat = async (fun: Promise<any>) => {
    try {
        const result = await fun
        return {result: result, error: null} as ApiResult
    } catch (error: any) {
        return {result: null, error: error} as ApiResult
    }
}

/**
 * api基础请求封装，loading,错误提示,异常处理
 */
export const ApiBase = async (fun: Promise<any>, {showLoading = false, loadingText = '加载中', showError = true} = {}) => {

    // 加载Loading
    let loading: any
    // loadingKey
    const loadingKey = Math.random().toString(36).slice(-8) + new Date().getTime()
    try {
        if (showLoading) loading = message.loading({content: loadingText, key: loadingKey})

        // 发起请求
        const {result, error} = await ApiFormat(fun)

        if (error && showError) {
            message.error({content: error.message || '请求异常', key: loadingKey})
            return {result, error} as ApiResult
        }

        // if (result.code != 0 && showError) {
        //   message.error({ content: result.msg || '其他异常', key: loadingKey })
        //   return { result, error } as ApiResult
        // }

        if (loading) loading();
        loading = null
        return {result, error} as ApiResult
    } catch (error: any) {
        if (showError) {
            message.error({content: error.message || '请求处理异常', key: loadingKey})
        } else {
            if (loading) loading();
            loading = null
        }
        return {result: null, error} as ApiResult

    }
}

//错误校验
export const errorCheck = (result: any, error: any) => {
    if (!result || result.code !== 0) {
        const errorCode = [1610 , -1 , -2 , -3 , -4 , -5]
        if (errorCode.indexOf(result.code)!==-1){
            router.push('/login')
        }
        message.error({
            title: '请求异常',
            content: result.msg
        })
        return false;
    }
    return true;
}