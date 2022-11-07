# 组件 {#components}

目前为止，我们只使用了单个组件。真正的 Vue 应用往往是由嵌套组件创建的。

父组件可以在模板中渲染另一个组件作为子组件。要使用子组件，我们需要先导入它：

<div class="composition-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'
```

</div>
</div>

<div class="options-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  }
}
```

我们还需要使用 `components` 选项注册组件。这里我们使用对象属性的简写形式在 `ChildComp` 键下注册 `ChildComp` 组件。

</div>
</div>

<div class="sfc">

然后我们就可以在模板中使用组件，就像这样：

```vue-html
<ChildComp />
```

</div>

<div class="html">

```js
import ChildComp from './ChildComp.js'

createApp({
  components: {
    ChildComp
  }
})
```

我们还需要使用 `components` 选项注册组件。这里我们使用对象属性的简写形式在 `ChildComp` 键下注册 `ChildComp` 组件。

因为我们是在 DOM 中编写模板语法，因此需要遵循浏览器的大小写敏感的标签解析规则。所以，我们需要使用 kebab-case 的名字来引用子组件：

```vue-html
<child-comp></child-comp>
```

</div>


现在自己尝试一下——导入子组件并在模板中渲染它。
