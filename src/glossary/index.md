# 术语表 {#glossary}

该术语表的目的是提供一些关于在谈论 Vue 时常用的技术术语的含义的指导。它旨在*描述*术语的常见用法，而不是*规定*它们必须如何使用。在不同的上下文中，一些术语的含义可能会有细微的差别。

[[TOC]]

## 异步组件 {#async-component}

*异步组件*是另一个组件的包装器，它允许被包装的组件进行懒加载。这通常用作减少构建的 `.js` 文件大小的一种方式，通过将它们拆分为较小的块来按需加载。

Vue Router 也有类似的功能，用于[路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)，但这并不是通过 Vue 的异步组件功能实现的。

更多细节参考：
- [指南 - 异步组件](/guide/components/async.html)

## 编译器宏 {#compiler-macro}

*编译器宏*是一种特殊的代码，由编译器处理并转换为其他东西。它们实际上是一种更高效且巧妙的字符串替换形式。

Vue 的[单文件组件](#single-file-component)编译器支持各种宏，例如 `defineProps()`、`defineEmits()` 和 `defineExpose()`。这些宏有意设计成类似正常的 JavaScript 函数，以便它们可以利用 JavaScript / TypeScript 中的相同解析器和类型推断工具。然而，它们不是在浏览器中运行的实际函数。这些是编译器检测到并替换为实际上将运行的真正 JavaScript 代码的特殊字符串。

宏在使用上有一些不适用于正常 JavaScript 代码的限制。例如，你可能认为 `const dp = defineProps` 可以让你为 `defineProps` 创建一个别名，但实际上它会导致错误。对 `defineProps()` 可传入的值也有限制，因为“参数”必须由编译器而不是在运行时处理。

更多细节参考：
- [`<script setup>` - `defineProps()` & `defineEmits()`](/api/sfc-script-setup.html#defineprops-defineemits)
- [`<script setup>` - `defineExpose()`](/api/sfc-script-setup.html#defineexpose)

## 组件 {#component}

*组件*一词不是 Vue 独有的。它是许多 UI 框架都有的共同特性。它描述了 UI 的一部分，例如按钮或复选框。多个组件也可以组合成更大的组件。

组件是 Vue 提供的用于将 UI 拆分为较小的部分的主要机制，既可以提高可维护性，也允许代码重用。

一个 Vue 组件是一个对象。所有属性都是可选的，但是模板或渲染函数是组件渲染所必需的。例如，以下对象将是一个有效的组件：

```js
const HelloWorldComponent = {
  render() {
    return 'Hello world!'
  }
}
```

在实践中，大多数 Vue 应用都是通过[单文件组件](#single-file-component) (`.vue` 文件)编写的。虽然这些组件乍一看可能不像是对象，但单文件组件编译器会将它们转换为一个对象，它将用作文件的默认导出。从外部的角度来看，`.vue` 文件只是一个导出组件对象的 ES 模块。

组件对象的属性通常称为*选项*。这就是[选项式 API](#options-api)得名的原因。

组件的选项将定义如何创建该组件的实例。组件在概念上类似于类，尽管 Vue 并不使用实际的 JavaScript 类来定义它们。

组件这个词也可以更宽泛地用来指代组件实例。

更多细节参考：
- [指南 - 组件基础](/guide/essentials/component-basics.html)

“组件”一词还出现在其他几个术语中：
- [异步组件](#async-component)
- [动态组件](#dynamic-component)
- [函数式组件](#functional-component)
- [Web Component](#web-component)

## 组合式函数 {#composable}

*组合式函数*一词描述了 Vue 中的一种常见用法。它不是 Vue 的一个单独的特性，而是一种使用框架的[组合式 API](#composition-api)的方式。

* 组合式函数是一个函数。
* 组合式函数用于封装和重用有状态的逻辑。
* 函数名通常以 `use` 开头，以便让其他开发者知道它是一个组合式函数。
* 函数通常在组件的 `setup()` 函数(或等效的 `<script setup>` 块)的同步执行期间调用。这将组合式函数的调用与当前组件的上下文绑定，例如通过调用 `provide()`、`inject()` 或 `onMounted()`。
* 通常来说，组合式函数返回的是一个普通对象，而不是一个响应式对象。这个对象通常包含 `ref` 和函数，并且预期在调用它的代码中进行解构。

在许多模式中，对于特定代码是否符合该标签可能会有一些争议。并非所有的 JavaScript 工具函数都是组合式函数。如果一个函数没有使用组合式 API，那么它可能不是一个组合式函数。如果它不期望在 `setup()` 的同步执行期间被调用，那么它可能不是一个组合式函数。组合式函数专门用于封装有状态的逻辑，它们不仅仅是函数的命名约定。

参考[指南 - 组合式函数](/guide/reusability/composables.html)获取更多关于如何编写组合式函数的细节。

## 组合式 API {#composition-api}

*组合式 API*是 Vue 中的一组用于编写组件和组合式函数的函数。

该词也用于描述用于编写组件的两种主要风格之一，另一种是[选项式 API](#options-api)。通过组合式 API 编写的组件使用 `<script setup>` 或显式的 `setup()` 函数。

参考[组合式 API 常见问答](/guide/extras/composition-api-faq)获取更多细节。

## 自定义元素 {#custom-element}

*自定义元素*是现代 Web 浏览器中实现的 [Web Components](#web-component) 标准的一个特性。它指的是在 HTML 标记中使用自定义 HTML 元素的能力，以在页面的该位置导入一个 Web Component。

Vue 对渲染自定义元素有内置的支持，并允许它们直接在 Vue 组件模板中使用。

自定义元素不应该与在另一个 Vue 组件的模板中包含 Vue 组件的能力混淆。自定义元素是用于创建 Web Components 的，而不是 Vue 组件。

更多细节参考：
- [Vue 与 Web Components](/guide/extras/web-components.html)

## 指令 {#directive}

*指令*一词指的是以 `v-` 前缀开头的模板属性，或者它们的等效简写。

内置的指令包括 `v-if`、`v-for`、`v-bind`、`v-on` 和 `v-slot`。

Vue 也支持创建自定义指令，尽管它们通常只用作操作 DOM 节点的“逃生舱”。自定义指令通常不能用来重新创建内置指令的功能。

更多细节参考：
- [指南 - 模板语法 - 指令](/guide/essentials/template-syntax.html#directives)
- [指南 - 自定义指令](/guide/reusability/custom-directives.html)

## 动态组件 {#dynamic-component}

*动态组件*一词用于描述需要动态选择要渲染的子组件的情况。这通常是通过 `<component :is="type">` 来实现的。

动态组件不是一种特殊类型的组件。任何组件都可以用作动态组件。动态指的是的是组件的选择，而不是组件本身。

更多细节参考：
- [指南 - 组件基础 - 动态组件](/guide/essentials/component-basics.html#dynamic-components)

## 作用 {#effect}

见[响应式作用](#reactive-effect)和[副作用](#side-effect).

## 事件 {#event}

通过事件在程序的不同部分之间进行通信在许多不同领域编程实践中都是很常见的。在 Vue 中，这个术语通常被用于原生 HTML 元素事件和 Vue 组件事件。`v-on` 指令用于在模板中监听这两种类型的事件。

更多细节参考：
- [指南 - 事件处理](/guide/essentials/event-handling.html)
- [指南 - 组件事件](/guide/components/events.html)

## 片段 {#fragment}

*片段*一词指的是一种特殊类型的 [VNode](#vnode)，它用作其他 VNode 的父节点，但它本身不渲染任何元素。

该名称来自于一个类似概念：原生 DOM API 中的 [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)。

片段用于支持具有多个根节点的组件。虽然这样的组件可能看起来有多个根节点，但在幕后，它们使用片段节点作为单个根节点，作为“根”节点的父节点。

片段也被模板编译器用作包装多个动态节点的方式，例如通过 `v-for` 或 `v-if` 创建的节点。这允许向 [VDOM](#virtual-dom) 补丁算法传递额外的提示。这些大部分都是在内部处理的，但你可能直接遇到的一个例子是在 `<template>` 标签上使用 `v-for` 的 `key`。在这种情况下，`key` 会作为[参数](#prop)添加到片段的 VNode。

片段节点当前被渲染为 DOM 上的空文本节点，尽管这是一个实现细节。但如果你使用 `$el` 或尝试使用内置的浏览器 API 遍历 DOM 时，可能会遇到这些文本节点。

## 函数式组件 {#functional-component}

组件的定义通常是一个包含选项的对象。如果使用 `<script setup>` 的话它可能看起来不是这样，但是从 `.vue` 文件导出的组件仍然是一个对象。

*函数式组件*是组件的一种替代形式，它使用函数来声明。该函数充当组件的[渲染函数](#render-function)。

函数式组件无法拥有任何自己的状态。它也不会经历通常的组件生命周期，因此无法使用生命周期钩子。这使得它们比正常的有状态组件要稍微轻一些。

更多细节参考：
- [指南 - 渲染函数 & JSX -函数式组件](/guide/extras/render-function.html#functional-components)

## 提升 {#hoisting}

*提升*一词用于描述在一段代码到达之前就运行。执行被“提升”到一个较早的点。

JavaScript 对某些结构使用了提升，例如 `var`、`import` 和函数声明。

在 Vue 上下文中，模板编译器应用了*静态提升*来提高性能。在将模板转换为渲染函数时，对应于静态内容的 VNode 可以只创建一次然后被重复使用。这些静态 VNode 是被提升的，因为它们是在渲染函数运行之前，在其外面创建的。模板编译器生成的静态对象或数组也会应用类似的提升。

更多细节参考：
- [指南 - 渲染机制 - 静态提升](/guide/extras/rendering-mechanism.html#static-hoisting)

## 内联 DOM 模板 {#in-dom-template}

There are various ways to specify a template for a component. In most cases the template is provided as a string.

The term *in-DOM template* refers to the scenario where the template is provided in the form of DOM nodes, instead of a string. Vue then converts the DOM nodes into a template string using `innerHTML`.

Typically, an in-DOM template starts off as HTML markup written directly in the HTML of the page. The browser then parses this into DOM nodes, which Vue then uses to read off the `innerHTML`.

For more details see:
- [Guide - Creating an Application - In-DOM Root Component Template](/guide/essentials/application.html#in-dom-root-component-template)
- [Guide - Component Basics - DOM Template Parsing Caveats](/guide/essentials/component-basics.html#dom-template-parsing-caveats)
- [Options: Rendering - template](/api/options-rendering.html#template)

## inject {#inject}

See [provide / inject](#provide-inject).

## lifecycle hooks {#lifecycle-hooks}

A Vue component instance goes through a lifecycle. For example, it is created, mounted, updated, and unmounted.

The *lifecycle hooks* are a way to listen for these lifecycle events.

With the Options API, each hook is provided as a separate option, e.g. `mounted`. The Composition API uses functions instead, such as `onMounted()`.

For more details see:
- [Guide - Lifecycle Hooks](/guide/essentials/lifecycle.html)

## macro {#macro}

See [compiler macro](#compiler-macro).

## named slot {#named-slot}

A component can have multiple slots, differentiated by name. Slots other than the default slot are referred to as *named slots*.

For more details see:
- [Guide - Slots - Named Slots](/guide/components/slots.html#named-slots)

## Options API {#options-api}

Vue components are defined using objects. The properties of these component objects are known as *options*.

Components can be written in two styles. One style uses the [Composition API](#composition-api) in conjunction with `setup` (either via a `setup()` option or `<script setup>`). The other style makes very little direct use of the Composition API, instead using various component options to achieve a similar result. The component options that are used in this way are referred to as the *Options API*.

The Options API includes options such as `data()`, `computed`, `methods` and `created()`.

Some options, such as `props`, `emits` and `inheritAttrs`, can be used when authoring components with either API. As they are component options, they could be considered part of the Options API. However, as these options are also used in conjunction with `setup()`, it is usually more useful to think of them as shared between the two component styles.

The `setup()` function itself is a component option, so it *could* be described as part of the Options API. However, this is not how the term 'Options API' is normally used. Instead, the `setup()` function is considered to be part of Composition API.

## plugin {#plugin}

While the term *plugin* can be used in a wide variety of contexts, Vue has a specific concept of a plugin as a way to add functionality to an application.

Plugins are added to an application by calling `app.use(plugin)`. The plugin itself is either a function or an object with an `install` function. That function will be passed the application instance and can then do whatever it needs to do.

For more details see:
- [Guide - Plugins](/guide/reusability/plugins.html)

## prop {#prop}

There are three common uses of the term *prop* in Vue:

* Component props
* VNode props
* Slot props

*Component props* are what most people think of as props. These are explicitly defined by a component using either `defineProps()` or the `props` option.

The term *VNode props* refers to the properties of the object passed as the second argument to `h()`. These can include component props, but they can also include component events, DOM events, DOM attributes and DOM properties. You'd usually only encounter VNode props if you're working with render functions to manipulate VNodes directly.

*Slot props* are the properties passed to a scoped slot.

In all cases, props are properties that are passed in from elsewhere.

While the word props is derived from the word *properties*, the term props has a much more specific meaning in the context of Vue. You should avoid using it as an abbreviation of properties.

For more details see:
- [Guide - Props](/guide/components/props.html)
- [Guide - Render Functions & JSX](/guide/extras/render-function.html)
- [Guide - Slots - Scoped Slots](/guide/components/slots.html#scoped-slots)

## provide / inject {#provide-inject}

`provide` and `inject` are a form of inter-component communication.

When a component *provides* a value, all descendants of that component can then choose to grab that value, using `inject`. Unlike with props, the providing component doesn't know precisely which component is receiving the value.

`provide` and `inject` are sometimes used to avoid *prop drilling*. They can also be used as an implicit way for a component to communicate with its slot contents.

`provide` can also be used at the application level, making a value available to all components within that application.

For more details see:
- [Guide - provide / inject](/guide/components/provide-inject.html)

## reactive effect {#reactive-effect}

A *reactive effect* is part of Vue's reactivity system. It refers to the process of tracking the dependencies of a function and re-running that function when the values of those dependencies change.

`watchEffect()` is the most direct way to create an effect. Various other parts of Vue use effects internally. e.g. component rendering updates, `computed()` and `watch()`.

Vue can only track reactive dependencies within a reactive effect. If a property's value is read outside a reactive effect it'll 'lose' reactivity, in the sense that Vue won't know what to do if that property subsequently changes.

The term is derived from 'side effect'. Calling the effect function is a side effect of the property value being changed.

For more details see:
- [Guide - Reactivity in Depth](/guide/extras/reactivity-in-depth.html)

## reactivity {#reactivity}

In general, *reactivity* refers to the ability to automatically perform actions in response to data changes. For example, updating the DOM or making a network request when a data value changes.

In a Vue context, reactivity is used to describe a collection of features. Those features combine to form a *reactivity system*, which is exposed via the [Reactivity API](#reactivity-api).

There are various different ways that a reactivity system could be implemented. For example, it could be done by static analysis of code to determine its dependencies. However, Vue doesn't employ that form of reactivity system.

Instead, Vue's reactivity system tracks property access at runtime. It does this using both Proxy wrappers and getter/setter functions for properties.

For more details see:
- [Guide - Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals.html)
- [Guide - Reactivity in Depth](/guide/extras/reactivity-in-depth.html)

## Reactivity API {#reactivity-api}

The *Reactivity API* is a collection of core Vue functions related to [reactivity](#reactivity). These can be used independently of components. It includes functions such as `ref()`, `reactive()`, `computed()`, `watch()` and `watchEffect()`.

The Reactivity API is a subset of the Composition API.

For more details see:
- [Reactivity API: Core](/api/reactivity-core.html)
- [Reactivity API: Utilities](/api/reactivity-utilities.html)
- [Reactivity API: Advanced](/api/reactivity-advanced.html)

## ref {#ref}

> This entry is about the use of `ref` for reactivity. For the `ref` attribute used in templates, see [template ref](#template-ref) instead.

A `ref` is part of Vue's reactivity system. It is an object with a single reactive property, called `value`.

There are various different types of ref. For example, refs can be created using `ref()`, `shallowRef()`, `computed()`, and `customRef()`. The function `isRef()` can be used to check whether an object is a ref, and `isReadonly()` can be used to check whether the ref allows the direct reassignment of its value.

For more details see:
- [Guide - Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals.html)
- [Reactivity API: Core](/api/reactivity-core.html)
- [Reactivity API: Utilities](/api/reactivity-utilities.html)
- [Reactivity API: Advanced](/api/reactivity-advanced.html)

## render function {#render-function}

A *render function* is the part of a component that generates the VNodes used during rendering. Templates are compiled down into render functions.

For more details see:
- [Guide - Render Functions & JSX](/guide/extras/render-function.html)

## scheduler {#scheduler}

The *scheduler* is the part of Vue's internals that controls the timing of when [reactive effects](#reactive-effect) are run.

When reactive state changes, Vue doesn't immediately trigger rendering updates. Instead, it batches them together using a queue. This ensures that a component only re-renders once, even if multiple changes are made to the underlying data.

[Watchers](/guide/essentials/watchers.html) are also batched using the scheduler queue. Watchers with `flush: 'pre'` (the default) will run before component rendering, whereas those with `flush: 'post'` will run after component rendering.

Jobs in the scheduler are also used to perform various other internal tasks, such as triggering some [lifecycle hooks](#lifecycle-hooks) and updating [template refs](#template-ref).

## scoped slot {#scoped-slot}

The term *scoped slot* is used to refer to a [slot](#slot) that receives [props](#prop).

Historically, Vue made a much greater distinction between scoped and non-scoped slots. To some extent they could be regarded as two separate features, unified behind a common template syntax.

In Vue 3, the slot APIs were simplified to make all slots behave like scoped slots. However, the use cases for scoped and non-scoped slots often differ, so the term still proves useful as a way to refer to slots with props.

The props passed to a slot can only be used within a specific region of the parent template, responsible for defining the slot's contents. This region of the template behaves as a variable scope for the props, hence the name 'scoped slot'.

For more details see:
- [Guide - Slots - Scoped Slots](/guide/components/slots.html#scoped-slots)

## SFC {#sfc}

See [Single-File Component](#single-file-component).

## side effect {#side-effect}

The term *side effect* is not specific to Vue. It is used to describe operations or functions that do something beyond their local scope.

For example, in the context of setting a property like `user.name = null`, it is expected that this will change the value of `user.name`. If it also does something else, like triggering Vue's reactivity system, then this would be described as a side effect. This is the origin of the term [reactive effect](#reactive-effect) within Vue.

When a function is described as having side effects, it means that the function performs some sort of action that is observable outside the function, aside from just returning a value. This might mean that it updates a value in state, or triggers a network request.

The term is often used when describing rendering or computed properties. It is considered best practice for rendering to have no side effects. Likewise, the getter function for a computed property should have no side effects.

## Single-File Component {#single-file-component}

The term *Single-File Component*, or SFC, refers to the `.vue` file format that is commonly used for Vue components.

See also:
- [Guide - Single-File Components](/guide/scaling-up/sfc.html)
- [SFC Syntax Specification](/api/sfc-spec.html)

## slot {#slot}

Slots are used to pass content to child components. Whereas props are used to pass data values, slots are used to pass richer content consisting of HTML elements and other Vue components.

For more details see:
- [Guide - Slots](/guide/components/slots.html)

## template ref {#template-ref}

The term *template ref* refers to using a `ref` attribute on a tag within a template. After the component renders, this attribute is used to populate a corresponding property with either the HTML element or the component instance that corresponds to the tag in the template.

If you are using the Options API then the refs are exposed via properties of the `$refs` object.

With the Composition API, template refs populate a reactive [ref](#ref) with the same name.

Template refs should not be confused with the reactive refs found in Vue's reactivity system.

For more details see:
- [Guide - Template Refs](/guide/essentials/template-refs.html)

## VDOM {#vdom}

See [virtual DOM](#virtual-dom).

## virtual DOM {#virtual-dom}

The term *virtual DOM* (VDOM) is not unique to Vue. It is a common approach used by several web frameworks for managing updates to the UI.

Browsers use a tree of nodes to represent the current state of the page. That tree, and the JavaScript APIs used to interact with it, are referred to as the *document object model*, or *DOM*.

Manipulating the DOM is a major performance bottleneck. The virtual DOM provides one strategy for managing that.

Rather than creating DOM nodes directly, Vue components generate a description of what DOM nodes they would like. These descriptors are plain JavaScript objects, known as VNodes (virtual DOM nodes). Creating VNodes is relatively cheap.

Every time a component re-renders, the new tree of VNodes is compared to the previous tree of VNodes and any differences are then applied to the real DOM. If nothing has changed then the DOM doesn't need to be touched.

Vue uses a hybrid approach that we call [Compiler-Informed Virtual DOM](/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom). Vue's template compiler is able to apply performance optimizations based on static analysis of the template. Rather than performing a full comparison of a component's old and new VNode trees at runtime, Vue can use information extracted by the compiler to reduce the comparison to just the parts of the tree that can actually change.

For more details see:
- [Guide - Rendering Mechanism](/guide/extras/rendering-mechanism.html)
- [Guide - Render Functions & JSX](/guide/extras/render-function.html)

## VNode {#vnode}

A *VNode* is a *virtual DOM node*. They can be created using the [`h()`](/api/render-function.html#h) function.

See [virtual DOM](#virtual-dom) for more information.

## Web Component {#web-component}

The *Web Components* standard is a collection of features implemented in modern web browsers.

Vue components are not Web Components, but `defineCustomElement()` can be used to create a [custom element](#custom-element) from a Vue component. Vue also supports the use of custom elements inside Vue components.

For more details see:
- [Guide - Vue and Web Components](/guide/extras/web-components.html)
