import {reactive, ref} from "vue";
import {message} from "ant-design-vue";
import {ApiBase, errorCheck} from "@/common/api";

/**
 * 表格类型枚举，可以用来分类处理不同场景
 */
export class FormEvent {
    public show:boolean
    public title!:string
    public labelCol: object
    public wrapperCol: object
    public width: string
    public type:string
    public formData:any = {}
    public confirmLoading:Boolean = false
    public loading:boolean = false
    public message:string = '加载中'

    constructor(labelCol_:number|string = 5,wrapperCol_:number|string = 17,width_:number = 600) {
        this.show = false
        this.labelCol = {span:labelCol_}
        this.wrapperCol = {span:wrapperCol_}
        this.width = width_+'px'
        this.type = 'add'
    }
    //打开
    public open(){
        this.show = true
        console.log("FormEvent：open")
    }
    //关闭
    public close(){
        this.show = false
    }
//取消
    public cancel(){
        this.close()
    }
//    确定
    public confirm(call:Function=()=>{}){
        call();
        this.close()
    }
//    修改formData
    public setFormData(data:object = {}){
        this.formData = data
    }

//    触发修改或新增
    public onModify(title:string,data:any,type:string){
        this.title = title;
        this.type = type;
        this.show = true;
        this.formData = data;
    }
//    方法调用
    public async onMethodsApi(api_:any,param_:any,{loading_=true,message_='加载中',confirmLoading_=true}={}){
        this.loading = loading_
        this.confirmLoading = confirmLoading_
        let hide;
        if (loading_)  hide=message.loading(message_,0)
        const {result,error} = await ApiBase(api_({...param_}))
        if(hide) hide()
        this.loading = false

        this.confirmLoading = false

        if (errorCheck(result,error)){
            return result;
        }
        return '';
    }
}