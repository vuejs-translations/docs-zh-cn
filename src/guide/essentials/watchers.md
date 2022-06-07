# 侦听器 {#watchers}

## 基本示例 {#basic-example}

计算属性允许我们声明性地计算推导值。然而，在有些情况下，为了应对一些状态的变化，我们需要运行些“副作用”：例如更改 DOM，或者根据异步操作的结果，去修改另一处的状态。

<div class="options-api">

在选项式 API 中，我们可以使用 [`watch` 选项](/api/options-state.html#watch)在每次响应式 property 发生变化时触发一个函数。

```js
export default {
  data() {
    return {
      question: '',
      answer: 'Questions usually contain a question mark. ;-)'
    }
  },
  watch: {
    // 每当 question 改变时，这个函数就会执行
    question(newQuestion, oldQuestion) {
      if (newQuestion.indexOf('?') > -1) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.answer = 'Thinking...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Error! Could not reach the API. ' + error
      }
    }
  }
}
```

```vue-html
<p>
  Ask a yes/no question:
  <input v-model="question" />
</p>
<p>{{ answer }}</p>
```

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcXVlc3Rpb246ICcnLFxuICAgICAgYW5zd2VyOiAnUXVlc3Rpb25zIHVzdWFsbHkgY29udGFpbiBhIHF1ZXN0aW9uIG1hcmsuIDstKSdcbiAgICB9XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgLy8gd2hlbmV2ZXIgcXVlc3Rpb24gY2hhbmdlcywgdGhpcyBmdW5jdGlvbiB3aWxsIHJ1blxuICAgIHF1ZXN0aW9uKG5ld1F1ZXN0aW9uLCBvbGRRdWVzdGlvbikge1xuICAgICAgaWYgKG5ld1F1ZXN0aW9uLmluZGV4T2YoJz8nKSA+IC0xKSB7XG4gICAgICAgIHRoaXMuZ2V0QW5zd2VyKClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBhc3luYyBnZXRBbnN3ZXIoKSB7XG4gICAgICB0aGlzLmFuc3dlciA9ICdUaGlua2luZy4uLidcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3llc25vLnd0Zi9hcGknKVxuICAgICAgICB0aGlzLmFuc3dlciA9IChhd2FpdCByZXMuanNvbigpKS5hbnN3ZXJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMuYW5zd2VyID0gJ0Vycm9yISBDb3VsZCBub3QgcmVhY2ggdGhlIEFQSS4gJyArIGVycm9yXG4gICAgICB9XG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBBc2sgYSB5ZXMvbm8gcXVlc3Rpb246XG4gICAgPGlucHV0IHYtbW9kZWw9XCJxdWVzdGlvblwiIC8+XG4gIDwvcD5cbiAgPHA+e3sgYW5zd2VyIH19PC9wPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

`watch` 选项也支持把键设置成用点号分隔的路径：

```js
export default {
  watch: {
    // 注意：只能是简单的路径，不支持表达式。
    'some.nested.key'(newValue) {
      // ...
    }
  }
}
```

</div>

<div class="composition-api">

在组合式 API 中，我们可以使用 [`watch` 函数](/api/reactivity-core.html#watch)在每次响应式状态发生变化时触发回调函数：

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')

// 可以直接侦听一个 ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgd2F0Y2ggfSBmcm9tICd2dWUnXG5cbmNvbnN0IHF1ZXN0aW9uID0gcmVmKCcnKVxuY29uc3QgYW5zd2VyID0gcmVmKCdRdWVzdGlvbnMgdXN1YWxseSBjb250YWluIGEgcXVlc3Rpb24gbWFyay4gOy0pJylcblxud2F0Y2gocXVlc3Rpb24sIGFzeW5jIChuZXdRdWVzdGlvbikgPT4ge1xuICBpZiAobmV3UXVlc3Rpb24uaW5kZXhPZignPycpID4gLTEpIHtcbiAgICBhbnN3ZXIudmFsdWUgPSAnVGhpbmtpbmcuLi4nXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3llc25vLnd0Zi9hcGknKVxuICAgICAgYW5zd2VyLnZhbHVlID0gKGF3YWl0IHJlcy5qc29uKCkpLmFuc3dlclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhbnN3ZXIudmFsdWUgPSAnRXJyb3IhIENvdWxkIG5vdCByZWFjaCB0aGUgQVBJLiAnICsgZXJyb3JcbiAgICB9XG4gIH1cbn0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBBc2sgYSB5ZXMvbm8gcXVlc3Rpb246XG4gICAgPGlucHV0IHYtbW9kZWw9XCJxdWVzdGlvblwiIC8+XG4gIDwvcD5cbiAgPHA+e3sgYW5zd2VyIH19PC9wPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

### 侦听来源类型 {#watch-source-types}

`watch` 的第一个参数可以是不同形式的“来源”：它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个来源组成的数组：

```js
const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

注意，你不能侦听响应式对象的 property，例如:

```js
const obj = reactive({ count: 0 })

// 这不起作用，因为你向 watch() 传入了一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```

而是用 getter 函数：

```js
// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```

</div>

## 深层侦听器 {#deep-watchers}

<div class="options-api">

`watch` 默认是浅层的：被侦听的 property，仅在被赋新值时，才会触发回调函数——而嵌套 property 的变化不会触发。如果想侦听所有嵌套的变更，你需要深层侦听器：

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // 注意：在嵌套的变更中，
        // 只要没有替换对象本身，
        // 那么这里的 `newValue` 和 `oldValue` 相同
      },
      deep: true
    }
  }
}
```

</div>

<div class="composition-api">

直接给 `watch()` 传入一个响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发：

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // 在嵌套的 property 变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})

obj.count++
```

这不同于返回响应式对象的 getter 函数：只有在 getter 函数返回不同的对象时，才会触发回调：

```js
watch(
  () => state.someObject,
  () => {
    // 仅当 state.someObject 被替换时触发
  }
)
```

然而，在上面的例子里，你可以显式地加上 `deep` 选项，强制转成深层侦听器：

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
深度侦听需要遍历被侦听对象中的所有嵌套的 property，当用于大型数据结构时，开销很大。因此请只在必要时才使用它，并且要留意性能。
:::

<div class="options-api">

## 即时回调的侦听器 {#eager-watchers}

`watch` 默认是懒侦听的：仅在侦听源变化时，才会执行回调。但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调。举个例子，我们想请求一些初始数据，然后在相关状态更改时重新请求数据。

我们可以用一个对象来声明侦听器，这个对象有 `handler` 方法和 `immediate: true` 选项，这样便能强制回调函数立即执行：

```js
export default {
  // ...
  watch: {
    question: {
      handler(newQuestion) {
        // 在组件实例创建时会立即调用
      },
      // 强制立即执行回调
      immediate: true
    }
  }
  // ...
}
```

</div>

<div class="composition-api">

## `watchEffect()` \*\*

`watch()` 是懒执行的：仅在侦听源变化时，才会执行回调。但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调。举个例子，我们想请求一些初始数据，然后在相关状态更改时重新请求数据。我们可以这样写：

```js
const url = ref('https://...')
const data = ref(null)

async function fetchData() {
  const response = await fetch(url.value)
  data.value = await response.json()
}

// 立即获取
fetchData()
// ...再侦听 url 变化
watch(url, fetchData)
```

这段代码还可以用 [`watchEffect` 函数](/api/reactivity-core.html#watcheffect) 来简化。`watchEffect()` 会立即执行一遍回调函数，如果这时函数产生了副作用，Vue 会自动追踪副作用的依赖关系，自动分析出响应源。上面的例子可以重写为：

```js
watchEffect(async () => {
  const response = await fetch(url.value)
  data.value = await response.json()
})
```

这个例子中，回调会立即执行。在执行期间，它会自动追踪 `url.value` 作为依赖（近似于计算属性）。每当 `url.value` 变化时，回调会再次执行。

你可以上手体验[这个例子](/examples/#fetching-data)，它用了 `watchEffect`，还涉及如何做响应式的数据请求。

:::tip
`watchEffect` 仅会在其**同步**执行期间，才追踪依赖。在使用异步回调时，只有在第一个 `await` 正常工作前访问到的 property 才会被追踪。
:::

### `watch` vs. `watchEffect` {#watch-vs-watcheffect}

`watch` 和 `watchEffect` 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：

- `watch` 只追踪明确侦听的源。它不会追踪任何在回调中访问到的东西。另外，仅在响应源确实改变时才会触发回调。`watch` 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。

- `watchEffect`，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式 property。这更方便，而且代码往往更简洁，但其响应性依赖关系不那么明确。

</div>

## 回调的刷新时机 {#callback-flush-timing}

当你更改了响应式状态，它可能会同时触发 Vue 组件更新和侦听器回调。

默认情况下，用户创建的侦听器回调，都会在 Vue 组件更新**之前**被调用。这意味着你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。

如果想在侦听器回调中能访问被 Vue 更新**之后**的DOM，你需要指明 `flush: 'post'` 选项：

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

后置刷新的 `watchEffect()` 有个更方便的别名 `watchPostEffect()`：

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
})
```

</div>

<div class="options-api">

## `this.$watch()` \* {#this-watch}

我们也可以使用组件实例的 [`$watch()` 方法](/api/component-instance.html#watch)来命令式地创建一个侦听器：

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

如果要在特定条件下设置一个侦听器，或者只侦听响应用户交互的内容，这方法很有用。它还允许你提前停止该侦听器。

</div>

## 停止侦听器 {#stopping-a-watcher}

<div class="options-api">

用 `watch` 选项或者 `$watch()` 实例方法声明的侦听器，会在宿主组件卸载时自动停止。因此，在大多数场景下，你无需关心怎么停止它。

在少数情况下，你的确需要在组件卸载之前就停止一个侦听器，这时可以调用 `$watch()` API 返回的函数：

```js
const unwatch = this.$watch('foo', callback)

// ...当该侦听器不再需要时
unwatch()
```

</div>

<div class="composition-api">

在 `setup()` 或 `<script setup>` 中用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。因此，在大多数情况下，你无需关心怎么停止一个侦听器。

一个关键点是，侦听器必须用**同步**语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。如下方这个例子：

```vue
<script setup>
import { watchEffect } from 'vue'

// 它会自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

要手动停止一个侦听器，请调用 `watch` 或 `watchEffect` 返回的函数：

```js
const unwatch = watchEffect(() => {})

// ...当该侦听器不再需要时
unwatch()
```

注意，需要异步创建侦听器的情况很少，请尽可能选择同步创建。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑：

```js
// 需要异步请求得到的数据
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // 数据加载后执行某些操作...
  }
})
```

</div>

<!-- zhlint disabled -->
