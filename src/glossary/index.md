# 术语表 {#glossary}

本术语表旨在为一些在讨论 Vue 时常用的技术术语的含义提供指导。其目的在于*描述*术语的常见用法，而不是*规定*它们必须如何使用。在不同的上下文中，一些术语的含义可能会有细微的差别。

[[TOC]]

## 异步组件 (async component) {#async-component}

*异步组件*是为另一个组件提供的包装器，来让被包装的组件可以进行懒加载。这通常用作减少构建后的 `.js` 文件大小的一种方式，通过将它们拆分为较小的块来按需加载。

Vue Router 也有类似的功能，用于[路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)，但这并不是通过 Vue 的异步组件功能实现的。

详见：
- [指南 - 异步组件](/guide/components/async.html)

## 编译器宏 (compiler macro) {#compiler-macro}

*编译器宏*是一种特殊的代码，由编译器处理并转换为其他东西。它们实际上是一种更巧妙的字符串替换形式。

Vue 的[单文件组件](#single-file-component)编译器支持各种宏，例如 `defineProps()`、`defineEmits()` 和 `defineExpose()`。这些宏有意设计得像是普通的 JavaScript 函数，以便它们可以利用 JavaScript / TypeScript 中的相同解析器和类型推断工具。然而，它们不是在浏览器中运行的实际函数。这些特殊字符串会被编译器检测到并替换为实际真正运行的 JavaScript 代码。

宏在使用上有一些不适用于普通 JavaScript 代码的限制。例如，你可能认为 `const dp = defineProps` 会为 `defineProps` 创建一个别名，但实际上它会导致错误。相同的限制也存在于传入 `defineProps()` 的值，因为“参数”必须由编译器处理，而不是在运行时。

详见：
- [`<script setup>` - `defineProps()` & `defineEmits()`](/api/sfc-script-setup.html#defineprops-defineemits)
- [`<script setup>` - `defineExpose()`](/api/sfc-script-setup.html#defineexpose)

## 组件 (component) {#component}

*组件*一词不是 Vue 独有的。它是许多 UI 框架都有的共同特性。它描述了 UI 的一部分，例如按钮或复选框。多个组件也可以组合成更大的组件。

组件是 Vue 提供的将 UI 拆成较小部分的主要机制，既可以提高可维护性，也允许代码重用。

一个 Vue 组件是一个对象。所有属性都是可选的，但是必须有用于组件渲染的模板或渲染函数二选一。例如，以下对象将是一个有效的组件：

```js
const HelloWorldComponent = {
  render() {
    return 'Hello world!'
  }
}
```

在实践中，大多数 Vue 应用都是通过[单文件组件](#single-file-component) (`.vue` 文件) 编写的。虽然这些组件乍一看不是对象，但单文件组件编译器会将它们转换为用作文件默认导出的一个对象。从外部来看，`.vue` 文件只是导出一个组件对象的 ES 模块。

组件对象的属性通常称为*选项*。这就是[选项式 API](#options-api) 得名的原因。

组件的选项将定义如何创建该组件的实例。组件在概念上类似于类，尽管 Vue 并不使用实际的 JavaScript 类来定义它们。

组件这个词也可以更宽泛地用来指代组件实例。

详见：
- [指南 - 组件基础](/guide/essentials/component-basics.html)

“组件”一词还出现在其他几个术语中：
- [异步组件](#async-component)
- [动态组件](#dynamic-component)
- [函数式组件](#functional-component)
- [Web Component](#web-component)

## 组合式函数 (composable) {#composable}

*组合式函数*一词描述了 Vue 中的一种常见用法。它不是 Vue 的一个单独的特性，而是一种使用框架的[组合式 API](#composition-api) 的方式。

* 组合式函数是一个函数。
* 组合式函数用于封装和重用有状态的逻辑。
* 函数名通常以 `use` 开头，以便让其他开发者知道它是一个组合式函数。
* 函数通常在组件的 `setup()` 函数 (或等效的 `<script setup>` 块) 的同步执行期间调用。这将组合式函数的调用与当前组件的上下文绑定，例如通过调用 `provide()`、`inject()` 或 `onMounted()`。
* 通常来说，组合式函数返回的是一个普通对象，而不是一个响应式对象。这个对象通常包含 `ref` 和函数，并且预期在调用它的代码中进行解构。

与许多模式一样，对于特定代码是否符合上述定义可能会有一些争议。并非所有的 JavaScript 工具函数都是组合式函数。如果一个函数没有使用组合式 API，那么它可能不是一个组合式函数。如果它不期望在 `setup()` 的同步执行期间被调用，那么它可能不是一个组合式函数。组合式函数专门用于封装有状态的逻辑，它们不仅仅是函数的命名约定。

参考[指南 - 组合式函数](/guide/reusability/composables.html)获取更多关于如何编写组合式函数的细节。

## 组合式 API (Composition API) {#composition-api}

*组合式 API* 是 Vue 中的一组用于编写组件和组合式函数的函数。

该词也用于描述用于编写组件的两种主要风格之一，另一种是[选项式 API](#options-api)。通过组合式 API 编写的组件使用 `<script setup>` 或显式的 `setup()` 函数。

参考[组合式 API 常见问答](/guide/extras/composition-api-faq)获取更多细节。

## 自定义元素 (custom element) {#custom-element}

*自定义元素*是现代 Web 浏览器中实现的 [Web Components](#web-component) 标准的一个特性。它指的是在 HTML 标记中使用自定义 HTML 元素，以在页面的该位置加入一个 Web Component 的能力。

Vue 对渲染自定义元素有内置的支持，并允许它们直接在 Vue 组件模板中使用。

自定义元素不应该与在 Vue 组件的模板中包含另一个 Vue 组件的能力混淆。自定义元素是用于创建 Web Components 的，而不是 Vue 组件。

详见：
- [Vue 与 Web Components](/guide/extras/web-components.html)

## 指令 (directive) {#directive}

*指令*一词指的是以 `v-` 前缀开头的模板属性，或者它们的等效简写。

内置的指令包括 `v-if`、`v-for`、`v-bind`、`v-on` 和 `v-slot`。

Vue 也支持创建自定义指令，尽管它们通常只用作操作 DOM 节点的“逃生舱”。自定义指令通常不能用来重新创建内置指令的功能。

详见：
- [指南 - 模板语法 - 指令](/guide/essentials/template-syntax.html#directives)
- [指南 - 自定义指令](/guide/reusability/custom-directives.html)

## 动态组件 (dynamic component) {#dynamic-component}

*动态组件*一词用于描述需要动态选择要渲染的子组件的情况。这通常是通过 `<component :is="type">` 来实现的。

动态组件不是一种特殊类型的组件。任何组件都可以用作动态组件。动态指的是的是组件的选择，而不是组件本身。

详见：
- [指南 - 组件基础 - 动态组件](/guide/essentials/component-basics.html#dynamic-components)

## 作用 (effect) {#effect}

见[响应式作用](#reactive-effect)和[副作用](#side-effect)。

## 事件 (event) {#event}

通过事件在程序的不同部分之间进行通信在许多不同领域编程实践中都是很常见的。在 Vue 中，这个术语通常被用于原生 HTML 元素事件和 Vue 组件事件。`v-on` 指令用于在模板中监听这两种类型的事件。

详见：
- [指南 - 事件处理](/guide/essentials/event-handling.html)
- [指南 - 组件事件](/guide/components/events.html)

## 片段 (fragment) {#fragment}

*片段*一词指的是一种特殊类型的 [VNode](#vnode)，它用作其他 VNode 的父节点，但它本身不渲染任何元素。

该名称来自于一个类似概念：原生 DOM API 中的 [`DocumentFragment`](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)。

片段用于支持具有多个根节点的组件。虽然这样的组件表面上有多个根节点，但背后还是有一个单一的片段根节点作为这些表面上“根”节点的父节点。

片段也作为包装多个动态节点的一种方式被用于模板编译器，例如通过 `v-for` 或 `v-if` 创建的节点。这允许我们向 [VDOM](#virtual-dom) 补丁算法传递额外的提示。这些大部分都是在内部处理的，但你可能会直接遇到的一种情况是在 `<template>` 标签上使用 `v-for` 的 `key`。在此，`key` 会作为 [prop](#prop) 添加到片段的 VNode。

片段节点当前在 DOM 上被渲染为了空文本节点，但这只是一个实现细节。当你使用 `$el` 或尝试通过浏览器内置的 API 遍历 DOM 时，可能会意外地遇到这些文本节点。

## 函数式组件 (functional component) {#functional-component}

组件的定义通常是一个包含选项的对象。如果使用 `<script setup>` 的话它可能看起来不是这样，但是从 `.vue` 文件导出的组件仍然是一个对象。

*函数式组件*是组件的一种替代形式，它使用函数来声明。该函数充当组件的[渲染函数](#render-function)。

函数式组件无法拥有任何自己的状态。它也不会经历通常的组件生命周期，因此无法使用生命周期钩子。这使得它们比正常的有状态组件要稍微轻一些。

详见：
- [指南 - 渲染函数 & JSX -函数式组件](/guide/extras/render-function.html#functional-components)

## 变量提升 (hoisting) {#hoisting}

*变量提升*一词用于描述在一段代码到达之前就运行。执行被“提升”到一个较早的点。

JavaScript 对某些结构使用了变量提升，例如 `var`、`import` 和函数声明。

在 Vue 上下文中，模板编译器应用了*静态变量提升*来提高性能。在将模板转换为渲染函数时，对应于静态内容的 VNode 可以只创建一次然后被重复使用。这些静态 VNode 是被提升的，因为它们是在渲染函数运行之前，在其外面创建的。模板编译器生成的静态对象或数组也会应用类似的变量提升。

详见：
- [指南 - 渲染机制 - 静态提升](/guide/extras/rendering-mechanism.html#static-hoisting)

## DOM 内模板 (in-DOM template) {#in-dom-template}

指定组件模板的方式有很多。在大多数情况下，模板是以字符串的形式提供的。

*DOM 内模板*一词指的是以 DOM 节点而非字符串形式提供模板的场景。然后 Vue 将通过 `innerHTML` 将 DOM 节点转换为模板字符串。

通常来说，内联 DOM 模板是直接在页面的 HTML 中编写的 HTML 标记。然后浏览器将其解析为 DOM 节点，Vue 再使用这些节点来读取 `innerHTML`。

详见：
- [指南 - 创建一个应用 - DOM 中的根组件模板](/guide/essentials/application.html#in-dom-root-component-template)
- [指南 - 组件基础 - DOM 内模板解析注意事项](/guide/essentials/component-basics.html#in-dom-template-parsing-caveats)
- [渲染选项 - template](/api/options-rendering.html#template)

## 注入 (inject) {#inject}

见[提供 / 注入](#provide-inject)。

## 生命周期钩子 (lifecycle hooks) {#lifecycle-hooks}

Vue 组件实例会经历一个生命周期。例如，它会被创建、挂载、更新和卸载。

*生命周期钩子*是监听这些生命周期事件的一种方式。

在选项式 API 中，每个钩子都作为单独的选项提供，例如 `mounted`。而组合式 API 则使用函数，例如 `onMounted()`。

详见：
- [指南 - 生命周期钩子](/guide/essentials/lifecycle.html)

## 宏 (macro) {#macro}

见[编译器宏](#compiler-macro)。

## 具名插槽 (named slot) {#named-slot}

组件可以有通过名称进行区分的多个插槽。除了默认插槽之外的插槽被称为*具名插槽*。

详见：
- [指南 - 插槽 - 具名插槽](/guide/components/slots.html#named-slots)

## 选项式 API (Options API) {#options-api}

Vue 组件是通过对象定义的。这些组件对象的属性被称为*选项*。

组件可以用两种风格编写。一种风格将[组合式 API](#composition-api) 与 `setup` (通过 `setup()` 选项或 `<script setup>`) 结合使用。另一种风格几乎不直接使用组合式 API，而是使用各种组件选项来达到类似的效果。以这种方式使用的组件选项被称为*选项式 API*。

选项式 API 包括 `data()`、`computed`、`methods` 和 `created()` 等选项。

某些选项，例如 `props`、`emits` 和 `inheritAttrs`，可以用于任意一套 API 编写组件。由于它们是组件选项，因此可以被认为是选项式 API 的一部分。但是，由于这些选项也与 `setup()` 结合使用，因此通常更适合将它们视为两套组件风格之间共享的选项。

`setup()` 函数本身是一个组件选项，因此它*可以*被描述为选项式 API 的一部分。但是，这不是“选项式 API”这个术语的常见用法。相反，`setup()` 函数被认为是组合式 API 的一部分。

## 插件 (plugin) {#plugin}

*插件*一词可以在各种上下文中使用，但是在 Vue 中它有一个特定的概念，即插件是向应用程序添加功能的一种方式。

调用 `app.use(plugin)` 可以将插件添加到应用中。插件本身可以是一个函数，也可以是一个带有 `install` 函数的对象。该函数会被传入应用实例，然后执行任何所需的操作。

详见：
- [指南 - 插件](/guide/reusability/plugins.html)

## Prop {#prop}

*Prop* 一词在 Vue 中有三种常见用法：

* 组件 prop
* VNode prop
* 插槽 prop

大多数情况下，prop 是指*组件 prop*。这些 prop 由组件通过 `defineProps()` 或 `props` 选项显式定义。

*VNode prop* 一词指的是作为第二个参数传入 `h()` 的对象的属性。这些属性可以包括组件 prop，也可以包括组件事件、DOM 事件、DOM attribute 和 DOM property。通常只有在使用渲染函数直接操作 VNode 时才会用到 VNode prop。

*插槽 prop* 是传递给作用域插槽的属性。

在所有情况下，prop 都是从其他地方传递过来的属性。

虽然 prop 源自单词 *properties*，但在 Vue 的上下文中，术语 prop 具有更加特定的含义。你应该避免将其用作 properties 的缩写。

详见：
- [指南 - Props](/guide/components/props.html)
- [指南 - 渲染函数 & JSX](/guide/extras/render-function.html)
- [指南 - 插槽 - 作用域插槽](/guide/components/slots.html#scoped-slots)

## 提供 / 注入 (provide / inject) {#provide-inject}

`provide` 和 `inject` 是一种组件间通信的形式。

当组件*提供*一个值时，该组件的所有后代组件都可以选择使用 `inject` 来获取该值。与 prop 不同，提供值的组件不知道哪些组件正在接收该值。

`provide` 和 `inject` 有时用于避免 *prop 逐级透传*。它们也可以作为组件与其插槽内容进行隐式通信的一种方式。

`provide` 也可以在应用级别使用，使得该值对该应用中的所有组件都可用。

详见：
- [指南 - 依赖注入](/guide/components/provide-inject.html)

## 响应式作用 (reactive effect) {#reactive-effect}

*响应式作用*是 Vue 响应性系统的一部分。它指的是跟踪函数的依赖关系，并在它们的值发生变化时重新运行该函数的过程。

`watchEffect()` 是最直接的创建作用的方式。Vue 内部的其他各个部分也会使用作用。例如：组件渲染更新、`computed()` 和 `watch()`。

Vue 只能在响应式作用内部跟踪响应式依赖关系。如果在响应式作用之外读取属性的值，它将“丢失”响应性，因为 Vue 不知道在该属性发生变化后应该做什么。

这个术语源自“副作用”。调用作用函数是属性值被更改的副作用。

详见：
- [指南 - 深入响应式系统](/guide/extras/reactivity-in-depth.html)

## 响应性 (reactivity) {#reactivity}

通常来说，*响应性*是指在数据变化时自动执行操作的能力。例如，当数据值变化时更新 DOM，或进行网络请求。

在 Vue 上下文中，响应性用于描述一组功能。这些功能组合在一起形成一个*响应性系统*，并通过[响应性 API](#reactivity-api) 暴露出来。

实现一个响应性系统的方式有很多种。例如，可以通过代码的静态分析来确定其依赖关系。但是，Vue 没有采用这种形式的响应性系统。

取而代之的是，Vue 的响应性系统在运行时跟踪属性的访问。它通过结合 Proxy 包装器和 getter/setter 函数来实现。

详见：
- [指南 - 响应式基础](/guide/essentials/reactivity-fundamentals.html)
- [指南 - 深入响应式系统](/guide/extras/reactivity-in-depth.html)

## 响应性 API (Reactivity API) {#reactivity-api}

*响应性 API* 是一组与[响应性](#reactivity)相关的核心 Vue 函数。这些函数可以独立于组件使用。包括 `ref()`、`reactive()`、`computed()`、`watch()` 和 `watchEffect()` 等。

响应性 API 是组合式 API 的一个子集。

详见：
- [响应性 API：核心](/api/reactivity-core.html)
- [响应性 API：工具](/api/reactivity-utilities.html)
- [响应性 API：进阶](/api/reactivity-advanced.html)

## ref {#ref}

> 该条目是关于 `ref` 在响应性中的用法。对于模板中使用的 `ref` attribute，请参考[模板 ref](#template-ref)。

`ref` 是 Vue 响应性系统的一部分。它是一个具有单个响应式属性 (称为 `value`) 的对象。

Ref 有多种不同的类型。例如，可以使用 `ref()`、`shallowRef()`、`computed()` 和 `customRef()` 来创建 ref。函数 `isRef()` 可以用来检查一个对象是否是 ref，`isReadonly()` 可以用来检查 ref 是否允许被直接重新赋值。

详见：
- [指南 - 响应式基础](/guide/essentials/reactivity-fundamentals.html)
- [响应性 API：核心](/api/reactivity-core.html)
- [响应性 API：工具](/api/reactivity-utilities.html)
- [响应性 API：进阶](/api/reactivity-advanced.html)

## 渲染函数 (render function) {#render-function}

*渲染函数*是组件的一部分，它在渲染期间生成 VNode。模板会被编译成渲染函数。

详见：
- [指南 - 渲染函数 & JSX](/guide/extras/render-function.html)

## 调度器 (scheduler) {#scheduler}

*调度器*是 Vue 内部的一部分，它控制着[响应式作用](#reactive-effect)运行的时机。

当响应式状态发生变化时，Vue 不会立即触发渲染更新。取而代之的是，它会通过队列实现批处理。这确保了即使对底层数据进行了多次更改，组件也只重新渲染一次。

[侦听器](/guide/essentials/watchers.html)也使用了调度器队列进行批处理。具有 `flush: 'pre'` (默认值) 的侦听器将在组件渲染之前运行，而具有 `flush: 'post'` 的侦听器将在组件渲染之后运行。

调度器中的任务还用于执行各种其他内部任务，例如触发一些[生命周期钩子](#lifecycle-hooks)和更新[模板 ref](#template-ref)。

## 作用域插槽 (scoped slot) {#scoped-slot}

*作用域插槽*是指接收 [prop](#prop) 的[插槽](#slot)。

过去，Vue 在作用域插槽和非作用域插槽之间有很大的区别。在某种程度上，它们可以被视为被统一在一个公共的模板语法背后的两个不同的功能。

在 Vue 3 中，插槽 API 被简化为使所有插槽都像作用域插槽一样。然而，作用域插槽和非作用域插槽的使用场景通常不一样，因此该术语仍被用于特指具有 prop 的插槽。

传递给插槽的 prop 只能在父模板中负责定义该插槽内容的指定区域中使用。该模板区域的行为类似于 prop 的变量作用域，因此称为“作用域插槽”。

详见：
- [指南 - 插槽 - 作用域插槽](/guide/components/slots.html#scoped-slots)

## SFC {#sfc}

见[单文件组件](#single-file-component)。

## 副作用 (side effect) {#side-effect}

*副作用*一词并非 Vue 特有。它用于描述超出其局部作用域的操作或函数。

举个例子，在 `user.name = null` 这样设置属性的上下文中，我们可以预期 `user.name` 的值会被更改。如果它还做了其他事情，比如触发 Vue 的响应性系统，那么这就被描述为副作用。这就是 Vue 中的[响应式 effect](#reactive-effect) 一词的起源。

当描述一个函数具有副作用时，这意味着该函数除了返回一个值之外，还执行了某种在函数外可观察到的操作。这可能意味着它更新了状态中的值，或者触发了网络请求。

该术语通常用于描述渲染或计算属性。最佳实践是渲染不应该有副作用。同样，计算属性的 getter 函数也不应该有副作用。

## 单文件组件 (Single-File Component) {#single-file-component}

*单文件组件* (SFC) 一词指的是常用于 Vue 组件的 `.vue` 文件格式。

参考：
- [指南 - 单文件组件](/guide/scaling-up/sfc.html)
- [SFC 语法定义](/api/sfc-spec.html)

## 插槽 (slot) {#slot}

插槽用于向子组件传递内容。和 prop 用于传递数据不同，插槽用于传递更丰富的内容，包括 HTML 元素和其他 Vue 组件。

详见：
- [指南 - 插槽](/guide/components/slots.html)

## 模板 ref (template ref) {#template-ref}

*模板 ref* 一词指的是在模板中的标签上使用 `ref` 属性。组件渲染后，该属性用于将相应的属性填充为模板中的标签对应的 HTML 元素或组件实例。

如果你使用的是选项式 API，那么 ref 会通过 `$refs` 对象的属性暴露出来。

通过组合式 API，模板 ref 会填充一个与之同名的[响应式 ref](#ref)。

模板 ref 不应该与 Vue 响应性系统中的响应式 ref 混淆。

详见：
- [指南 - Template Refs](/guide/essentials/template-refs.html)

## VDOM {#vdom}

参考[虚拟 DOM](#virtual-dom)。

## 虚拟 DOM (virtual DOM) {#virtual-dom}

*虚拟 DOM* (VDOM) 一词并非 Vue 独有。它是多个 web 框架用于管理 UI 更新的常用方法。

浏览器使用节点树来表示页面的当前状态。该树及用于与之交互的 JavaScript API 称为*文档对象模型*或 *DOM*。

更新 DOM 是一个主要的性能瓶颈。虚拟 DOM 提供了一种管理 DOM 的策略。

与直接创建 DOM 节点不同，Vue 组件会生成它们想要的 DOM 节点的描述。这些描述符是普通的 JavaScript 对象，称为 VNode (虚拟 DOM 节点)。创建 VNode 的成本相对较低。

每次组件重新渲染时，都会将新的 VNode 树与先前的 VNode 树进行比较，然后将它们之间的差异应用于真实 DOM。如果没有任何更改，则不需要修改 DOM。

Vue 使用了一种混合方法，我们称之为[带编译时信息的虚拟 DOM](/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom)。Vue 的模板编译器能够根据对模板的静态分析添加性能优化。Vue 不会在运行时对组件的新旧 VNode 树进行完整的对比，而是可以利用编译器提取的信息，将树的对比减少到实际可能发生变化的部分。

详见：
- [指南 - 渲染机制](/guide/extras/rendering-mechanism.html)
- [指南 - 渲染函数 & JSX](/guide/extras/render-function.html)

## VNode {#vnode}

*VNode* 即*虚拟 DOM 节点*。它们可以使用 [`h()`](/api/render-function.html#h) 函数创建。

详见[虚拟 DOM](#virtual-dom)。

## Web Component {#web-component}

*Web Component* 标准是现代 Web 浏览器中实现的一组功能。

Vue 组件不是 Web 组件，但是可以通过 `defineCustomElement()` 从 Vue 组件创建[自定义元素](#custom-element)。Vue 还支持在 Vue 组件内部使用自定义元素。

详见：
- [指南 - Vue 和 Web Components](/guide/extras/web-components.html)
