
interface TreeType{
    title:string,
    key:string,
    disableCheckbox?:Boolean | undefined,
    children?:TreeType[]
}

export class Authority {
    private isDisable:Boolean = false;
    public AuthorityTree = ():TreeType[]=>{
        return [
            {
                title:'所有权限',
                key:'*',
            },
            {
                title:'充电站全景',
                key:'cdzqj',
            },
            {
                title:"管理员",
                key:"gly",
                disableCheckbox:this.isDisable,
                children:[
                    {
                        title:'管理员管理',
                        key:'gly-glygl',
                        disableCheckbox:this.isDisable
                    },
                    {
                        title:'角色管理',
                        key:'gly-jsgl',
                        disableCheckbox:this.isDisable
                    },
                    {
                        title:'微信多商户',
                        key:'gly-wxdsh',
                        disableCheckbox:this.isDisable
                    },
                ]
            },
            {
                title:"车主管理",
                key: "czgl",
                disableCheckbox:this.isDisable
            },
            {
                title:"设备管理",
                key:"sbgl",
                disableCheckbox:this.isDisable,
                children:[{
                    title: '充电站管理',
                    key: 'sbgl-chargingStation',
                    disableCheckbox:this.isDisable
                },{
                    title: '充电桩管理',
                    key: 'sbgl-chargingPile',
                    disableCheckbox:this.isDisable
                },{
                    title: '充电枪管理',
                    key: 'sbgl-chargingGun',
                    disableCheckbox:this.isDisable
                }, {
                    title: '充电枪管理',
                    key: 'sbgl-berth',
                    disableCheckbox:this.isDisable
                }]
            },
            {
                title:"订单管理",
                key: "ddgl",
                disableCheckbox:this.isDisable,
                children:[{
                    title: '充电中订单',
                    key: 'ddgl-chrging',
                    disableCheckbox:this.isDisable
                },{
                    title: '已完成订单',
                    key: 'ddgl-finish',
                    disableCheckbox:this.isDisable
                },{
                    title: '缴费记录',
                    key: 'ddgl-payment',
                    disableCheckbox:this.isDisable
                },{
                    title: '账单管理',
                    key: 'ddgl-bill',
                    disableCheckbox:this.isDisable
                },{
                    title: '退款记录管理',
                    key: 'ddgl-refund',
                    disableCheckbox:this.isDisable
                }]
            },
            {
                title: "充电套餐",
                key:"cdtc",
                disableCheckbox:this.isDisable
            },
            {
                title: "收费规则",
                key:"sfgz",
                disableCheckbox:this.isDisable
            }
        ]
    };

    public changDisable=(bool:boolean)=>{
        this.isDisable = bool
    }
}