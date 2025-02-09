# 优先级D: 小心使用的规则{#priority-d-rules-use-with-caution}

Some features of Vue exist to accommodate rare edge cases or smoother migrations from a legacy code base. When overused however, they can make your code more difficult to maintain or even become a source of bugs. These rules shine a light on potentially risky features, describing when and why they should be avoided.

Vue的一些特性可以适应罕见的边缘情况或从遗留代码库更平滑的迁移。但是，如果过度使用，它们会使您的代码更难维护，甚至成为bug的来源。这些规则揭示了潜在的风险特征，描述了何时以及为什么应该避免它们。

## 具有`作用域`的元素选择器{#element-selectors-with-scoped}

**在`scoped`中应该避免使用元素选择器。**

在`作用域`样式中，类选择器优于元素选择器，因为大量的元素选择器速度很慢。

:::详细说明

对于作用域样式，Vue为组件元素添加了一个唯一的属性，例如`data-v-f3 f3 eg 9`。然后修改选择器，以便只选择具有此属性的匹配元素（例如`button[data-v-f3 f3 eg 9]`）。

问题是大量的元素-属性选择器（例如`button[data-v-f3 f3 eg 9]`）会比类-属性选择器（例如`.btn-close[data-v-f3 f3 eg 9]`）慢得多，所以类选择器应该尽可能优先使用。:::

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


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
<h3>好的示例</h3>


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

## 隐式父子通信{#implicit-parent-child-communication}

**对于父子组件通信，应该首选Prop和事件，而不是`this.$parent`或突变属性。**

一个理想的Vue应用程序是props down，events up。坚持这种约定会使您的组件更容易理解。然而，也有一些边缘情况，prop mutation或`this.$parent`可以简化已经深度耦合的两个组件。

问题是，也有许多*简单的*情况下，这些模式可以提供方便。注意：不要为了短期的方便（编写更少的代码）而放弃简单性（能够理解状态流）。

<div class="options-api">
<div class="style-example style-example-bad">
<h3>坏的示例</h3>


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
<h3>好的示例</h3>


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

</div>

<div class="composition-api">
<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <input v-model="todo.text" />
</template>
```

```vue
<script setup>
import { getCurrentInstance } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const instance = getCurrentInstance()

function removeTodo() {
  const parent = instance.parent
  if (!parent) return

  parent.props.todos = parent.props.todos.filter((todo) => {
    return todo.id !== props.todo.id
  })
}
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo">×</button>
  </span>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['input'])
</script>

<template>
  <input :value="todo.text" @input="emit('input', $event.target.value)" />
</template>
```

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="emit('delete')">×</button>
  </span>
</template>
```

</div>

</div>
