import { message } from 'ant-design-vue'

/**
 * 表格类型枚举，可以用来分类处理不同场景
 */
export enum DialogType{
  Default,
  Add,
  Edit
}
export class DialogViewVo {

  // 类型，一般来区分是新增还是修改或者是其他类型
  public type: DialogType = DialogType.Default
  // 显示状态
  public visible: boolean = false
  // Dialog名称
  public title: string
  // 确认按钮加载状态
  public confirmLoading: boolean = false
  // Dialog宽度
  public width: string
  // 点击蒙层是否关闭
  public maskClosable: boolean = false
  // 是否显示右上角的关闭按钮
  public closable: boolean = true
  // 取消按钮文字
  public cancelText: string | any = '取消'
  // 确认按钮文字
  public okText: string|any = '确定'
  // 全屏显示
  public fullScreen: boolean = false
  // 弹窗最外层类名
  public wrapClass: String = ''
  // 关闭弹窗时是否销毁dom
  public destroyOnClose: boolean = true
  // loading
  public loading:boolean = false
  // loading描述
  public loadingTip:string = '加载中'

  constructor({ title = "弹窗", width = "60%" }) {
    this.title = title
    this.width = width
  }

  // 打开Dialog, 一般来说要重写此方法
  public show({type = DialogType.Add, parame = {}} = {}) {
    this.visible = true
    this.type = type
  }

  // 确认按钮的回调
  public async onOk(e:any) {
    this.confirmLoading = true
    try {
      // console.log('e',e)
      await this.onConfirm(e)
    } catch (error: any) {
      console.error("确认按钮的回调", error)
    }
    this.confirmLoading = false
  }

  // 确认按钮事件，一般来说需要重写
  public async onConfirm(e: any) {

  }  // 方法事件，一般在操作启用、停用、删除等操作时使用，可以减少一部分代码
  public async onApi(api: any, param: any,
                     {
                       showLoading = true, // 是否显示顶部loading
                       loadingText = '处理中', // 顶部loading文字
                       successText = '操作成功', // 成功提示文本，为空则不提示
                       confirmLoading = true, // 是否显示表格loading
                       showError = true, // 失败提示，false则不提示
                       errorText = '', // 失败提示文本，有值则按照该值提示
                       defaultErrorText = '操作失败', // 失败提示文本，有值则按照该值提示
                     }: {
                       showLoading?: boolean;
                       loadingText?: string;
                       successText?: string;
                       confirmLoading?: boolean;
                       showError?: boolean;
                       errorText?: string;
                       defaultErrorText?: string;
                     } = {}
  ) {
    if (confirmLoading) { this.confirmLoading = true }
    // 开始请求
    try {
      const { code, data, msg } = await api({ ...param }).base({ showLoading, loadingText, showError: false })
      if (code === '0' || code === 0) {
        // 请求成功时执行
        if (successText) {
          message.success({ content: successText || '操作成功' })
        }
      } else {
        if (showError) {
          message.error({ content: errorText || msg || defaultErrorText })
        }
      }
      if (confirmLoading) {
        this.confirmLoading = false
      }
      return { code, data, msg }
    } catch (error: any) {
      console.error(error)
      if (showError) {
        message.error({ content: errorText || error.message || defaultErrorText })
      }
      // message.error({ content: error.message || '操作异常' })
      if (confirmLoading) {
        this.confirmLoading = false
      }
      return { code: -1, msg: error.message || '操作异常' }
    }
  }

  public onCancel() {
    // console.log("onCancel:")
    this.visible = false
  }


}