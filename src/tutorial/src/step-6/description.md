# 条件渲染 {#conditional-rendering}

我们可以使用 `v-if` 指令来有条件地渲染元素：

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

这个 `<h1>` 标签只会在 `awesome` 的值为[真值 (Truthy)](https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy) 时渲染。若 `awesome` 更改为[假值 (Falsy)](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy)，它将被从 DOM 中移除。

我们也可以使用 `v-else` 和 `v-else-if` 来表示其他的条件分支：

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

现在，示例程序同时展示了两个 `<h1>` 标签，并且按钮不执行任何操作。尝试给它们添加 `v-if` 和 `v-else` 指令，并实现 `toggle()` 方法，让我们可以使用按钮在它们之间切换。

更多细节请查阅 `v-if`：<a target="_blank" href="/guide/essentials/conditional.html">指南 - 条件渲染</a>
