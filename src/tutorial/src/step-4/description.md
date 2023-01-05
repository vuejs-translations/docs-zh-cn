# 事件监听 {#event-listeners}

我们可以使用 `v-on` 指令监听 DOM 事件：

```vue-html
<button v-on:click="increment">{{ count }}</button>
```

因为其经常使用，`v-on` 也有一个简写语法：

```vue-html
<button @click="increment">{{ count }}</button>
```

<div class="options-api">

此处，`increment` 引用了一个使用 `methods` 选项声明的函数：

<div class="sfc">

```js{7-12}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // 更新组件状态
      this.count++
    }
  }
}
```

</div>
<div class="html">

```js{7-12}
createApp({
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // 更新组件状态
      this.count++
    }
  }
})
```

</div>

在方法中，我们可以使用 `this` 来访问组件实例。组件实例会暴露 `data` 中声明的数据属性。我们可以通过改变这些属性的值来更新组件状态。

</div>

<div class="composition-api">

<div class="sfc">

此处，`increment` 引用了一个在 `<script setup>` 中声明的函数：

```vue{6-9}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  // 更新组件状态
  count.value++
}
</script>
```

</div>

<div class="html">

此处，`increment` 引用了一个从 `setup()` 对象返回的方法：

```js{$}
setup() {
  const count = ref(0)

  function increment(e) {
    // 更新组件状态
    count.value++
  }

  return {
    count,
    increment
  }
}
```

</div>

在函数中，我们可以通过修改 ref 来更新组件状态。

</div>

事件处理函数也可以使用内置表达式，并且可以使用修饰符简化常见任务。这些细节包含在<a target="_blank" href="/guide/essentials/event-handling.html">指南 - 事件处理</a>。

现在，尝试自行实现 `increment` <span class="options-api">方法</span><span class="composition-api">函数</span>并通过使用 `v-on` 将其绑定到按钮上。
