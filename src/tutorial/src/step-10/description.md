# 侦听器 {#watchers}

有时我们需要响应性地执行一些“副作用”——例如，当一个数字改变时将其输出到控制台。我们可以通过侦听器来实现它：

<div class="composition-api">

```js
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // 没错，console.log() 是一个副作用
  console.log(`new count is: ${newCount}`)
})
```

`watch()` 可以直接侦听一个 ref，并且只要 `count` 的值改变就会触发回调。`watch()` 也可以侦听其他类型的数据源——更多详情请参阅<a target="_blank" href="/guide/essentials/watchers.html">指南 - 侦听器</a>。

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  watch: {
    count(newCount) {
      // 没错，console.log() 是一个副作用
      console.log(`new count is: ${newCount}`)
    }
  }
}
```

这里，我们使用 `watch` 选项来侦听 `count` 属性的变化。当 `count` 改变时，侦听回调将被调用，并且接收新值作为参数。更多详情请参阅<a target="_blank" href="/guide/essentials/watchers.html">指南 - 侦听器</a>。

</div>

一个比在控制台输出更加实际的例子是当 ID 改变时抓取新的数据。在右边的例子中就是这样一个组件。该组件被挂载时，会从模拟 API 中抓取 todo 数据，同时还有一个按钮可以改变要抓取的 todo 的 ID。现在，尝试实现一个侦听器，使得组件能够在按钮被点击时抓取新的 todo 项目。
