import * as XLSX from "xlsx"

// 文件转xlsx
export const file2Xce = (file:any) => {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        reader.onload = function(e:any) {
            const data = e.target.result
            let wb = XLSX.read(data, {
                type: 'binary'
            })
            const result:Array<any> = []
            wb.SheetNames.forEach((sheetName:any) => {
                result.push({
                    sheetName: sheetName,
                    sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
                })
            })
            resolve(result)
        }
        reader.readAsBinaryString(file)
    })
}
