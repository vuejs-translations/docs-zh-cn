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

- **参考**：[模板语法 - 文本插值](/guide/essentials/template-syntax.html#text-interpolation)

## v-html {#v-html}

更新元素的 [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)。

- **预期：** `string`

- **详细信息**

 `v-html` 的内容直接作为普通 HTML 插入—— Vue 模板语法是不会被解析的。如果你发现自己正打算用 `v-html` 来编写模板，不如重新想想怎么使用组件来代替。

 ::: warning 安全说明
 在你的站点上动态渲染任意的 HTML 是非常危险的，因为它很容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。请只对可信内容使用 HTML 插值，**绝不要**将用户提供的内容作为插值
  :::

 在[单文件组件](/guide/scaling-up/sfc)，`scoped` 样式将不会作用于 `v-html` 里的内容，因为 HTML 内容不会被 Vue 的模板编译器解析。如果你想让 `v-html` 的内容也支持 scoped CSS，你可以使用 [CSS modules](./sfc-css-features.html#css-modules) 或使用一个额外的全局 `<style>` 元素，手动设置类似 BEM 的作用域策略。

- **示例：**

  ```vue-html
  <div v-html="html"></div>
  ```

- **参考**：[模板语法 - 原始 HTML](/guide/essentials/template-syntax.html#raw-html)

## v-show {#v-show}

基于表达式值的真假性，来改变元素的可见性。

- **预期：** `any`

- **详细信息**

  `v-show` 通过设置内联样式的 `display` CSS property 来工作，当元素可见时将使用初始 `display` 值。当条件改变时，也会触发过度效果。

- **参考**：[条件渲染 - v-show](/guide/essentials/conditional.html#v-show)

## v-if {#v-if}

基于表达式值的真假性，来条件性地渲染元素或者模板片段。

- **预期：** `any`

- **详细信息**

  当 `v-if` 元素被触发，元素及其所包含的指令/组件都会销毁和重构。如果初始条件是假，那么其内部的内容根本都不会被渲染。

  可用于 `<template>` 表示仅包含文本或多个元素的条件块。

  当条件改变时会触发过渡效果。

  当同时使用时，`v-if` 比 `v-for` 优先级更高。我们并不推荐在一元素上同时使用这两个指令 — 查看[列表渲染指南](/guide/essentials/list.html#v-for-with-v-if)详情。

- **参考**：[条件渲染 - v-if](/guide/essentials/conditional.html#v-if)

## v-else {#v-else}

表示 `v-if` 或 `v-if` / `v-else-if` 链式调用的“else 块”。

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

- **参考**：[条件渲染 - v-else](/guide/essentials/conditional.html#v-else)

## v-else-if {#v-else-if}

表示 `v-if` 的“else if 块”。可以进行链式调用。

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

- **参考**：[条件渲染 - v-else-if](/guide/essentials/conditional.html#v-else-if)

## v-for {#v-for}

基于原始数据多次渲染元素或模板块。

- **预期：** `Array | Object | number | string | Iterable`

- **详细信息**

  指令值必须使用特殊语法 `alias in expression` 为正在迭代的元素提供一个别名：

  ```vue-html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  或者，你也可以为索引指定别名 (如果用在对象，则是键值)：

  ```vue-html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  `v-for` 的默认方式是尝试就地更新元素而不移动它们。要强制其重新排序元素，你需要用特殊 attribute `key` 来提供一个排序提示：

  ```vue-html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `v-for` 也可以用于 [Iterable Protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 的实现，包括原生 `Map` 和 `Set`。

- **参考：**
  - [列表渲染](/guide/essentials/list.html)

## v-on {#v-on}

给元素绑定事件监听器。

- **缩写：** `@`

- **预期：** `Function | Inline Statement | Object (不带参数)`

- **参数：** `event` (使用对象语法则为可选项)

- **修饰符：**

  - `.stop` ——调用 `event.stopPropagation()`。
  - `.prevent` ——调用 `event.preventDefault()`。
  - `.capture` ——在捕获模式添加事件监听器。
  - `.self` ——只有事件从元素本身发出才触发处理函数。
  - `.{keyAlias}` ——只在某些按键下触发处理函数。
  - `.once` ——最多触发一次处理函数。
  - `.left` ——只在鼠标左键事件触发处理函数。
  - `.right` ——只在鼠标右键事件触发处理函数。
  - `.middle` ——只在鼠标中键事件触发处理函数。
  - `.passive` ——通过 `{ passive: true }` 附加一个 DOM 事件。

- **详细信息**

  事件类型由参数来指定。表达式可以是一个方法名，一个内联声明，如果有修饰符则可省略。

  当用于普通元素，只监听[**原生 DOM 事件**](https://developer.mozilla.org/en-US/docs/Web/Events)。当用于自定义元素组件，则监听子组件触发的**自定义事件**。

  当监听原生 DOM 事件时，方法接收原生事件作为唯一参数。如果使用内联声明，声明可以访问一个特殊的 `$event` property：`v-on:click="handle('ok', $event)"`。

  `v-on` 还支持绑定不带参数的事件/监听器对的对象。请注意，当使用对象语法时，不支持任何修饰符。

- **示例：**

  ```vue-html
  <!-- 方法处理函数 -->
  <button v-on:click="doThis"></button>

  <!-- 动态事件 -->
  <button v-on:[event]="doThis"></button>

  <!-- 内联声明 -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- 缩写 -->
  <button @click="doThis"></button>

  <!-- 使用缩写的动态事件 -->
  <button @[event]="doThis"></button>

  <!-- 停止传播 -->
  <button @click.stop="doThis"></button>

  <!-- 阻止默认事件 -->
  <button @click.prevent="doThis"></button>

  <!-- 不带表达式地阻止默认事件 -->
  <form @submit.prevent></form>

  <!-- 链式调用修饰符 -->
  <button @click.stop.prevent="doThis"></button>

  <!-- 按键用于 keyAlias 修饰符-->
  <input @keyup.enter="onEnter" />

  <!-- 点击事件将最多触发一次 -->
  <button v-on:click.once="doThis"></button>

  <!-- 对象语法 -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  监听子组件的自定义事件 (当子组件的“my-event”事件被触发，处理函数将被调用)：

  ```vue-html
  <MyComponent @my-event="handleThis" />

  <!-- 内联声明 -->
  <MyComponent @my-event="handleThis(123, $event)" />
  ```

- **参考：**
  - [事件处理](/guide/essentials/event-handling.html)
  - [组件 - 自定义事件](/guide/essentials/component-basics.html#listening-to-events)

## v-bind {#v-bind}

动态的绑定一个或多个 attribute，也可以是组件的 prop。

- **缩写：** `:` 或者 `.` (当使用 `.prop` 修饰符)

- **期望：** `any (带参数) | Object (不带参数)`

- **参数：** `attrOrProp (可选的)`

- **修饰符：**

  - `.camel` ——将短横线命名的 attribute 转变为驼峰式命名。
  - `.prop` ——强制绑定为 DOM property。<sup class="vt-badge">3.2+</sup>
  - `.attr` ——强制绑定为 DOM attribute。<sup class="vt-badge">3.2+</sup>

- **用途：**

  当用于绑定 `class` 或 `style` attribute，`v-bind` 支持额外的值类型如数组或对象。详见下方的指南链接。

  当在元素设置了绑定，Vue 默认利用 `in` 操作检查，该元素中是否已把关键字定义为 property。如果 property 已定义，Vue 会把值设为一个 DOM property 而不是 attribute。这对于大多数情况都适用，但是你也可以显示调用 `.prop` 和 `.attr` 修饰符来覆盖这种特性。有时这是必要的，特别是[用在自定义元素](/guide/extras/web-components.html#passing-dom-properties)。

  当用于组件 prop 绑定，prop 必须在子组件中已被正确声明。

  当用于无参情况，可以用于绑定具有名值对 attribute 的对象。请注意，这种模式 `class` 和 `style` 不支持数组或对象。

- **示例：**

  ```vue-html
  <!-- 绑定 attribute -->
  <img v-bind:src="imageSrc" />

  <!-- 动态 attribute 名 -->
  <button v-bind:[key]="value"></button>

  <!-- 缩写 -->
  <img :src="imageSrc" />

  <!-- 缩写形式的动态 attribute 名 -->
  <button :[key]="value"></button>

  <!-- 内联字符串拼接 -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- class 绑定 -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

  <!-- style 绑定 -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- 绑定对象形式的 attribute -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- prop 绑定。“prop” 必须在子组件中已声明。 -->
  <MyComponent :prop="someThing" />

  <!-- 传递子父组件共有的 prop -->
  <MyComponent v-bind="$props" />

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  `.prop` 修饰符也有专门的缩写，`.`：

  ```vue-html
  <div :someProperty.prop="someObject"></div>
  
  <!-- 等同于 -->
  <div .someProperty="someObject"></div>
  ```

  当在 DOM 内模板使用 `.camel` 修饰符，可以驼峰化 `v-bind` attribute 的名称，例如 SVG `viewBox` attribute：

  ```vue-html
  <svg :view-box.camel="viewBox"></svg>
  ```

  如果使用字符串模板或使用构建步骤预编译模板，则不需要 `.camel`。

- **参考：**
  - [Class 与 Style 绑定](/guide/essentials/class-and-style.html)
  - [组件 -  Prop 传递细节](/guide/components/props.html#prop-passing-details)

## v-model {#v-model}

在表单输入元素或组件中创建双向绑定。

- **预期**：根据表单输入元素或组件输出的值而变化

- **仅限：**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **修饰符：**

  - [`.lazy`](/guide/essentials/forms.html#lazy) ——监听 `change` 事件而不是 `input`
  - [`.number`](/guide/essentials/forms.html#number) ——将输入的合法符串转为数字
  - [`.trim`](/guide/essentials/forms.html#trim) ——移除输入内容两端空格

- **参考：**

  - [表单输入绑定](/guide/essentials/forms.html)
  - [组件事件 - 配合 `v-model` 使用](/guide/components/events.html#usage-with-v-model)

## v-slot {#v-slot}

表示具名插槽或准备接收 prop 的插槽。

- **缩写：** `#`

- **预期**：在函数参数位置，JavaScript 表达式是合法的，也支持解构。可选项——只有在给插槽传 prop 才需要。

- **参数**：插槽名 (可选，默认是 `default`)

- **仅限：**

  - `<template>`
  - [components](/guide/components/slots.html#scoped-slots) (用于带有 prop 的单个默认插槽)

- **示例：**

  ```vue-html
  <!-- 具名插槽 -->
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

  <!-- 接收 prop 的具名插槽 -->
  <InfiniteScroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </InfiniteScroll>

  <!-- 接收 prop 的默认插槽，并解构 -->
  <Mouse v-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
  </Mouse>
  ```

- **参考：**
  - [组件 - 插槽](/guide/components/slots.html)

## v-pre

跳过该元素及其所有子元素的编译。

- **无需传入**

- **详细信息**

  元素内具有 `v-pre`，所有 Vue 模板语法都会被保留并按原样渲染。最常见的用例就是显示原始双大括号标签及内容。

- **示例：**

  ```vue-html
  <span v-pre>{{ this will not be compiled }}</span>
  ```

## v-once {#v-once}

仅渲染元素和组件一次，并跳过之后的更新。

- **无需传入**

- **详细信息**

  在随后的重新渲染，元素/组件及其所有子项将被当作静态内容并跳过渲染。这可以用来优化更新时的性能。

  ```vue-html
  <!-- 单个元素 -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- 带有子元素的元素 -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- 组件 -->
  <my-component v-once :comment="msg"></my-component>
  <!-- `v-for` 指令 -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  从 3.2 起，你也可以搭配 [`v-memo`](#v-memo) 的无效条件来缓存部分模板。

- **参考：**
  - [数据绑定语法 - 插值](/guide/essentials/template-syntax.html#text-interpolation)
  - [v-memo](#v-memo)

## v-memo <sup class="vt-badge" data-text="3.2+" /> {#v-memo}

- **预期：** `any[]`

- **详细信息**

  缓存一个模板的子树。元素和组件都可以使用。为了实现缓存，该指令期待传入一个定长地依赖值数组进行比较。如果数组里的每个值都与最后一次的渲染相同，那么整个子树的更新将被跳过。举个例子：

  ```vue-html
  <div v-memo="[valueA, valueB]">
    ...
  </div>
  ```

  当组件重新渲染，如果 `valueA` 和 `valueB` 都保持不变，这个 `<div>` 及其子项的所有更新都将被跳过。实际上，甚至虚拟 DOM 的 vnode 创建也将被跳过，因为缓存的子树副本可以被重新使用。

  正确指定缓存数组很重要，否则应该生效的更新可能被跳过。`v-memo` 传入空依赖数组 (`v-memo="[]"`) 将与 `v-once` 效果相同。

  **与 `v-for` 一起使用**

  `v-memo` 仅用于性能至上场景中的微小优化，应该很少需要。最常见的情况可能是有助于渲染海量 `v-for` 列表 (当 `length > 1000`)：

  ```vue-html
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...more child nodes</p>
  </div>
  ```

  当组件的 `selected` 状态改变，大量的 vnode 将会被创建，尽管大部分项都是完全一致。`v-memo` 用在这里本质上是在说“只有从未选中变为选中或者相反转变时才更新”。这使得每个未受影响的项能重用之前的 vnode 并完全跳过差异比较。注意这里我们并不需要包含 `item.id` 在 memo 依赖数组中，因为 Vue 会根据 item 的 `:key` 进行推断。

  :::warning 警告
  当搭配 `v-for` 使用 `v-memo`，确保它两是用在同一个元素中。**`v-memo` 不能用在 `v-for` 内。**
  :::

  `v-memo` 也能被用于组件来手动阻止在子组件更新检查取消优化的某些极端情况下，出现不需要的更新。但是再次说明，指定正确的依赖数组以免跳过必要更新，这是开发者的责任。

- **参考：**
  - [v-once](#v-once)

## v-cloak {#v-cloak}

用于隐藏未编译的模板，直到完成。

- **无需传入**

- **详细信息**

  **该指令只在没有构建步骤的环境下需要使用。**

  当用于 DOM 内模板，可能会“突然出现之前未编译好的模板”：用户可能先看到原始双大括号标签，直到挂载的组件将它们替换为渲染的内容。

  `v-cloak` 将保留在元素上直到相关组件实例被挂载。与像 `[v-cloak] { display: none }` 这样的 CSS 规则结合，它可以隐藏原始模板直到组件编译完毕。

- **示例：**

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

  `<div>` 将不可见直到编译完成。
