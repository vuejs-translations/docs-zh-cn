<script setup>
import { reactive } from 'vue'

const items = reactive([1, 2, 3, 4, 5])
let nextNum = items.length + 1

function add() {
  items.splice(randomIndex(), 0, nextNum++)
}

function remove() {
  items.splice(randomIndex(), 1)
}

function randomIndex() {
  return Math.floor(Math.random() * items.length)
}
</script>

<template>
  <div class="demo">
    <button @click="add">在任意位置添加一项</button>
    <button @click="remove">移除任意位置上的一项</button>
    <TransitionGroup name="list" tag="ul" style="margin-top: 20px">
      <li v-for="item in items" :key="item">
        {{ item }}
      </li>
    </TransitionGroup>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
