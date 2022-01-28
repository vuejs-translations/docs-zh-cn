<script setup>
let x = $ref(0)
function onMousemove(e) {
  x = e.clientX
}
</script>

<template>
  <div
    @mousemove="onMousemove"
    :style="{ backgroundColor: `hsl(${x}, 80%, 50%)` }"
    class="demo movearea"
  >
    <p>移动鼠标穿过这个 div...</p>
    <p>x: {{ x }}</p>
  </div>
</template>

<style>
.movearea {
  color: #fff;
  transition: 0.3s background-color ease;
  border: none;
}
</style>
