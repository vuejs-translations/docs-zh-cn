---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# 深入响应式系统 {#reactivity-in-depth}

Vue 最有区别性的功能就是其潜藏于底层的响应式系统。组件状态都是响应式的 JavaScript 对象。当更改它们时，视图会随即更新。这让状态管理更加简单直观，但理解它是如何工作的也是很重要的，以避免一些常见的陷阱。在本节中，我们将深入研究 Vue 响应性系统的一些底层细节。

## 什么是响应性 {#what-is-reactivity}

这个术语最近在编程中经常出现，但人们说它的时候究竟是想表达什么意思呢？响应性是一种可以使我们声明式地处理变化的编程范式。一个常见的典型例子是 Excel 电子表格，它是一个很好的例子。

<SpreadSheet />

这里单元格 A2 中的值是通过公式 `= A0 + A1` 来定义的 (你可以在 A2 上点击来查看或编辑该公式)，因此最终得到的值为 3。没有任何的惊喜，但你可以试着更改 A0 或 A1，你会注意到 A2 也会随即自动更新。

而 JavaScript 一般不会这样工作。如果我们在 JavaScript 写类似的逻辑：

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // 仍然是 3
```

当我们更改 `A0` 后，`A2` 不会自动更新。

那么我们如何在 JavaScript 中做到这一点呢？首先，为了能重新运行计算的代码来更新 `A2`，我们需要将其包装为一个函数：

```js
let A2

function update() {
  A2 = A0 + A1
}
```

然后，我们需要定义几个术语：

- 这个 `update()` 函数会产生一个**副作用**，或者就简称为**作用**，因为它会更改程序里的状态。

- `A0` 和 `A1` 被视为这个作用的**依赖**，因为它们的值被用来执行这个作用。因此这次作用也可以说是一个它依赖的**订阅者**。

我们需要一个魔法函数，能够在 `A0` 或 `A1` (这两个**依赖**) 变化时调用 `update()` (产生**作用**)。

```js
whenDepsChange(update)
```

这个 `whenDepsChange()` 函数有如下的任务：

1. 当一个变量被读取时进行追踪。例如我们执行了表达式 `A0 + A1` 的计算，则 `A0` 和 `A1` 都被读取到了。

2. 如果一个变量在当前运行的副作用中被读取了，就将该副作用设为此变量的一个订阅者。例如由于 `A0` 和 `A1` 在 `update()` 执行时被访问到了，则 `update()` 需要在第一次调用之后成为 `A0` 和 `A1` 的订阅者。

3. 探测一个变量的变化。例如当我们给 `A0` 赋了一个新的值后，应该通知其所有订阅了的副作用重新执行。

## Vue 中的响应性是如何工作的 {#how-reactivity-works-in-vue}

我们无法直接追踪对上述示例中局部变量的读写过程，在原生 JavaScript 中没有提供这样一种机制。**但是**，我们是可以追踪一个**对象的属性**进行读和写的。

在 JavaScript 中有两种劫持属性访问的方式：[getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)/[setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) 和 [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。Vue 2 使用 getter/setters 完全由于需支持更旧版本浏览器的限制。而在 Vue 3 中使用了 Proxy 来创建响应式对象，将 getter/setter 用于 ref。下面的伪代码将会说明它们是如何工作的：

```js{4,8,17,21}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      trigger(target, key)
      target[key] = value
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      trigger(refObject, 'value')
      value = newValue
    }
  }
  return refObject
}
```

:::tip
这里和下面的代码片段旨在以最简单的形式解释核心概念，因此省略了许多细节，忽略了边界情况。
:::

这解释了我们在基础章节部分讨论过的一些事情：

- 当你将一个响应性对象的属性解构为一个局部变量时，响应性就会“断开连接”，因为对局部变量的访问不再触发 get / set 代理捕获。

- 从 `reactive()` 返回的代理尽管行为上表现得像原始对象，但我们通过使用 `===` 运算符还是能够比较出它们的不同。

在 `track()` 内部，我们会检查当前是否有正在运行的副作用。如果有，我们会查找到一个所有追踪了该属性的订阅者，它们存储在一个 Set 中，然后将当前这个副作用添加到该 Set 中。

```js
// 这会在一个副作用就要运行之前被设置
// 我们会在后面处理它
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

副作用订阅将被存储在一个全局的 `WeakMap<target, Map<key, Set<effect>>>` 数据结构中。如果在第一次追踪时没有找到对相应属性订阅的副作用集合，它将会在这里新建。这就是 `getSubscribersForProperty()` 函数所做的事。为了简化描述，我们跳过了它其中的细节。

在 `trigger()` 之中，我们会再查找到该属性的所有订阅副作用。但这一次我们是去调用它们：

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

现在让我们回到 `whenDepsChange()` 函数中：

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

它包装了原先的 `update` 函数到一个副作用中，并在运行实际的更新之前，将它自己设为当前活跃的副作用。而在更新期间开启的 `track()` 调用，都将能定位到这个当前活跃的副作用。

此时，我们已经创建了一个能自动跟踪其依赖关系的副作用，它会在依赖关系更改时重新运行。我们称其为**响应式副作用**。

Vue 提供了一个 API 来让你创建响应式副作用 [`watchEffect()`](/api/reactivity-core.html#watcheffect)。事实上，你会发现它的使用方式和我们上面示例中说的魔法函数 `whenDepsChange()` 非常相似。我们可以用真正的 Vue API 改写上面的例子：

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // 追踪 A0 和 A1
  A2.value = A0.value + A1.value
})

// 将触发副作用
A0.value = 2
```

使用一个响应式副作用来更改一个 ref 并不是最优解，事实上使用计算属性会更直观简洁：

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

在内部，`computed` 会使用响应式副作用来管理失效与重新计算的过程。

那么，常见的响应式副作用的用例是什么呢？自然是更新 DOM！我们可以像下面这样实现一个简单的“响应式渲染”：

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `计数：${count.value}`
})

// 更新 DOM
count.value++
```

实际上，这与 Vue 组件保持状态和 DOM 同步的方式非常接近。每个组件实例创建一个响应式副作用来渲染和更新 DOM。当然，Vue 组件使用了比 `innerHTML` 更高效的方式来更新 DOM。这会在[渲染机制](./rendering-mechanism)一章中详细介绍。

<div class="options-api">

`ref()`、`computed()` 和 `watchEffect()` 这些 API 都是组合式 API 的一部分，如果你至今只使用过选项式 API，那么你需要知道的是组合式 API 更贴近 Vue 底层的响应式系统。事实上，Vue 3 中的选项式 API 正是基于组合式 API 建立的。对该组件实例 (`this`) 所有的属性访问都会触发 getter/setter 的响应式追踪，而像 `watch` 和 `computed` 这样的选项也是在内部调用相应等价的组合式 API。

</div>

## 运行时 vs. 编译时响应性 {#runtime-vs-compile-time-reactivity}

Vue 的响应式系统基本是基于运行时的。追踪和触发都是在浏览器中运行时进行的。运行时响应性的优点是，它可以在没有构建步骤的情况下工作，而且边缘情况较少。另一方面，这使得它受到了 JavaScript 语法的制约。

我们在前面的示例中已经说到了所遇到的一个限制：JavaScript 并没有提供一种方式来拦截对局部变量的读写，因此我们始终只能够以对象属性的形式访问响应式状态，也就因此有了响应式对象和 ref。

我们已经在通过[响应性语法糖](/guide/extras/reactivity-transform.html)这一实验性功能去尝试减少冗余代码：

```js
let A0 = $ref(0)
let A1 = $ref(1)

// 在变量读取时追踪
const A2 = $computed(() => A0 + A1)

// 在变量写入时触发
A0 = 2
```

这个代码段会被编译成没有该转换时的样子，即自动地为所有变量引用处添加上 `.value`。有了响应性语法糖，Vue 的响应式系统更加如虎添翼。

## 响应性调试 {#reactivity-debugging}

Vue 的响应性系统可以自动跟踪依赖关系，但在某些情况下，我们可能希望确切地知道正在跟踪什么，或者是什么导致了组件重新呈现。

### 组件调试钩子 {#component-debugging-hooks}

我们可以在一个组件渲染时调试查看哪些依赖正在被使用，以及使用 <span class="options-api">`renderTracked`</span><span class="composition-api">`onRenderTracked`</span> 和 <span class="options-api">`renderTriggered`</span><span class="composition-api">`onRenderTriggered`</span> 生命周期钩子来确定哪个依赖正在触发更新。这些钩子都会收到一个调试事件，其中包含了所需依赖的信息。推荐在回调中放置一个 `debugger` 语句，使你可以在开发者工具中交互式地查看依赖：

<div class="composition-api">

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```

</div>

:::tip
组件调试钩子仅会在开发模式下工作
:::

调试事件对象有如下的类型定义：

<span id="debugger-event"></span>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### 计算属性调试 {#computed-debugging}

<!-- TODO options API equivalent -->

我们可以向 `computed()` 传入第二个参数，是一个包含了 `onTrack` 和 `onTrigger` 两个回调函数的对象：

- `onTrack` 将在响应属性或引用作为依赖项被跟踪时被调用。
- `onTrigger` 将在侦听器回调被依赖项的变更触发时被调用。

这两个回调都会作为组件调试的钩子，接受[相同格式](#debugger-event)的调试事件：

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // 当 count.value 被追踪为依赖时触发
    debugger
  },
  onTrigger(e) {
    // 当 count.value 被更改时触发
    debugger
  }
})

// 访问 plusOne，会触发 onTrack
console.log(plusOne.value)

// 更改 count.value，应该会触发 onTrigger
count.value++
```

:::tip
计算属性的 `onTrack` 和 `onTrigger` 选项仅会在开发模式下工作。
:::

### 侦听器调试 {#watcher-debugging}

<!-- TODO options API equivalent -->

和 `computed()` 类似，侦听器也支持 `onTrack` 和 `onTrigger` 选项：

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip
侦听器的 `onTrack` 和 `onTrigger` 选项仅会在开发模式下工作。
:::

## 与其他状态系统集成 {#integration-with-external-state-systems}

Vue 的响应性系统是通过深度转换纯 JavaScript 对象到响应式代理来实现的。这种深度转换可以是不必要的，或者在集成其他外部状态管理系统时甚至是我们不想要的 (例如，一个外部的解决方案也用了 Proxy)。

将 Vue 的响应性系统与外部状态管理方案集成的总体意见是：将外部状态放在一个 [`shallowRef`](/api/reactivity-advanced.html#shallowref) 中。一个浅层的 ref 中只有它的 `.value` 属性本身被访问时才是有响应性的，而不关心它内部的值。当外部状态改变时，替换此 ref 的 `.value` 才会触发更新。

### 不可变数据 {#immutable-data}

如果你正在实现一个撤销/重做的功能，你可能想要对用户编辑时应用的状态进行快照记录。然而，如果状态树很大的话，Vue 的可变响应性系统没法很好地处理这种情况，因为在每次更新时都序列化整个状态对象对 CPU 和内存开销来说都是非常昂贵的。

[不可变数据结构](https://en.wikipedia.org/wiki/Persistent_data_structure)通过永不更改状态对象来解决这个问题。与 Vue 不同的是，它会创建一个新对象，保留旧的对象未发生改变的一部分。在 JavaScript 中有多种不同的方式来使用不可变数据，但我们推荐使用 [Immer](https://immerjs.github.io/immer/) 搭配 Vue，因为它使你可以在保持原有直观、可变的语法的同时，使用不可变数据。

我们可以通过一个简单的组合式函数来集成 Immer：

```js
import produce from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZUltbWVyIH0gZnJvbSAnLi9pbW1lci5qcydcbiAgXG5jb25zdCBbaXRlbXMsIHVwZGF0ZUl0ZW1zXSA9IHVzZUltbWVyKFtcbiAge1xuICAgICB0aXRsZTogXCJMZWFybiBWdWVcIixcbiAgICAgZG9uZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgIHRpdGxlOiBcIlVzZSBWdWUgd2l0aCBJbW1lclwiLFxuICAgICBkb25lOiBmYWxzZVxuICB9XG5dKVxuXG5mdW5jdGlvbiB0b2dnbGVJdGVtKGluZGV4KSB7XG4gIHVwZGF0ZUl0ZW1zKGl0ZW1zID0+IHtcbiAgICBpdGVtc1tpbmRleF0uZG9uZSA9ICFpdGVtc1tpbmRleF0uZG9uZVxuICB9KVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHVsPlxuICAgIDxsaSB2LWZvcj1cIih7IHRpdGxlLCBkb25lIH0sIGluZGV4KSBpbiBpdGVtc1wiXG4gICAgICAgIDpjbGFzcz1cInsgZG9uZSB9XCJcbiAgICAgICAgQGNsaWNrPVwidG9nZ2xlSXRlbShpbmRleClcIj5cbiAgICAgICAge3sgdGl0bGUgfX1cbiAgICA8L2xpPlxuICA8L3VsPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLmRvbmUge1xuICB0ZXh0LWRlY29yYXRpb246IGxpbmUtdGhyb3VnaDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJpbW1lclwiOiBcImh0dHBzOi8vdW5wa2cuY29tL2ltbWVyQDkuMC43L2Rpc3QvaW1tZXIuZXNtLmpzP21vZHVsZVwiXG4gIH1cbn0iLCJpbW1lci5qcyI6ImltcG9ydCBwcm9kdWNlIGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgc2hhbGxvd1JlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUltbWVyKGJhc2VTdGF0ZSkge1xuICBjb25zdCBzdGF0ZSA9IHNoYWxsb3dSZWYoYmFzZVN0YXRlKVxuICBjb25zdCB1cGRhdGUgPSAodXBkYXRlcikgPT4ge1xuICAgIHN0YXRlLnZhbHVlID0gcHJvZHVjZShzdGF0ZS52YWx1ZSwgdXBkYXRlcilcbiAgfVxuXG4gIHJldHVybiBbc3RhdGUsIHVwZGF0ZV1cbn0ifQ==)

### 状态机 {#state-machines}

[状态机](https://en.wikipedia.org/wiki/Finite-state_machine)是一种数据模型，用于描述应用程序可能处于的所有可能状态，以及从一种状态转换到另一种状态的所有可能方式。虽然对于简单的组件来说，这可能有些小题大做了，但它的确可以使得复杂的状态流更加健壮和易于管理。

JavaScript 中一个最受欢迎的状态机实现方案就是 [XState](https://xstate.js.org/)。这里是集成它的一个例子：

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZU1hY2hpbmUgfSBmcm9tICcuL21hY2hpbmUuanMnXG4gIFxuY29uc3QgW3N0YXRlLCBzZW5kXSA9IHVzZU1hY2hpbmUoe1xuICBpZDogJ3RvZ2dsZScsXG4gIGluaXRpYWw6ICdpbmFjdGl2ZScsXG4gIHN0YXRlczoge1xuICAgIGluYWN0aXZlOiB7IG9uOiB7IFRPR0dMRTogJ2FjdGl2ZScgfSB9LFxuICAgIGFjdGl2ZTogeyBvbjogeyBUT0dHTEU6ICdpbmFjdGl2ZScgfSB9XG4gIH1cbn0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cInNlbmQoJ1RPR0dMRScpXCI+XG4gICAge3sgc3RhdGUubWF0Y2hlcyhcImluYWN0aXZlXCIpID8gXCJPZmZcIiA6IFwiT25cIiB9fVxuICA8L2J1dHRvbj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJ4c3RhdGVcIjogXCJodHRwczovL3VucGtnLmNvbS94c3RhdGVANC4yNy4wL2VzL2luZGV4LmpzP21vZHVsZVwiXG4gIH1cbn0iLCJtYWNoaW5lLmpzIjoiaW1wb3J0IHsgY3JlYXRlTWFjaGluZSwgaW50ZXJwcmV0IH0gZnJvbSAneHN0YXRlJ1xuaW1wb3J0IHsgc2hhbGxvd1JlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1hY2hpbmUob3B0aW9ucykge1xuICBjb25zdCBtYWNoaW5lID0gY3JlYXRlTWFjaGluZShvcHRpb25zKVxuICBjb25zdCBzdGF0ZSA9IHNoYWxsb3dSZWYobWFjaGluZS5pbml0aWFsU3RhdGUpXG4gIGNvbnN0IHNlcnZpY2UgPSBpbnRlcnByZXQobWFjaGluZSlcbiAgICAub25UcmFuc2l0aW9uKChuZXdTdGF0ZSkgPT4gKHN0YXRlLnZhbHVlID0gbmV3U3RhdGUpKVxuICAgIC5zdGFydCgpXG4gIGNvbnN0IHNlbmQgPSAoZXZlbnQpID0+IHNlcnZpY2Uuc2VuZChldmVudClcblxuICByZXR1cm4gW3N0YXRlLCBzZW5kXVxufSJ9)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) 是一个用于处理异步事件流的库。[VueUse](https://vueuse.org/) 库提供了 [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) 扩展来支持连接 RxJS 流与 Vue 的响应性系统。
