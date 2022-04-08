# 优先级 A 规则：必要的

这些规则可以帮你规避错误，所以请务必学习并遵守它们。可能存在例外的情况，但应该非常少，而且需要同时精通 JavaScript 和 Vue 的人来决定。

## 组件名使用多个单词

除根组件 `App`外的用户组件名应多由多个单词组成。这可以避免与现有或未来会有的 HTML 元素[产生冲突](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)，因为所有的 HTML 元素名称都是由单个单词组成。

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```vue-html
<!-- 在预渲染模板中 -->
<Item />

<!-- 在 in-DOM 模板中 -->
<item></item>
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```vue-html
<!-- 在预渲染模板中 -->
<TodoItem />

<!-- 在 DOM 模板中 -->
<todo-item></todo-item>
```

</div>

## 使用详细的 prop 定义

在提交的代码中，prop 的定义应该尽量详细，至少指定其类型。

::: details 详解
详细的 [prop 定义](/guide/components/props.html#prop-validation)有两个好处：

- 它们写明了组件的 API，所以组件用法会通俗易懂；
- 在开发环境下，如果为一个组件提供了格式错误的 prop，Vue 将会告警以帮助你捕获潜在的错误来源。
  :::

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```js
// 仅在原型设计中可行
props: ['status']
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```js
props: {
  status: String
}
```

```js
// 更好！
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

## 使用含 `key` 的 `v-for`

组件里 `v-for` 必须**始终**和 `key` 一同使用，以便维护内部组件及其子树的状态。即使对于元素而言，保持可预测的行为也是一种好的做法。例如动画中的[对象固化（object constancy）](https://bost.ocks.org/mike/constancy/) 。

::: details 详解
假设你有个待办列表：

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'Learn to use v-for'
      },
      {
        id: 2,
        text: 'Learn to use key'
      }
    ]
  }
}
```

然后你把它们按照字母顺序排序。在更新 DOM 的时候，Vue 将会优化渲染，尽可能地将 DOM 操作的代价降到最低。言下之意，可能是删掉第一个待办事项元素，然后把它重新加回到列表的最末尾。

问题在于，可能会存在某种情况，不删除将要保留在 DOM 中的元素也很重要。比如说，你想使用 `<transition-group>` 给列表排序增加动画，或在被渲染元素是 `<input>` 时保留焦点状态。在这些情况下，为每一个项目添加一个唯一的键值（比如 `:key="todo.id"`）将会让 Vue 知道如何使行为更容易预测。

根据我们的经验，最好**始终**添加一个唯一的键值，这样你和你的团队永远不必担心这些极端情况。在极少数对性能有严格要求的情况下，为了避免对象固化，你可以刻意做一些非常规的处理。
:::

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

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

## 避免 `v-if` 和 `v-for` 一起使用

**永远不要在一个元素上同时使用 `v-if` 和 `v-for`。**

在这两种常见的情况下我们倾向这样做：

- 为了对列表中的项目进行过滤（比如 `v-for="user in users" v-if="user.isActive"`）。在这种情形下，请将 `users` 替换为一个计算属性（比如 `activeUsers`），返回过滤后的列表。

- 为了避免渲染本应该被隐藏的列表（比如 `v-for="user in users" v-if="shouldShowUsers"`）。这种情形下，请将 `v-if` 移动至容器元素上（比如 `ul`、`ol`）。

::: details 详解
Vue 在处理指令时，`v-if` 比 `v-for` 具有更高的优先级，这个模板：

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

将抛出一个错误，因为 `v-if` 指令将首先被执行，而此时迭代的变量 `user` 还不存在。

这可以通过遍历一个计算属性来解决，像这样：

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

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

另外，我们也可以使用 `<template>` 标签和 v-for 来包裹 `<li>` 元素：

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
<h3>反面示例</h3>

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
<h3>正面示例</h3>

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

## 为组件样式设置作用域

对应用而言，顶层 `App` 组件和布局组件中的样式可以是全局的，但是在其它所有组件中都应该要有作用域的。

这条规则只适用于[单文件组件](/guide/scaling-up/sfc.html)。你**不一定**要使用 [`scoped` attribute](https://vue-loader.vuejs.org/en/features/scoped-css.html) 。作用域也可以通过 [CSS 模块](https://vue-loader.vuejs.org/en/features/css-modules.html) 、像 [BEM](http://getbem.com/) 一样基于类的策略，或其它的库/约定来实现。

**不管怎样，就组件库而言，我们应该更倾向于选用基于类的策略，而不是 `scoped` attribute。**

使用可读类名，没有太高的选择器优先级，会让覆写内部样式变得更容易且不太会导致冲突。

::: details 详解
如果你正在和其他开发者一起开发一个大型项目，或有时候要引入三方 HTML/CSS（比如来自 Auth0），设置一致的作用域能确保你的样式只会运用在它们想要作用的组件上。

除了 `scoped` 属性以外，使用唯一的类名可以帮你确保那些第三方库的 CSS 不会用在你自己的 HTML 上。比如说，许多项目都用了 `button`、`btn` 或 `icon` 类名，所以即便你不使用类似 BEM 的策略，为应用或组件添加一个专属前缀（比如 `ButtonClose-icon`）也有所帮助。
:::

<div class="style-example style-example-bad">
<h3>反面示例</h3>

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
<h3>正面示例</h3>

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

<!-- 使用 CSS 模块 -->
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

## 避免在 mixin 中暴露私有函数

使用模块作用域来确保外部无法访问到私有函数。如果无法做到这一点，就始终应该为插件、mixin 等不考虑对外公开 API 的自定义私有 property 使用 `$_` 前缀并带命名空间，以避免与其它作者造成冲突（比如 `$_yourPluginName_`）。

::: details 详解
Vue 使用 `_` 前缀来定义其自有私有 property，所以使用相同的前缀（比如 `_update`）存在覆写实例 property 的风险。即便你检查确认了当前的 Vue 版本没有用到这个 property 名，但也不能保证与未来版本同样没有冲突。

对 `$` 前缀而言，其在 Vue 生态系统中的目的是暴露给用户的一个特殊的实例 property，所以把它用于**私有** property 并不合适。

不过，我们推荐把这两个前缀结合为 `$_`，充当一个用户定义的私有 property 的约定，以确保不会和 Vue 自身相冲突。
:::

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```js
const myGreatMixin = {
  // ...
  methods: {
    update() {
      // ...
    }
  }
}
```

```js
const myGreatMixin = {
  // ...
  methods: {
    _update() {
      // ...
    }
  }
}
```

```js
const myGreatMixin = {
  // ...
  methods: {
    $update() {
      // ...
    }
  }
}
```

```js
const myGreatMixin = {
  // ...
  methods: {
    $_update() {
      // ...
    }
  }
}
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```js
const myGreatMixin = {
  // ...
  methods: {
    $_myGreatMixin_update() {
      // ...
    }
  }
}
```

```js
// 更好！
const myGreatMixin = {
  // ...
  methods: {
    publicMethod() {
      // ...
      myPrivateFunction()
    }
  }
}

function myPrivateFunction() {
  // ...
}

export default myGreatMixin
```

</div>
