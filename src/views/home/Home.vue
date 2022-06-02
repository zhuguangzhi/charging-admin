<script setup lang="ts">
import PageLayout from "@/layout/PageLayout"

const keepAlive: any[] = []
</script>

<template>
  <div class="k-home">
    <PageLayout>
      <router-view v-slot="{ Component }">
        <transition name="slide-fade">
          <keep-alive :include="keepAlive">
            <component :is="Component"></component>
          </keep-alive>
        </transition>
      </router-view>
    </PageLayout>
  </div>
</template>

<style lang="less" scoped>
.k-home{
  height: 100%;
  width: 100%;
}

/* 可以为进入和离开动画设置不同的持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>