# 优先级 A 规则: 必要的 {#priority-a-rules-essential}

这些规则有助于避免错误，因此务必学习并遵守。这里面可能存在例外，但应该非常少，且只有你同时精通 JavaScript 和 Vue 才可以这样做。

## 组件名为多个单词 {#use-multi-word-component-names}

用户定义的组件名称应始终使用多个单词，根 `App` 组件除外。这样做可以避免跟现有的以及未来的 HTML 元素[相冲突](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)，因为所有的 HTML 元素名称都是单个单词的。

<div class="style-example style-example-bad">
<h3>反例</h3>

```vue-html
<!-- 在 预编译 模板中 -->
<Item />

<!-- 在 DOM 模板中 -->
<item></item>
```

</div>

<div class="style-example style-example-good">
<h3>正例</h3>

```vue-html
<!-- 在 预编译 模板中 -->
<TodoItem />

<!-- 在 DOM 模板中 -->
<todo-item></todo-item>
```

</div>

## Prop 定义要详细 {#use-detailed-prop-definitions}

在提交的代码中，prop 的定义应该尽量详细，至少需要指定其类型。

::: details 详细解释
详细的 [prop 定义](/guide/components/props#prop-validation) 有两个优点:

- 它们记录了组件的API，因此很容易看出如何使用该组件。
- 在开发环境下，如果向一个组件提供格式不正确的 props，Vue 将会告警，帮助你捕获潜在的错误来源。
  :::

<div class="options-api">

<div class="style-example style-example-bad">
<h3>反例</h3>

```js
// 这样做只有开发原型系统时可以接受
props: ['status']
```

</div>

<div class="style-example style-example-good">
<h3>正例</h3>

```js
props: {
  status: String
}
```

```js
// 更棒的写法！
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>反例</h3>

```js
// 这样做只有开发原型系统时可以接受
const props = defineProps(['status'])
```

</div>

<div class="style-example style-example-good">
<h3>正例</h3>

```js
const props = defineProps({
  status: String
})
```

```js
// 更棒的写法！
const props = defineProps({
  status: {
    type: String,
    required: true,

    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(
        value
      )
    }
  }
})
```

</div>

</div>

## 为 v-for 设置键值 {#use-keyed-v-for}


在组件上 _始终_ 需要用 `key` 配合 `v-for`，以便维护子树中的内部组件状态。即使对于元素，这也是一种很好的做法，可以维持可控制的行为，比如动画中的 [对象固化 (object constancy)](https://bost.ocks.org/mike/constancy/)。

::: details 详细解释
假设你有一个待办事项列表：

<div class="options-api">

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: '学习使用 v-for'
      },
      {
        id: 2,
        text: '学习使用 key'
      }
    ]
  }
}
```

</div>

<div class="composition-api">

```js
const todos = ref([
  {
    id: 1,
    text: '学习使用 v-for'
  },
  {
    id: 2,
    text: '学习使用 key'
  }
])
```

</div>

你把它们按照字母顺序排序。在更新 DOM 的时候，Vue 将会优化渲染把可能的 DOM 变更降到最低。即可能删掉第一个待办事项元素，然后把它重新加回到列表的最末尾。

有些情况下，重要的不是删除 DOM 中的元素，而是你可能希望使用 `<transition-group>` 来动画化列表排序，或者如果渲染的元素是 `<input>` ，则希望保持焦点。在这些情况下，为每个项目添加唯一的键（例如 :key="todo.id"）将告诉 Vue 如何更有效的控制其行为。

根据我们的经验，最好 _始终_ 添加一个唯一的键值，以便你和你的团队永远不必担心这些边缘情况。也在少数对性能有严格要求的情况下，为了避免对象固化，你可以做到一些非常规的处理。
:::

<div class="style-example style-example-bad">
<h3>反例</h3>

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>正例</h3>

```vue-html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

</div>

## 避免同时使用 `v-if` 和 `v-for` {#avoid-v-if-with-v-for}

**永远不要在同一个元素上同时使用 `v-if` 和 `v-for` 。**

一般我们在两种常见的情况下会这样做：

- 为了过滤一个列表中的项 (例如 `v-for="user in users" v-if="user.isActive"`). 在这些情况下，请用一个新的计算属性替换 `users`， 该属性返回你筛选后的列表 (例如 `activeUsers`)。

- 如果列表应该隐藏，则避免渲染它 (例如 `v-for="user in users" v-if="shouldShowUsers"`). 在这些情况下，请将 `v-if` 移动到容器元素（例如 `ul`、`ol`）。

::: details 详细解释
当 Vue 处理指令时，`v-if` 的优先级高于 `v-for`，所以这个模板：

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

将会抛出一个错误，因为 `v-if` 指令会首先被执行，而此时迭代变量 `user` 尚不存在。

此时可以通过创建一个计算属性来解决，比如这样：

<div class="options-api">

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

</div>

<div class="composition-api">

```js
const activeUsers = computed(() => {
  return users.filter((user) => user.isActive)
})
```

</div>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

或者，我们可以使用带有 `v-for` 的 `<template>` 标签来包裹 `<li>` 元素：

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h3>反例</h3>

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>正例</h3>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

</div>

## 为组件样式设置作用域 {#use-component-scoped-styling}

对于应用程序，顶层 `App` 组件和布局组件中的样式可以是全局的，但所有其他组件应始终使用作用域样式。

这仅适用于 [单文件组件](/guide/scaling-up/sfc)。 你 _不一定_ 要使用 [`scoped` attribute](https://vue-loader.vuejs.org/en/features/scoped-css.html)。 也可以通过 [CSS modules](https://vue-loader.vuejs.org/en/features/css-modules)，基于类的策略 [BEM](http://getbem.com/) 或 其他库/约定来实现。

`然而，组件库应该更倾向于使用基于类的策略，而不是使用 `scoped` 属性。`

这使得覆盖内部样式更容易，使用了常人可理解的 class 名称且没有太高的选择器优先级，而且不太会导致冲突。

::: details 详细解释
如果你与其他开发者合作开发一个大型工程，或者有时引入第三方 HTML/CSS（例如 来自Auth0），设置一致的作用域将确保你的样式仅适用于它们所针对的组件。

除了 `scoped` 属性之外，使用唯一的 class 名可以确保第三方 CSS 不会应用于你自己的 HTML 上。例如，许多项目使用 `button`、`btn` 或 `icon` class 名，因此即使不使用 BEM 等策略，添加特定于应用程序或组件的前缀（例如 `ButtonClose-icon`）也可以提供一定的保护。
:::

<div class="style-example style-example-bad">
<h3>反例</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>正例</h3>

```vue-html
<template>
  <button class="button button-close">×</button>
</template>

<!-- 使用 `scoped` attribute -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- 使用 CSS modules -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- 使用 BEM 约定 -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```

</div>