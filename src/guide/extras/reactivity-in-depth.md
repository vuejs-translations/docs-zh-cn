---
aside: deep
title: 深入响应式系统 <Badge text="WIP" />
---

# 深入响应式系统 <Badge text="WIP" /> {#reactivity-in-depth}

// TODO explain proxies
// TODO explain refs
// TODO explain shallow

是时候进行更深入的学习了！Vue 最独特的功能就正是在于它那不容易被注意到的响应式系统。数据模型（Model）都是被代理的 JavaScript 对象。当你对它们进行更改，视图会相应地更新。这使得状态管理更简单易懂、符合直觉，但为了避免一些常见的问题，了解其工作原理是很重要的。在这一章中，我们将会深入探究一些 Vue 底层响应式系统的细节。

## 什么是响应性 {#what-is-reactivity}

这个术语最近在编程中经常出现，但人们说它的时候究竟是想表达什么意思呢？响应性是一种可以使我们声明式地处理变化的编程范式。一个常见的典型例子是 Excel 电子表格，它是一个很好的例子。

<video width="550" height="400" controls>
  <source src="/images/reactivity-spreadsheet.mp4" type="video/mp4">
  对不起，你的浏览器不支持 video 标签
</video>

如果你在第一个单元格内放置了数字 2、第二个放数字 3，然后使用 SUM 函数，后面的单元格中将会写上所求的和。一切都很好，没有什么意外。但如果你更改了第一个数字，所求的和也会自动地更新。

而 JavaScript 一般不会这样工作。如果我们在 JavaScript 写类似的逻辑：

```js
let val1 = 2
let val2 = 3
let sum = val1 + val2

console.log(sum) // 5

val1 = 3

console.log(sum) // 仍然是 5
```

如果我们更改了第一个值，所求的和并没有跟着调整。

所以在 JavaScript 中我们应该怎么做？

概括地来讲，我们必须能够做到下面几件事：

1. **跟踪值的读取**：例如 `val1 + val2` 读取了 `val1` 和 `val2`。
2. **侦测值的改变**：例如对变量赋值 `val1 = 3`。
3. **重新运行之前对值的读取过程**：再次运行 `sum = val1 + val2` 来更新 `sum` 的值。

我们不能直接使用前一个例子的代码，但我们稍后会回到这个例子，看看如何调整使它兼容 Vue 的响应性系统。

首先，让我们深入研究一下 Vue 是如何实现上述响应性系统核心需求的。

## 如何确定什么代码正在运行 {#how-vue-knows-what-code-is-running}

为了能够在值更改时运行求和函数，我们需要做的第一件事是将这个计算包装为一个函数：

```js
const updateSum = () => {
  sum = val1 + val2
}
```

但是我们如何让这个函数在 Vue 应用中实现效果呢？

Vue 会使用一个 *副作用* 来追踪当前是哪一个函数在运行。一个副作用接收一个函数为参数，在函数被调用之前就开始追踪。Vue 在任何时候都知道正在运行的是什么副作用，并且可以随时按需重新运行它。

要更好地理解这个过程，让我们自己先在不依赖 Vue 的情况下简单地实现一些代码，了解这到底是如何工作的。

我们需要的是一个可以包裹求和函数的东西，就像这样：

```js
createEffect(() => {
  sum = val1 + val2
})
```

我们需要 `createEffect` 对求和函数保持追踪。我们或许会实现出下面这样的代码：

```js
// 维持一个栈，保存的是运行中的副作用
const runningEffects = []

const createEffect = (fn) => {
  // 包裹传入的函数成为副作用
  const effect = () => {
    runningEffects.push(effect)
    fn()
    runningEffects.pop()
  }

  // 立即自动运行该副作用
  effect()
}
```

当该副作用被调用后，它会在调用 `fn` 之前，将自己压入栈 `runningEffects` 之中。任何需要知道当前运行的副作用的地方，都可以检查这个栈数组。

副作用就像是我们众多关键功能的一个起点。举个例子，组件的渲染过程和计算属性更新都是因为内部使用了副作用。若你发现了任何自动响应了数据变更的过程，你都有充分的理由相信它被包裹在了一个副作用中。

虽然 Vue 的公开 API 没有包含任何方式直接创建一个副作用，但的确也提供了一个 `watchEffect` 函数，和上面说的 `createEffect` 函数表现非常相似。

但是知道什么代码正在运行只解答了谜题的一部分。Vue 如何知道副作用使用什么值，以及它如何知道它们何时发生变化？

## Vue 如何追踪变化 {#how-vue-tracks-these-changes}

我们无法跟踪局部变量的重新赋值，就像我们前面的例子中的那些变量一样，JavaScript 本身并没有提供这样一套机制。但我们能追踪的还有对象属性的变更。

当我们从组件的 `data` 函数中返回了一个 JavaScript 对象，Vue 会使用 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 将其包裹，配以 `get` 和 `set` 的处理函数，代理在 ES6 中被颁布，并使得 Vue 3 摆脱了早先版本中的一些响应式的局限性。

<div class="reactivecontent">
  <!-- <common-codepen-snippet title="直观解释代理与 Vue 的响应性系统" slug="VwmxZXJ" tab="result" theme="light" :height="500" :editable="false" :preview="false" /> -->
</div>

这么讲似乎有些太快了，而且需要你有一些关于 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的预备知识才能理解！所以让我们慢慢深入。你可以在网上找到很多关于 Proxy 的文章，但你真正需要了解的其实就是 **Proxy 是封装了一个对象的代理对象，并允许你拦截对所代理对象的任何交互。**

像这样使用：`new Proxy(target, handler)`

```js
const dinner = {
  meal: '鱼香肉丝'
}

const handler = {
  get(target, property) {
    console.log('截获到了！')
    return target[property]
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// 截获到了！
// 鱼香肉丝
```

我们拦截到了对目标对象属性的读取。这样的处理函数也被叫做 _trap_（捕捉）。有许多不同类型的 trap，每一种都处理不同类型的交互。

我们想做的当然不会只是 `console.log`，我们甚至可以 *不* 返回我们想要的值。这也是 Proxy 非常适合用来构建 API 的原因。

学习使用 Proxy 的第一个挑战是实现 Vue 的 `this` 相关绑定。我们想要所有的方法都被绑定到该 Proxy 对象上，而不是目标对象上，因此我们同样可以劫持它们。相应地，ES6 为我们提供了另一个新功能：`Reflect`，使我们事半功倍地解决这个问题：

```js{7}
const dinner = {
  meal: '鱼香肉丝'
}

const handler = {
  get(target, property, receiver) {
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// 鱼香肉丝
```

使用 Proxy 实现响应式系统的第一步就是追踪对属性的读取。我们会在 `get` 处理函数中做这件事，实现一个名为 `track` 的函数，传入的是 `target` 和 `property`：

```js{7}
const dinner = {
  meal: '鱼香肉丝'
}

const handler = {
  get(target, property, receiver) {
    track(target, property)
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// 鱼香肉丝
```

我们并没有在这里将 `track` 函数的实现展示出来。它会检查当前是哪个 *副作用* 在运行，将其与 `target` 和 `property` 一并作记录。Vue 就是这样得知了这个属性是该副作用的一个依赖。

最后，我们需要在属性值改变时重新运行这个副作用。对此在 Proxy 上需要一个 `set` 处理函数：

```js
const dinner = {
  meal: '鱼香肉丝'
}

const handler = {
  get(target, property, receiver) {
    track(target, property)
    return Reflect.get(...arguments)
  },
  set(target, property, value, receiver) {
    trigger(target, property)
    return Reflect.set(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// 鱼香肉丝
```

还记得之前我们罗列的需求列表吗？现在我们有一些 Vue 如何实现这些关键步骤的答案：

1. **跟踪值的读取**：Proxy 的 `get` 处理函数中的 `track` 记录了访问的属性和当前运行的副作用。
2. **侦测值的改变**：Proxy 调用其 `set` 处理函数 is called on the proxy.
3. **重新运行之前对值的读取过程**：`trigger` 函数会找出所有依赖此属性的副作用，并重新运行它们。

被代理的对象对用户是不可见的，在这从本质上开启了 Vue 执行依赖追踪和变更通知的能力。值得注意的一点是控制台会对被代理的对象使用不同的输出格式，所以你可能需要安装 [vue-devtools](https://github.com/vuejs/vue-devtools) 开发工具，获得一个更便于调试检查的界面。

如果我们要用一个组件重写原来的例子，可能会这样做：

```js
const vm = createApp({
  data() {
    return {
      val1: 2,
      val2: 3
    }
  },
  computed: {
    sum() {
      return this.val1 + this.val2
    }
  }
}).mount('#app')

console.log(vm.sum) // 5

vm.val1 = 3

console.log(vm.sum) // 6
```

`data` 函数被包裹在了一个响应式代理中，存储为了 `this.$data`。属性 `this.val1` 和 `this.val2` 分别是 `this.$data.val1` 和 `this.$data.val2` 的别名，所以它们要通过同一个代理。

Vue 会将 `sum` 函数包裹在一个副作用中。当我们想要访问 `this.sum`，它会运行该副作用重新计算值。包裹 `$data` 的响应式代理会追踪副作用中访问到的属性 `val1` 和 `val2`。

在 Vue 3 中，响应式系统也作为了一个 [独立的包](https://github.com/vuejs/vue-next/tree/master/packages/reactivity) 提供给用户。包裹 `$data` 成一个响应式代理的的函数就是 [`reactive`](/api/reactivity-core.html#reactive)。我们可以直接自行调用，响应式代理不一定非要用在组件中：

```js
const proxy = reactive({
  val1: 2,
  val2: 3
})
```

我们会在接下来的几页指引中看到更多由 `reactivity` 包暴露的功能函数，比如我们已经遇到过的 `reactive` 和 `watchEffect`，以及一些使用了其他响应性功能的函数，比如 `computed` 和 `watch`，都无需创建一个组件。

### 被代理对象 {#proxied-objects}

Vue 会在内部追踪所有变为响应式的对象，所以对同一个对象会始终返回相同的代理。

当一个响应式代理访问到一个深层次对象，这个对象 *也会被* 转为一个 Proxy 再返回：

```js{6-7}
const handler = {
  get(target, property, receiver) {
    track(target, property)
    const value = Reflect.get(...arguments)
    if (isObject(value)) {
      // 在响应式代理上嵌套深层次对象
      return reactive(value)
    } else {
      return value
    }
  }
  // ...
}
```

### Proxy 和原始值的区分 {#proxy-vs-original-identity}

使用 Proxy 的另一个注意事项是：代理对象和原始对象是不相等的，即无法通过 `===` 来比较，举个例子：

```js
const obj = {}
const wrapped = new Proxy(obj, handlers)

console.log(obj === wrapped) // false
```

其他依赖于严格相等的比较都会受到影响，比如 `.includes()` 或是 `.indexOf()`。

最佳实践是不要使用原始对象的引用，始终使用响应式的版本：

```js
const obj = reactive({
  count: 0
}) // 不要引用原对象
```

这确保了相等比较和响应性都符合预期。

注意 Vue 不会对基础类型的值（比如数字值或字符串）使用 Proxy，你仍然可以使用 `===` 直接比较这些值：

```js
const obj = reactive({
  count: 0
})

console.log(obj.count === 0) // true
```

### 保持响应性 {#retaining-reactivity}

当我们只想取用一个很大的响应式对象上的一小部分属性时，可能会想到使用解构来获取想要的属性。然而被解构的属性会丢失与代理对象的响应性连接。

```js
const state = reactive({
  count: 0
  // ... 有非常多的属性
})

// `count` 一旦被解构就不是响应式的了
// 因为此时只是个 number 型的值
const { count } = state
```

你可以根据一个响应式对象上的属性值，通过  [`toRef()`](/api/reactivity-utilities.html#toref) 创建一个 ref：

```js
import { toRef } from 'vue'

const count = toRef(state, 'count')

state.count++
console.log(count.value) // 1
```

## 渲染如何响应变化 {#how-rendering-reacts-to-changes}

组件的模板会被编译为一个 [`render`](/guide/extras/render-function.html) 函数。这个 `render` 函数会创建 [VNode](/guide/extras/render-function.html#the-virtual-dom-tree)，描述了组件需要被如何渲染。这杯包裹在一个副作用中，使 Vue 对运行时访问到的这些值进行追踪。

一个 `render` 函数从概念上和 `computed` 属性非常相似。Vue 并不会追踪究竟是如何使用依赖的，它只知道它们在渲染函数运行时的某个时间点被使用。如果发生了任何其他属性的次生更改，将会再次触发副作用、再运行一次，重新运行 `render` 函数来生成新的 VNode。然后对 DOM 进行必要的更改。

<div class="reactivecontent">
  <!-- <common-codepen-snippet title="Second Reactivity with Proxies in Vue 3 Explainer" slug="wvgqyJK" tab="result" theme="light" :height="500" :editable="false" :preview="false" /> -->
</div>

## 响应性调试 {#reactivity-debugging}

Vue 的响应性系统自动地追踪了依赖，但某些场景中，我们可能想要知道究竟追踪了什么，或者是什么造成了组件重渲染。

### 组件调试钩子 {#component-debugging-hooks}

// TODO `renderTracked` and `renderTriggered`

<div class="composition-api">

### 计算属性调试 \*\* {#computed-debugging}

我们可以向 `computed()` 传入第二个参数，是一个包含了 `onTrack` 和 `onTrigger` 两个回调函数的对象：

- `onTrack` 将在响应属性或引用作为依赖项被跟踪时被调用。
- `onTrigger` 将在侦听器回调被依赖项的变更触发时被调用。

这两个回调都会收到一个调试器事件，包含了所需的依赖相关信息。推荐在这些回调中放置一个 `debugger` 语句以便在开发工具中交互式地检查依赖：

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

### 侦听器调试 \*\* {#watcher-debugging}

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

## 副作用失效 \*\* {#side-effect-invalidation} {#side-effect-invalidation}

某些情况下，副作用会是异步的函数，并需要当其失效时被清理（例如：状态在副作用完成前就改变了）。副作用函数中可以使用一个 `onInvalidate` 函数来注册失效时的回调。失效回调应该在以下时机被调用：<!-- TODO: 需要校对此小节 -->

- 副作用可能重新运行时
- 监视器被停止时（例如：当 `watchEffect` 在 `setup()` 或生命周期钩子中使用且组件卸载后）

```js
watchEffect((onInvalidate) => {
  const token = performAsyncOperation(id.value)
  onInvalidate(() => {
    // id 已经改变，或者监视器已经停止
    // 使以前挂起的异步操作无效
    token.cancel()
  })
})
```

我们通过传入的函数注册失效回调，而不是从回调函数返回它，是因为返回值对异步错误处理很重要。在执行数据请求时，副作用函数一般都是异步的：

```js
const data = ref(null)
watchEffect(async (onInvalidate) => {
  onInvalidate(() => {
    /* ... */
  }) // 我们在 Promise 完成前注册清理函数
  data.value = await fetchData(props.id)
})
```

一个异步函数会隐式返回一个 Promise，但清理函数需要在 Promise 完成前立即注册。另外，Vue 也依赖这个返回的 Promise 来自动地处理 Promise 链上潜在的错误。

</div>

## Integration with External State Systems

### State Machines

// TODO `useMachine()` example

### RxJS

The [VueUse](https://vueuse.org/) library provides the [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) add-on for connecting RxJS streams with Vue's reactivity system.
