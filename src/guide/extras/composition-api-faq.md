---
outline: deep
---

# 组合式 API FAQ {#composition-api-faq}

:::tip
这个 FAQ 假定你有一些使用 Vue 的经验，特别是使用 Vue 2 的经验，同时主要使用选项式 API。
:::

## 什么是组合式 API？ {#what-is-composition-api}

组合式 API 是一系列 API 的集合，使我们可以使用函数而不是声明选项的方式书写 Vue 组件。它是一个概括性的术语，涵盖了以下方面的 API：

- [响应性 API](/api/reactivity-core.html)：例如 `ref()` 和 `reactive()`，使我们可以直接创建响应式状态、计算属性和侦听器。

- [生命周期钩子](/api/composition-api-lifecycle.html)：例如 `onMounted()` 和 `onUnmounted()`，使我们可以在组件各个生命周期阶段添加逻辑。

- [依赖注入](/api/composition-api-dependency-injection.html)：例如 `provide()` 和 `inject()`，使我们可以在使用响应性 API 时，利用 Vue 的依赖注入系统。

组合式 API 是 Vue 3 的内置功能，而要想在 Vue 2 中使用，可以使用官方维护的插件 [`@vue/composition-api`](https://github.com/vuejs/composition-api)。在 Vue 3 中，组合式 API 基本上都会配合 [`<script setup>`](/api/sfc-script-setup.html) 语法在单文件组件中使用。下面是一个使用组合式 API 的组件示例：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 响应式状态
const count = ref(0)

// 更改状态、触发更新的函数
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log(`计数器初始值为 ${count.value}。`)
})
</script>

<template>
  <button @click="increment">点击了：{{ count }} 次</button>
</template>
```

虽然这套 API 的风格是基于函数的组合，但**组合式 API 并不是函数式编程**。组合式 API 是以 Vue 中数据可变的、细粒度的响应性系统为基础的，而函数式编程更强调数据不可变。

如果你对如何通过组合式 API 使用 Vue 感兴趣，可以切换页面左侧边栏上方的 API 偏好到组合式 API，然后重新从头阅读指引。

## 为什么要有组合式 API？ {#why-composition-api}

### 更好的逻辑复用 {#better-logic-reuse}

组合式 API 最基本的优势是它使我们能够通过[组合函数](/guide/reusability/composables.html)来实现更加简洁高效的逻辑复用。它解决了[所有 mixins 的缺陷](/guide/reusability/composables.html#vs-mixins)，那是选项式 API 中一种逻辑复用机制。

组合式 API 提供的更多逻辑复用可能性孵化了一些非常棒的社区项目，比如 [VueUse](https://vueuse.org/)，一个不断成长的工具型组合式函数集合。组合式 API 还为其他第三方状态管理库集成 Vue 的响应式系统提供了一套简洁清晰的机制，例如 [RxJS](https://vueuse.org/rxjs/readme.html#vueuse-rxjs)。

### 更灵活的代码组织 {#more-flexible-code-organization}

许多用户都喜欢选项式 API，因为在默认情况下就能够写出有组织的代码：任何东西都有其对应的选项来管理。然而，选项式 API 在单个组件的逻辑复杂到一定程度时，也面临了一些无法忽视的限制。这些限制主要体现在需要处理多个**逻辑关注点**的组件中，在许多 Vue 2 已经上线的生产应用中可以看到这一点。

我们以 Vue CLI GUI 中的文件浏览器组件为例：这个组件承担了以下几个逻辑关注点：

- 追踪当前文件夹的状态，展示其内容
- 处理文件夹的相关操作 (打开、关闭和刷新)
- 支持创建新文件夹
- 可以切换到只展示收藏的文件夹
- 可以开启对隐藏文件夹的展示
- 处理当前工作目录中的变更

这个组件[最原始的版本](https://github.com/vuejs/vue-cli/blob/a09407dd5b9f18ace7501ddb603b95e31d6d93c0/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue#L198-L404)是由选项式 API 写成的。如果我们为相同的逻辑关注点标上一种颜色，那将会是这样：

<img alt="folder component before" src="https://user-images.githubusercontent.com/499550/62783021-7ce24400-ba89-11e9-9dd3-36f4f6b1fae2.png" width="129" height="500" style="margin: 1.2em auto">

你可以看到，处理相同逻辑关注点的代码被强制拆分在了不同的选项中，位于文件的不同部分。在一个几百行的大组件中，要读懂代码中的一个逻辑关注点，只能在文件中反复上下滚动，可这件事不应该这么困难。另外，如果我们还想要将一个逻辑关注点抽离到一个可重用的工具函数中，需要从文件的不同部分中寻找到所需的正确片段。

而如果[用组合式 API 重构](https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e)这个组件，将会变成：

![重构后的文件夹组件](https://user-images.githubusercontent.com/499550/62783026-810e6180-ba89-11e9-8774-e7771c8095d6.png)

现在与同一个逻辑关注点相关的代码被归为了一组：我们无需再为了一个逻辑关注点在不同的选项块间来回滚动切换。此外，我们现在可以不费吹灰之力地将这一组代码移动到一个外部文件中，不再需要为了抽象而重新组织代码，大大降低了重构成本，这在长期维护的大型项目中非常关键。

### 更好的类型推导 {#better-type-inference}

近几年来，越来越多的开发者开始使用 [TypeScript](https://www.typescriptlang.org/) 书写更健壮可靠的代码，TypeScript 还提供了非常好的 IDE 开发支持。然而选项式 API 是在 2013 年创建的，那时并没有想到需要进行类型推导。因此我们做了一些[荒谬复杂的类型体操](https://github.com/vuejs/core/blob/44b95276f5c086e1d88fa3c686a5f39eb5bb7821/packages/runtime-core/src/componentPublicInstance.ts#L132-L165)来实现对选项式 API 的类型推导。但尽管做了这么多的努力，选项式 API 的类型推导仍然无法适配混入和依赖注入。

因此，很多想要搭配 TS 使用 Vue 的开发者采用了由 `vue-class-component` 提供的 Class API。然而，基于 Class 的 API 非常依赖 ES 装饰器，在 Vue 2019 年开发完成后，它仍是一个仅处于 stage 2 的语言功能。我们认为将这样一种不稳定的方案作为官方 API 的一种实现形式风险过高，在那之后装饰器提案还进行了一些较大的变动，在书写这篇文档时仍未到达 stage 3。另外，基于 Class 的 API 和选项式 API 在逻辑复用和代码组织方面有相同的限制。

相比之下，组合式 API 主要利用基本的变量和函数，它们本身就是类型友好的。用组合式 API 重写的代码可以享受到完整的类型推导，不需要书写太多类型标注。大多数时候，用 TypeScript 书写的组合式 API 代码和用 JavaScript 写都差不太多！这也同样让许多纯 JavaScript 用户能从 IDE 中享受到部分类型推导功能。

### 生产包体积更小 {#smaller-production-bundle-and-less-overhead}

搭配 `<script setup>` 使用组合式 API 比等价情况下的选项式 API 更高效，对代码压缩也更友好。这是由于 `<script setup>` 形式书写的组件模板被编译为了一个内联函数，和 `<script setup>` 中的代码位于同一作用域。不像选项式 API 需要依赖 `this` 上下文对象访问属性，被编译的模板可以直接访问 `<script setup>` 中定义的变量，无需一个代码实例从中代理。这对代码压缩更友好，因为变量的名字可以变得更短，但对象的属性名则不能。

## 与选项式 API 的关系 {#relationship-with-options-api}

### 权衡 {#trade-offs}

一些从选项式 API 迁移来的用户发现，他们的组合式 API 代码缺乏组织性，并得出了组合式 API 在代码组织方面“更糟糕”的结论。我们建议持有这类观点的用户从不同的角度看待这个问题。

诚然，组合式 API 不再提供用来指导你把自己的代码放进相应位置的“护栏”。作为回报，你可以像编写普通的 JavaScript 那样来编写组件代码。这意味着**你能够且应该将任何代码组织的最佳实践应用于你的组合式 API 的代码，就像你编写普通的 JavaScript 时那样**。如果你可以编写组织良好的 JavaScript，你也应该有能力编写组织良好的组合式 API 代码。

选项式 API 确实允许你在编写组件代码时“少思考”，这是许多用户喜欢它的原因。然而，在减少费神思考的同时，它也将你锁定在规定的代码组织模式中，没有摆脱的余地，这会导致在更大规模的项目中难以进行重构或提高代码质量。在这方面，组合式 API 提供了更好的长期可扩展性。

### 组合式 API 是否覆盖了所有场景？ {#does-composition-api-cover-all-use-cases}

对于有状态的逻辑来说，的确如此。当使用组合式 API 时，只需要用到一小部分选项：`props`，`emits`，`name` 和 `inheritAttrs`。如果使用 `<script setup>`，那么 `inheritAttrs` 应该是唯一一个需要用额外的 `<script>` 块书写的选项了。

如果你在代码中只使用了组合式 API (以及上述必需的选项)，得益于[编译时标记](https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags)你可以减小生产包大概几 kb 左右的体积，因为丢掉了 Vue 之中关于选项式 API 的所有代码。注意这也会影响你依赖中的 Vue 组件。

### 可以同时使用两种 API 吗？ {#can-i-use-both-apis-together}

可以。你可以在一个选项式 API 组件中使用 [`setup()`](/api/composition-api-setup.html#setup) 选项。

然而，我们只推荐你在旧项目中这样使用。它们长期基于选项式 API 开发、又可能想要集成新的功能，或是想要集成基于组合式 API 的第三方库。

### 选项式 API 会被废弃吗？ {#will-options-api-be-deprecated}

不会，我们没有任何计划这样做。选项式 API 也是 Vue 不可分割的一部分，也有很多开发者喜欢它。我们也意识到组合式 API 主要适用于非常大型的项目，而对于中小型项目来说选项式 API 仍然是一个不错的选择。

## 与 Class API 的关系 {#relationship-with-class-api}

我们不再推荐在 Vue 3 中使用 Class API，因为组合式 API 提供了很好的 TypeScript 集成，并具有额外的逻辑重用和代码组织优势。

## 和 React Hooks 相比 {#comparison-with-react-hooks}

组合式 API 提供了和 React Hooks 相同级别的逻辑组织能力，但它们之间有着一些重要的区别。

React Hooks 在组件每次更新时都会重新调用。这就产生了一些即使是经验丰富的 React 开发人员也会感到困惑的问题。这也带来了一些性能问题，严重影响开发的体验。下面一些例子：

- Hooks 有严格的调用顺序，并不可以写在条件分支中。

- React 组件中定义的变量会被一个钩子函数闭包捕获，若开发者传递了错误的依赖数组，它将保持不变。这导致了 React 开发者非常依赖 ESLint 规则以确保传递了正确的依赖，然而，这些规则往往不够智能，保持正确的代价过高，在一些边缘情况时会遇到令人头疼的、不必要的报错信息。

- 昂贵的计算需要使用 `useMemo`，这也需要传入正确的依赖数组。

- 在默认情况下，传递给子组件的事件处理函数会导致子组件进行不必要的更新。子组件默认更新，并需要显式的调用 `useCallback` 作优化。这几乎是必需的，因此同样需要正确的依赖数组。忽视这一点会导致默认情况下对应用程序进行过度渲染，并可能在不知不觉中导致性能问题。

- 要解决变量闭包导致的问题，再结合并发功能，使得很难推理出一段钩子代码是什么时候运行的，并且很不好处理需要横跨多个渲染 (通过 `useRef`) 的可变状态。

相比起来，Vue 的组合式 API：

- 仅调用 `setup()` 或 `<script setup>` 的代码一次。这使得代码能更好地与 JavaScript 的习惯性使用的直觉结合起来，因为不需要担心闭包变量的问题。组合式 API 也并不限制调用顺序，还可以有条件地进行调用。

- Vue 的响应性系统运行时会自动收集计算属性和侦听器的依赖，因此无需我们手动声明依赖。

- 无需手动缓存回调函数来避免不必要的组件更新。总而言之，Vue 细粒度的响应性系统确保了组件仅执行必要的更新。对 Vue 开发者来说几乎不怎么需要对子组件更新进行手动优化。

我们承认 React Hooks 的创造性，它是组合式 API 的一个主要灵感来源。然而，它的设计也确实存在上面提到的问题，而 Vue 的响应性模型恰好提供了一种解决这些问题的方法。
