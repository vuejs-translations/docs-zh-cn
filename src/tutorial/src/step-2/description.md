# 声明式渲染 {#declarative-rendering}

<div class="sfc">

你在编辑器中看到的是一个 Vue 单文件组件 (Single-File Component，缩写为 SFC)。SFC 是一种可复用的代码组织形式，它将从属于同一个组件的 HTML、CSS 和 JavaScript 封装在使用 `.vue` 后缀的文件中。

</div>

Vue 的核心功能是**声明式渲染**：通过扩展于标准 HTML 的模板语法，我们可以根据 JavaScript 的状态来描述 HTML 应该是什么样子的。当状态改变时，HTML 会自动更新。

<div class="composition-api">

能在改变时触发更新的状态被称作是**响应式**的。我们可以使用 Vue 的 `reactive()` API 来声明响应式状态。由 `reactive()` 创建的对象都是 JavaScript [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，其行为与普通对象一样：

```js
import { reactive } from 'vue'

const counter = reactive({
  count: 0
})

console.log(counter.count) // 0
counter.count++
```

`reactive()` 只适用于对象 (包括数组和内置类型，如 `Map` 和 `Set`)。而另一个 API `ref()` 则可以接受任何值类型。`ref` 会返回一个包裹对象，并在 `.value` 属性下暴露内部值。

```js
import { ref } from 'vue'

const message = ref('Hello World!')

console.log(message.value) // "Hello World!"
message.value = 'Changed'
```

`reactive()` 和 `ref()` 的细节在<a target="_blank" href="/guide/essentials/reactivity-fundamentals.html">指南 - 响应式基础</a>一节中有进一步讨论。

<div class="sfc">

在组件的 `<script setup>` 块中声明的响应式状态，可以直接在模板中使用。下面展示了我们如何使用双花括号语法，根据 `counter` 对象和 `message` ref 的值渲染动态文本：

</div>

<div class="html">

传入 `createApp()` 的对象是一个 Vue 组件。组件的状态应该在 `setup()` 函数中声明，并使用一个对象返回。

```js{2,5}
setup() {
  const counter = reactive({ count: 0 })
  const message = ref('Hello World!')
  return {
    counter,
    message
  }
}
```

返回对象中的属性可以在模板中使用。下面展示了我们如何使用双花括号语法，根据 `message` 的值来渲染动态文本：

</div>

```vue-html
<h1>{{ message }}</h1>
<p>count is: {{ counter.count }}</p>
```

注意我们在模板中访问的 `message` ref 时不需要使用 `.value`：它会被自动解包，让使用更简单。

</div>

<div class="options-api">

能在改变时触发更新的状态被认为是**响应式**的。在 Vue 中，响应式状态被保存在组件中。<span class="html">在示例代码中，传递给 `createApp()` 的对象是一个组件。</span>

我们可以使用 `data` 组件选项来声明响应式状态，该选项应该是一个返回对象的函数：

<div class="sfc">

```js{3-5}
export default {
  data() {
    return {
      message: 'Hello World!'
    }
  }
}
```

</div>
<div class="html">

```js{3-5}
createApp({
  data() {
    return {
      message: 'Hello World!'
    }
  }
})
```

</div>

`message` 属性可以在模板中使用。下面展示了我们如何使用双花括号法，根据 `message` 的值来渲染动态文本：

```vue-html
<h1>{{ message }}</h1>
```

</div>

在双花括号中的内容并不只限于标识符或路径——我们可以使用任何有效的 JavaScript 表达式。

```vue-html
<h1>{{ message.split('').reverse().join('') }}</h1>
```

<div class="composition-api">

现在，试着自己创建一些响应式状态，用它来为模板中的 `<h1>` 渲染动态的文本内容。

</div>

<div class="options-api">

现在，试着自己创建一个数据属性，用它来为模板中的 `<h1>` 渲染动态的文本内容。

</div>
