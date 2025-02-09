# 优先级A：基本规则

这些规则有助于防止错误，因此不惜一切代价学习并遵守它们。可能存在例外，但应该非常罕见，只有那些对JavaScript和Vue的专业知识的人才能做到。



## 使用多单词组件名称


用户组件名称应始终是多个单词，​​除了根`App`组件。由于所有HTML元素都是一个单词，因此[可以防止与现有和未来的HTML元素发生冲突](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)。

### 坏的示例

```vue-html
<!-- in pre-compiled templates -->
<Item />

<!-- in in-DOM templates -->
<item></item>
```



### 好的示例

```vue-html
<!-- in pre-compiled templates -->
<TodoItem />

<!-- in in-DOM templates -->
<todo-item></todo-item>
```



## 使用详细的属性定义

在提交的代码中，属性定义应始终尽可能的详细，至少需要指定属性的类型。
:::详细说明[属性定义](https://github.com/vuejs-translations/docs-zh-cn/blob/main/guide/components/props#prop-validation)有两个优点：

- 他们记录了组件的API，因此很容易看到该组件的使用方式。
- 在开发中，Vue会警告您，如果提供了错误格式的属性，可以帮助您捕获潜在的错误来源。 :::

### 坏的示例

```
// This is only OK when prototyping
props: ['status']
```



### 好的示例

```
props: {
  status: String
}
```



```
// 更好的示例!
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



### 坏的示例

```
// This is only OK when prototyping
const props = defineProps(['status'])
```



### 好的示例

```
const props = defineProps({
  status: String
})
```



```
// // 更好的示例!

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



## 使用v-for



为了在子树下维护内部组件状态，*始终*需要在组件上使用`v-for`的`key` 。即使对于元素，维持可预测的行为是一个很好的做法，例如动画中的[对象恒定](https://bost.ocks.org/mike/constancy/)。

:::详细说明:  假设您有todos的列表：

```
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



```
const todos = ref([
  {
    id: 1,
    text: 'Learn to use v-for'
  },
  {
    id: 2,
    text: 'Learn to use key'
  }
])
```

然后，您按字母顺序排序。更新DOM时，VUE将优化渲染以执行最便宜的DOM突变。这可能意味着删除第一个todo元素，然后在列表的末尾再次添加。

问题是，在某些情况下，重要的是不要删除将保留在DOM中的元素。例如，您可能需要使用`<transition-group>`来动画列表排序，或者如果渲染元素为`<input>`则保持焦点。在这些情况下，为每个项目添加一个唯一的密钥（例如`:key="todo.id"` ）将告诉Vue如何更可预测的行为。
根据我们的经验，最好*始终*添加一个唯一的钥匙，这样您和您的团队根本就不必担心这些不常见的情况。然后，在罕见、性能要求高的情况如不需要对象恒定时，您可以做出有意识的例外。 :::

### 坏的示例

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```



### 好的示例

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



## 使用`v-for` 时避免`v-if`

**切勿在与`v-for`相同的元素上使用`v-if` 。**

在两种常见的情况下，这可能很诱人：

- 要过滤列表中的项目（例如 `v-for="user in users" v-if="user.isActive"` ）。在这些情况下，用新的计算属性替换`users` ，该属性返回您的过滤列表（例如`activeUsers` ）。
- 为了避免呈现列表，如果应该隐藏列表（例如 `v-for="user in users" v-if="shouldShowUsers"` ）。在这些情况下，将`v-if`移至容器元件（例如`ul` ， `ol` ）。



:::详细说明: 当VUE处理指令时， `v-if`的优先级高于`v-for` ，因此，如下的模板会出现错误，因为`v-if`指令将首先评估，并且目前不存在迭代变量`user` ：

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

可以通过在计算的属性上迭代来解决，类似下面的代码：

```
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```



```
const activeUsers = computed(() => {
  return users.filter((user) => user.isActive)
})
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



另外，我们可以使用`v-for`的`<template>`标签来包装`<li>`元素：

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```



### 坏的示例

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



### 好的示例

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



## 使用组件scope样式

对于应用程序，顶级`App`组件和布局组件中的样式可能是全局的，但是所有其他组件都应始终在某个范围内。

这仅与[单文件组件](https://github.com/vuejs-translations/docs-zh-cn/blob/main/guide/scaling-up/sfc)有关。它*不需要*使用[`scoped`属性](https://vue-loader.vuejs.org/guide/scoped-css.html)。scope可以通过[CSS模块](https://vue-loader.vuejs.org/guide/css-modules.html)、采用基于类的策略如[BEM](http://getbem.com/)或其他库/公约来进行定义。

**但是，组件库应该推荐使用基于类的策略，而不是使用`scoped`属性。**

这使得重载内部样式变得更加容易，采用人类可读的、不是太特殊的类名称，但仍然不太可能导致冲突。

:::详细说明：如果您正在开发一个大型项目，与其他开发人员合作，或者有时包括第三方HTML/CSS（例如Auth0），一致的范围(scope)定义可确保您的样式仅适用于它们的组件。
除了`scoped`属性之外，使用唯一的类名称可以帮助确保第三方CSS不适用于您自己的HTML。例如，许多项目都使用`button` ， `btn`或`icon`类名称，因此，即使不使用BEM之类的策略，添加特定于APP和/或组件的特殊的前缀（EG `ButtonClose-icon` ）也可以提供一些保护。 :::

### 坏的示例

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



### 好的示例

```vue-html
<template>
  <button class="button button-close">×</button>
</template>

<!-- Using the `scoped` attribute -->
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

<!-- Using CSS modules -->
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

<!-- Using the BEM convention -->
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

