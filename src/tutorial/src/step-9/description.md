# 生命周期和模板引用 {#lifecycle-and-template-refs}

目前为止，Vue 为我们处理了所有的 DOM 更新，这要归功于响应性和声明式渲染。然而，有时我们也会不可避免地需要手动操作 DOM。

这时我们需要使用**模板引用**——也就是指向模板中一个 DOM 元素的 ref。我们需要通过<a target="_blank" href="/api/built-in-special-attributes.html#ref">这个特殊的 `ref` attribute</a> 来实现模板引用：

```vue-html
<p ref="pElementRef">hello</p>
```

<div class="composition-api">

要访问该引用，我们需要声明<span class="html">并暴露</span>一个同名的 ref：

<div class="sfc">

```js
const pElementRef = ref(null)
```

</div>
<div class="html">

```js
setup() {
  const pElementRef = ref(null)

  return {
    pElementRef
  }
}
```

</div>

注意这个 ref 使用 `null` 值来初始化。这是因为当 <span class="sfc">`<script setup>`</span><span class="html">`setup()`</span> 执行时，DOM 元素还不存在。模板引用 ref 只能在组件**挂载**后访问。

要在挂载之后执行代码，我们可以使用 `onMounted()` 函数：

<div class="sfc">

```js
import { onMounted } from 'vue'

onMounted(() => {
  // 此时组件已经挂载。
})
```

</div>
<div class="html">

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // 此时组件已经挂载。
    })
  }
})
```

</div>
</div>

<div class="options-api">

此元素将作为 `this.$refs.pElementRef` 暴露在 `this.$refs` 上。然而，你只能在组件**挂载**之后访问它。

要在挂载之后执行代码，我们可以使用 `mounted` 选项：

<div class="sfc">

```js
export default {
  mounted() {
    // 此时组件已经挂载。
  }
}
```

</div>
<div class="html">

```js
createApp({
  mounted() {
    // 此时组件已经挂载。
  }
})
```

</div>
</div>

这被称为**生命周期钩子**——它允许我们注册一个在组件的特定生命周期调用的回调函数。还有一些其他的钩子如 <span class="options-api">`created` 和 `updated`</span><span class="composition-api">`onUpdated` 和 `onUnmounted`</span>。更多细节请查阅<a target="_blank" href="/guide/essentials/lifecycle.html#lifecycle-diagram">生命周期图示</a>。

现在，尝试添加一个 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> 钩子，然后通过 <span class="options-api">`this.$refs.pElementRef`</span><span class="composition-api">`pElementRef.value`</span> 访问 `<p>`，并直接对其执行一些 DOM 操作。(例如修改它的 `textContent`)。
