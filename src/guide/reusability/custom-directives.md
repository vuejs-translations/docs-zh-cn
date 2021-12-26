---
title: 自定义指令
---
# 自定义指令 {#custom-directives}

<script setup>
const vFocus = {
  mounted: el => el.focus()
}
</script>

## 介绍 {#introduce}

除了 Vue 内置的一系列指令（比如 `v-model` 或 `v-show`）之外，Vue 还允许你注册自定义的指令。

我们已经介绍过了两种 Vue 中重用逻辑的方式：[组件](/guide/essentials/component-basics.html) 和 [可组合函数](./composables)。组件主要关注构建视图区块，而可组合函数关注与有状态的逻辑。自定义指令则主要是封装了可重用的对底层 DOM 访问的逻辑。

一个自定义指令被定义为一个包含类似于组件的生命周期钩子的对象。钩子接收指令绑定到的元素。下面是一个自定义指令的例子，当元素被 Vue 插入到 DOM 中时，会聚焦一个 input 元素：

<div class="composition-api">

```vue
<script setup>
// 在模板中注册 v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

</div>

<div class="options-api">

```js
const focus = {
  mounted: (el) => el.focus()
}

export default {
  directives: {
    // 在模板中注册 v-focus
    focus
  }
}
```

```vue-html
<input v-focus />
```

</div>

<div class="demo">
  <input v-focus placeholder="此处会被聚焦" />
</div>

假设你还未点击页面中的其他地方，那么上面这个 input 元素则会被自动聚焦。该指令比 `autofocus` attribute 更有用，因为它不仅仅可以在页面加载完成后运行，还可以在 Vue 动态插入元素后运行。

<div class="composition-api">

在 `<script setup>` 中，任何以 `v` 开头的 camelCase 格式的变量都会可以被用作一个自定义指令。再上线的例子中，`vFocus` 即可以在模板中被用作指令 `v-focus`。

如果不使用 `<script setup>`，自定义指令可以通过 `directives` 选项注册：

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模板中启用 v-focus
    focus: {
      /* ... */
    }
  }
}
```

</div>

<div class="options-api">

和组件类似，自定义指令必须被注册才能在模板中使用。在上面的例子中，我们使用 `directives` 选项局部注册了指令。

</div>

常常也会将一个自定义指令注册到应用全局：

```js
const app = createApp({})

// 使 v-focus 在所有组件中都可用
app.directive('focus', {
  /* ... */
})
```

:::tip
只有当所需功能只能通过直接 DOM 操作来实现时，才应该使用自定义指令。尽可能使用声明式的模板、使用内置指令例如 `v-bind`，因为这更高效、更对服务端渲染友好。
:::

## 指令钩子 {#directive-hooks}

一个指令的定义对象可以提供几种钩子函数（都是可选的）：

```js
const myDir = {
  // 在帮顶元素的 attribute 前调用
  // 或事件监听器应用前调用
  created(el, binding, vnode, prevVnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount() {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都 挂载 完成后调用
  mounted() {},
  // 绑定元素的父组件更新前调用
  beforeUpdate() {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都 更新 完成后调用
  updated() {},
  // 绑定元素的父组件卸载之前调用
  beforeUnmount() {},
  // 绑定元素的父组件卸载之后调用
  unmounted() {}
  }
}
```

### 钩子参数 {#hook-arguments}

指令的钩子会传递以下几种参数：

- `el`：指令绑定到的元素。这可以用于直接操作 DOM。

- `binding`：一个对象，包含以下属性
  - `value`：传递给指令的值。例如 `v-my-directive="1 + 1"` 之中，值就是 `2`。
  - `oldValue`：之前的值，仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否更改，它都可用。
  - `arg`：传递给指令的参数，例如 `v-my-directive:foo` 之中，参数就是 `"foo"`。
  - `modifiers`：一个对象，包含使用到的所有修饰符。例如 `v-my-directive.foo.bar` 之中，修饰符对象会是 `{ foo: true, bar: true }`。
  - `instance`：使用该指令的组件实例。
  - `dir`：指令定义对象

- `vnode`：代表绑定元素的底层 VNode。
- `prevNode`：之前的渲染中代表指令所绑定元素的 VNode。仅在 `beforeUpdate` 和 `updated` 钩子中可用。

举个例子，像下面这样使用指令：

```vue-html
<div v-example:foo.bar="baz">
```

`binding` 参数会是一个这样的对象：

```js
{
  arg: 'foo',
  modifiers: { baz: true },
  value: /* `baz` 的值 */,
  oldValue: /* 上一次更新后时`baz` 的值 */
}
```

和内置指令类似，自定义指令的参数也可以是动态的，举个例子：

```vue-html
<div v-example:[arg]="value"></div>
```

这里指令的参数会基于组件状态 `arg` 属性响应式地更新。

:::tip Note
除了 `el` 外，你应该将这些参数都视为只读的，并一律不更改它们。若你需要在不同的钩子间共享信息，推荐方法是通过元素的 [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) attribute。
:::

## 简化形式 {#function-shorthand} {#function-shorthand}

对于自定义指令来说，`mounted` 和 `updated` 需要相同的行为、又并不关心其他钩子的情况很常见。在这种时候，此时你可以将指令定义成一个下面这样的函数：

```vue-html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```

## 对象字面量 {#object-literals} {#object-literals}

如果你的指令需要多个值，你可以向它传递一个 JavaScript 对象字面量。请记住，指令也可以接收任何合法的 JavaScript 表达式。

```vue-html
<div v-demo="{ color: '白色', text: '你好!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "白色"
  console.log(binding.value.text) // => "你好!"
})
```

## 在组件上使用 {#usage-on-components} {#usage-on-components}

当在组件上使用自定义指令时，它会始终应用于组件的根节点，和 [透传 attributes](/guide/components/attrs.html) 类似。

```vue-html
<MyComponent v-demo="test" />
```

```vue-html
<!-- MyComponent 的模板 -->

<div> <!-- v-demo 指令会被应用在此处 -->
  <span>我的组件内容</span>
</div>
```

如果组件可能含有多个根节点，指令不会起效、被忽略，还会抛出一个警告。和 attribute 不同，指令不可以通过 `v-bind="$attrs"` 来传递给一个不同的元素。总而言之，**不推荐** 在组件上使用自定义指令。
