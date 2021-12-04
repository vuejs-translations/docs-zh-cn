# 监听器 {#watchers}

## 基本示例 {#basic-example}

计算属性允许我们声明性地计算派生值。然而，在有些情况下，我们需要对状态的变化展现出犹如 "副作用" 一般的反应，例如更改 DOM，或基于某异步操作其他状态。

<div class="options-api">

在选项式 API 中，我们可以使用 [`watch` 选项](/api/options-state.html#watch)，每当一个反应式属性发生变化时触发一个函数。

```js
export default {
  data() {
    return {
      question: '',
      answer: '问句通常都会带一个问号。;-)'
    }
  },
  watch: {
    // 只要问题发生变化，这个函数就会运行
    question(newQuestion, oldQuestion) {
      if (newQuestion.indexOf('?') > -1) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.answer = '思考中...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (e) {
        this.answer = '出错了！无法访问该 API。' + error
      }
    }
  }
}
```

```vue-html
<p>
  提一个 Yes/No 的问题：
  <input v-model="question" />
</p>
<p>{{ answer }}</p>
```

[在 Playground 尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcXVlc3Rpb246ICcnLFxuICAgICAgYW5zd2VyOiAnUXVlc3Rpb25zIHVzdWFsbHkgY29udGFpbiBhIHF1ZXN0aW9uIG1hcmsuIDstKSdcbiAgICB9XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgLy8gd2hlbmV2ZXIgcXVlc3Rpb24gY2hhbmdlcywgdGhpcyBmdW5jdGlvbiB3aWxsIHJ1blxuICAgIHF1ZXN0aW9uKG5ld1F1ZXN0aW9uLCBvbGRRdWVzdGlvbikge1xuICAgICAgaWYgKG5ld1F1ZXN0aW9uLmluZGV4T2YoJz8nKSA+IC0xKSB7XG4gICAgICAgIHRoaXMuZ2V0QW5zd2VyKClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBhc3luYyBnZXRBbnN3ZXIoKSB7XG4gICAgICB0aGlzLmFuc3dlciA9ICdUaGlua2luZy4uLidcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3llc25vLnd0Zi9hcGknKVxuICAgICAgICB0aGlzLmFuc3dlciA9IChhd2FpdCByZXMuanNvbigpKS5hbnN3ZXJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5hbnN3ZXIgPSAnRXJyb3IhIENvdWxkIG5vdCByZWFjaCB0aGUgQVBJLiAnICsgZXJyb3JcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxwPlxuICAgIEFzayBhIHllcy9ubyBxdWVzdGlvbjpcbiAgICA8aW5wdXQgdi1tb2RlbD1cInF1ZXN0aW9uXCIgLz5cbiAgPC9wPlxuICA8cD57eyBhbnN3ZXIgfX08L3A+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

`watch` 选项也支持 also supports a dot-delimited path as the key:

```js
export default {
  watch: {
    // 注意：只能是简单的路径，不支持表达式
    'some.nested.key'(newValue) {
      // ...
    }
  }
}
```

</div>

<div class="composition-api">

在组合式 API 中，我们可以使用 [`watch` 方法](/api/reactivity-core.html#watch) 让每次响应式状态变化时都触发一个回调函数执行：

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('问句通常都会带一个问号。;-)')

// 直接监听一个 ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = '思考中...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (e) {
      answer.value = '出错了！无法访问该 API。' + error
    }
  }
})
</script>

<template>
  <p>
    提一个 Yes/No 的问题：
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[在 Playground 尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgd2F0Y2ggfSBmcm9tICd2dWUnXG5cbmNvbnN0IHF1ZXN0aW9uID0gcmVmKCcnKVxuY29uc3QgYW5zd2VyID0gcmVmKCdRdWVzdGlvbnMgdXN1YWxseSBjb250YWluIGEgcXVlc3Rpb24gbWFyay4gOy0pJylcblxud2F0Y2gocXVlc3Rpb24sIGFzeW5jIChuZXdRdWVzdGlvbikgPT4ge1xuICBpZiAobmV3UXVlc3Rpb24uaW5kZXhPZignPycpID4gLTEpIHtcbiAgICBhbnN3ZXIudmFsdWUgPSAnVGhpbmtpbmcuLi4nXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3llc25vLnd0Zi9hcGknKVxuICAgICAgYW5zd2VyLnZhbHVlID0gKGF3YWl0IHJlcy5qc29uKCkpLmFuc3dlclxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGFuc3dlci52YWx1ZSA9ICdFcnJvciEgQ291bGQgbm90IHJlYWNoIHRoZSBBUEkuICcgKyBlcnJvclxuICAgIH1cbiAgfVxufSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxwPlxuICAgIEFzayBhIHllcy9ubyBxdWVzdGlvbjpcbiAgICA8aW5wdXQgdi1tb2RlbD1cInF1ZXN0aW9uXCIgLz5cbiAgPC9wPlxuICA8cD57eyBhbnN3ZXIgfX08L3A+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

### 监听来源类型 {#watch-source-types}

`watch`的第一个参数可以是不同类型的响应式 “源”：它可以是一个 ref（包括计算属性），一个响应式对象，一个函数，或是一个数组表示多个源：

```js
const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个源的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

注意，你不能像这样观察一个响应式对象的属性:

```js
const obj = reactive({ count: 0 })

// 这不会正常工作，因为你是向 watch() 传入了一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```

此时你应该传入一个函数：

```js
// 提供一个获取函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```

</div>

## 深层监听器 {#deep-watchers}

<div class="options-api">

`watch` 默认是浅层的：回调函数仅在被监听的属性被新的值赋值时才执行，而内层的属性变化则不会触发。如果你想要对象内所有层级的更改都触发该回调，那么你需要使用一个深层监听器：

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // 注意：在深层次变更中，
        // 只要对象本身没有被替换，
        // 那么`newValue` 这里和 `oldValue` 就是相同的
      },
      deep: true
    }
  }
}
```

</div>

<div class="composition-api">

当你直接对一个响应式对象调用 `watch()`，会隐式地创建一个深层监听器，回调会在每个层级更改时都被触发：

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // 在深层次属性更改时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})

obj.count++
```

这应该与返回响应式对象的函数有所区别，在后一种情况下，只有在函数返回不同的对象时才会触发回调：

```js
watch(
  () => state.someObject,
  () => {
    // 仅当 state.activeObject 被替换时触发
  }
)
```

You can, however, force the second case into a deep watcher by explicitly using the `deep` option:

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // *除非* state.someObject 被整个替换了
  },
  { deep: true }
)
```

</div>

:::warning 谨慎使用
深度观察需要遍历被观察对象中的所有深层属性，该操作当用于大型数据结构时可能会很昂贵。因此请只在必要时才使用它，并且要注意其性能影响。
:::

<div class="options-api">

## 积极监听 {#eager-watchers}

`watch` 默认是懒监听的：仅在监听源发生更改时才会被调用。但在某些场景中，我们希望该回调函数以积极态运行，举个例子，首先需要请求一些初始数据，之后再在相关状态变化后重新获取。

我们可以通过使用一个带有 `handler` 函数和 `immediate: true` 选项的对象来声明监视器的回调函数，从而强制它立即执行:

```js
export default {
  // ...
  watch: {
    question: {
      handler(newQuestion) {
        // 在组件实例创建时会立即调用
      },
      // 强制积极执行回调
      immediate: true
    }
  }
  // ...
}
```

</div>

<div class="composition-api">

## `watchEffect()` \*\*

`watch()` 是懒执行的：回调函数只有在监听的源更改时才会调用。但某些场景下我们可能希望回调函数能呈积极态调用。举个例子，我们可能会请求一些初始数据，然后在相应状态改变时重新请求。我们可以这样来写：

```js
const url = ref('https://...')
const data = ref(null)

async function fetchData() {
  const response = await fetch(url.value)
  data.value = await response.json()
}

// 立即获取
fetchData()
// ...再监听 url 变化
watch(url, fetchData)
```

这可以通过 [`watchEffect` 方法](/api/reactivity-core.html#watcheffect) 来简化，`watchEffect()` 使我们可以立即执行一次该副作用，并自动追踪依赖。上面的例子可以重写为：

```js
watchEffect(async () => {
  const response = await fetch(url.value)
  data.value = await response.json()
})
```

上面这个例子中，回调会立即执行一次。在执行期间，它会自动追踪 `question.value` 作为依赖（近似于计算属性）。每当 `question.value` 变化时，回调将会再次执行。

你可以查看这个使用 `watchEffect` 的 [这个例子](/examples/#fetching-data)，了解如何在运行时做响应式数据请求。

:::tip
`watchEffect` 仅会在其 **同步** 执行期间追踪依赖。当使用一个异步回调时，只有在第一次 `await` 前被访问的属性会被追踪为依赖。
:::

### `watch` vs. `watchEffect` {#watch-vs-watcheffect}

`watch` 和 `watchEffect` 都给我们提供了创建副作用的能力。它们之间的主要区别是追踪响应式依赖的方式：

- `watch` 只跟踪明确监视的源。它不会跟踪任何在回调中访问到的东西。另外，回调仅会在源确实改变了才会被触发，`watch` 将依赖追踪和副作用区分开，这让我们对如何触发回调有更多的控制权。

- 而 `watchEffect` 则将依赖追踪和副作用耦合，会自动追踪其同步执行过程中访问到的所有响应式属性。这更方便，一般来说代码也会更简洁，但其响应性依赖关系则不那么显式。

</div>

## 副作用刷新时机 {#effect-flush-timing}

当你更改了响应式状态，可能同时触发 Vue 组件更新和你定义的监视器回调。

默认情况下，用户创建的副作用都会在 Vue 组件更新的副作用 **之前** 被调用。这意味着，如果您试图在监视器回调中访问 DOM, DOM 将是 Vue 执行任何更新之前的状态。

如果你想于 Vue 更新之后，在监听器回调中访问 DOM，你需要指明 `flush: 'post'` 选项：

<div class="options-api">

```js
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'post'
    }
  }
}
```

</div>

<div class="composition-api">

```js
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

后置刷新的 `watchEffect()` 也有一个更便捷的别名 `watchPostEffect()`：

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
})
```

</div>

<div class="options-api">

## `this.$watch()` \* {#watch}

我们也可以使用组件实例的 [`$watch()` 方法](/api/component-instance.html#watch) 来命令式地创建一个监听器：

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

当您需要有条件地设置一个监视器，或者只监听响应用户交互的内容时，这会很有用。它还使你可以提前停止监听器。

</div>

## 停止监听器 {#stopping-a-watcher}

<div class="options-api">

由 `watch` 选项和 `$watch()` 实例方法声明的监听器会在宿主组件卸载时自动停止，因此大多数场景下你无需关心要怎么操作来停止它。

在少数情况下，若你的确需要在组件卸载前停止一个监听器，`$watch()` API 会返回一个能这样做的函数：

```js
const unwatch = this.$watch('foo', callback)

// ...当该监听器不再需要时
unwatch()
```

</div>

<div class="composition-api">

在 `setup()` 或 `<script setup>` 同步声明的监听器会和宿主组件绑，也会在组件卸载时自动停止，在大多数场景下你无需关心要怎么操作来停止它。

一个关键点是，监听器必须是被 **同步** 创建的：如果监听器是在异步回调中被创建的，它将不会绑定当前组件为宿主，并且必须手动停止以防内存泄漏，如下方这个例子所示：

```vue
<script setup>
import { watchEffect } from 'vue'

// 这个副作用会在组件卸载时自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

要手动停止一个监听器，请使用返回的处理函数。`watch` 和 `watchEffect` 都是这样：

```js
const unwatch = watchEffect(() => {})

// ...当该监听器不再需要时
unwatch()
```

注意，需要异步创建监视器的情况应该很少，并且应该尽可能首选同步创建。如果需要等待一些异步数据，可以将监听逻辑设置为有条件的：

```js
// 需要异步请求得到的数据
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // 得到数据后要做的事...
  }
})
```

</div>
