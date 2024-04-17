import { account } from '@/store';

import axios from 'axios'
import type { AxiosStatic } from 'axios'
import { notification } from 'ant-design-vue'
import router from '@/router'
import { message  } from 'ant-design-vue'
import {removeEmptyValues} from "./utils";

interface ApiResult {
  result: any,
  error: any
}

class Http {

  public axios: AxiosStatic|any = null

  public promiseValue: any = null

  constructor() {

    this.axios = axios

    // 这里主要是防止重复添加拦截器导致的请求失败
    if (!this.axios.initialize) {
      // console.log("执行HTTP构造函数:加载拦截器")
      this.axios.initialize = true
      // 添加请求拦截器，在发送请求之前做些什么(**具体查看axios文档**)--------------------------------------------
      axios.interceptors.request.use(function (config: any) {
        return config
      }, function (error) {
        return Promise.reject(error)
      })

      // 添加响应拦截器(**具体查看axios文档**)----------------------------------------------------------------
      axios.interceptors.response.use(function (response: any) {
        // 对响应数据做点什么，允许在数据返回客户端前，修改响应的数据
        // 如果只需要返回体中数据，则如下，如果需要全部，则 return response 即可
        return response.data
      }, (error) => {
        // 对响应错误做点什么
        return Promise.reject(error)
      })
    }

  }

  // 封装数据返回失败提示函数---------------------------------------------------------------------------
  private errorState (response: any) {
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
      // 如果不需要除了data之外的数据，可以直接 return response.data
      return response.data
    } else {
      return { code: -1, msg: response?.message || '请求异常' }
    }
  }

  // 封装数据返回成功提示函数---------------------------------------------------------------------------
  private successState (res: any) {
    // console.log("响应数据：",res)
    return res.data
    // // 统一判断后端返回的错误码(错误码与后台协商而定)
    // if (res.success && res.code === '0') {
    //   return res.data || true
    // } else {
    //   // if(res.code === '401' || res.code === '402'){
    //   //   router.replace('/login')
    //   //   return false
    //   // }
    //   // notification['error']({
    //   //   message: '温馨提示',
    //   //   description: res.msg
    //   // })
    //   return res.data || false
    // }
  }

  // 封装axios--------------------------------------------------------------------------------------
  private apiAxios (method: string, url: string, params: any, header?: any) {

    if (!header) { header = {} }

    const accountStore = account()
    const token = accountStore.getToken

    if(token){
      header.token = token
    } else {
    }
    // header['auth'] = '834ce4db-13f6-4dfd-9d9a-8d393701451a'
    params = removeEmptyValues(params)

    const httpDefault: any = {
      method: method,
      url: url,
      params: method === 'GET' ? params : null,
      data: method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH' ? params : null,
      timeout: 30000
    }

    // 如果headers中还需要其他信息可以在这边合并
    httpDefault.headers = {
      ...header
    }

    // this.httpDefault = httpDefault

    this.promiseValue = new Promise((resolve, reject) => {
      axios(httpDefault).then((res) => {
        if(this.successState(res)) {
          resolve(res)
        } else {
          resolve(res)
        }
      }).catch((response) => {
        // console.log("response:", response)
        // this.errorState(response)
        reject(response)
      })
    })
    return this
  }

  public format = async ():Promise<ApiResult> => {
    try {
      const result = await this.promiseValue
      // this.formatValue = { result: result, error: null } as ApiResult
      return { result: result, error: null } as ApiResult
    } catch (error: any) {
      // this.formatValue = { result: null, error: error } as ApiResult
      return { result: null, error: error } as ApiResult
    }
  }

  public base = async ({showLoading = true, loadingText = '加载中', showError = true} = {}) => {
    // 加载Loading
    let loading: any
    // loadingKey
    const loadingKey = Math.random().toString(36).slice(-8) + new Date().getTime()
    try {
      if (showLoading) loading = message.loading({ content: loadingText, key: loadingKey })

      // 发起请求
      const { result, error } = await this.format()

      if (error) {
        console.log("请求异常", error)
        if (showError) {
          message.error({ content: error.message || '请求异常', key: loadingKey })
        }
        return { code: -1, msg: error.message }
      }

      if (result?.code != '0' && showError) {
        console.log("其他异常", result?.msg)
        message.error({ content: result?.msg || '其他异常', key: loadingKey })
        if(result.code=="401" || result.code=="402") {
          router.push('/login')
        }
        return result
      }

      if (loading) loading();loading = null
      return result
    } catch (error: any) {
      if (showError) {
        message.error({ content: error?.message || '请求处理异常', key: loadingKey })
      }
      if (loading) loading();loading = null
      return { code: -1, msg: error.message }
    }
  }

  public run = () => {
    return this.promiseValue
  }

  public get(url: string, params: any = null, header?: any) { return this.apiAxios('GET', url, params, header) }
  public post(url: string, params: any = null, header?: any) { return this.apiAxios('POST', url, params, header) }
  public put(url: string, params: any = null, header?: any) { return this.apiAxios('PUT', url, params, header) }
  public delete(url: string, params: any = null, header?: any) { return this.apiAxios('DELETE', url, params, header) }
  public patch(url: string, params: any = null, header?: any) { return this.apiAxios('PATCH', url, params, header) }
}

export default Http