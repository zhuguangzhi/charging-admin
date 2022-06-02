import { VxeGridProps } from "vxe-table"

/**
 * 表格类型枚举，可以用来分类处理不同场景
 */
enum DialogType{
  ADD,
  EDIT
}
export class DialogViewVo {

  // 类型，一般来区分是新增还是修改或者是其他类型
  public type: DialogType
  // 表单
  public form: any
  // 确认按钮加载状态
  public confirmLoading: boolean
  // 显示状态
  public visible: boolean
  // Dialog名称
  public title: string
  // Dialog宽度
  public width: string
  // 点击蒙层是否关闭
  public maskClosable: boolean
  // 取消按钮文字
  public cancelText: string|any
  // 确认按钮文字
  public okText: string|any
  
  constructor({} = {}) {
    this.visible = false
    this.form = {}
    this.confirmLoading = false
    this.type = DialogType.ADD
    this.title = "窗口"
    this.width = "520px"
    this.maskClosable = false
    this.cancelText = "取消"
    this.okText = "确认"
  }

  // 打开Dialog, 一般来说要重写此方法
  public show({type = DialogType.ADD} = {}) {
    this.visible = true
    this.type = type
  }

  // 点击遮罩层或右上角叉或取消按钮的回调	
  public onCancel() {
    this.visible = false
  }

  // 确认按钮的回调
  public async onOk(e:any) {
    this.confirmLoading = true
    try {
      await this.onConfirm(e)
    } catch (error: any) {
      console.error("确认按钮的回调", e)
    }
    this.confirmLoading = false
  }

  // 确认按钮事件，一般来说需要重写
  public async onConfirm(e:any) {

  }

}