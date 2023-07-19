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

## composable {#composable}

The term *composable* describes a common usage pattern in Vue. It isn't a separate feature of Vue, it's just a way of using the framework's [Composition API](#composition-api).

* A composable is a function.
* Composables are used to encapsulate and reuse stateful logic.
* The function name usually begins with `use`, so that other developers know it's a composable.
* The function is typically expected to be called during the synchronous execution of a component's `setup()` function (or, equivalently, during the execution of a `<script setup>` block). This ties the invocation of the composable to the current component context, e.g. via calls to `provide()`, `inject()` or `onMounted()`.
* Composables typically return a plain object, not a reactive object. This object usually contains refs and functions and is expected to be destructured within the calling code.

As with many patterns, there can be some disagreement about whether specific code qualifies for the label. Not all JavaScript utility functions are composables. If a function doesn't use the Composition API then it probably isn't a composable. If it doesn't expect to be called during the synchronous execution of `setup()` then it probably isn't a composable. Composables are specifically used to encapsulate stateful logic, they are not just a naming convention for functions.

See [Guide - Composables](/guide/reusability/composables.html) for more details about writing composables.

## Composition API {#composition-api}

The *Composition API* is a collection of functions used to write components and composables in Vue.

The term is also used to describe one of the two main styles used to write components, the other being the [Options API](#options-api). Components written using the Composition API use either `<script setup>` or an explicit `setup()` function.

See the [Composition API FAQ](/guide/extras/composition-api-faq) for more details.

## custom element {#custom-element}

A *custom element* is a feature of the [Web Components](#web-component) standard, which is implemented in modern web browsers. It refers to the ability to use a custom HTML element in your HTML markup to include a Web Component at that point in the page.

Vue has built-in support for rendering custom elements and allows them to be used directly in Vue component templates.

Custom elements should not be confused with the ability to include Vue components as tags within another Vue component's template. Custom elements are used to create Web Components, not Vue components.

For more details see:
- [Guide - Vue and Web Components](/guide/extras/web-components.html)

## directive {#directive}

The term *directive* refers to template attributes beginning with the `v-` prefix, or their equivalent shorthands.

Built-in directives include `v-if`, `v-for`, `v-bind`, `v-on` and `v-slot`.

Vue also supports creating custom directives, though they are typically only used as an 'escape hatch' for manipulating DOM nodes directly. Custom directives generally can't be used to recreate the functionality of the built-in directives.

For more details see:
- [Guide - Template Syntax - Directives](/guide/essentials/template-syntax.html#directives)
- [Guide - Custom Directives](/guide/reusability/custom-directives.html)

## dynamic component {#dynamic-component}

The term *dynamic component* is used to describe cases where the choice of which child component to render needs to be made dynamically. Typically, this is achieved using `<component :is="type">`.

A dynamic component is not a special type of component. Any component can be used as a dynamic component. It is the choice of component that is dynamic, rather than the component itself.

For more details see:
- [Guide - Components Basics - Dynamic Components](/guide/essentials/component-basics.html#dynamic-components)

## effect {#effect}

See [reactive effect](#reactive-effect) and [side effect](#side-effect).

## event {#event}

The use of events for communicating between different parts of a program is common to many different areas of programming. Within Vue, the term is commonly applied to both native HTML element events and Vue component events. The `v-on` directive is used in templates to listen for both types of event.

For more details see:
- [Guide - Event Handling](/guide/essentials/event-handling.html)
- [Guide - Component Events](/guide/components/events.html)

## fragment {#fragment}

The term *fragment* refers to a special type of [VNode](#vnode) that is used as a parent for other VNodes, but which doesn't render any elements itself.

The name comes from the similar concept of a [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) in the native DOM API.

Fragments are used to support components with multiple root nodes. While such components might appear to have multiple roots, behind the scenes they use a fragment node as a single root, as a parent of the 'root' nodes.

Fragments are also used by the template compiler as a way to wrap multiple dynamic nodes, e.g. those created via `v-for` or `v-if`. This allows for extra hints to be passed to the [VDOM](#virtual-dom) patching algorithm. Much of this is handled internally, but one place you may encounter this directly is using a `key` on a `<template>` tag with `v-for`. In that scenario, the `key` is added as a [prop](#prop) to the fragment VNode.

Fragment nodes are currently rendered to the DOM as empty text nodes, though that is an implementation detail. You may encounter those text nodes if you use `$el` or attempt to walk the DOM with built-in browser APIs.

## functional component {#functional-component}

A component definition is usually an object containing options. It may not appear that way if you're using `<script setup>`, but the component exported from the `.vue` file will still be an object.

A *functional component* is an alternative form of component that is declared using a function instead. That function acts as the [render function](#render-function) for the component.

A functional component cannot have any state of its own. It also doesn't go through the usual component lifecycle, so lifecycle hooks can't be used. This makes them slightly lighter than normal, stateful components.

For more details see:
- [Guide - Render Functions & JSX - Functional Components](/guide/extras/render-function.html#functional-components)

## hoisting {#hoisting}

The term *hoisting* is used to describe running a section of code before it is reached, ahead of other code. The execution is 'pulled up' to an earlier point.

JavaScript uses hoisting for some constructs, such as `var`, `import` and function declarations.

In a Vue context, the template compiler applies *static hoisting* to improve performance. When converting a template to a render function, VNodes that correspond to static content can be created once and then reused. These static VNodes are described as hoisted because they are created outside the render function, before it runs. A similar form of hoisting is applied to static objects or arrays that are generated by the template compiler.

For more details see:
- [Guide - Rendering Mechanism - Static Hoisting](/guide/extras/rendering-mechanism.html#static-hoisting)

## in-DOM template {#in-dom-template}

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
