# 插槽

除了通过 props 传递数据外，父组件还可以通过 **slots** 传递模板片段给子组件：

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

在子组件中，可以使用 `<slot>` 元素作为插口渲染父组件中插槽的内容：

<div class="sfc">

```vue-html
<!-- 在子组件中 -->
<slot/>
```

</div>
<div class="html">

```vue-html
<!-- 在子组件中 -->
<slot></slot>
```

</div>

`<slot>` 插口的内容将被当作“默认”内容：它会在父组件没有传递任何插槽内容的时候显示：

```vue-html
<slot>Fallback content</slot>
```

现在我们没有传递任何插槽内容给 `<ChildComp>`，所以你将看到默认内容。让我们使用父组件的 `msg` 状态为子组件提供一些插槽内容吧。
