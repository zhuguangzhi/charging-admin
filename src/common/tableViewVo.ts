import {VxeGridProps} from "vxe-table"
import {errorCheck} from "@/common/api";
import exp from "constants";
import {account} from "@/store";

/**
 * 表格类型枚举，可以用来分类处理不同场景
 */
enum TableType {
  Default
}

export class TableViewVo {

  public type: TableType
  // 表单
  public form: any
  // 数据总条数
  public total: number
  // 当前选中页
  public page: number
  // 每页多少条
  public row: number
  // vxe-table配置
  public vxeGridProps: VxeGridProps
  // 加载状态
  public loading: boolean
  // 是否是高级搜索模式
  public isMore: boolean
  // 是否显示高级搜索
  public showMord: boolean
  // 高度是否铺满
  public heightFull: boolean
  //表格对齐方式
  public align: string
  //复选框选中值
  public checkList: Array<object>
  // 是否使用商户隔离
  public useTenant: boolean = false
  //当前商户code
  public tenantCode: String | Number
  //是否使用导出
  public useExport: boolean = true
  // 是否使用pagination
  public usePagination: boolean = true
  public getMethods: any

  public exportName?: string

  constructor(vxeGridProps: VxeGridProps, {showMord = false, heightFull = true, useTenant = false} = {}) {
    this.type = TableType.Default
    this.form = {}
    this.total = 0
    this.page = 1
    this.row = 10
    this.loading = false
    this.isMore = false
    this.heightFull = heightFull
    this.showMord = showMord
    this.align = "center"
    this.checkList = []
    this.useTenant = useTenant


    this.tenantCode = account().currentUseTenant

    if(this.useTenant) {
      this.form.tenantId = this.tenantCode
    }

    // 初始化表格参数
    let data: VxeGridProps = Object.assign(
      {
        // ellipsis（只显示省略号）,title（并且显示为原生 title）,tooltip（并且显示为 tooltip 提示）
        showOverflow: 'tooltip',
        showHeaderOverflow: 'tooltip',
        id: 'tableView',
        border: false,
        height: this.heightFull ? 'auto' : '',
        autoResize: true,
        headerAlign: 'center',
        align: this.align,
        columns: [],
        keepSource: true,
        customConfig: {
          storage: true,
        },
        printConfig: {},
        columnConfig: {
          resizable: false,
          isCurrent: true
        },
        rowConfig: {
          isHover: true,
          isCurrent: true,
          // height: 40
        },
        keyboardConfig: {
          isArrow: true // 开启方向键功能
        },
        toolbarConfig: {
          slots: {
            buttons: "toolbar_buttons",
          },
          perfect: true,
          print: true,
          zoom: true,
          custom: true
        },
        data: []
      },
      vxeGridProps
    )
    this.vxeGridProps = data

  }

  public onPageChange(page: number) {
    // console.log('tableViewVo:onPageChange:', page, this)
    this.page = page
    this.vxeGridProps.data = []
    this.getData(this.getParam())
  }

  public onPageSizeChange(pageSize: number, page: number): void {
    console.log('tableViewVo:onPageSizeChange:', pageSize, page)
    this.row = pageSize
    this.page = page
  }

  // 搜索事件
  public search() {
    this.page = 1
    this.vxeGridProps.data = []
    this.getData(this.getParam())
  }

  //刷新事件
  public reFresh() {
    this.vxeGridProps.data = []
    this.getData(this.getParam())
  }

  // 重置搜索
  public reset() {
    this.form = {}
    this.page = 1
    this.row = 10
    this.vxeGridProps.data = []
    this.getData(this.getParam())
  }

  // 获取查询参数
  public getParam() {
    const  param = {
      page: this.page,
      row: this.row,
      ...this.form
    }
    if(this.useTenant) {
      param.tenantId = this.tenantCode
    }
    return param
  }

  public beforeGetData(param: any) {
    this.loading = true
  }

  public async afterGetData(res: any) {
    this.loading = false
    if (errorCheck(res)) {
      let data: any = JSON.parse(JSON.stringify(this.vxeGridProps.data))
      await res.data.forEach((item: any) => {
        data.push(item)
      });
      this.vxeGridProps.data = data
      // this.form = {}
      this.total = res.total
    }
  }

  public getDataFun(param: any): any {
  }

  // 获取数据方法, 需要重写
  public async getData(param: any) {
    this.beforeGetData(param)
    const result = await this.getDataFun(param)
    console.log('result', result)
    await this.afterGetData(result)
  }

//    方法事件
  public async onApi(api: any, param: any) {
    this.loading = true
    const {result, error} = await api({...param}).base({showLoading: false})
    if (errorCheck(result, error)) {
      this.reFresh()
      return result;
    }
    this.loading = false
    return '';
  }

}
