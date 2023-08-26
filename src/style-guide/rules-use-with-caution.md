# 优先级 D 规则：谨慎使用 {#priority-d-rules-use-with-caution}

Vue 的某些特性存在是为了适应罕见的边界情况或更平稳地从旧代码库迁移。然而，过度使用这些特性可能会使您的代码更难以维护，甚至成为错误的源头。这些规则将重点放在潜在风险的特性上，描述了何时以及为什么应避免使用它们。

## 带有 `scoped` 的元素选择器 {#element-selectors-with-scoped}

**应避免在 `scoped` 中使用元素选择器。**

在 `scoped` 样式中，优先使用类选择器而不是元素选择器，因为大量的元素选择器会导致速度变慢。

::: details 详细解释
为了对样式进行作用域限定，Vue 会给组件元素添加一个唯一的属性，例如 `data-v-f3f3eg9`。然后，选择器会被修改，只选择带有此属性的匹配元素（例如 `button[data-v-f3f3eg9]`）。

问题在于，大量的元素属性选择器（例如 `button[data-v-f3f3eg9]`）的速度会比类属性选择器（例如 `.btn-close[data-v-f3f3eg9]`）要慢得多，因此应尽可能使用类选择器。
:::

<div class="style-example style-example-bad">
<h3>不推荐</h3>

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
<h3>推荐</h3>

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

## 隐式父子组件通信 {#implicit-parent-child-communication}

**在父子组件之间的通信中，应优先使用 props 和 events，而不是 `this.$parent` 或修改 props。**

一个理想的 Vue 应用是自上而下的 props 传递，自下而上的 events 传递。坚持这一约定会使您的组件更易于理解。然而，在已经紧密耦合的两个组件中，可能存在使用属性修改或 `this.$parent` 的情况。

问题在于，还有很多 _简单_ 的情况下，这些模式可能提供方便。要注意：不要为了短期的方便（写更少的代码）而陷入交换简洁性（能够理解状态流程）的陷阱。

<div class="style-example style-example-bad">
<h3>不推荐</h3>

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
<h3>推荐</h3>

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
