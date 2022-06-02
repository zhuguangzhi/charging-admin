<script setup lang="ts">
import { TableViewVo } from "@/common/tableViewVo"
import {account} from "@/store";
import {reactive} from "vue";
import {ApiBase, errorCheck, Merchant} from "@/common/api";

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
if (isTenantBoss) {
  (async () => {
    const {result, error} = await ApiBase(Merchant.GetAllMerchant({page: 1, row: 9999}))
    if (errorCheck(result, error)) {
      result.data.forEach((item: any) => {
        tenantList.push({
          value: item.tenantCode,
          label: item.name
        })
      })
    }
  })()
}
const tableViewVo = reactive<TableViewVo>(props.tableViewVo)
//更改商户搜索条件
const selectChang = (e: Number|String) => {
  console.log(e)
  tableViewVo.tenantCode = e
  console.log(tableViewVo)
}
// const emit = defineEmits(["search", "reset", "showChange"])
// // 搜索按钮点击
// const searchClick = () => {
//   emit('search')
// }
// // 重置按钮点击
// const resetClick = () => {
//   emit('reset')
// }

// // 搜索类型变更
// const showChange = () => {
//   emit('showChange')
// }

</script>

<template>
  <div class="k-table-form">
    <div class="k-table-form-search">
      <slot></slot>
      <a-form  v-if="isTenantBoss && tableViewVo.tenantCode" layout="inline" :model="tableViewVo.form">
      <a-form-item label="商户">
        <a-select
            v-model:value="tableViewVo.tenantCode"
            show-search
            placeholder="Select a person"
            style="width: 200px"
            :options="tenantList"
            @change="selectChang"
        ></a-select>
      </a-form-item>
      </a-form>
    </div>
    <slot name="moreSearch"></slot>

    <div class="k-table-form-opt">
      <div style="flex: 1"></div>
      <a-button type="primary" @click="() => props.tableViewVo.search()">搜索</a-button>
      <a-button @click="() => props.tableViewVo.reset()">重置</a-button>
      <a-button v-if="props.tableViewVo.showMord" type="link" @click="() => props.tableViewVo.isMore = !props.tableViewVo.isMore">{{ props.tableViewVo.isMore ? '普通搜索' : '高级搜索' }}</a-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.k-table-form{
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
