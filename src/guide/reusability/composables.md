# 可组合函数 {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip
这一章假设你已经对组合式 API 有了一个基本的了解。如果你只学习过选项式 API，你可以使用左侧边栏上方的切换按钮将 API 风格切换为组合式 API 后，重新阅读[响应性基础](/guide/essentials/reactivity-fundamentals.html)和[生命周期钩子](/guide/essentials/lifecycle.html)两个章节。
:::

## 什么是“可组合函数”？ {#what-is-a-composable}

在 Vue 应用的概念中，“可组合函数”是一个利用 Vue 组合式 API 来封装和复用**有状态逻辑**的函数。

当构建前端应用时，我们常常需要复用公共任务的逻辑。例如，我们可以为了实现在不同位置格式化时间，抽取一个可复用的函数。这个格式化函数封装了**无状态的逻辑**：它在接收一些输入后，会立刻返回所期望的输出。有很多为了复用无状态逻辑而生的库，你可能有听说它们，例如 [lodash](https://lodash.com/) 和 [date-fns](https://date-fns.org/)。

相比之下，有状态逻辑负责管理会随时变化的状态。一个简单的例子是跟踪当前鼠标在页面中的位置。在真实应用中，它也可以是像触摸手势或与数据库的连接状态这样的更复杂的逻辑。

## 鼠标跟踪器示例 {#mouse-tracker-example}

如果我们要直接在组件中使用组合式 API 实现鼠标跟踪功能，它会是这样的：

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>鼠标位置：{{ x }}, {{ y }}</template>
```

但是，如果我们想在多个组件中复用这个相同的逻辑呢？我们可以把这个逻辑以一个可组合函数的形式提取到外部文件中：

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// 按照惯例，可组合函数名以 “use” 开头
export function useMouse() {
  // 被可组合函数封装和管理的状态
  const x = ref(0)
  const y = ref(0)

  // 可组合函数可以随时更改其状态。
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 一个可组合函数也可以 “挂靠” 宿主组件的生命周期
  // 来启动和卸载副作用
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // 将所管理的状态作为返回值
  return { x, y }
}
```

下面是它在组件中使用的方式：

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>鼠标位置：{{ x }}, {{ y }}</template>
```

<div class="demo">
  鼠标位置：{{ x }}, {{ y }}
</div>

[在 Playground 中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZU1vdXNlIH0gZnJvbSAnLi9tb3VzZS5qcydcblxuY29uc3QgeyB4LCB5IH0gPSB1c2VNb3VzZSgpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICBNb3VzZSBwb3NpdGlvbiBpcyBhdDoge3sgeCB9fSwge3sgeSB9fVxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwibW91c2UuanMiOiJpbXBvcnQgeyByZWYsIG9uTW91bnRlZCwgb25Vbm1vdW50ZWQgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VNb3VzZSgpIHtcbiAgY29uc3QgeCA9IHJlZigwKVxuICBjb25zdCB5ID0gcmVmKDApXG5cbiAgZnVuY3Rpb24gdXBkYXRlKGV2ZW50KSB7XG4gICAgeC52YWx1ZSA9IGV2ZW50LnBhZ2VYXG4gICAgeS52YWx1ZSA9IGV2ZW50LnBhZ2VZXG4gIH1cblxuICBvbk1vdW50ZWQoKCkgPT4gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHVwZGF0ZSkpXG4gIG9uVW5tb3VudGVkKCgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB1cGRhdGUpKVxuXG4gIHJldHVybiB7IHgsIHkgfVxufSJ9)

如你所见，核心逻辑一点都没有被改变，我们做的只是把它移到一个外部函数中去，并返回需要暴露的状态。和在组件中一样，你也可以在可组合函数中使用所有的[组合式 API 函数](/api/#composition-api)。现在，在任何组件中都可以使用 `useMouse()` 功能了。

然而更酷的一点是，你还可以嵌套多个可组合函数：一个可组合函数可以调用一个或多个其他的可组合函数。这使得我们可以像使用多个组件组合成整个应用一样，用多个较小且逻辑独立的单元来组合形成复杂的逻辑。实际上，这正是我们决定将实现了这一设计模式的 API 集合命名为组合式 API 的原因。

举个例子，我们可以将添加和清除 DOM 事件监听器的逻辑放入一个可组合函数中：

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // 如果你想的话，
  // 也可以用字符串形式的 CSS选择器来寻找目标 DOM 元素
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

现在，`useMouse()` 可以被简化为：

```js{3,9-12}
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip
每一个调用 `useMouse()` 的组件实例会创建其独有的 `x`、`y` 状态拷贝，因此他们不会互相影响。如果你想要在组件之间共享状态，请阅读[状态管理](/guide/scaling-up/state-management.html)这一章。
:::

## 异步状态示例 {#async-state-example}

`useMouse()` 可组合函数没有接收任何参数，因此让我们再来看一个需要接收一个参数的可组合函数示例。在做异步数据请求时，我们常常需要处理不同的状态：加载中、加载成功和加载失败。

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">糟糕！出错了：{{ error.message }}</div>
  <div v-else-if="data">
    加载完成：
    <pre>{{ data }}</pre>
  </div>
  <div v-else>加载中...</div>
</template>
```

同样，如果在每个需要获取数据的组件中都要重复这种模式，那就太繁琐了。让我们把它抽取成一个可组合函数：

```js
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

现在在我们的组件中，我们可以这样做：

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

`useFetch()` 接收一个静态的 URL 字符串作为输入，所以它只执行一次请求，然后就完成了。但如果我们想让他在每次 URL 变化时都重新请求呢？那我们可以让它同时允许接收 ref 作为参数：

```js
// fetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // 在请求之前重设状态...
    data.value = null
    error.value = null
    // unref() 解套可能为 ref 的值
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  if (isRef(url)) {
    // 若输入的 URL 是一个 ref，那么启动一个响应式的请求
    watchEffect(doFetch)
  } else {
    // 否则只请求一次
    // 避免监听器的额外开销
    doFetch()
  }

  return { data, error }
}
```

这个版本的 `useFetch()` 现在同时可以接收静态的 URL 字符串和 URL 字符串的 ref。当它通过 [`isRef()`](/api/reactivity-utilities.html#isref) 检测到 URL 是一个动态 ref 时，它会通过 [`watchEffect()`](/api/reactivity-core.html#watcheffect) 启动一个响应式的副作用。该副作用会立刻执行一次，并在此过程中将 URL ref 作为依赖进行跟踪。URL ref 发生改变时，数据就会被重置，并重新请求。

这里是一个[升级版的 `useFetch()`](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgY29tcHV0ZWQgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyB1c2VGZXRjaCB9IGZyb20gJy4vdXNlRmV0Y2guanMnXG5cbmNvbnN0IGJhc2VVcmwgPSAnaHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3RvZG9zLydcbmNvbnN0IGlkID0gcmVmKCcxJylcbmNvbnN0IHVybCA9IGNvbXB1dGVkKCgpID0+IGJhc2VVcmwgKyBpZC52YWx1ZSlcblxuY29uc3QgeyBkYXRhLCBlcnJvciwgcmV0cnkgfSA9IHVzZUZldGNoKHVybClcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIExvYWQgcG9zdCBpZDpcbiAgPGJ1dHRvbiB2LWZvcj1cImkgaW4gNVwiIEBjbGljaz1cImlkID0gaVwiPnt7IGkgfX08L2J1dHRvbj5cblxuXHQ8ZGl2IHYtaWY9XCJlcnJvclwiPlxuICAgIDxwPk9vcHMhIEVycm9yIGVuY291bnRlcmVkOiB7eyBlcnJvci5tZXNzYWdlIH19PC9wPlxuICAgIDxidXR0b24gQGNsaWNrPVwicmV0cnlcIj5SZXRyeTwvYnV0dG9uPlxuICA8L2Rpdj5cbiAgPGRpdiB2LWVsc2UtaWY9XCJkYXRhXCI+RGF0YSBsb2FkZWQ6IDxwcmU+e3sgZGF0YSB9fTwvcHJlPjwvZGl2PlxuICA8ZGl2IHYtZWxzZT5Mb2FkaW5nLi4uPC9kaXY+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJ1c2VGZXRjaC5qcyI6ImltcG9ydCB7IHJlZiwgaXNSZWYsIHVucmVmLCB3YXRjaEVmZmVjdCB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZldGNoKHVybCkge1xuICBjb25zdCBkYXRhID0gcmVmKG51bGwpXG4gIGNvbnN0IGVycm9yID0gcmVmKG51bGwpXG5cbiAgYXN5bmMgZnVuY3Rpb24gZG9GZXRjaCgpIHtcbiAgICAvLyByZXNldCBzdGF0ZSBiZWZvcmUgZmV0Y2hpbmcuLlxuICAgIGRhdGEudmFsdWUgPSBudWxsXG4gICAgZXJyb3IudmFsdWUgPSBudWxsXG4gICAgXG4gICAgLy8gcmVzb2x2ZSB0aGUgdXJsIHZhbHVlIHN5bmNocm9ub3VzbHkgc28gaXQncyB0cmFja2VkIGFzIGFcbiAgICAvLyBkZXBlbmRlbmN5IGJ5IHdhdGNoRWZmZWN0KClcbiAgICBjb25zdCB1cmxWYWx1ZSA9IHVucmVmKHVybClcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gYXJ0aWZpY2lhbCBkZWxheSAvIHJhbmRvbSBlcnJvclxuICBcdCAgYXdhaXQgdGltZW91dCgpXG4gIFx0ICAvLyB1bnJlZigpIHdpbGwgcmV0dXJuIHRoZSByZWYgdmFsdWUgaWYgaXQncyBhIHJlZlxuXHQgICAgLy8gb3RoZXJ3aXNlIHRoZSB2YWx1ZSB3aWxsIGJlIHJldHVybmVkIGFzLWlzXG4gICAgXHRjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmxWYWx1ZSlcblx0ICAgIGRhdGEudmFsdWUgPSBhd2FpdCByZXMuanNvbigpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3IudmFsdWUgPSBlXG4gICAgfVxuICB9XG5cbiAgaWYgKGlzUmVmKHVybCkpIHtcbiAgICAvLyBzZXR1cCByZWFjdGl2ZSByZS1mZXRjaCBpZiBpbnB1dCBVUkwgaXMgYSByZWZcbiAgICB3YXRjaEVmZmVjdChkb0ZldGNoKVxuICB9IGVsc2Uge1xuICAgIC8vIG90aGVyd2lzZSwganVzdCBmZXRjaCBvbmNlXG4gICAgZG9GZXRjaCgpXG4gIH1cblxuICByZXR1cm4geyBkYXRhLCBlcnJvciwgcmV0cnk6IGRvRmV0Y2ggfVxufVxuXG4vLyBhcnRpZmljaWFsIGRlbGF5XG5mdW5jdGlvbiB0aW1lb3V0KCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjMpIHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKCdSYW5kb20gRXJyb3InKSlcbiAgICAgIH1cbiAgICB9LCAzMDApXG4gIH0pXG59In0=)，出于演示目的，人为地设置了一个延迟和随机误差。

## 约定和最佳实践 {#conventions-and-best-practices}

### 命名 {#naming}

可组合函数约定用驼峰命名法命名，并以“use”作为开头。

### 输入参数 {#input-arguments}

可组合函数虽然不依赖 ref 来实现响应性，但可以接收 ref 作为参数。因此如果你正在编写一个提供给其他开发者使用的可组合函数，处理好输入参数不是数值而是 ref 的情形会是个很好的选择。为了做到这一点，[`unref()`](/api/reactivity-utilities.html#unref) 工具函数会派上用场：

```js
import { unref } from 'vue'

function useFeature(maybeRef) {
  // 若 maybeRef 确实是一个 ref，它的 .value 会被返回
  // 否则，maybeRef 会被原样返回
  const value = unref(maybeRef)
}
```

如果你的可组合函数在接收 ref 为参数时会产生相应式作用，请确保使用 `watch()` 显式地监听此 ref，或者在 `watchEffect()` 中调用 `unref()` 来进行恰当的追踪。

### 返回值 {#return-values}

你可能已经注意到了，我们一直在可组合函数中使用 `ref()` 而不是 `reactive()`。约定推荐始终从可组合函数中返回一个包含 ref 的对象，这样在组建中进行解构时可以[保持响应性](/guide/extras/reactivity-in-depth.html#retaining-reactivity)：

```js
// x 和 y 是两个 ref
const { x, y } = useMouse()
```

从可组合函数返回一个响应式对象会导致在对象解构过程中丢失与可组合函数内状态的响应性连接。与之相反，ref 则可以维持这一响应性连接。

如果你更希望以对象的属性的形式从可组合函数中返回状态，你可以将要返回的对象用 `reactive()` 包裹，这样其中的 ref 会被自动解套，例如：

```js
const mouse = reactive(useMouse())
// mouse.x 链接到了原来的 x ref
console.log(mouse.x)
```

```vue-html
鼠标位置：{{ mouse.x }}, {{ mouse.y }}
```

### 副作用 {#side-effects}

在可组合函数中的确可以执行副作用 (例如：添加 DOM 事件监听器或者请求数据)，但请注意以下规则：

- 如果你在一个应用中使用了[服务器端渲染](/guide/scaling-up/ssr.html) (SSR)，请确保在后置加载的声明钩子上执行 DOM 相关的副作用，例如：`onMounted()`。这些钩子仅会在浏览器中使用，因此可以确保能访问到 DOM。

- 确保在 `onUnmounted()` 时清理副作用。举个例子，如果一个可组合函数设置了一个事件监听器，它就应该在 `onUnmounted()` 中被移除 (就像我们在 `useMouse()` 示例中看到的一样)。当然也可以像之前的`useEventListener()` 示例那样，使用一个可组合函数来自动帮你做这些事。

### 使用限制 {#usage-restrictions}

可组合函数在 `<script setup>` 或 `setup()` 钩子中，始终应被**同步地**调用。在某些场景下，你也可以在像 `onMounted()` 这样的生命周期钩子中使用。

这些是 Vue 得以确定当前活跃的组件实例的条件。有能力对活跃的组件实例进行访问是必要的，以便：

1. 可以在可组合函数中注册生命周期钩子

2. 计算属性和监听器可以连接到当前组件实例，以便在组件卸载时处理掉。

:::tip
`<script setup>` 是你在使用了 `await` 之后唯一可以调用可组合函数的地方。编译器会自动地在异步操作之后自动地为你恢复当前活跃的组件实例。
:::

## 抽取可组合函数实现代码整理 {#extracting-composables-for-code-organization}

抽取可组合函数不仅是为了复用，也是为了代码管理。随着你的组件复杂度增高，你可能会最终发现组件大到难以阅读和理解。组合式 API 会给予你足够的灵活性，让你可以基于逻辑问题将组建代码拆分成更小的函数：

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

在某种程度上，你可以将这些提取出的可组合函数看作是可以相互通信的组件范围内的服务。

## 在选项式 API 中使用可组合函数 {#using-composables-in-options-api}

如果你正在使用选项式 API，可组合函数必须在 `setup()` 中调用。如果要绑定某个可组合函数的返回值，必须将要在 `setup()` 中返回，这样才能将其暴露给 `this` 上下文和模板：

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() 暴露的属性可以在 `this` 上下文中访问到
    console.log(this.x)
  }
  // ...其他选项
}
```

## 与其他技巧的比较 {#comparisons-with-other-techniques}

### vs. 混入 {#vs-mixins}

Vue 2 的用户可能会对[混入 (mixins)](/api/options-composition.html#mixins) 选项比较熟悉。它也让我们能够把组件逻辑提取到可复用的单元里。然而混入有三个主要的短板：

1. **不清晰的Property来源**：当使用了多个混入时，无法清晰得知某个实例 property 来自哪个混入，会导致代码实现难以追溯，组件行为难以理解。这也是我们推荐在可组合函数中使用 ref + 解构模式的理由：这样可以让 property 的来源在消费者组件中一目了然。

2. **命名空间冲突**：来自不同作者的多个混入可能会注册相同的 property 键名，造成命名空间冲突。若使用可组合函数，你可以通过在解构变量时对变量进行重命名来避免相同的键名。

3. **隐式的多个混入间交流**：多个混入必须依赖共享的 property 键名来进行相互作用，这使得它们隐性地耦合在一起。有了可组合函数，从一个可组合函数中返回的值可以像普通函数那样被传递给其他的变量。

基于上述理由，我们不再推荐在 Vue 3 中继续使用混入。保留该功能只是为了项目迁移的需求和照顾熟悉它的用户。

### vs. 无渲染组件 {#vs-renderless-components}

在组件插槽一章中，我们讨论过了基于作用域插槽的[无渲染组件](/guide/components/slots.html#renderless-components)。我们甚至用它实现了一样的鼠标追踪器示例。

可组合函数相对于无渲染组件的主要优势是：可组合函数不会产生额外的组件实例开销。当在整个应用中使用时，由无渲染组件产生的额外组件实例会带来无法忽视的性能开销。

推荐的做法是在需要复用纯逻辑时使用组合式函数，在需要同时复用逻辑和视图布局时使用无渲染组建。

### vs. React Hooks {#vs-react-hooks}

如果你有 React 的开发经验，你可能注意到可组合函数和自定义 React hooks 非常相似。组合式 API 的一部分灵感正来自于 React hooks，Vue 的可组合函数也的确在逻辑组合能力上与 React hooks 相近。然而，Vue 的可组合函数是基于 Vue 细粒度的响应性系统，这和 React hooks 的执行模型有本质上的不同。这一话题在[组合式 API FAQ](/guide/extras/composition-api-faq#comparison-with-react-hooks) 中有更细致的讨论。

## 延伸阅读 {#further-reading}

- [深入响应性原理](/guide/extras/reactivity-in-depth.html)：理解 Vue 响应性系统的底层细节。
- [状态管理](/guide/scaling-up/state-management.html)：多个组件间共享状态的管理模式。
- [测试可组合函数](/guide/scaling-up/testing.html#testing-composables)：可组合函数的单元测试技巧。
- [VueUse](https://vueuse.org/)：一个日益增长的 Vue 可组合函数集合。源代码本身就是一份不错的学习资料。
