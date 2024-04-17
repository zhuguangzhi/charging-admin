<script lang="ts" setup>
import { reactive, toRefs, defineEmits } from 'vue';
import { KPopupVo } from './KPopupVo';

// 声明响应式对象并转换为响应式引用
const KPopupInstance = KPopupVo.instance();
</script>
<template>
  <Teleport to="body" v-if="KPopupInstance.open.value">
    <div class='container animate__animated animate__fadeIn'>
      <div v-if="KPopupInstance.mask.value" @click="KPopupInstance.closeCall()" class="mask"></div>
      <div class="popup" :style="{ width: KPopupInstance.width.value }">
        <div class="popup_header">
          <p v-if="KPopupInstance.title.value">{{ KPopupInstance.title.value }}</p>
          <p v-if="KPopupInstance.showClose.value" @click="KPopupInstance.closeCall()" class="popup_close">
            <IconFont type="icon-cha"/>
          </p>
        </div>

        <div class="popup_body">
          {{ KPopupInstance.msg.value }}
        </div>
        <div class="popup_footer">
          <p v-if="KPopupInstance.leftBtn.value" @click="KPopupInstance.onLeftEvent.value()" class="popup_footer_left">
            {{ KPopupInstance.leftBtn.value }}
          </p>
          <div class="flex popup_footer_right">
            <a-button v-if="KPopupInstance.useCancelBtn.value" @click="KPopupInstance.closeCall()" type='default'>
              {{ KPopupInstance.cancelBtnName.value || '取消' }}
            </a-button>
            <a-button
                @click="KPopupInstance.confirmCall()"
                style="margin-left: 12px"
                type='primary'
                :danger="KPopupInstance.isDanger.value"
                :disabled='KPopupInstance.disabled.value'
                :loading="KPopupInstance.confirmLoading.value"
            >
              {{ KPopupInstance.okBtnName.value || '确定' }}
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped lang="less">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 9999;
  overflow: hidden;

  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 30%);
  }

  .popup {
    width: 450px;
    min-height: 128px;
    border-radius: 8px;
    background-color: #fff;
    font-size: 14px;
    font-feature-settings: 'tnum';
    font-variant: tabular-nums;
    line-height: 1.5715;
    z-index: 2;
    margin-top: -80px;

    &_header {
      display: flex;
      align-items: center;
      position: relative;
      width: 100%;
      padding: 24px 56px 24px 24px;
      box-sizing: border-box;
      font-size: 16px;
    }

    &_close {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      text-align: center;
      line-height: 28px;
      position: absolute;
      right: 24px;
      cursor: pointer;
    }

    &_close:hover {
      background-color: #e8e9e9;
    }

    &_body {
      box-sizing: border-box;
      color: #333;
      font-size: 14px;
      font-feature-settings: 'tnum';
      font-variant: tabular-nums;
      line-height: 1.5715;
      list-style: none;
      padding: 0 24px;
      margin: 0 0 24px;
      flex: 1;
      //overflow: auto;
      word-wrap: break-word;
    }

    &_footer {
      display: flex;
      align-items: center;
      position: relative;
      box-sizing: border-box;
      text-align: right;
      min-height: 56px;
      padding: 0 24px 24px;

      .ant-btn {
        border-radius: 6px !important;
        height: 32px !important;
        min-width: 80px !important;
      }

      .ant-btn-default:hover {
        border-color: #d0d3d6 !important;
        color: rgb(0 0 0 / 85%);
        background-color: #f2f3f5 !important;
      }

      &_left {
        color: #5b89fd;
        cursor: pointer;
        user-select: none;
      }

      &_right {
        position: absolute;
        right: 24px;
      }
    }
  }
}

</style>
