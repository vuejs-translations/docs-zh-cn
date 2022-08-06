# 表单绑定 {#form-bindings}

我们可以同时使用 `v-bind` 和 `v-on` 来在表单的输入元素上创建双向绑定：

```vue-html
<input :value="text" @input="onInput">
```

<div class="options-api">

```js
methods: {
  onInput(e) {
    // v-on 处理函数会接收原生 DOM 事件
    // 作为其参数。
    this.text = e.target.value
  }
}
```

</div>

<div class="composition-api">

```js
function onInput(e) {
  // v-on 处理函数会接收原生 DOM 事件
  // 作为其参数。
  text.value = e.target.value
}
```

</div>

试着在文本框里输入——你会看到 `<p>` 里的文本也随着你的输入更新了。

为了简化双向绑定，Vue 提供了一个 `v-model` 指令，它实际上是上述操作的语法糖：

```vue-html
<input v-model="text">
```

`v-model` 会将被绑定的值与 `<input>` 的值自动同步，这样我们就不必再使用事件处理函数了。

`v-model` 不仅支持文本输入框，也支持诸如多选框、单选框、下拉框之类的输入类型。我们在<a target="_blank" href="/guide/essentials/forms.html">指南 - 表单绑定</a>中讨论了更多的细节。

现在，试着用 `v-model` 把代码重构一下吧。
