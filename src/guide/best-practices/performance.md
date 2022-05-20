---
outline: deep
---

# 性能 {#performance}

## 概述 {#overview}

Vue 的设计对于大多数常见的使用情况来说都是性能优秀的，不需要太多的手动优化。然而，总有一些具有挑战性的场景需要进行额外的细微调整。在本节中，我们将讨论当涉及到 Vue 应用程序的性能时，你应该注意什么。

首先，让我们讨论一下网络性能的两个主要方面：

- **页面加载性能**：应用展示出内容与首次访问时变为可交互的速度。这通常是使用网络的重要指标来衡量，如最大的[最大内容绘制 (LCP)](https://web.dev/lcp/) 和[首次输入延迟](https://web.dev/fid/)。

- **更新性能**：应用响应用户输入更新的速度。举个例子，当用户在一个搜索框中输入时列表的更新速度，或者用户在一个单页面应用 (SPA) 中点击链接跳转页面时的切换速度。

虽然最理想的情况是将两者都最大化，但是不同的前端架构往往会影响到在这些方面是否能达到更理想的性能。此外，你所构建的应用程序的类型极大地影响了你在性能方面应该优先考虑的问题。因此，确保最佳性能的第一步是为你的应用类型挑选合适的架构：

- 查看[使用 Vue 的多种方式](/guide/extras/ways-of-using-vue.html)这一章看看如何用不同的方式围绕 Vue 组织架构。

- Jason Miller 在[应用标本](https://jasonformat.com/application-holotypes/)一文中讨论了 Web 应用的类型以及它们各自的理想的实现/交付方式。

## 分析选项 {#profiling-options}

为了提高性能，我们首先需要知道如何衡量它。在这方面，有一些很棒的工具可以提供帮助：

用于生产部署的负载性能分析：

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

用于本地开发期间的性能分析：

- [Chrome 开发者工具“性能”面板](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - [`app.config.performance`](/api/application.html#app-config-performance) 将会开启 Vue 特有的性能标记，标记在 Chrome 开发者工具的性能时间线上。
- [Vue 开发者扩展](/guide/scaling-up/tooling.html#browser-devtools)也提供了性能分析的功能。

## 页面加载优化 {#page-load-optimizations}

页面加载优化有许多跟框架无关的方面 - 这份 [web.dev 指南](https://web.dev/fast/)提供了一个全面的总结。这里，我们将主要关注和 Vue 相关的技巧。

### 包体积与 Tree-shaking 优化 {#bundle-size-and-tree-shaking}

一个最有效的提升页面加载速度的方法就是压缩 JavaScript 打包产物的体积。当使用 Vue 时有下面一些办法来减小打包产物体积：

- 尽可能地采用构建步骤

  - 如果使用的是相对现代的打包工具，许多 Vue 的 API 都是可以被 [tree-shake](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) 的。举个例子，如果你根本没有使用到内置的 `<Transition>` 组件，它将不会被打包进入最终的产物里。Tree-shaking 也可以移除你源代码中其他未使用到的模块。

  - 当使用了构建步骤时，模板会被预编译，因此我们无须在浏览器中载入 Vue 编译器。这在同样最小化加上 gzip 优化下会相对缩小 **14kb** 并避免运行时的编译开销。

- 在引入新的依赖项时要小心包体积膨胀！在现实的应用中，包体积膨胀通常因为无意识地引入了过重的依赖导致的。

  - 如果使用了构建步骤，应当尽量选择提供 ES 模块格式的依赖，它们对 tree-shaking 更友好。举个例子，选择 `lodash-es` 比 `lodash` 更好。

  - 查看依赖的体积，并评估与其所提供的功能之间的性价比。如果依赖对 tree-shaking 友好，实际增加的体积大小将取决于你从它之中导入的 API。像 [bundlejs.com](https://bundlejs.com/) 这样的工具可以用来做快速的检查，但是根据实际的构建设置来评估总是最准确的。

- 如果你基本上是以渐进式集成的模式使用 Vue，并选择避免使用构建步骤，请考虑使用 [petite-vue](https://github.com/vuejs/petite-vue) (只有 **6kb**) 来代替。

### 代码拆分 {#code-splitting}

代码拆分是指构建工具将应用程序包拆分为多个较小的块，然后可以按需或并行加载。通过适当的代码拆分，页面加载时需要的功能可以立即下载，而额外的块只在需要时才加载，从而提高性能。

像 Rollup(Vite 就是基于它之上开发的) 或者 Webpack 这样的打包器可以通过探测 ESM 动态导入的语法来自动拆分代码块：

```js
// lazy.js 及其依赖会被拆分到一个单独的块中
// 并只在 `loadLazy()` 调用时才加载
function loadLazy() {
  return import('./lazy.js')
}
```

懒加载对于页面初次加载时的优化帮助极大，它帮助应用暂时略过了那些不是立即需要的功能。在 Vue 应用中，这常常与 Vue 的[异步组件](/guide/components/async.html)搭配使用，为组件树创建分离的代码块：

```js
import { defineAsyncComponent } from 'vue'

// 会为 Foo.vue 及其依赖创建单独的一个块
// 它只会按需加载
//（即该异步组件在页面中被渲染时）
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

如果在客户端侧通过 Vue Router 构建了路由，那么强烈建议使用异步组件作为路由组件。查看[懒加载路由](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)了解更多细节。

### SSR / SSG {#ssr-ssg}

纯粹的客户端渲染存在内容到达时间缓慢的问题。这可以通过采用服务端渲染 (SSR) 或者静态站点生成 (SSG) 来进行优化。你可以查看 [SSR 指引](/guide/scaling-up/ssr.html)了解更多细节。

## 更新优化 {#update-optimizations}

### props 稳定性 {#props-stability}

在 Vue 之中，一个子组件只会在其至少一个 props 改变时才会更新。我们来思考以下示例：

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
```

在 `<ListItem>` 组件中，它使用了 `id` 和 `activeId` 两个 props 来确定它是否是当前活跃的那一项。虽然这是可行的，但问题是每当 `activeId` 更新时，列表中的**每一个** `<ListItem>` 都会跟着更新！

理想情况下，只有活跃状态发生改变的项才应该更新。我们可以将活跃状态比对的逻辑移入父组件来实现这一点，然后让 `<ListItem>` 改为接收一个 `active` prop：

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="item.id === activeId" />
```

现在，对与大多数的组件来说，`activeId` 改变时，它们的 `active` prop 都会保持不变，因此它们无需再更新。总而言之，核心要义就是尽量保持传给子组件的 props 稳定。

### `v-once` {#v-once}

`v-once` 是一个内置的指令，可以用来渲染依赖运行时数据但无需再更新的内容。它的整个子树都会在未来的更新中被跳过。查看它的 [API 参考手册](/api/built-in-directives.html#v-once)可以了解更多细节。

### `v-memo` {#v-memo}

`v-memo` 是一个内置指令，可以用来有条件地跳过某些大型子树或者 `v-for` 列表的更新。查看它的 [API 参考手册](/api/built-in-directives.html#v-memo)可以了解更多细节。

## 总体优化 {#general-optimizations}

> 以下提示会同时影响页面加载和更新性能。

### 大型虚拟列表 {#virtualize-large-lists}

所有的前端应用中最常见的性能问题就是渲染大型列表。无论一个框架性能有多好，渲染成千上万个列表项**都会**变得很慢，因为浏览器需要处理大量的 DOM 节点。

但是，我们并不需要立刻渲染出全部的列表。在大多数场景中，用户的屏幕尺寸只会展示这个巨大列表中的一小部分。我们可以通过**列表虚拟化**来提升性能，这项技术使我们只需要渲染用户视口中能看到的部分。

要实现列表虚拟化并不简单，幸运的是，你可以直接使用现有的社区库：

- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)

### 减少大型不可变结构的响应性开销 {#reduce-reactivity-overhead-for-large-immutable-structures}

Vue 的响应性系统默认是深度的。虽然这让状态管理变得更直观，但在数据变大时它也的确创造了不小的性能负担，因为每个属性访问都将触发代理的依赖追踪。试想一下当一次渲染需要访问 100,000+ 属性的时候，这个开销在处理大型数组或层级很深的对象时变得无法忽略，因此，我们应该控制它只影响非常具体的使用情况。

Vue 确实也为此提供了一种解决方案，通过使用 [`shallowRef()`](/api/reactivity-advanced.html#shallowref) 和 [`shallowReactive()`](/api/reactivity-advanced.html#shallowreactive) 来选择退出深度响应。浅层式 API 创建的状态只在其顶层是响应式的，并原封不动地显示所有下面层级的对象。这使得对深层级属性的访问变得更快，但代价是，我们现在必须将所有深层级对象视为不可变的，并且只能通过替换整个根状态来触发更新：

```js
const shallowArray = shallowRef([
  /* 巨大的列表，里面包含深层的对象 */
])

// 这不会触发更新...
shallowArray.value.push(newObject)
// 这才会触发更新
shallowArray.value = [...shallowArr.value, newObject]

// 这不会触发更新...
shallowArray.value[0].foo = 1
// 这才会触发更新
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### 避免不必要的组件抽象 {#avoid-unnecessary-component-abstractions}

有些时候我们会去创建[无渲染组件](/guide/components/slots.html#renderless-components)或高阶组件 (用来渲染具有额外 props 的其他组件) 来实现更好的抽象或代码组织。虽然这并没有什么问题，但请记住，组件实例比普通 DOM 节点要昂贵得多，而且为了逻辑抽象创建太多组件实例将会导致性能损失。

请注意，只减少几个实例不会有明显的效果，所以如果该组件在应用程序中只渲染了几次，就不用担心了。考虑这种优化的最佳场景还是在大型列表中。想象一下一个有 100 项的列表，每项的组件都包含许多子组件。在这里去掉一个不必要的组件抽象，可能会减少数百个组件实例的无谓性能消耗。
