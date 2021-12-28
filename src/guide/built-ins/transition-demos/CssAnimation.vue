<script setup>
let show = $ref(true)
</script>

<template>
  <div class="demo">
    <button @click="show = !show">切换</button>
    <Transition name="bounce">
      <p v-if="show" style="margin-top: 20px; text-align: center;">
        你好！你会看到这里正在跳跃！
      </p>
    </Transition>
  </div>
</template>

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
