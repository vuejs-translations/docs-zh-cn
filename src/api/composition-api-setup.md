# 组合式 API：setup()  {#composition-api-setup}

:::info 注意
这篇文档所讲的是组件 `setup` 选项的使用方式。如果你正在搭配单文件组件使用组合式 API，建议使用更简洁易用的 [`<script setup>`](/api/sfc-script-setup.html) 语法。
:::

`setup()` 这个钩子在以下情况下，作为组件中使用组合式 API 的入口。

1. 不搭配构建步骤使用组合式 API。
2. 在选项式 API 组件中集成基于组合式 API 的代码。

## 基本使用 {#basic-usage}

我们可以使用[响应性 API](./reactivity-core.html) 来声明响应式的状态，在 `setup()` 函数中返回的对象会暴露给模板。在其他的选项中，返回值对象中的 property 在组件实例上同样可用：<!-- 译者备注：（原文问题）这里是否使用选项和是否在组件实例上可用并没有因果关系，因此对 if 从句作了意译 -->

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // 返回值会暴露给模板和其他的选项式 API 钩子
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

请注意在模板中访问从 `setup` 返回的 [ref](/api/reactivity-core.html#ref) 时，它会[自动浅层解包](/guide/essentials/reactivity-fundamentals.html#deep-reactivity)，因此你无须再在模板中为它写 `.value`。当通过 `this` 访问时也会同样如此解包。

:::tip
`setup()` 自身并不含对组件实例的访问权，即在 `setup()` 中访问 `this` 会是 `undefined`。你可以在选项式 API 中访问组合式 API 暴露的值，但反过来则不行。
:::

## 访问 Prop  {#accessing-props}

`setup` 函数的第一个参数是组件的 `props`。和标准的组件一致，一个 `setup` 函数的 `props` 是响应式的，并且会在传入新的 prop 时同步更新。

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

请注意如果你解构了 `props` 对象，解构出的变量将会丢失响应性。因此我们推荐通过 `props.xxx` 的形式来使用其中的 prop。

如果你确实需要解构 `props` 对象，或者需要将某个 prop 传到一个外部函数中并保持响应性，那么你可以使用 [toRefs()](./reactivity-utilities.html#torefs) 和 [toRef()](/api/reactivity-utilities.html#toref) 这两个工具 API：

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // 将 `props` 转为一个其中全是 ref 的对象，然后解构
    const { title } = toRefs(props)
    // `title` 是一个追踪着 `props.title` 的 ref
    console.log(title.value)

    // 或者，将 `props` 的单个 property 转为一个 ref
    const title = toRef(props, 'title')
  }
}
```

## Setup 的上下文 {#setup-context}

传入 `setup` 函数的第二个参数是一个 **Setup 上下文**对象。上下文对象暴露了其他一些在 `setup` 中可能会用到的值：

```js
export default {
  setup(props, context) {
    // Attribute（非响应式的对象，等价于 $attrs）
    console.log(context.attrs)

    // 插槽（非响应式的对象，等价于 $slots）
    console.log(context.slots)

    // 触发事件（函数，等价于 $emit）
    console.log(context.emit)

    // 暴露公共 property（函数）
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

`attrs` 和 `slots` 都是有状态的对象，它们总是会随着组件自身的更新而更新。这意味着你应当避免解构它们，并始终通过 `attrs.x` 或 `slots.x` 的形式使用其中的 property。此外还需注意，和 `props` 不同，`attrs` 和 `slots` 的 property 都**不是**响应式的。如果你想要基于 `attrs` 或 `slots` 的改变来执行副作用，那么你应该在 `onBeforeUpdate` 生命周期钩子中编写相关逻辑。

### 暴露公共 Property {#exposing-public-properties}

`expose` 函数用于显式地限制该组件暴露出的 property，当父组件通过[模板 ref](/guide/essentials/template-refs.html#ref-on-component) 访问该组件的实例时，将仅能访问 `expose` 函数暴露出的内容：

```js{5,10}
export default {
  setup(props, { expose }) {
    // 让组件实例处于 “关闭状态”
    // 即不向父组件暴露任何东西
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // 有选择地暴露局部状态
    expose({ count: publicCount })
  }
}
```

## 与渲染函数一起使用 {#usage-with-render-functions}

`setup` 也可以返回一个[渲染函数](/guide/extras/render-function.html)，此时在渲染函数中可以直接使用在同一作用域下声明的响应式状态：

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

返回一个渲染函数将会阻止我们返回其他东西。对于组件内部来说，这样没有问题，但如果我们想通过模板 ref 将这个组件的方法暴露给父组件，那就有问题了。

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

此时父组件可以通过模板 ref 来访问这个 `increment` 方法。
