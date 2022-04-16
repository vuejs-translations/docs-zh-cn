# 内置指令

## v-text {#v-text}

更新元素的文本内容。

- **预期：** `string`

- **详细信息**

  `v-text` 通过设置元素的 [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) property 来工作，因此它将覆盖元素中所有现有的内容。如果你需要更新 `textContent` 的部分，应该使用 [mustache interpolations](/guide/essentials/template-syntax.html#text-interpolation) 代替。

- **示例**

  ```vue-html
  <span v-text="msg"></span>
  <!-- 等同于 -->
  <span>{{msg}}</span>
  ```

- **相关内容：** [模板语法 - 文本插值](/guide/essentials/template-syntax.html#text-interpolation)

## v-html {#v-html}

更新元素的 [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)。

- **预期：** `string`

- **详细信息**

  `v-html` 的内容直接作为普通 HTML 插入 - Vue 模板语法是不会被解析的。如果你发现自己正打算用 `v-html` 来编写模板，重新想想怎么使用组件来代替。

  ::: warning 安全说明
  在自己网站上动态地渲染任意 HTML 将是非常危险的，因为这非常容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。仅仅把 `v-html` 用于可信任的内容，**永不**用于用户提供的内容。
  :::

  在 [单文件组件](/guide/scaling-up/sfc)，`scoped` 样式将不会作用于 `v-html` 里的内容，因为 HTML 内容不会被 Vue 的模板编译器解析。如果你想让 `v-html` 的内容也用上 scoped CSS，你可以使用 [CSS modules](./sfc-css-features.html#css-modules) 或使用一个额外的全局 `<style>` 元素，手动设置类似 BEM 的作用域策略。

- **示例：**

  ```vue-html
  <div v-html="html"></div>
  ```

- **相关内容：** [模板语法 - 原始 HTML](/guide/essentials/template-syntax.html#raw-html)

## v-show {#v-show}

基于表达式值的真假性，来改变元素的可见性。

- **预期：** `any`

- **详细信息**

  `v-show` 通过设置内联样式的 `display` CSS property 来工作，当元素可见时将使用初始 `display` 值。当条件改变时，也会触发过度效果。

- **相关内容：** [条件渲染 - v-show](/guide/essentials/conditional.html#v-show)

## v-if {#v-if}

基于表达式值的真假性，来条件性地渲染元素或者模板片段。

- **预期：** `any`

- **详细信息**

  当 `v-if` 元素被触发，元素及其所包含的指令/组件都会销毁和重构。如果初始条件是假，那么其内部的内容根本都不会被渲染。

  可用于 `<template>` 表示仅包含文本或多个元素的条件块。

  当条件改变时会触发过度效果。

  当同时使用时， `v-if` 比 `v-for` 优先级更高。我们并不推荐在一元素上同时使用这两个指令 — 查看 [列表渲染指南](/guide/essentials/list.html#v-for-with-v-if) 详情。

- **相关内容：** [条件渲染 - v-if](/guide/essentials/conditional.html#v-if)

## v-else

表示 `v-if` 或 `v-if` / `v-else-if` 链式调用的”else 块“。

- **无需传入表达式**

- **详细信息**

  - 限定：上一个兄弟元素必须有 `v-if` 或 `v-else-if`。

  - 可用于 `<template>` 表示仅包含文本或多个元素的条件块。

- **示例**

  ```vue-html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

- **相关内容：** [条件渲染 - v-else](/guide/essentials/conditional.html#v-else)

## v-else-if  {#v-else-if}

表示 `v-if` 的”else if 块“。可以进行链式调用。

- **预期：** `any`

- **详细信息**

  - 限定：上一个兄弟元素必须有 `v-if` 或 `v-else-if`。

  - 可用于 `<template>` 表示仅包含文本或多个元素的条件块。

- **示例**

  ```vue-html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Not A/B/C
  </div>
  ```

- **相关内容：** [条件渲染 - v-else-if](/guide/essentials/conditional.html#v-else-if)

## v-for

基于原始数据多次渲染元素或模板块。

- **预期：** `Array | Object | number | string | Iterable`

- **详细信息**

  指令值必须使用特殊语法 `alias in expression` 为正在迭代的元素提供一个别名：

  ```vue-html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  或者，你也可以为索引指定别名（如果用在对象，则是键值）：

  ```vue-html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

   `v-for` 的默认方式是尝试就地更新元素而不移动它们。要强制给元素重新排序，你需要提供 `key` 特殊 attribute 作为排序提示：

  ```vue-html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `v-for` 也可以用于 [Iterable Protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 的实现，包括原生 `Map` 和 `Set`。

- **相关内容：**
  - [列表渲染](/guide/essentials/list.html)

## v-on

Attach an event listener to the element.

- **Shorthand:** `@`

- **预期：** `Function | Inline Statement | Object (without argument)`

- **Argument:** `event` (optional if using Object syntax)

- **修饰符：**

  - `.stop` - call `event.stopPropagation()`.
  - `.prevent` - call `event.preventDefault()`.
  - `.capture` - add event listener in capture mode.
  - `.self` - only trigger handler if event was dispatched from this element.
  - `.{keyAlias}` - only trigger handler on certain keys.
  - `.once` - trigger handler at most once.
  - `.left` - only trigger handler for left button mouse events.
  - `.right` - only trigger handler for right button mouse events.
  - `.middle` - only trigger handler for middle button mouse events.
  - `.passive` - attaches a DOM event with `{ passive: true }`.

- **详细信息**

  The event type is denoted by the argument. The expression can be a method name, an inline statement, or omitted if there are modifiers present.

  When used on a normal element, it listens to [**native DOM events**](https://developer.mozilla.org/en-US/docs/Web/Events) only. When used on a custom element component, it listens to **custom events** emitted on that child component.

  When listening to native DOM events, the method receives the native event as the only argument. If using inline statement, the statement has access to the special `$event` property: `v-on:click="handle('ok', $event)"`.

  `v-on` also supports binding to an object of event / listener pairs without an argument. Note when using the object syntax, it does not support any modifiers.

- **示例：**

  ```vue-html
  <!-- method handler -->
  <button v-on:click="doThis"></button>

  <!-- dynamic event -->
  <button v-on:[event]="doThis"></button>

  <!-- inline statement -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- shorthand -->
  <button @click="doThis"></button>

  <!-- shorthand dynamic event -->
  <button @[event]="doThis"></button>

  <!-- stop propagation -->
  <button @click.stop="doThis"></button>

  <!-- prevent default -->
  <button @click.prevent="doThis"></button>

  <!-- prevent default without expression -->
  <form @submit.prevent></form>

  <!-- chain modifiers -->
  <button @click.stop.prevent="doThis"></button>

  <!-- key modifier using keyAlias -->
  <input @keyup.enter="onEnter" />

  <!-- the click event will be triggered at most once -->
  <button v-on:click.once="doThis"></button>

  <!-- object syntax -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  Listening to custom events on a child component (the handler is called when "my-event" is emitted on the child):

  ```vue-html
  <MyComponent @my-event="handleThis" />

  <!-- inline statement -->
  <MyComponent @my-event="handleThis(123, $event)" />
  ```

- **相关内容：**
  - [Event Handling](/guide/essentials/event-handling.html)
  - [Components - Custom Events](/guide/essentials/component-basics.html#listening-to-events)

## v-bind

Dynamically bind one or more attributes, or a component prop to an expression.

- **Shorthand:** `:` or `.` (when using `.prop` modifier)

- **期望：** `any (with argument) | Object (without argument)`

- **参数：** `attrOrProp (optional)`

- **修饰符：**

  - `.camel` - transform the kebab-case attribute name into camelCase.
  - `.prop` - force a binding to be set as a DOM property. <sup class="vt-badge">3.2+</sup>
  - `.attr` - force a binding to be set as a DOM attribute. <sup class="vt-badge">3.2+</sup>

- **用途：**

  When used to bind the `class` or `style` attribute, `v-bind` supports additional value types such as Array or Objects. See linked guide section below for more details.

  When setting a binding on an element, Vue by default checks whether the element has the key defined as a property using an `in` operator check. If the property is defined, Vue will set the value as a DOM property instead of an attribute. This should work in most cases, but you can override this behavior by explicitly using `.prop` or `.attr` modifiers. This is sometimes necessary, especially when [working with custom elements](/guide/extras/web-components.html#passing-dom-properties).

  When used for component prop binding, the prop must be properly declared in the child component.

  When used without an argument, can be used to bind an object containing attribute name-value pairs. Note in this mode `class` and `style` does not support Array or Objects.

- **Example:**

  ```vue-html
  <!-- bind an attribute -->
  <img v-bind:src="imageSrc" />

  <!-- dynamic attribute name -->
  <button v-bind:[key]="value"></button>

  <!-- shorthand -->
  <img :src="imageSrc" />

  <!-- shorthand dynamic attribute name -->
  <button :[key]="value"></button>

  <!-- with inline string concatenation -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- class binding -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

  <!-- style binding -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- binding an object of attributes -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- prop binding. "prop" must be declared in the child component. -->
  <MyComponent :prop="someThing" />

  <!-- pass down parent props in common with a child component -->
  <MyComponent v-bind="$props" />

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  The `.prop` and `.attr` modifiers also have a dedicated shorthand, `.` and `^` respectively:

  ```vue-html
  <div :someProperty.prop="someObject"></div>
  <!-- equivalent to -->
  <div .someProperty="someObject"></div>
  
  <div :someProperty.attr="someString"></div>
  <!-- equivalent to -->
  <div ^someProperty="someString"></div>
  ```

  The `.camel` modifier allows camelizing a `v-bind` attribute name when using in-DOM templates, e.g. the SVG `viewBox` attribute:

  ```vue-html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` is not needed if you are using string templates, or pre-compiling the template with a build step.

- **相关内容：**
  - [Class and Style Bindings](/guide/essentials/class-and-style.html)
  - [Components - Prop Passing Details](/guide/components/props.html#prop-passing-details)

## v-model

Create a two-way binding on a form input element or a component.

- **预期：** varies based on value of form inputs element or output of components

- **Limited to:**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **修饰符：**

  - [`.lazy`](/guide/essentials/forms.html#lazy) - listen to `change` events instead of `input`
  - [`.number`](/guide/essentials/forms.html#number) - cast valid input string to numbers
  - [`.trim`](/guide/essentials/forms.html#trim) - trim input

- **相关内容：**

  - [Form Input Bindings](/guide/essentials/forms.html)
  - [Component Events - Usage with `v-model`](/guide/components/events.html#usage-with-v-model)

## v-slot

Denote named slots or slots that expect to receive props.

- **Shorthand:** `#`

- **预期：** JavaScript expression that is valid in a function argument position, including support for destructuring. Optional - only needed if expecting props to be passed to the slot.

- **参数：** slot name (optional, defaults to `default`)

- **Limited to:**

  - `<template>`
  - [components](/guide/components/slots.html#scoped-slots) (for a lone default slot with props)

- **Example:**

  ```vue-html
  <!-- Named slots -->
  <BaseLayout>
    <template v-slot:header>
      Header content
    </template>

    <template v-slot:default>
      Default slot content
    </template>

    <template v-slot:footer>
      Footer content
    </template>
  </BaseLayout>

  <!-- Named slot that receives props -->
  <InfiniteScroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </InfiniteScroll>

  <!-- Default slot that receive props, with destructuring -->
  <Mouse v-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
  </Mouse>
  ```

- **相关内容：**
  - [Components - Slots](/guide/components/slots.html)

## v-pre

Skip compilation for this element and all its children.

- **Does not expect expression**

- **详细信息**

  Inside the element with `v-pre`, all Vue template syntax will be preserved and rendered as-is. The most common use case of this is displaying raw mustache tags.

- **Example:**

  ```vue-html
  <span v-pre>{{ this will not be compiled }}</span>
  ```

## v-once

Render the element and component once only, and skip future updates.

- **Does not expect expression**

- **详细信息**

  On subsequent re-renders, the element/component and all its children will be treated as static content and skipped. This can be used to optimize update performance.

  ```vue-html
  <!-- single element -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- the element have children -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- component -->
  <my-component v-once :comment="msg"></my-component>
  <!-- `v-for` directive -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  Since 3.2, you can also memoize part of the template with invalidation conditions using [`v-memo`](#v-memo).

- **相关内容：**
  - [Data Binding Syntax - interpolations](/guide/essentials/template-syntax.html#text-interpolation)
  - [v-memo](#v-memo)

## v-memo <sup class="vt-badge" data-text="3.2+" />

- **预期：** `any[]`

- **详细信息**

  Memoize a sub-tree of the template. Can be used on both elements and components. The directive expects a fixed-length array of dependency values to compare for the memoization. If every value in the array was the same as last render, then updates for the entire sub-tree will be skipped. For example:

  ```vue-html
  <div v-memo="[valueA, valueB]">
    ...
  </div>
  ```

  When the component re-renders, if both `valueA` and `valueB` remain the same, all updates for this `<div>` and its children will be skipped. In fact, even the Virtual DOM VNode creation will also be skipped since the memoized copy of the sub-tree can be reused.

  It is important to specify the memoization array correctly, otherwise we may skip updates that should indeed be applied. `v-memo` with an empty dependency array (`v-memo="[]"`) would be functionally equivalent to `v-once`.

  **Usage with `v-for`**

  `v-memo` is provided solely for micro optimizations in performance-critical scenarios and should be rarely needed. The most common case where this may prove helpful is when rendering large `v-for` lists (where `length > 1000`):

  ```vue-html
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...more child nodes</p>
  </div>
  ```

  When the component's `selected` state changes, a large amount of VNodes will be created even though most of the items remained exactly the same. The `v-memo` usage here is essentially saying "only update this item if it went from non-selected to selected, or the other way around". This allows every unaffected item to reuse its previous VNode and skip diffing entirely. Note we don't need to include `item.id` in the memo dependency array here since Vue automatically infers it from the item's `:key`.

  :::warning
  When using `v-memo` with `v-for`, make sure they are used on the same element. **`v-memo` does not work inside `v-for`.**
  :::

  `v-memo` can also be used on components to manually prevent unwanted updates in certain edge cases where the child component update check has been de-optimized. But again, it is the developer's responsibility to specify correct dependency arrays to avoid skipping necessary updates.

- **相关内容：**
  - [v-once](#v-once)

## v-cloak

Used to hide un-compiled template until it is ready.

- **Does not expect expression**

- **详细信息**

  **This directive is only needed in no-build-step setups.**

  When using in-DOM templates, there can be a "flash of un-compiled templates": the user may see raw mustache tags until the mounted component replaces them with rendered content.

  `v-cloak` will remain on the element until the associated component instance is mounted. Combined with CSS rules such as `[v-cloak] { display: none }`, it can be used to hide the raw templates until the component is ready.

- **Example:**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```vue-html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  The `<div>` will not be visible until the compilation is done.
