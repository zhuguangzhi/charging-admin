<template>
  <div v-if="props.pileList.length>0">
    <div class="station-detail-box" id="square" ref="squareRef">
      <div class="info-box" ref="infoBox"
           :style="{transform:`translateX(${state.moveX}px)`,transition:'0.3s linear'}">
        <div class="box-item" @click="choseItem(index)"
             v-for="(item, index) in props.pileList" :key="item.id">

<!--          不可使用中的充电桩-->
          <div class="info-item" v-if="item.portNum<1">
            <div class="no-plate">
              <img
                  src="@/assets/image/wonlinecar.png"
                  style="height:50px;width:50px;margin-top:12%"
              />
            </div>
<!--            <div :class="[item.realTimeOrder.plate ? 'item-bot' : 'item-bot2']">-->
            <div class="item-bot2">
              <p>充电桩号：{{ item.name || '-' }}</p>
            </div>
          </div>
<!--          可使用的充电桩-->
          <div class="free-berth" v-else>
            <div class="free-img">
              <img
                  src="@/assets/image/nocar.png"
                  style="height:50px;width:50px;margin-top:15%"
              />
            </div>
            <div class="free-title" style="margin-top: 5%;text-align: center">
              <a-tooltip placement="top">
                <template #title>
                  <span>{{ item.name }}</span>
                </template>
                <p style="white-space: nowrap">{{ item.name }}</p>
              </a-tooltip>
              <p>{{ item.portNum }} 枪可用</p>
            </div>
          </div>
        </div>


      </div>

    </div>
    <div class="station-detail-box-icon-box">
      <left-circle-outlined class="left-icon" @click="moveBox('left')"/>
      <right-circle-outlined class="right-icon" @click="moveBox('right')"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Hammer from 'hammerjs'
import {LeftCircleOutlined, RightCircleOutlined} from '@ant-design/icons-vue';
import {onMounted, PropType, reactive, ref, watch} from "vue";
import {number} from "vue-types";

const emit = defineEmits(["chosePile"]);

const props = defineProps({
  pileList: {
    type: Array as PropType<Array<any>>,
    default: () => {
      return []
    },
  },
})

const pileList = props.pileList as Array<any>

const squareRef: any = ref(null)
const infoBox: any = ref(null)

type StateType = {
  hammer: any,
  moveX: number,
  touchMoveX: number,
  infoBoxNode: any,
  infoBoxWidth: number

}
const state: StateType = reactive<StateType>({
  hammer: null,
  moveX: 0,//移动距离,
  touchMoveX: 0,//当前移动长度（用于计算移动的距离）
  infoBoxNode: null,//infoBox节点
  infoBoxWidth: 0,//infoBox节点的实际宽度 - 一屏宽
})
watch(props.pileList, () => {
  state.moveX = 0;
  state.infoBoxWidth = 0
})

const moveEnd = async (e: any) => {
  //16为padding值 160为宽
  if (state.infoBoxWidth <= 0) {
    state.infoBoxWidth = (160 + 16) * infoBox.value.childNodes.length - infoBox.value.offsetWidth
  }
  if (state.moveX >= 0) {
    //脱拽到头
    state.moveX = 0
  } else if (state.infoBoxWidth < 0) {
    state.moveX = 0
  } else if (state.moveX <= (0 - state.infoBoxWidth)) {
    //拖拽到尾部
    state.moveX = 0 - state.infoBoxWidth
  }
  // this.touchMoveX = 0;
  setTimeout(() => {
    //  避免滑动与点击冲突
    state.touchMoveX = 0;
  }, 200)
}

const initHammer = () => {
  let square:any = document.getElementById('square')
  state.hammer = new Hammer(square)
  state.hammer.on('panleft', (e: any) => {
    //  向左拖动
    state.moveX -= Math.abs(e.distance - state.touchMoveX);
    state.touchMoveX = e.distance;
  });
  state.hammer.on('panright', (e: any) => {
    //向右拖动
    state.moveX += Math.abs(e.distance - state.touchMoveX);
    state.touchMoveX = e.distance;
  });
  state.hammer.on('panend', moveEnd)
}
//  选择的泊位
const choseItem = (index: number) => {
  //判断是否在滑动中
  if (state.touchMoveX !== 0) return false
  emit('chosePile', (props.pileList as any)[index])
}
//  左右移动
const moveBox = (type: 'left' | 'right') => {
  if (state.infoBoxWidth <= 0) {
    // -2是因为vue添加了两个text节点
    state.infoBoxWidth = (160 + 16) * (infoBox.value.childNodes.length - 2) - infoBox.value.offsetWidth
  }
  let move = 0;
  //一步的距离
  let oneStep = 160 + 16
  switch (type) {
    case 'left':
      //左移
      if (state.moveX !== 0)
          //  还没到头。左移一格
        move = state.moveX + oneStep
      if (move > 0) {
        //  超出
        state.moveX = 0
      } else state.moveX = move
      break;
    case 'right':
      console.log()
      //右移
      if (state.moveX >= (0 - state.infoBoxWidth))
          //  还没到底。右移一格
        move = state.moveX - oneStep
      if (state.infoBoxWidth>0 && move < (0 - state.infoBoxWidth) )
          //  超出
        state.moveX = 0 - state.infoBoxWidth

      else state.moveX = move
      break;
  }
}

onMounted(() => {
  // initHammer()
})
</script>

<style scoped lang='scss'>
.station-detail-box {
  position: relative;
  user-select: none;
  margin: 0 70px;
  width: calc(100% - 140px);
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  z-index: 9;
}

.station-detail-box-icon-box {
  position: absolute;
  top: 32px;
  left: 0;
  width: 100%;
  height: calc(100% - 32px);
  display: flex;
  align-items: center;

  .left-icon,
  .right-icon {
    position: absolute;
    display: inline-block;
    height: 0;
    font-size: 30px;
    color: #999999;
    cursor: pointer;

    &:active {
      color: #0c93e9;
    }
  }

  .left-icon {
    left: 20px;
  }

  .right-icon {
    right: 20px;
  }
}

.info-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  &-animate {
    transition: 0.3s ease-out;
  }
}

.stationBox {
  height: 120px !important;
  width: 160px;
  font-size: 12px;
  color: #FFFFFF;
  padding: 10px 0;
  box-sizing: border-box;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  white-space: nowrap;

  p {
    padding: 0 10px;
    margin: 0;
  }

  p:first-child {
    padding: 0 5px !important;
    text-align: left;
    font-weight: bold;
    margin-bottom: 10px;
    //z-index: 10;
    //position: relative;
  }
}

.box-item {
  position: relative;
  min-width: 160px;
  max-width: 160px;
  height: calc(100% - 20rem);
  // margin: 4rem;
  background-color: rgba(#000000, 0.4);
  margin-right: 16px;
  padding: 0 8px;
  box-sizing: border-box;
}

//避免子元素被选中，解决图片可拖动
//.box-item::after {
//  content: '';
//  position: absolute;
//  top: 0;
//  left: 0;
//  min-width: 160px;
//  max-width: 230rem;
//  height: 100%;
//}

// 空泊位
.free-berth {
  position: relative;
  width: 100%;
  height: 124px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  overflow: hidden;
  //justify-content: center;
  padding: 8px 0px;
}

.info-item {
  width: 100%;
  height: 124px;
  display: flex;
  flex-wrap: wrap;
  padding: 8px 0px;
  cursor: pointer;

  .no-plate {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item-top {
    width: 100%;
    // height: 40%;
    padding: 0 16px;
    // background-color: green;
    .top-box {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }

  .item-bot {
    flex: 1;
    color: #fff;
    padding: 10px 0 0 20px;
    font-size: 10px;
  }

  .item-bot2 {
    flex: 1;
    color: #f47920;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 10px;
  }
}
</style>
