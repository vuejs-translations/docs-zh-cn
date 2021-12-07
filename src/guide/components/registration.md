# 组件注册 {#component-registration}

> 阅读此章节时，我们假设你应该已经读过了 [组件基础](/guide/essentials/component-basics)，若你对组件还完全不了解，请先阅读它。

一个 Vue 组件需要被 “注册” 使得 Vue 在渲染模板时能找到其实现。有两种方式来注册组件：全局注册和局部注册。

## 全局注册 {#global-registration}

我们可以使用 `app.component()` 方法，让组件在当前 [Vue 应用](/guide/essentials/application) 中全局可用。

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // 注册的名字
  'MyComponent',
  // 组件的实现
  {
    /* ... */
  }
)
```

如果使用单文件组件，你则可以从其他 `.vue` 文件中注册组件：

```js
import MyComponent from './App.vue`

app.component('MyComponent', MyComponent)
```

`app.component()` 方法可以被链式调用：

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

全局注册的组件可以在此应用的任意组件的模板中使用：

```vue-html
<!-- 这在当前应用的任意组件中都可用 -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

甚至是所有的子组件也是可以用的，换句话说，你甚至可以在这三个组件内的模板上使用他们，或者三者之间互相调用。

## 局部注册 {#local-registration}

虽然十分方便，但全局注册有以下几个短板：

1. 全局注册使构建系统无法自动移除未使用的组件。（也叫 “tree-shaking”）如果你全局注册了一个组件，却一次都没有使用，它仍然会出现在最终的构建产物中。

2. 全局注册在大型项目中使项目的依赖关系变得更不显式。在父组件使用它时，很难定位子组件的实现。这可能会影响未来长期的可维护性，类似于使用过多的全局变量。

局部注册将注册组件的可用性限定在当前组件的范围内。它使依赖关系更加明确，并且对 tree-shaking 更加友好。

<div class="composition-api">

当你在单文件组件中使用了 `<script setup>`，导入的组件会自动进行局部注册：

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

如果不使用 `<script setup>`，你需要使用 `components` 选项：

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

</div>
<div class="options-api">

局部注册需要使用 `components` 选项：

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

</div>

对于每个 `components` 对象里的属性，它们的 key 名就是注册的组件名，而值就是相应组件的实现。上面的例子中使用的是 ES2015 的缩写语法，等价于：

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

请注意：**局部注册组件在后代组件中 _并不可用_**。在这个例子中，`ComponentA` 注册后仅在当前组件可用，而在任何的子组件或后代组件中都不可用。

## 组件名格式 {#component-name-casing}

在整个指引中，我们都使用 PascalCase 作为组件名字的注册格式，这是因为：

1. PascalCase 是合法的 JavaScript 标识符。这使得在 JavaScript 作导入和注册组件都很容易，同时 IDE 也能提供较好的的自动补全。

2. `<PascalCase />` 使得 Vue 组件在模板中相较于一个一般的原生 HTML 元素更明显。同时也将 Vue 组件和自定义组件区分开来（Web components）。

在单文件组件和内联字符串模板中，我们都推荐这样做。但是，PascalCase 的标签名在 DOM 模板中是不可用的，详情参见 [DOM 模板解析注意事项](/guide/essentials/component-basics.html#dom-template-parsing-caveats)。

幸运的是，Vue 支持将那些用 PascalCase 注册的组件转换为 kebab-case 形式的标签名。这意味着一个以 `MyComponent` 为名注册的组件，可以在模板中既可以使用 `<MyComponent>` 也可以使用 `<my-component>`。因此不管模板来源是什么，我们的 JavaScript 代码都始终只有一套。
