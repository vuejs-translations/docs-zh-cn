---
title: 路由
---
# 路由 {#routing}

## 官方路由 {#official-router}

<!-- TODO update links -->

对于大多数的单页面应用，都推荐使用官方支持的 [路由库](https://github.com/vuejs/vue-router-next)。要了解更多细节，请查看 vue-router 的 [文档](https://next.router.vuejs.org/)。

## 从头开始实现一个简单的路由 {#simple-routing-from-scratch}

如果你只需要一个简单的页面路由，而不想为此引入一整个路由库，你可以通过 [动态组件](/guide/essentials/component-basics.html#dynamic-components) 的方式，监听浏览器 [`hashchange` 事件](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) 或是使用 [History API](https://developer.mozilla.org/en-US/docs/Web/API/History) 来更新当前组件。

你可以看看这个具备了基本骨架的示例：

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <a href="#/">Home</a> |
  <a href="#/about">关于</a> |
  <a href="#/non-existent-path">无法访问的链接</a>
  <component :is="currentView" />
</template>
```

[在 Playground 中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgY29tcHV0ZWQgfSBmcm9tICd2dWUnXG5pbXBvcnQgSG9tZSBmcm9tICcuL0hvbWUudnVlJ1xuaW1wb3J0IEFib3V0IGZyb20gJy4vQWJvdXQudnVlJ1xuaW1wb3J0IE5vdEZvdW5kIGZyb20gJy4vTm90Rm91bmQudnVlJ1xuXG5jb25zdCByb3V0ZXMgPSB7XG4gICcvJzogSG9tZSxcbiAgJy9hYm91dCc6IEFib3V0XG59XG5cbmNvbnN0IGN1cnJlbnRQYXRoID0gcmVmKHdpbmRvdy5sb2NhdGlvbi5oYXNoKVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsICgpID0+IHtcbiAgY3VycmVudFBhdGgudmFsdWUgPSB3aW5kb3cubG9jYXRpb24uaGFzaFxufSlcblxuY29uc3QgY3VycmVudFZpZXcgPSBjb21wdXRlZCgoKSA9PiB7XG4gIHJldHVybiByb3V0ZXNbY3VycmVudFBhdGgudmFsdWUuc2xpY2UoMSkgfHwgJy8nXSB8fCBOb3RGb3VuZFxufSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxhIGhyZWY9XCIjL1wiPummlumhtTwvYT4gfFxuICA8YSBocmVmPVwiIy9hYm91dFwiPuWFs+S6jjwvYT4gfFxuICA8YSBocmVmPVwiIy9ub24tZXhpc3RlbnQtcGF0aFwiPuaXoOazleiuv+mXrueahOmTvuaOpTwvYT5cbiAgPGNvbXBvbmVudCA6aXM9XCJjdXJyZW50Vmlld1wiIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJIb21lLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGgxPkhvbWU8L2gxPlxuPC90ZW1wbGF0ZT4iLCJBYm91dC52dWUiOiI8dGVtcGxhdGU+XG4gIDxoMT5BYm91dDwvaDE+XG48L3RlbXBsYXRlPiIsIk5vdEZvdW5kLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGgxPjQwNDwvaDE+XG48L3RlbXBsYXRlPiJ9)

</div>

<div class="options-api">

```vue
<script>
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || NotFound
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
		  this.currentPath = window.location.hash
		})
  }
}
</script>

<template>
  <a href="#/">Home</a> |
  <a href="#/about">关于</a> |
  <a href="#/non-existent-path">无法访问的链接</a>
  <component :is="currentView" />
</template>
```

[在 Playground 中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBIb21lIGZyb20gJy4vSG9tZS52dWUnXG5pbXBvcnQgQWJvdXQgZnJvbSAnLi9BYm91dC52dWUnXG5pbXBvcnQgTm90Rm91bmQgZnJvbSAnLi9Ob3RGb3VuZC52dWUnXG5cbmNvbnN0IHJvdXRlcyA9IHtcbiAgJy8nOiBIb21lLFxuICAnL2Fib3V0JzogQWJvdXRcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50UGF0aDogd2luZG93LmxvY2F0aW9uLmhhc2hcbiAgICB9XG4gIH0sXG4gIGNvbXB1dGVkOiB7XG4gICAgY3VycmVudFZpZXcoKSB7XG4gICAgICByZXR1cm4gcm91dGVzW3RoaXMuY3VycmVudFBhdGguc2xpY2UoMSkgfHwgJy8nXSB8fCBOb3RGb3VuZFxuICAgIH1cbiAgfSxcbiAgbW91bnRlZCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsICgpID0+IHtcblx0XHQgIHRoaXMuY3VycmVudFBhdGggPSB3aW5kb3cubG9jYXRpb24uaGFzaFxuXHRcdH0pXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxhIGhyZWY9XCIjL1wiPummlumhtTwvYT4gfFxuICA8YSBocmVmPVwiIy9hYm91dFwiPuWFs+S6jjwvYT4gfFxuICA8YSBocmVmPVwiIy9ub24tZXhpc3RlbnQtcGF0aFwiPuaXoOazleiuv+mXrueahOmTvuaOpTwvYT5cbiAgPGNvbXBvbmVudCA6aXM9XCJjdXJyZW50Vmlld1wiIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJIb21lLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGgxPkhvbWU8L2gxPlxuPC90ZW1wbGF0ZT4iLCJBYm91dC52dWUiOiI8dGVtcGxhdGU+XG4gIDxoMT5BYm91dDwvaDE+XG48L3RlbXBsYXRlPiIsIk5vdEZvdW5kLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGgxPjQwNDwvaDE+XG48L3RlbXBsYXRlPiJ9)

</div>
