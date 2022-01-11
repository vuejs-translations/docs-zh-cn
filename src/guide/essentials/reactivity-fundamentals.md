---
aside: deep
---

# 响应式基础 {#reactivity-fundamentals}

:::tip API 参考
本页和其他很多之后的页面中都分别包含了选项式 API 和组合式 API 的示例代码。现在你选择的是 <span class="options-api">选项式 API</span><span class="composition-api">组合式 API</span>。你可以使用左侧侧边栏顶部的 “API 偏好” 开关在 API 风格之间切换。
:::

## 声明响应式状态 {#declaring-reactive-state}

<div class="options-api">

选用选项式 API 时，会用 `data` 选项来定义组件的响应式状态。此选项的值应为返回一个对象的函数。Vue 将会在创建新组件实例的时候调用此函数，并将其包裹、转换为响应式。此对象以 `$data` 的形式存储在组件实例上。为了方便，任何此对象的顶层属性也都会直接暴露到组件实例上（也即方法和生命周期钩子中的 `this`）。

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` 是生命周期钩子，之后我们会讲到
  mounted() {
    // `this` 指向当前组件实例
    console.log(this.count) // => 1

    // 数据属性也可以被更改
    this.count = 2
  }
}
```

[在 Playground 中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDFcbiAgICB9XG4gIH0sXG5cbiAgLy8gYG1vdW50ZWRgIGlzIGEgbGlmZWN5Y2xlIGhvb2sgd2hpY2ggd2Ugd2lsbCBleHBsYWluIGxhdGVyXG4gIG1vdW50ZWQoKSB7XG4gICAgLy8gYHRoaXNgIHJlZmVycyB0byB0aGUgY29tcG9uZW50IGluc3RhbmNlLlxuICAgIGNvbnNvbGUubG9nKHRoaXMuY291bnQpIC8vID0+IDFcblxuICAgIC8vIGRhdGEgY2FuIGJlIG11dGF0ZWQgYXMgd2VsbFxuICAgIHRoaXMuY291bnQgPSAyXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIENvdW50IGlzOiB7eyBjb3VudCB9fVxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

这些实例上的属性仅在首次创建时被添加，因此你需要确保它们都出现在 `data` 函数返回的对象上。若所需的值还未准备好，在必要时也可以使用 `null`、`undefined` 或者其他一些占位的值。

也可以不在 `data` 上定义，直接向组件实例添加新属性。但这个属性将无法触发响应式更新。

Vue 在组件实例上暴露其内置 API 一般使用 `$` 作为前缀。同时也在内部属性上使用 `_` 前缀。你应该避免使用顶层 `data` 上任何以这些字符作前缀的属性。

### 响应式代理 vs. 原始值 \* {#reactive-proxy-vs-original}

在 Vue 3 中，得益于 [JavaScript Proxy（代理）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的能力，数据是响应式的。从 Vue 2 而来的用户可能需要注意下面这样的边界情况：

```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```

当你在赋值后再访问 `this.someObject`，此值已经是原来的 `original` 的一个响应式代理。**和 Vue 2 不同，原始的 `newObject` 不会变为响应式：确保始终通过 `this.` 来访问响应式状态。**

</div>

<div class="composition-api">

我们可以使用 [`reactive()`](/api/reactivity-core.html#reactive) 方法创建一个响应式对象：

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

响应式对象其实是 [JavaScript Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，行为表现与一般对象并无二致。不同之处在于 Vue 能够跟踪对响应式对象属性的访问与更改操作。如果你对这其中的细节感到好奇，我们在 [深入响应式系统](/guide/extras/reactivity-in-depth.html) 一章中会进行解释，但我们推荐你先读完这里的主要指引。

你也可以看看：[为响应式对象标注类型](/guide/typescript/composition-api.html#typing-reactive)。 <Badge type="ts" text="TS" />

要在组件模板中使用响应式状态，请在 `setup()` 函数中定义并返回。

```js{5,9-11}
import { reactive } from 'vue'

export default {
  // `setup` 是一个专门用于组合式 API 的特殊钩子
  setup() {
    const state = reactive({ count: 0 })

    // 暴露 state 到模板
    return {
      state
    }
  }
}
```

```vue-html
<div>{{ state.count }}</div>
```

相似地，我们也可以在这个作用域下定义更改响应式状态的函数，并作为一个方法与 state 一道被暴露出去：

```js{7-9,14}
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({ count: 0 })

    function increment() {
      state.count++
    }

    // 不要忘了同时暴露 increment 函数
    return {
      count,
      increment
    }
  }
}
```

暴露的方法通常会被用作事件监听器：

```vue-html
<button @click="increment">
  {{ state.count }}
</button>
```

### `<script setup>` \*\*

在 `setup()` 函数中手动暴露状态和方法非常繁琐。好消息是，你可以通过使用构建工具来简化该操作。当使用单文件组件（SFC）时，我们可以使用 `<script setup>` 来简化大量样板代码。

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })

function increment() {
  state.count++
}
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

[在 Playground 尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBzdGF0ZSA9IHJlYWN0aXZlKHsgY291bnQ6IDAgfSlcblxuZnVuY3Rpb24gaW5jcmVtZW50KCkge1xuICBzdGF0ZS5jb3VudCsrXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPlxuICAgIHt7IHN0YXRlLmNvdW50IH19XG4gIDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

`<script setup>` 内的顶层的导入和变量声明都将在相应组件的模板上自动生效。

> 接下来的指引中，我们基本上都会在组合式 API 示例中使用单文件组件 + `<script setup>` 的语法，因为大多数 Vue 开发者都会这样使用。

</div>

<div class="options-api">

## 声明方法 \* {#declaring-methods}

要为组件添加方法，我们需要用到 `methods` 选项。它应是一个对象，包含所有方法：

```js{7-11}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // 在其他方法或是生命周期中也可以调用方法
    this.increment()
  }
}
```

Vue 自动为 `methods` 中的方法绑定了永远指向组件实例的 `this`。这确保了方法在作为事件监听器或回调函数时始终保持正确的 `this`。你不应该在定义 `methods` 时使用箭头函数，因为这会阻止 Vue 的自动绑定。

```js
export default {
  methods: {
    increment: () => {
      // BAD: no `this` access here!
    }
  }
}
```

和其他组件实例上的属性一样，方法也可以在木板上被访问。在模板中它们常常被用作事件监听器：

```vue-html
<button @click="increment">{{ count }}</button>
```

[在 Playground 尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDBcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBpbmNyZW1lbnQoKSB7XG4gICAgICB0aGlzLmNvdW50KytcbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5pbmNyZW1lbnQoKVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPnt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

在上面的例子中，`increment` 方法会在 `<button>` 被点击时调用。

</div>

### DOM 更新时机 {#dom-update-timing}

当你更改响应式状态后，DOM 会自动地更新。然而，你得注意 DOM 的更新并不是同步的。相反，Vue 会将它们推入更新循环的 “下个 tick” 执行以确保无论改变了多少个状态，每个需要更新的组件都只更新一次。

若要等待一个状态改变后的 DOM 更新完成，你可以使用 [nextTick()](/api/general.html#nexttick) 这个全局 API：

<div class="composition-api">

```js
import { nextTick } from 'vue'

function increment() {
  count.value++
  nextTick(() => {
    // 访问更新后的 DOM
  })
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    increment() {
      this.count++
      nextTick(() => {
        // access updated DOM
      })
    }
  }
}
```

</div>

### 深层响应性 {#deep-reactivity}

在 Vue 中，状态都是默认深层响应式的。这意味着即使在更改深层次的对象或数组，你的改动也能被检测到。

<div class="options-api">

```js
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }
    }
  },
  methods: {
    mutateDeeply() {
      // 以下都会按照期望工作
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```

</div>

<div class="composition-api">

```js
import { reactive } from 'vue'

const obj = reactive({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // 以下都会按照期望工作
  obj.nested.count++
  obj.arr.push('baz')
}
```

</div>

也可以创建一个 [浅层 ref](/api/reactivity-advanced.html#shallowref) 和 [浅层响应式对象](/api/reactivity-advanced.html#shallowreactive)。它们仅在顶层具有响应性，一般仅在某些特殊场景中需要。

<div class="composition-api">

### 响应式代理 vs. 原始对象 {#reactive-proxy-vs-original} \*\*

值得注意的是，`reactive()` 返回的是一个源对象的 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，它和源对象是不相等的：

```js
const raw = {}
const proxy = reactive(raw)

// 代理和原始对象不是全等的
console.log(proxy === raw) // false
```

只有代理是响应式的，更改原始的对象不会触发更新。因此，使用 Vue 的响应式系统的最佳实践是 **仅使用代理作为状态**。

为保证访问代理的一致性，对同一个对象调用 `reactive()` 会总是返回同样的dialing，而对代理调用 `reactive()` 则会返回它自己：

```js
// 在同一个对象上调用 reactive() 会返回相同的代理
console.log(reactive(raw) === proxy) // true

// 在一个代理上调用 reactive() 会返回它自己
console.log(reactive(proxy) === proxy) // true
```

这个规则对深层级的对象也适用。依靠深层响应性，响应式对象内的深层级对象依然是代理：

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### `reactive()` 的局限性 \*\* {#limitations-of-reactive}

`reactive()` API 有两条限制：

1. 仅对对象类型有效（对象、数组和 `Map`、`Set` 这样的[集合类型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections)），而对 `string`、`number` 和 `boolean` 这样的 [基础类型](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) 无效。

2. 因为 Vue 的响应式系统是通过属性访问进行追踪的，因此我们必须始终保持对该响应式对象的引用。这意味着我们不可以随意地 “替换” 一个响应式对象：

   ```js
   let state = reactive({ count: 0 })

   // 这将不会按照你的期望工作
   state = reactive({ count: 1 })
   ```

   同时这也意味着把响应式对象的某个基础类型属性传入函数，或是从响应式对象中解构属性时，我们会失去响应性：

   ```js
   const state = reactive({ count: 0 })

   // 函数接受一个纯数字
   // 并不会追踪 state.count 的变化
   callSomeFunction(state.count)

   // count 已经是一个
   // 与 state 响应性失去连接的纯数字
   let { count } = state
   // 不会影响原状态
   count++
   ```

## `ref()` 定义响应式变量 \*\* {#reactive-variables-with-ref}

为了解决 `reactive()` 带来的限制，我们提供了另一个 [`ref()`](/api/reactivity-core.html#ref) 方法来帮我们创建响应式的 **ref**，它可以装载任何值类型：

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` 从参数中获取到值，将其包裹为一个带 `.value` 属性的对象：

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

你也可以看看：[为 ref 标注类型](/guide/typescript/composition-api.html#typing-ref)。 <Badge type="ts" text="TS" />

和响应式对象的属性类似，ref 的 `.value` 属性也是响应式的。同时，当值为对象类型时，会用 `reactive()` 自动转换它的 `.value`。

一个包含对象类型值的 ref 可以响应式地替换整个对象：

```js
const objectRef = ref({ count: 0 })

// 这是响应式的替换
objectRef.value = { count: 1 }
```

ref 被传递给函数或是从一般对象上被解构时，不会丢失响应性：

```js
const obj = {
  foo: ref(1),
  bar: ref(2)
}

// 该函数接收一个 ref
// 需要通过 .value 取值
// 但它会保持响应性
callSomeFunction(obj.foo)

// 仍然是响应式的
const { foo, bar } = obj
```

一言以蔽之，`ref()` 使我们能创造一种对任何值的 "引用" 并能够不丢失响应性地随意传递。这个功能非常重要，因为它经常用于将逻辑提取到 [组合函数](/guide/reusability/composables.html) 中。

### ref 在模板中的解套 \*\* {#ref-unwrapping-in-templates}

当 ref 被暴露给模板、在渲染上下文中被访问时，它们会自动地 “解套” 所以无需使用 `.value`。这里我们再次使用了之前的计数器示例，并使用了 `ref()`。

```vue{13}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }} <!-- no .value needed -->
  </button>
</template>
```

[在 Playground 尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgY291bnQgPSByZWYoMClcblxuZnVuY3Rpb24gaW5jcmVtZW50KCkge1xuICBjb3VudC52YWx1ZSsrXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPnt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

请注意，解套过程仅作用于顶层属性，访问深层级的 ref 则不会解套：

```js
const object = { foo: ref(1) }
```

```vue-html
{{ object.foo }} <!-- does NOT get unwrapped -->
```

We can fix that by making `foo` a top-level property:

```js
const { foo } = object
```

```vue-html
{{ foo }} <!-- properly unwrapped -->
```

Now `foo` will be wrapped as expected.

### ref 在响应式对象中的解套 \*\* {#ref-unwrapping-in-reactive-objects}

当一个 `ref` 作为一个响应式对象的属性被访问或更改时，它会自动解套因此会表现得和一般的属性一样：

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

如果将一个新的 ref 赋值给响应式对象某个已经为 ref 的属性，那么它会替换掉旧的 ref：

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// 原来的 ref 现在已经和 state.count 脱去联系
console.log(count.value) // 1
```

ref 只有在一个响应式对象之内时才会发生解套。当起作为 [浅层响应式对象](/api/reactivity-advanced.html#shallowreactive) 的属性被访问时不会解套。

另外，当从数组或 `Map` 这样的原生集合类型访问 ref 时，不会进行解套。

```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

</div>

<div class="options-api">

### 有状态方法 \* {#stateful-methods}

在某些情况下，我们可能需要动态地创建一个方法函数，比如创建一个预置防抖的事件处理器：

```js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // 使用 Lodash 的防抖函数
    click: debounce(function () {
      // ... 对点击的响应 ...
    }, 500)
  }
}
```

不过这种方法对于被重用的组件来说是有问题的，因为这个预置防抖的函数是 **有状态的**：它在运行时维护着一个内部状态。如果多个组件实例都共享这同一个预置防抖的函数，那么它们之间将会互相影响。

要保持每个组件实例的防抖函数都彼此独立，我们可以改为在 `created` 生命周期钩子中创建这个预置防抖的函数：

```js
export default {
  created() {
    // 每个实例都有了自己的预置防抖的处理函数
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // 最好是在组件卸载时
    // 清除掉防抖计时器
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... 对点击的响应 ...
    }
  }
}
```

</div>

<div class="composition-api">

### 响应性语法糖 <Badge type="warning" text="实验性" /> \*\* {#reactivity-transform}

必须对 ref 使用 `.value` 是一个因受限于 JavaScript 语言能力约束而带来的缺点。然而通过编译时期自动在合适的位置上添加上 `.value` 来改进开发体验。Vue 提供了一个语法糖，在编译时作相应转换，使得我们可以像这样书写上面的计数器示例：

```vue
<script setup>
let count = $ref(0)

function increment() {
  // no need for .value
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

你可以在 [Reactivity Transform](/guide/extras/reactivity-transform.html) 这个专门的章节了解更多细节。请注意它仍处于实验性阶段，在最终提案落地前仍可能发生改动。

</div>
