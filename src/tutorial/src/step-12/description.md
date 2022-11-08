# Props {#props}

子组件可以通过 **props** 从父组件接受动态数据。首先，需要声明它所接受的 props：

<div class="composition-api">
<div class="sfc">

```vue
<!-- ChildComp.vue -->
<script setup>
const props = defineProps({
  msg: String
})
</script>
```

注意 `defineProps()` 是一个编译时宏，并不需要导入。一旦声明，`msg` prop 就可以在子组件的模板中使用。它也可以通过 `defineProps()` 所返回的对象在 JavaScript 中访问。

</div>

<div class="html">

```js
// 在子组件中
export default {
  props: {
    msg: String
  },
  setup(props) {
    // 访问 props.msg
  }
}
```

一旦声明，`msg` prop 就会暴露在 `this` 上，并可以在子组件的模板中使用。接收到的 props 会作为第一个参数传递给 `setup()`。

</div>

</div>

<div class="options-api">

```js
// 在子组件中
export default {
  props: {
    msg: String
  }
}
```

一旦声明，`msg` prop 就会暴露在 `this` 上，并可以在子组件的模板中使用。

</div>

父组件可以像声明 HTML attributes 一样传递 props。若要传递动态值，也可以使用 `v-bind` 语法：

<div class="sfc">

```vue-html
<ChildComp :msg="greeting" />
```

</div>
<div class="html">

```vue-html
<child-comp :msg="greeting"></child-comp>
```

</div>

现在在编辑器中自己尝试一下吧。
