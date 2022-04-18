# 生命周期钩子 {#lifecycle-hooks}

每个 Vue 组件实例在创建时都需要经历一系列的初始化步骤，比如设置好数据侦听，编译模板，挂载实例到 DOM 以及数据改变时更新 DOM。在此过程中，它也会运行称为生命周期钩子的函数，让开发者有机会在特定阶段添加自己的代码。

## 注册周期钩子 {#registering-lifecycle-hooks}

举个例子，<span class="composition-api">`onMounted`</span><span class="options-api">`mounted`</span> 钩子可以用来在组件完成初始渲染并创建 DOM 节点后运行代码。

<div class="composition-api">

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`the component is now mounted.`)
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  mounted() {
    console.log(`the component is now mounted.`)
  }
}
```

</div>

还有其他一些钩子，会在实例生命周期的不同阶段被调用，最常用的是 <span class="composition-api">[`onMounted`](/api/composition-api-lifecycle.html#onmounted)，[`onUpdated`](/api/composition-api-lifecycle.html#onupdated) 和 [`onUnmounted`](/api/composition-api-lifecycle.html#onunmounted)。所有生命周期钩子的完整参考及其用法可以在[这里](/api/composition-api-lifecycle.html)看到。</span><span class="options-api">[`mounted`](/api/options-lifecycle.html#mounted)，[`updated`](/api/options-lifecycle.html#updated) 和 [`unmounted`](/api/options-lifecycle.html#unmounted)。</span>

<div class="options-api">

所有生命周期钩子函数的 `this` 上下文都会自动指向当前调用它的组件实例。注意：避免用箭头函数来定义生命周期钩子，因为如果这样的话你将无法在函数中通过 `this` 获取组件实例。

</div>

<div class="composition-api">

当调用 `onMounted` 时，Vue 会自动将注册的回调函数与当前活动组件实例相关联。这就要求这些钩子在组件设置时同步注册。例如请不要这样做：

```js
setTimeout(() => {
  onMounted(() => {
    // 这将不会正常工作
  })
}, 100)
```

请注意，这并不意味着对 `onMounted` 的调用必须放在 `setup()` 或 `<script setup>` 内的词法环境下。`onMounted()` 也可以在一个外部函数中调用，只要调用栈是同步的，且最终起源自 `setup()`。

</div>

## 生命周期图示 {#lifecycle-diagram}

下面是实例生命周期的图表。你不需要完全理解当前正在进行的所有事情，但随着你学习和构建更多内容，它将是一个有用的参考。

![组件生命周期图示](./images/lifecycle.png)

<!-- https://www.figma.com/file/Xw3UeNMOralY6NV7gSjWdS/Vue-Lifecycle -->

有关所有生命周期钩子及其各自用例的详细信息，请参考<span class="composition-api">[生命周期钩子 API 手册](/api/composition-api-lifecycle.html)</span><span class="options-api">[生命周期钩子 API 手册](/api/options-lifecycle.html)</span>。
