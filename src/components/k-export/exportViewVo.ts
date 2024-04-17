import type {TableViewVo} from "@/common/tableViewVo"
import type { VxeTableInstance } from 'vxe-table'

export class ExportViewVo {
  title:string = "导出"
  visible:boolean = false
  fileName?:string //导出的文件名称
  tableViewVo!:TableViewVo
  tableRef!:VxeTableInstance
  setExportCall!:(open:boolean)=>void
  constructor(__fileName?:string) {
    this.title = "导出"
    this.fileName = __fileName
  }
  public show (p:{tableViewVo:TableViewVo,tableRef:VxeTableInstance}){
    this.tableViewVo = p.tableViewVo
    this.tableRef = p.tableRef
    // p.fileName && (this.fileName = p.fileName)
    this.visible = true
    this.setExportCall(true)
  }
  public close() {
    this.visible = false
    this.setExportCall(false)
  }
}