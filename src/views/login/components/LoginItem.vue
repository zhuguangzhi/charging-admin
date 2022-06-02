<template>
  <div class="login-element">
    <img class="login-element-bg" src="../../../assets/login/bg.png" alt="">
    <img class="login-element-01" src="../../../assets/login/people.png" alt="">
    <img class="login-element-02" src="../../../assets/login/02.png" alt="">
    <img class="login-element-03" src="../../../assets/login/03.png" alt="">
  </div>
</template>

<script lang="ts">
import anime from 'animejs'
import { defineComponent } from 'vue'
export default defineComponent({
  data(){
    return {
    }
  },
  mounted() {
    anime({
      targets: ['.login-element-02', '.login-element-03'],
      translateY: () => anime.random(10, 30),
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true
    })
    setTimeout(() => {
      anime({
        targets: ['.login-element-01'],
        translateY: () => anime.random(10, 30),
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true
      })
    }, 800)
  },
})
</script>

<style scoped lang="less">
.login-element{
  position: relative;
  width: 900px;
  height: 677px;
  &-bg{
    position: absolute;
    left: 0px;
    top: 0px;
    width: 900px;
    height: 677px;
  }
  &-01{
    position: absolute;
    width: 257px;
    height: 216px;
    left: calc(535px - 110px);
    top: calc(630px - 240px);
  }
  &-02{
    position: absolute;
    width: 299px;
    height: 352px;
    left: calc(740px - 110px);
    top: calc(360px - 240px);
  }
  &-03{
    position: absolute;
    width: 202px;
    height: 442px;
    left: calc(180px - 110px);
    top: calc(360px - 240px);
  }
}

</style>