<style scoped lang="less">
.billing-rule-edit{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 99;
  .rule-header{
    background-color: #fff;
    .rule-content-memo{
      margin-top: 16px;
    }
    .rule-form{
      margin-top: 16px;
    }
  }
  .rule-rate-content, .rule-capping-content{
    padding: 16px;
    flex-grow: 1;
    overflow-y: auto;
    box-sizing: border-box;
    .add-rate-item{
      padding: 16px;
      background-color: #fff;
      height: 360px;
      border: 1px dashed #e8e8e8;
      text-align: center;
      cursor: pointer;
      line-height: 320px;
      font-size: 16px;
      user-select: none;
      transition: all .3s;
      &:hover{
        color: blue;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
      }
      i{
        padding: 0 8px 0 8px;
        margin-left: -16px;
      }
    }
  }
  &-drawer {
    height: 100%!important;
    overflow-y: scroll;
    &-num {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding-bottom: 16px;
      font-size: 16px;
      color: #1A73E8;
    }
  }
}
.BillForm {
  height: calc(100vh - 130px);
  overflow-y: scroll;
  box-sizing: border-box;

}
::-webkit-scrollbar {
  width: 0;
}
</style>


<template>
  <div class="billing-rule-edit">
    <a-page-header
        class="rule-header"
        title="收费规则"
        sub-title="收费规则配置说明"
        @back="() => formEvent.cancel()"
    >
      <template #extra>
<!--        <a-button :disabled="!$route.query.id" @click="getBilling($route.query.id)">刷新</a-button>-->
        <a-button @click="showDraw=true">时段</a-button>
        <a-button type="primary" :loading="formEvent.confirmLoading" @click="saveConfirm">保存</a-button>
      </template>
      <div class="rule-content">
        <a-alert
            v-if="errMsg"
            :message="errMsg"
            description="查询规则出现错误，请返回上一页重新进入！"
            type="error"
            show-icon
        />
        <!-- <div class="rule-content-memo">
          收费规则说明
        </div> -->
        <!-- 收费规则表单 -->
        <div class="rule-form">
          <a-form ref="formRef" :rules="rules" :label-col="{ xxl: 4, xl: 6, lg: 5, md: 6, sm: 5, xs: 6 }" :wrapper-col="{ span: 16 }">
            <a-row :gutter="16">
              <a-col class="gutter-row" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <a-form-item label="规则名称" labelAlign="left">
                  <a-input v-model:value="form.name" placeholder="请输入规则名称"></a-input>
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :xs="0" :sm="0" :md="12" :lg="12" :xl="16"><div style="height: 64px"></div></a-col>

              <a-col class="gutter-row" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <a-form-item name="free" label="免费时长" labelAlign="left">
                  <a-input-number @change="form.kilowatt=0" id="inputNumber" v-model:value="form.free" :min="0" :max="9999" /> 分钟
                </a-form-item>
                <a-form-item name="kilowatt" label="免费电量" labelAlign="left">
                  <a-input-number @change="form.free=0" id="inputNumber" v-model:value="form.kilowatt" :min="0" :max="9999" /> 度
                </a-form-item>
              </a-col>

<!--              <a-col class="gutter-row" style="width: 0" :xs="0" :sm="0" :md="12" :lg="12" :xl="16"><div></div></a-col>-->

<!--              <a-col class="gutter-row" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">-->
<!--                <a-form-item label="计费方式" labelAlign="left">-->
<!--                  <a-radio-group :default-value="form.cycle" name="radioGroup" labelAlign="left">-->
<!--                    <a-radio :value="1">按时间</a-radio>-->
<!--                    <a-radio :value="2">按电量</a-radio>-->
<!--&lt;!&ndash;                    <a-radio :value="3">按费用</a-radio>&ndash;&gt;-->
<!--                  </a-radio-group>-->
<!--                </a-form-item>-->
<!--              </a-col>-->
              <a-col class="gutter-row" :xs="0" :sm="0" :md="12" :lg="12" :xl="16"><div style="height: 64px"></div></a-col>
              <a-col class="gutter-row" style="margin-top: -8px" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <a-form-item label="计费类型" labelAlign="left">
                  <a-radio-group :default-value="form.billType" name="radioGroup">
                    <a-radio :value="1">平台计费</a-radio>
                    <a-radio :value="2">三方计费</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :xs="0" :sm="0" :md="12" :lg="12" :xl="16"><div style="height: 64px"></div></a-col>
              <a-col class="gutter-row" style="margin-top: -8px" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <a-form-item label="规则描述" labelAlign="left" :wrapper-col="{ span: 24 }">
                  <a-textarea v-model="form.memo" placeholder="请输入规则描述" :auto-size="{ minRows: 3, maxRows: 6 }" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </a-page-header>
<!--    时段-->
    <a-drawer
        :visible="showDraw"
        width="400"
        class="billing-rule-edit-drawer"
        title="收费时间段"
        :maskClosable="true"
        placement="right"
        @close="showDraw=false"
    >
      <a-form class="BillForm">
        <div style="padding-bottom: 24px;height: auto" v-for="(item,index) in form.ruleChargeList" :key="index">
          <div class="billing-rule-edit-drawer-num">
            <span>配置项 {{index+1}}</span>
            <a-popconfirm
                title="确认删除时段配置吗?"
                ok-text="确认"
                cancel-text="取消"
                @confirm="deleteRule(index)"
            >
              <a-button
                  type="primary" danger
                  style="padding: 0 16px; display: inline-block; margin-left: 8px;width: auto"
              >
                <template #icon>
                  <delete-outlined />
                </template>
              </a-button>
            </a-popconfirm>
          </div>
          <a-form-item label="计费方式" labelAlign="left">
            <a-radio-group :default-value="item.cycle" name="radioGroup" labelAlign="left">
              <a-radio @click="item.cycle=1" :value="1">按时间</a-radio>
              <a-radio @click="item.cycle=2" :value="2">按电量</a-radio>
              <!--                    <a-radio :value="3">按费用</a-radio>-->
            </a-radio-group>
          </a-form-item>
          <a-form-item label="时间段" style="margin-bottom: 0">
            <a-form-item
                help="选择费率开始时段"
                :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
              <a-time-picker
                  style="width: 100%"
                  format="HH:mm"
                  :defaultValue="formatTime(item.startTime)"
                  @change="(date: any, dataStr: any) => {item.startTime = dataStr;}"
              />
            </a-form-item>
            <span
                :style="{display: 'inline-block',width: '24px',textAlign: 'center',}"
            >-</span>
            <a-form-item
                help="选择费率结束时段"
                :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
            >
              <a-time-picker
                  style="width: 100%"
                  format="HH:mm"
                  :defaultValue="formatTime(item.endTime)"
                  @change="(date: any, dataStr: any) => {item.endTime = dataStr;}"
              />
            </a-form-item>
          </a-form-item>
          <div style="display: flex;flex-direction: column;align-items: flex-start;width: 100%">
            <div style="padding: 8px 0;color: rgba(0, 0, 0, 0.85);font-size: 14px">收费配置</div>
            <a-input-group compact>
              <a-input
                  v-if="item.cycle === 1"
                  :default-value="format.moneyNub(item.cost)"
                  @change="(e: any)=>{
                    moneyFormat(e,index,'cost')
                  }"
                  prefix="￥"
                  suffix="元/小时"
                  style="width: 100%; text-align: center"
              />
              <a-input
                  v-if="item.cycle === 2"
                  :default-value="format.moneyNub(item.cost)"
                  @change="(e: any)=>{
                    moneyFormat(e,index,'cost')
                  }"
                  prefix="￥"
                  suffix="元/度"
                  style="width: 100%; text-align: center"
              />

            </a-input-group>
          </div>
          <div style="display: flex;flex-direction: column;align-items: flex-start;width: 100%">
            <div style="padding: 8px 0;color: rgba(0, 0, 0, 0.85);font-size: 14px">服务费</div>
            <a-input-group compact>
              <a-input
                  v-if="item.cycle === 1"
                  :default-value="format.moneyNub(item.fee)"
                  @change="(e: any)=>{
                    moneyFormat(e,index,'fee')
                  }"
                  prefix="￥"
                  suffix="元/小时"
                  style="width: 100%; text-align: center"
              />
              <a-input
                  :default-value="format.moneyNub(item.fee)"
                  @change="(e: any)=>{
                    moneyFormat(e,index,'fee')
                  }"
                  v-if="item.cycle === 2"
                  prefix="￥"
                  suffix="元/度"
                  style="width: 100%; text-align: center"
              />
            </a-input-group>
          </div>
        </div>
        <a-form-item>
          <a-button type="dashed" block @click="addRateRule">
            <PlusOutlined />
            添加时间段
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
//data
import {reactive, ref} from "vue";
import {FormEvent} from "@/views/charging/components/form";
import RulesList from "@/common/rules";
import {DeleteOutlined,PlusOutlined} from '@ant-design/icons-vue';
import moment from 'moment'
import {message} from "ant-design-vue";
import {ChargingRuleApi} from "@/common/api";
import format from "@/common/format";

const emit = defineEmits(["finish"]);
const props = defineProps({
  formEvent:FormEvent as object,
})
const formRef:any = ref(null)
const showDraw = ref(false)

const formEvent = props.formEvent as FormEvent

let rules: any = ref({
  name: RulesList.notNull('请输入规则名'),
});
let errMsg:string = ref('').value;
let form:any = reactive(Object.assign(
  {
    free: 0, // 免费时间
    cycle: 1, // 计费周期
    memo: '', // 规则描述
    kilowatt:0,//免费电量
    billType:1,//计费方式
    name:'',
    ruleChargeList: [] // 子费率
  },
    formEvent.formData
));
let timeList:object = reactive<object>([])

//金额转换
const moneyFormat = (value:any,index:number,type:string) => {
  setTimeout(()=>{
    form.ruleChargeList[index][type] = format.moneynoYuan(Number(value.target._value))
  },0)
}

const formatTime = (data:string | number ='00:00')=>{
  return moment(data,'HH:mm')
}
//删除某个时间段
const deleteRule = (index:number)=>{
  form.ruleChargeList.splice(index,1)
}
// // 新增时段
const addRateRule = ()=> {
  form.ruleChargeList.push({
    cycle:1,
    cost:0,
    fee:0,
    startTime:'00:00',
    endTime:'00:00'
  })
  console.log(form)

};

const saveConfirm =() => {
  if (form.name==='') {
    message.error('请输入规则名')
    return false
  }
  if (form.ruleChargeList.length===0){
    message.error('请至少添加一条规则')
    return false
  }
  if(formEvent.type==='add'){
    addRule()
  }
  else {
    changeRule()
  }
}
const changeRule = async () => {
  const res = await formEvent.onMethodsApi(ChargingRuleApi.EditRule,{...form},{message_:'修改中'})
  if (res) {
    message.success('修改成功')
    emit("finish")
    formEvent.close()

  }
}
const addRule = async () => {
  const res = await formEvent.onMethodsApi(ChargingRuleApi.AddRule,{...form},{message_:'新增中'})
  if (res) {
    emit("finish")
    formEvent.close()
  }
}
</script>
