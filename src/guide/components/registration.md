# 组件注册 {#component-registration}

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components" title="组件注册 - 免费 Vue.js 课程"/>

> 阅读此章节时，我们假设你已经读过[组件基础](/guide/essentials/component-basics)，若你对组件还完全不了解，请先阅读它。

一个 Vue 组件需要被“注册”使得 Vue 在渲染模板时能找到其实现。有两种方式来注册组件：全局注册和局部注册。

## 全局注册 {#global-registration}

我们可以使用 `app.component()` 方法，让组件在当前 [Vue 应用](/guide/essentials/application)中全局可用。

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

如果使用单文件组件，你可以注册被导入的 `.vue` 文件：

```js
import MyComponent from './App.vue'

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

所有的子组件也可以使用全局注册的组件，这意味着这三个组件也都可以在*彼此内部*使用。

## 局部注册 {#local-registration}

全局注册虽然很方便，但有以下几个短板：

1. 全局注册使构建系统无法移除未使用的组件 (也叫“tree-shaking”)。如果你全局注册了一个组件，却一次都没有使用，它仍然会出现在最终的构建产物中。

2. 全局注册在大型项目中使项目的依赖关系变得不那么明确。在父组件中使用子组件时，很难定位子组件的实现。这可能会影响未来长期的可维护性，类似于使用过多的全局变量。

局部注册将注册组件的可用性限定在当前组件的范围内。它使依赖关系更加明确，并且对 tree-shaking 更加友好。

<div class="composition-api">

当你在单文件组件中使用了 `<script setup>`，导入的组件可以在本地使用而无需注册：

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

如果不在 `<script setup>` 中，你将需要使用 `components` 选项：

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

请注意：**局部注册组件在后代组件中并<i>不</i>可用**。在这个例子中，`ComponentA` 注册后仅在当前组件可用，而在任何的子组件或后代组件中都不可用。

## 组件名格式 {#component-name-casing}

在整个指引中，我们都使用 PascalCase 作为组件名的注册格式，这是因为：

1. PascalCase 是合法的 JavaScript 标识符。这使得在 JavaScript 中导入和注册组件都很容易，同时 IDE 也能提供较好的自动补全。

2. `<PascalCase />` 在模板中更明显地表明了这是一个 Vue 组件，而不是原生 HTML 元素。同时也能够将 Vue 组件和自定义元素 (web components) 区分开来。

在单文件组件和内联字符串模板中，我们都推荐这样做。但是，PascalCase 的标签名在 DOM 模板中是不可用的，详情参见 [DOM 模板解析注意事项](/guide/essentials/component-basics.html#dom-template-parsing-caveats)。

幸运的是，Vue 支持将使用 kebab-case 的标签解析为使用 PascalCase 注册的组件。这意味着一个以 `MyComponent` 为名注册的组件，在模板中可以通过 `<MyComponent>` 或 `<my-component>` 引用。这允许我们在不同来源的模板中始终使用同一份 JavaScript 组件注册代码。
