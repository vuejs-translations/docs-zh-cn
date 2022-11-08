# 计算属性 {#computed-property}

让我们在上一步的 todo 列表基础上继续。现在，我们已经给每一个 todo 添加了切换功能。这是通过给每一个 todo 对象添加 `done` 属性来实现的，并且使用了 `v-model` 将其绑定到复选框上：

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

下一个可以添加的改进是隐藏已经完成的 todo。我们已经有了一个能够切换 `hideCompleted` 状态的按钮。但是应该如何基于状态渲染不同的列表项呢？

<div class="options-api">

介绍一个新概念：<a target="_blank" href="/guide/essentials/computed.html">计算属性</a>。我们可以使用 `computed` 选项声明一个响应式的属性，它的值由其他属性计算而来：

<div class="sfc">

```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // 根据 `this.hideCompleted` 返回过滤后的 todo 项目
    }
  }
}
```

</div>
<div class="html">

```js
createApp({
  // ...
  computed: {
    filteredTodos() {
      // 根据 `this.hideCompleted` 返回过滤后的 todo 项目
    }
  }
})
```

</div>

</div>
<div class="composition-api">

介绍一个新 API：<a target="_blank" href="/guide/essentials/computed.html">`computed()`</a>。它可以让我们创建一个计算属性 ref，这个 ref 会动态地根据其他响应式数据源来计算其 `.value`：

<div class="sfc">

```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // 根据 `todos.value` & `hideCompleted.value`
  // 返回过滤后的 todo 项目
})
```

</div>
<div class="html">

```js{10-13}
import { createApp, ref, computed } from 'vue'

createApp({
  setup() {
    const hideCompleted = ref(false)
    const todos = ref([
      /* ... */
    ])

    const filteredTodos = computed(() => {
      // 根据 `todos.value` & `hideCompleted.value`
      // 返回过滤后的 todo 项目
    })

    return {
      // ...
    }
  }
})
```

</div>

</div>

```diff
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

计算属性会自动跟踪其计算中所使用的到的其他响应式状态，并将它们收集为自己的依赖。计算结果会被缓存，并只有在其依赖发生改变时才会被自动更新。

现在，试着添加 `filteredTodos` 计算属性并实现计算逻辑！如果实现正确，在隐藏已完成项目的状态下勾选一个 todo，它也应当被立即隐藏。
