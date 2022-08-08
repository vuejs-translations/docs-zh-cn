<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const s = document.createElement('script')
  s.async = true
  s.src = `https://cdn.wwads.cn/js/makemoney.js`
  const el = document.querySelector('.wwads-cn')!
  el?.parentElement?.insertBefore(s, el)
})
</script>

<template>
  <div class="wwads-cn wwads-vertical" data-id="53"></div>
</template>
