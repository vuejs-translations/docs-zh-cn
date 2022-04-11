# 组合式 API：setup()  {#composition-api-setup}

:::info 注意
这篇文档所讲的是组件 `setup` 选项的使用方式。如果你正在搭配单文件组件使用组合式 API，建议使用更简洁好用的 [`<script setup>`](/api/sfc-script-setup.html) 语法糖。
:::

`setup()` 这个钩子在以下情况下，作为组件中使用组合式 API 的入口。

1. 不搭配构建步骤使用组合 API
2. 在选项式 API 组件中集成基于组合式 API 的代码。

## 基本使用 {#basic-usage}

我们可以使用 [响应性 API](./reactivity-core.html) 来声明响应式的状态，并可以将其在 `setup()` 函数的返回值对象上，以此暴露给模板。在其他的选项中，返回值对象上的属性同样会作为组件实例的属性：<!-- 译者备注：（原文问题）这里是否使用选项和是否在组件实例上可用并没有因果关系，因此对 if 从句作了意译 -->

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // 暴露给模板和 API 钩子的其他选项
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

注意从 `setup` 返回的 [ref](/api/reactivity-core.html#ref) 在模板上访问时会 [自动浅层解包](/guide/essentials/reactivity-fundamentals.html#ref-unwrapping-in-templates) 因此你无须再在模板中为它写 `.value`。当通过 `this` 访问时也会同样如此解包。

:::tip
`setup()` 自身并不含对组件实例的访问权，即在 `setup()` 中访问 `this` 会是 `null`。你可以从选项式 API 中访问由组合式 API 暴露的值，但反过来则不行。
:::

## 访问 Props  {#accessing-props}

`setup` 函数的第一个参数是组件的 `props`。和标准的组件一致，一个 `setup` 函数的 `props` 是响应式的，并且会在传入新的 props 时同步更新。

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

注意如果你从 `props` 对象上解构，被解构的变量将会丢失响应性。因此我们推荐通过 `props.xxx` 的形式来使用其中的属性。

如果你确实需要从 props 上解构，或者想要将某个 prop 传入到一个外部函数中但想保持响应性，那么你可以使用 [toRefs()](./reactivity-utilities.html#torefs) [toRef()](/api/reactivity-utilities.html#toref) 这两个工具 API：

```js
import { toRefs } from 'vue'

export default {
  setup(props) {
    // 将 `props` 转为一个其中全是 ref 的对象，然后解构
    const { title } = toRefs(props)
    // `title` 是一个追踪着 `props.title` 的 ref
    console.log(title.value)

    // 或者，将 `props` 的单个属性转为一个 ref
    const title = toRef(props, 'title')
  }
}
```

## Setup 的上下文 {#setup-context}

传入 `setup` 函数的第二个参数是一个 **Setup 上下文** 对象。上下文对象上暴露了其他一些在 `setup` 之中很有用的值：

```js
export default {
  setup(props, context) {
    // Attributes（不是响应式的对象，等价于 $attrs）
    console.log(context.attrs)

    // 插槽（不是响应式的对象，等价于 $slots）
    console.log(context.slots)

    // 抛出事件（函数，等价于 $emit）
    console.log(context.emit)

    // 暴露公共属性（函数）
    console.log(context.expose)
  }
}
```

该上下文对象是非响应式的，可以安全地解构：

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` 和 `slots` 都是有状态的对象，它们总会随着组件自身的变更而更新。这意味着你应当避免从它们之中解构，而是始终使用属性引用，例如 `attrs.x` 或 `slots.x` 这样。此外还需注意，和 `props` 不同，`attrs` 和 `slots` 上的属性都 **不是** 响应式的。如果你试图基于 `attrs` 或 `slots` 来应用副作用，则应该放在生命周期钩子 `onBeforeUpdate` 之中。

### 暴露公共属性 {#exposing-public-properties}

`expose` 这个函数可以用于在父组件中通过[模板 ref](/guide/essentials/template-refs.html#ref-on-component)访问本组件时，显式地限制所暴露的属性：

```js{5,10}
export default {
  setup(props, { expose }) {
    // 这样会使得该组件处于 “关闭状态”
    // 即不向父组件暴露任何东西
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // 有选择地暴露局部状态
    expose({ count: publicCount })
  }
}
```

## 渲染函数的用法 {#usage-with-render-functions}

`setup` 也可以返回一个 [渲染函数](/guide/extras/render-function.html)，它可以直接使用在同一作用域中声明的响应状态：

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

返回一个渲染函数将会阻止我们返回其他东西。对组件内部来说，这应该不是个问题，但如果我们想通过模板 ref 将这个组件的方法暴露给父组件，那就有问题了。

我们可以通过调用 [`expose()`](#exposing-public-properties) 解决这个问题：

```js{8-10}
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

此时这个 `increment` 方法将可以在父组件中模板 ref 上访问到。
