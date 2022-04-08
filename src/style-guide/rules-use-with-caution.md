# 优先级 D 规则：谨慎使用

某些 Vue 特性的存在是为了照顾极端情况，或帮助老代码平稳迁移。当被过度使用时，这些特性将使得代码难以维护，甚至成为 bug 的来源。这些规则的存在是为了给有潜在风险的特性敲响警钟，告诉他们哪些情况下应避免使用这些特性，以及为什么要避免使用它们。

## `scoped` 中的元素选择器

**元素选择器应该避免在 `scoped` 中出现。**

在 `scoped` 样式中，类选择器要比元素选择器更好，大量地使用元素选择器会使得速度很慢。

::: details 详解
为了给样式设置作用域，Vue 会为元素添加一个独一无二的属性，例如 `data-v-f3f3eg9`。然后选择器将被修改，使得在匹配到的元素中，只有带这个属性的才会真正生效（比如 `button[data-v-f3f3eg9]`）。

问题在于，大量的元素与属性组合的选择器（比如 `button[data-v-f3f3eg9]`）会比类与属性组合的选择器更慢，因此应该尽可能地选用类选择器。
:::

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```vue-html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

</div>

## 隐性的父子组件通信

**应该优先通过 prop 和事件进行父子组件之间的通信，而不是通过 `this.$parent` 或对 prop 做出变更。**

一个理想的 Vue 应用是 prop 向下传递，事件向上传递的。遵循这一约定会让你的组件更易于理解。然而，在一些边界情况下，对 prop 的变更或 `this.$parent` 能够简化两个深度耦合的组件。

问题在于，这种做法在很多_简单_的场景下也可能会更方便。但请当心：不要为了一时方便（少写代码）而牺牲简明性（易于理解的状态流）。

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(
        (todo) => todo.id !== vm.todo.id
      )
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```

</div>
