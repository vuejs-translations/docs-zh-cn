---
aside: deep
---

# 可组合函数 {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip
这一章假设你已经对组合式 API 有了一个基本的了解。如果你只学习过选项式 API，你可以通过侧边栏左上角的切换按钮将 API 风格切换为组合式 API，然后重新阅读 [响应性基础](/guide/essentials/reactivity-fundamentals.html) 和 [生命周期钩子](/guide/essentials/lifecycle.html) 两个章节。
:::

## 什么是一个 "可组合函数"? {#what-is-a-composable}

在 Vue 应用的概念中，一个 “可组合函数” 是一个利用组合式 API 来封装可重用 **有状态逻辑** 的函数。

当构建前端应用时，我们常常需要重用一些任务逻辑。举个例子，我们需要在很多地方格式化时间，为此我们抽取出了一个可重用的函数。这个格式化函数封装了 **无状态的逻辑**：取得一些输入值然后立刻返回所期望的输出。有许多这样的封装了无状态逻辑的库，比如 [lodash](https://lodash.com/) 和 [date-fns](https://date-fns.org/) 等，你可能已经听说过它们了。

相比之下，有状态逻辑中需要管理随时可能发生变化的状态。一个简单的例子是跟踪当前鼠标在页面中的位置。在真实应用中，它也可以是更复杂的逻辑，如触摸手势或与数据库的连接状态。

## 鼠标跟踪器示例 {#mouse-tracker-example}

如果我们要直接在组件中使用组合式 API 实现鼠标跟踪功能，它会是这样的:

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

但是，如果我们想在多个组件中重用相同的逻辑呢？我们可以将逻辑提取到一个外部文件中，作为一个可组合函数:

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

下面是它在组件中使用的方式:

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

正如我们所看到的，核心逻辑保持完全相同，我们只需要将其移动到一个外部函数中，将要暴露的状态返回即可。和在组件中一样，你也可以在可组合函数中使用 [组合式 API 函数](/api/#composition-api)，现在任意组件中都可以使用 `useMouse()` 的功能了。

最酷也最有趣的一点是，你还可以将多个可组合函数进行嵌套：一个可组合函数可以调用一个或多个其他的可组合函数。这使得我们可以通过组合多个较小的函数、独立的单元来实现复杂的逻辑，这与我们使用组件来组合一整个大型应用类似。实际上，这也正是我们打算命名这套 API 模式 为组合式 API 的原因。

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

And now our `useMouse()` can be simplified to:

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
每一个调用 `useMouse()` 的组件实例会创建其独有的 `x`、`y` 状态拷贝，因此他们不会互相影响。如果你想要在组件之间共享状态，请阅读 [状态管理](/guide/scaling-up/state-management.html) 这一章。
:::

## 异步状态示例 {#async-state-example}

`useMouse()` 可组合函数没有接收任何参数，因此让我们再来看一个需要接收一个参数的可组合函数示例。当需要做异步数据请求时，我们常常会需要处理不同的状态：加载中、加载成功和加载失败。

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

`useFetch()` 接收一个静态的 URL 字符串作为输入，所以它只执行一次请求，然后就完成了。但如果我们想让他在 URL 变化时重新请求呢？那我们可以使用一个 ref 作为其参数：

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

这个版本的 `useFetch()` 现在同时可以接收静态的 URL 字符串和 URL 字符串的 ref。当它通过 [`isRef()`](/api/reactivity-utilities.html#isref) 检测到 URL 是一个 ref 时，它会通过 [`watchEffect()`](/api/reactivity-core.html#watcheffect) 启动一个响应式的副作用。该副作用会立刻运行一次，然后跟踪 URL ref 的变化，将其作为此过程的依赖。一旦 URL ref 变化了，数据就会被重置并重新发起请求。

这里是一个 [升级版的 `useFetch()`](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgY29tcHV0ZWQgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyB1c2VGZXRjaCB9IGZyb20gJy4vdXNlRmV0Y2guanMnXG5cbmNvbnN0IGJhc2VVcmwgPSAnaHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3RvZG9zLydcbmNvbnN0IGlkID0gcmVmKCcxJylcbmNvbnN0IHVybCA9IGNvbXB1dGVkKCgpID0+IGJhc2VVcmwgKyBpZC52YWx1ZSlcblxuY29uc3QgeyBkYXRhLCBlcnJvciwgcmV0cnkgfSA9IHVzZUZldGNoKHVybClcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIExvYWQgcG9zdCBpZDpcbiAgPGJ1dHRvbiB2LWZvcj1cImkgaW4gNVwiIEBjbGljaz1cImlkID0gaVwiPnt7IGkgfX08L2J1dHRvbj5cblxuXHQ8ZGl2IHYtaWY9XCJlcnJvclwiPlxuICAgIDxwPk9vcHMhIEVycm9yIGVuY291bnRlcmVkOiB7eyBlcnJvci5tZXNzYWdlIH19PC9wPlxuICAgIDxidXR0b24gQGNsaWNrPVwicmV0cnlcIj5SZXRyeTwvYnV0dG9uPlxuICA8L2Rpdj5cbiAgPGRpdiB2LWVsc2UtaWY9XCJkYXRhXCI+RGF0YSBsb2FkZWQ6IDxwcmU+e3sgZGF0YSB9fTwvcHJlPjwvZGl2PlxuICA8ZGl2IHYtZWxzZT5Mb2FkaW5nLi4uPC9kaXY+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJ1c2VGZXRjaC5qcyI6ImltcG9ydCB7IHJlZiwgaXNSZWYsIHVucmVmLCB3YXRjaEVmZmVjdCB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZldGNoKHVybCkge1xuICBjb25zdCBkYXRhID0gcmVmKG51bGwpXG4gIGNvbnN0IGVycm9yID0gcmVmKG51bGwpXG5cbiAgYXN5bmMgZnVuY3Rpb24gZG9GZXRjaCgpIHtcbiAgICAvLyByZXNldCBzdGF0ZSBiZWZvcmUgZmV0Y2hpbmcuLlxuICAgIGRhdGEudmFsdWUgPSBudWxsXG4gICAgZXJyb3IudmFsdWUgPSBudWxsXG4gICAgXG4gICAgLy8gcmVzb2x2ZSB0aGUgdXJsIHZhbHVlIHN5bmNocm9ub3VzbHkgc28gaXQncyB0cmFja2VkIGFzIGFcbiAgICAvLyBkZXBlbmRlbmN5IGJ5IHdhdGNoRWZmZWN0KClcbiAgICBjb25zdCB1cmxWYWx1ZSA9IHVucmVmKHVybClcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gYXJ0aWZpY2lhbCBkZWxheSAvIHJhbmRvbSBlcnJvclxuICBcdCAgYXdhaXQgdGltZW91dCgpXG4gIFx0ICAvLyB1bnJlZigpIHdpbGwgcmV0dXJuIHRoZSByZWYgdmFsdWUgaWYgaXQncyBhIHJlZlxuXHQgICAgLy8gb3RoZXJ3aXNlIHRoZSB2YWx1ZSB3aWxsIGJlIHJldHVybmVkIGFzLWlzXG4gICAgXHRjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmxWYWx1ZSlcblx0ICAgIGRhdGEudmFsdWUgPSBhd2FpdCByZXMuanNvbigpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3IudmFsdWUgPSBlXG4gICAgfVxuICB9XG5cbiAgaWYgKGlzUmVmKHVybCkpIHtcbiAgICAvLyBzZXR1cCByZWFjdGl2ZSByZS1mZXRjaCBpZiBpbnB1dCBVUkwgaXMgYSByZWZcbiAgICB3YXRjaEVmZmVjdChkb0ZldGNoKVxuICB9IGVsc2Uge1xuICAgIC8vIG90aGVyd2lzZSwganVzdCBmZXRjaCBvbmNlXG4gICAgZG9GZXRjaCgpXG4gIH1cblxuICByZXR1cm4geyBkYXRhLCBlcnJvciwgcmV0cnk6IGRvRmV0Y2ggfVxufVxuXG4vLyBhcnRpZmljaWFsIGRlbGF5XG5mdW5jdGlvbiB0aW1lb3V0KCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjMpIHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKCdSYW5kb20gRXJyb3InKSlcbiAgICAgIH1cbiAgICB9LCAzMDApXG4gIH0pXG59In0=)，出于演示目的，人为地设置了一个延迟和随机误差。

## 约定和最佳实践 {#conventions-and-best-practices}

### 命名 {#naming}

约定将可组合函数命名为以 “use” 开头的函数。

### 输入参数 {#input-arguments}

一个可组合函数可以接收 ref 作为参数，即使并不依赖其响应性。如果你正在编写一个提供给其他开发者使用的可组合函数，最好处理输入参数是 ref 而不是原始值。[`unref()`](/api/reactivity-utilities.html#unref) 工具函数在此时带来极大方便：

```js
import { unref } from 'vue'

function useFeature(maybeRef) {
  // 若 maybeRef 的确是一个 ref，它的 .value 会被返回
  // 否则返回其本身
  const value = unref(maybeRef)
}
```

如果你的可组合函数期望使用一个 ref 为参数启动一个 `watchEffect()`，请确保使用 `watch()` 显式地监听此 ref ，或者在副作用回调中调用 `unref()` 以保证其被追踪为依赖。

### 返回值 {#return-values}

你可能已经注意到了，我们一直在可组合函数中使用 `ref()` 而不是 `reactive()`。约定推荐始终从可组合函数中返回一个包含 ref 的对象，这样在对象解构时可以 [保持响应性](/guide/extras/reactivity-in-depth.html#retaining-reactivity)：

```js
// x 和 y 是两个 ref
const { x, y } = useMouse()
```

从可组合函数返回一个响应式对象会导致对象解构时丢失与可组合函数内状态的响应性连接。

如果你更想使用可组合函数返回对象的属性，你可以将该返回对象用 `reactive()` 包裹，因而其中的 ref 在访问时会自动解套，举个例子：

```js
const mouse = reactive(useMouse())
// mouse.x 链接到了原来的 x ref
console.log(mouse.x)
```

```vue-html
鼠标位置：{{ mouse.x }}, {{ mouse.y }}
```

### 副作用 {#side-effects}

在可组合函数中的确可以执行副作用（例如：添加 DOM 事件监听器或者请求数据），但请注意以下规则：

- 如果你在一个应用程序中使用了 [服务器端渲染](/guide/extras/ssr.html)（SSR），请确保在后置加载的声明钩子上执行 DOM 相关的副作用，例如： `onMounted()`。这些钩子仅会在浏览器中使用，因此可以确保能访问到 DOM。

- 确保在 `onUnmounted()` 时清理副作用。举个例子，如果一个可组合函数设置了一个事件监听器，它就应该在 `onUnmounted()` 中被移除（就像我们在 `useMouse()` 示例中看到的一样）。当然也可以使用一个可组合函数来自动帮你做这些事，例如之前的 `useEventListener()` 示例。

### 使用限制 {#usage-restrictions}

可组合函数应该在 `<script setup>` 或 `setup()` 钩子中始终被 **同步地** 调用。在某些场景下，你可能也需要在生命周期钩子（比如 `onMounted()`）中使用。

这些是 Vue 能够确定当前活动组件实例的上下文。对活动组件实例的访问是必要的，所以：

1. 可以在可组合函数中注册生命周期钩子

2. 计算属性和监听器可以链接到当前组件实例，以便在组件卸载时处理掉。

:::tip
若想要在使用了 `await` 之后还可以调用可组合函数，只能在 `<script setup>` 里。编译器会自动地在异步操作之后自动地为你恢复当前活跃的组件实例。
:::

## 抽取可组合函数实现代码整理 {#extracting-composables-for-code-organization}

抽取可组合函数不仅是为了可重用，更是为了更好地管理代码。随着你的组件复杂度增高，你可能会最终发现组件太大，难以浏览和推理。组合式 API 给予了我们足够的灵活性来管理你的组件代码，可以基于逻辑关注点将其拆分为更小的函数：

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = iseFeatureC(baz)
</script>
```

在某种程度上，您可以将这些提取的可组合函数看作是可以相互通信的组件范围内的服务。

## 在选项式 API 中使用可组合函数 {#using-composables-in-options-api}

如果你正在使用选项式 API，可组合函数必须在 `setup()` 中调用，若某处要绑定某个可组合函数的返回值，必须将要在 `setup()` 中返回，这样才能将其暴露给 `this` 上下文和模板：

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
  // ...其它选项
}
```

## 与其他技巧的比较 {#comparisons-with-other-techniques}

### vs. 混入 {#vs-mixins}

Vue 2 的用户可能会对 [混入（mixins）](/api/options-composition.html#mixins) 选项比较属性，它使得我们可以抽取组件逻辑到可重用的单元。然而混入有两个短板：

1. **不清晰的属性来源**：当使用了多个混入时，无法清晰得知某个组件实例是来自哪个混入，使我们很难追溯其实现和理解组件的行为。这也是我们推荐在可组合函数中使用 ref + 解构模式的原因：这样可以使属性来源在消费者组件中更清晰易懂。

2. **名称空间冲突**：来自不同作者的多个混入可能不小心注册了相同的属性名，会造成名称空间冲突。使用可组合函数，你可以在解构时很方便地重命名变量，以区分不同可组合函数得到的属性。

3. **隐式的多个混入间交流**：多个需要相互作用的混入必须依赖共享的属性 key，这使得它们隐性地耦合在一起。有了可组合函数，其返回的值可以作为参数传入另一个可组合函数，就像普通的函数那样。

由于上面的几种原因，我们不再推荐在 Vue 3 中继续使用混入。保留该功能只是为了迁移升级需要和旧版用户熟悉的原因。

### vs. 无渲染组件 {#vs-renderless-components}

在组件插槽一章中，我们讨论过了基于作用域插槽的 [无渲染组件](/guide/components/slots.html#renderless-components)。我们甚至用它实现了一样的鼠标追踪器示例。

可组合函数相对于无渲染组件的主要优势是：可组合函数不会产生额外的组件实例开销。当在整个应用程序中使用时，由无渲染组件创建的额外组件实例所带来的性能消耗是无法忽略的。

推荐的做法是用可组合函数来封装纯逻辑，而要同时重用视图布局和逻辑时再使用无渲染组件。

### vs. React Hooks {#vs-react-hooks}

如果你有过开发 React 的经验，你可能注意到可组合函数和自定义 React hooks 非常类似。组合式 API 一部分灵感也正来自于 React hooks，Vue 的可组合函数也的确在逻辑组合方面和 React hooks 类似。然而，Vue 的可组合函数是基于 Vue 细粒度的响应式系统，这和 React hooks 的执行模型有本质上的不同。关于此中细节的更多讨论请参见 [组合式 API FAQ](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## 延伸阅读 {#further-reading}

- [深入了解响应性](/guide/extras/reactivity-in-depth.html)：从更底层的角度理解 Vue 的响应式系统是如何工作的。
- [状态管理](/guide/scaling-up/state-management.html)：了解管理多个组件间共享状态的模式。
- [VueUse](https://vueuse.org/)：一个不断增长的 Vue 可组合函数的集合。它的源代码本身就是一份不错的学习资料。
