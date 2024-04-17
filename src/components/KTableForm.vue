<script setup lang="ts">
import { TableViewVo } from "@/common/tableViewVo"
import {account} from "@/store";
import {onMounted, reactive} from "vue";
import {errorCheck, Merchant} from "@/common/api";

const props = defineProps({
  // isMore: {
  //   type: Boolean,
  //   default: false
  // },
  tableViewVo: {
    type: TableViewVo,
    default () {
      return new TableViewVo({})
    }
  },
})

//获取总商户字段
const isTenantBoss = account().getTenantBoos
let tenantList: any = reactive<Object>([]);
//获取商户列表
//总商户才可获取

const tableViewVo = reactive<TableViewVo>(props.tableViewVo)
//更改商户搜索条件
const selectChang = (e: Number|String) => {
  account().setCurrentUseTenant(e.toString())
  tableViewVo.tenantCode = e
  console.log('tableViewVo',tableViewVo.tenantCode)
}
onMounted(async ()=>{
  if (isTenantBoss) {
    const result = await Merchant.GetAllMerchant({page: 1, row: 9999}).base({showLoading:false})
    if (errorCheck(result)) {
      result.data.forEach((item: any) => {
        tenantList.push({
          value: item.tenantCode,
          label: item.name
        })
      })
    }
  }
})

</script>

<template>
  <div class="k-table-form">
    <div class="k-table-form-search">
      <a-form  layout="inline" :model="tableViewVo.form">
        <slot></slot>
        <a-form-item label="" v-if="isTenantBoss && tableViewVo.useTenant" >
          <a-select
              v-model:value="tableViewVo.tenantCode"
              show-search
              placeholder="请选择商户"
              style="width: 200px"
              :options="tenantList"
              :filterOption = "(input: string, option: any) =>option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0"
              @change="selectChang"
          ></a-select>
        </a-form-item>
        <slot name="moreSearch"></slot>
      </a-form>
    </div>

    <div class="k-table-form-opt">
      <div style="flex: 1"></div>
      <a-button type="primary" @click="() => props.tableViewVo?.search()">搜索</a-button>
      <a-button @click="() => props.tableViewVo?.reset()">重置</a-button>
      <a-button v-if="props.tableViewVo?.showMord" type="link" @click="() => props.tableViewVo.isMore = !props.tableViewVo?.isMore">{{ props.tableViewVo.isMore ? '收起' : '展开' }}</a-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.k-table-form{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  &-search{
    display: flex;
    align-items: center;
    flex-flow: wrap;
  }
  padding: 8px 0;
  .ant-form-inline .ant-form-item{
    margin-bottom: 8px;
  }
  &-opt{
    display: flex;
    flex-direction: row;
    & > :not(:last-child) {
      margin-right: 8px;
    }
    .ant-btn-link{
      padding: 4px 4px;
    }
  }
}
</style>
