<style lang="less" scoped>
// kw-plate
@--plate-color-blue: rgba(79, 158, 238, 1);
@--plate-color-green: rgba(74, 229, 102, 1);
@--plate-color-yellow: rgba(255, 188, 5, 1);
@--plate-color-white: rgba(255, 255, 255, 1);
@--plate-color-black: rgba(0, 0, 0, 1);
@--plate-color-grey: rgba(0, 0, 0, 0.3);

.kw-plate{
  // width: $--plate-width;
  // height: $--plate-height;
  position: relative;
  text-align: center;
  border: 1px solid rgba(153, 153, 153, 0.3);
  .dot{
    width: 4px;
    height: 4px;
    border-radius: 50%;
    position: absolute;
  }
  .dot-top-left{
    top: 3px;
    left: 3px;
  }
  .dot-top-right{
    top: 3px;
    right: 3px;
  }
  .dot-bottom-left{
    bottom: 3px;
    left: 3px;
  }
  .dot-bottom-right{
    bottom: 3px;
    right: 3px;
  }
  .plate-line{
    position: absolute;
    bottom: 4px;
    left: 14px;
    // width: $--plate-width - 28px;
    height: 1px;
    background-color: #fff;
    .line-s{
      position: absolute;
      width: 2px;
      left: 10px;
      height: 1px;
    }
  }
  p{
    // font-size: $--plate-fontsize;
    // line-height: $--plate-height;
    font-weight: 600;
    color: #fff;
  }
}
.kw-plate-blue {
  background-color: @--plate-color-blue;
  .line-s{
    background-color: @--plate-color-blue;
  }
  .dot{
    background-color: #fff;
  }
  .plate-line{
    background-color: #fff;
  }
  p{
    color: #fff;
  }
}
.kw-plate-yellow {
  background-color: @--plate-color-yellow;
  .line-s{
    background-color: @--plate-color-blue;
  }
  .dot{
    background-color: #fff;
  }
  .plate-line{
    background-color: #fff;
  }
  p{
    color: #fff;
  }
}
.kw-plate-green {
  background-color: @--plate-color-green;
  .line-s{
    background-color: @--plate-color-blue;
  }
  .dot{
    background-color: #fff;
  }
  .plate-line{
    background-color: #fff;
  }
  p{
    color: #fff;
  }
}
.kw-plate-white {
  background-color: @--plate-color-white;
  .line-s{
    background-color: @--plate-color-blue;
  }
  .dot{
    background-color: #000;
  }
  .plate-line{
    background-color: #000;
  }
  p{
    color: #000;
  }
}
.kw-plate-black {
  background-color: @--plate-color-black;
  .line-s{
    background-color: @--plate-color-blue;
  }
  .dot{
    background-color: #fff;
  }
  .plate-line{
    background-color: #fff;
  }
  p{
    color: #fff;
  }
}
.kw-plate-grey {
  background-color: @--plate-color-grey;
  .line-s{
    background-color: @--plate-color-blue;
  }
  .dot{
    background-color: #fff;
  }
  .plate-line{
    background-color: #fff;
  }
  p{
    color: #fff;
  }
}
</style>

<template>
  <div class="kw-plate" :class="reversedMessage" :style="{ width: width, height: height }" @click="click">
    <span class="dot dot-top-left"></span>
    <span class="dot dot-top-right"></span>
    <span class="dot dot-bottom-left"></span>
    <span class="dot dot-bottom-right"></span>
    <span class="plate-line" :style="{ width: `calc(${width} - 28px)` }">
      <span class="line-s"></span>
    </span>
    <p :style="{ lineHeight: height, fontSize: fontSize }">{{ plate }}</p>
  </div>
</template>

<script>
const colorEnum = {
  blue: "kw-plate-blue",
  yellow: "kw-plate-yellow",
  green: "kw-plate-green",
  white: "kw-plate-white",
  black: "kw-plate-black",
  other: "kw-plate-grey"
}

export default {
  props: {
    width: {
      type: String,
      default: '90px'
    },
    height: {
      type: String,
      default: '36px'
    },
    fontSize: {
      type: String,
      default: '14px'
    },
    plate: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'other'
    }
  },
  data () {
    return {
      colorEnum: colorEnum
    }
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // console.log('type', this.type);
      // `this` 指向 vm 实例
      if (this.colorEnum[this.color]) {
        return this.colorEnum[this.color]
      } else {
        return this.colorEnum["other"]
      }
    }
  },
  methods: {
    close () {
      this.$emit("close")
    },
    click () {
      this.$emit("click")
    }
  }
};
</script>
