# 插槽 {#slots}

除了通过 props 传递数据外，父组件还可以通过**插槽** (slots) 将模板片段传递给子组件：

<div class="sfc">

```vue-html
<ChildComp>
  This is some slot content!
</ChildComp>
```

</div>
<div class="html">

```vue-html
<child-comp>
  This is some slot content!
</child-comp>
```

</div>

在子组件中，可以使用 `<slot>` 元素作为插槽出口 (slot outlet) 渲染父组件中的插槽内容 (slot content)：

<div class="sfc">

```vue-html
<!-- 在子组件的模板中 -->
<slot/>
```

</div>
<div class="html">

```vue-html
<!-- 在子组件的模板中 -->
<slot></slot>
```

</div>

`<slot>` 插口中的内容将被当作“默认”内容：它会在父组件没有传递任何插槽内容时显示：

```vue-html
<slot>Fallback content</slot>
```

现在我们没有给 `<ChildComp>` 传递任何插槽内容，所以你将看到默认内容。让我们利用父组件的 `msg` 状态为子组件提供一些插槽内容吧。
