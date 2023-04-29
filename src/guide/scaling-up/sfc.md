# 单文件组件 {#single-file-components}

## 介绍 {#introduction}

Vue 的单文件组件 (即 `*.vue` 文件，英文 Single-File Component，简称 **SFC**) 是一种特殊的文件格式，使我们能够将一个 Vue 组件的模板、逻辑与样式封装在单个文件中。下面是一个单文件组件的示例：

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const greeting = ref('Hello World!')
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

如你所见，Vue 的单文件组件是网页开发中 HTML、CSS 和 JavaScript 三种语言经典组合的自然延伸。`<template>`、`<script>` 和 `<style>` 三个块在同一个文件中封装、组合了组件的视图、逻辑和样式。完整的语法定义可以查阅 [SFC 语法说明](/api/sfc-spec)。

## 为什么要使用 SFC {#why-sfc}

使用 SFC 必须使用构建工具，但作为回报带来了以下优点：

- 使用熟悉的 HTML、CSS 和 JavaScript 语法编写模块化的组件
- [让本来就强相关的关注点自然内聚](#what-about-separation-of-concerns)
- 预编译模板，避免运行时的编译开销
- [组件作用域的 CSS](/api/sfc-css-features)
- [在使用组合式 API 时语法更简单](/api/sfc-script-setup)
- 通过交叉分析模板和逻辑代码能进行更多编译时优化
- [更好的 IDE 支持](/guide/scaling-up/tooling#ide-support)，提供自动补全和对模板中表达式的类型检查
- 开箱即用的模块热更新 (HMR) 支持

SFC 是 Vue 框架提供的一个功能，并且在下列场景中都是官方推荐的项目组织方式：

- 单页面应用 (SPA)
- 静态站点生成 (SSG)
- 任何值得引入构建步骤以获得更好的开发体验 (DX) 的项目

当然，在一些轻量级场景下使用 SFC 会显得有些杀鸡用牛刀。因此 Vue 同样也可以在无构建步骤的情况下以纯 JavaScript 方式使用。如果你的用例只需要给静态 HTML 添加一些简单的交互，你可以看看 [petite-vue](https://github.com/vuejs/petite-vue)，它是一个 6 kB 左右、预优化过的 Vue 子集，更适合渐进式增强的需求。

## SFC 是如何工作的 {#how-it-works}

Vue SFC 是一个框架指定的文件格式，因此必须交由 [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) 编译为标准的 JavaScript 和 CSS，一个编译后的 SFC 是一个标准的 JavaScript(ES) 模块，这也意味着在构建配置正确的前提下，你可以像导入其他 ES 模块一样导入 SFC：

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

SFC 中的 `<style>` 标签一般会在开发时注入成原生的 `<style>` 标签以支持热更新，而生产环境下它们会被抽取、合并成单独的 CSS 文件。

你可以在 [Vue SFC 演练场](https://play.vuejs.org/)中实际使用一下单文件组件，同时可以看到它们最终被编译后的样子。

在实际项目中，我们一般会使用集成了 SFC 编译器的构建工具，比如 [Vite](https://cn.vitejs.dev/) 或者 [Vue CLI](https://cli.vuejs.org/zh/) (基于 [webpack](https://webpack.js.org/))，Vue 官方也提供了脚手架工具来帮助你尽可能快速地上手开发 SFC。更多细节请查看 [SFC 工具链](/guide/scaling-up/tooling)章节。

## 如何看待关注点分离？ {#what-about-separation-of-concerns}

一些有着传统 Web 开发背景的用户可能会因为 SFC 将不同的关注点集合在一处而有所顾虑，觉得 HTML/CSS/JS 应当是分离开的！

要回答这个问题，我们必须对这一点达成共识：**前端开发的关注点不是完全基于文件类型分离的**。前端工程化的最终目的都是为了能够更好地维护代码。关注点分离不应该是教条式地将其视为文件类型的区别和分离，仅仅这样并不够帮我们在日益复杂的前端应用的背景下提高开发效率。

在现代的 UI 开发中，我们发现与其将代码库划分为三个巨大的层，相互交织在一起，不如将它们划分为松散耦合的组件，再按需组合起来。在一个组件中，其模板、逻辑和样式本就是有内在联系的、是耦合的，将它们放在一起，实际上使组件更有内聚性和可维护性。

即使你不喜欢单文件组件这样的形式而仍然选择拆分单独的 JavaScript 和 CSS 文件，也没关系，你还是可以通过[资源导入](/api/sfc-spec#src-imports)功能获得热更新和预编译等功能的支持。
