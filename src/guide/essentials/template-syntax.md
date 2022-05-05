# 模板语法 {#template-syntax}

Vue 使用一种基于 HTML 的模板语法，使我们能够声明式地将其组件实例的数据绑定到呈现的 DOM 上。所有的 Vue 模板都是语法上合法的 HTML，可以被符合规范的浏览器和 HTML 解析器解析。

在底层机制中，Vue 会将模板编译成高度优化的 JavaScript 代码。结合响应式系统，当应用状态变更时，Vue 能够智能地推导出需要重新渲染的组件的最少数量，并应用最少的 DOM 操作。

如果你对虚拟 DOM 的概念比较熟悉，并且偏向于 JavaScript 的原始力量，你也可以结合可选的 JSX 支持[直接手写渲染函数](/guide/extras/render-function.html)而不采用模板。但请注意，这将不会享受到和模板同等级别的编译时优化。

## 文本插值 {#text-interpolation}

最基本的数据绑定形式是文本插值，它使用的是“Mustache”语法 (即双大括号)：

```vue-html
<span>Message: {{ msg }}</span>
```

双大括号标签会被替换为相应组件实例中 `msg` property 的值。同时每次 `msg` property 更改时它也会同步更新。

## 原始 HTML {#raw-html}

双大括号将会将数据插值为纯文本，而不是 HTML。若想插入 HTML，你需要使用 [`v-html` 指令](/api/built-in-directives.html#v-html)：

```vue-html
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

<script setup>
  const rawHtml = '<span style="color: red">This should be red.</span>'
</script>

<p class="demo">
  <p>Using text interpolation: {{ rawHtml }}</p>
  <p>Using v-html directive: <span v-html="rawHtml"></span></p>
</p>

这里我们遇到了一个新的概念。这里看到的 `v-html` attribute 被称为一个**指令**。指令由 `v-` 作为前缀，表明它们是一些由 Vue 提供的特殊 attribuite，你可能已经猜到了，它们将为渲染的 DOM 应用特殊的响应式行为。这里我们做的事情简单来说就是：在当前组件实例上，将此元素的 innerHTML 与 `rawHtml` property 保持同步。

`span` 的内容将会被替换为 `rawHtml` property 的值，插值为纯 HTML——数据绑定将会被忽略。注意，你不能使用 `v-html` 来拼接组合模板，因为 Vue 不是一个基于字符串的模板引擎。相反，组件更适合作为 UI 重用和组合的基本单元。

:::warning 安全警告
在网站上动态渲染任意 HTML 是非常危险的，因为这非常容易造成 [XSS 漏洞](https://en.wikipedia.org/wiki/Cross-site_scripting)。请仅在内容安全可信时再使用 `v-html`，并且**永远不要**使用用户提供的 HTML 内容。
:::

## Attribute 绑定 {#attribute-bindings}

双大括号不能在 HTML attributes 中使用。相应的，应该使用 [`v-bind` 指令](/api/built-in-directives.html#v-bind)：

```vue-html
<div v-bind:id="dynamicId"></div>
```

`v-bind` 指令指示 Vue 将元素的 `id` attribute 与组件的 `dynamicId` property 保持一致。如果绑定的值是 `null` 或者 `undefined`，那么该 attribute 将会从渲染的元素上移除。

### 简写 {#shorthand}

因为 `v-bind` 非常常用，我们提供了特定的简写语法：

```vue-html
<div :id="dynamicId"></div>
```

开头为 `:` 的 attribute 可能和一般的 HTML attribute 看起来不太一样，但它的确是合法的 attribute 名称字符，并且所有支持 Vue 的浏览器都能正确解析它。此外，他们不会出现在最终渲染的标签中。简写语法是可选的，但相信在你了解了它更多的用处后，你应该会更喜欢它。

> 接下来的指引中，我们都将在示例中使用简写语法，因为这是在 Vue 开发者之间最常见的用法。

### 布尔型 Attribute {#boolean-attributes}

[布尔型 attribute](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes) 依据 true / false 值来决定 attribute 是否应该存在于该元素上。[`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) 就是最常见的例子之一。

`v-bind` 在这种场景下的行为略有不同：

```vue-html
<button :disabled="isButtonDisabled">Button</button>
```

当 `isButtonDisabled` 为[真值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)或一个空字符串 (即 `<button disabled="">`) 时，元素会包含这个 `disabled` attribute。而当其为[假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)时 attribute 将被忽略。

### 动态绑定多个值 {#dynamically-binding-multiple-attributes}

如果你有像这样的一个包含多个 attribute 的 JavaScript 对象：

<div class="composition-api">

```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper'
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    objectOfAttrs: {
      id: 'container',
      class: 'wrapper'
    }
  }
}
```

</div>

通过不带参数的 `v-bind`，你可以将它们绑定到单个元素上：

```vue-html
<div v-bind="objectOfAttrs"></div>
```

## 使用 JavaScript 表达式

至此，我们仅在模板中绑定了一些简单的 property 键。但是 Vue 实际上在所有的数据绑定中都支持完整的 JavaScript 表达式：

```vue-html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```

这些表达式都会被作为 JavaScript ，以组件为作用域解析执行。

在 Vue 模板内，JavaScript 表达式可以被使用在如下场景上：

- 在文本插值中 (双大括号)
- 在任何 Vue 指令 (以 `v-` 开头的特殊 attribute) attribute 的值中

### 仅支持表达式

每个绑定仅支持**单一表达式**，所以下面的例子都是**无效**的：

```vue-html
<!-- 这是一个语句，而非表达式 -->
{{ var a = 1 }}

<!-- 条件控制同样不会工作，请使用三元表达式 -->
{{ if (ok) { return message } }}
```

### 调用函数 {#calling-functions}

可以在绑定的表达式中使用一个组件暴露的方法：

```vue-html
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```

:::tip
绑定在表达式中的方法在组件每次更新时都会被重新调用，因此**不**应该产生任何副作用，比如改变数据或触发异步操作。
:::

### 受限的全局访问 {#restricted-globals-access}

模板中的表达式将被沙盒化，仅能够访问到[有限的全局对象列表](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsWhitelist.ts#L3)。该列表中会暴露常用的内置全局对象，比如 `Math` 和 `Date`。

没有显式包含在列表中的全局对象将不能在模板内表达式中访问，例如用户附加在 `window` 上的 property。然而，你也可以自行在 [`app.config.globalProperties`](/api/application.html#app-config-globalproperties) 上显式地添加他们，供所有的 Vue 表达式使用。

## 指令 {#directives}

指令是带有 `v-` 前缀的特殊 attribute。Vue 提供了许多[内置指令](/api/built-in-directives.html)，包括上面我们所介绍的 `v-bind` 和 `v-html`。

指令 attribute 的期望值为一个 JavaScript 表达式 (之后要讨论到的 `v-for`、`v-on` 和 `v-slot` 将会是例外)。使用指令是为了在其表达式值变化时响应式地对 DOM 应用更新。以 [`v-if`](/api/built-in-directives.html#v-if) 为例：

```vue-html
<p v-if="seen">Now you see me</p>
```

这里，`v-if` 指令会基于表达式 `seen` 的值的真假来移除/插入该 `<p>` 元素。

### 参数 {#arguments}

某些指令会需要一个“参数”，在指令名后通过一个冒号隔开做标识。例如用 `v-bind` 指令来响应式地更新一个 HTML attribute：

```vue-html
<a v-bind:href="url"> ... </a>

<!-- 简写 -->
<a :href="url"> ... </a>
```

这里 `href` 就是一个参数，它告诉 `v-bind` 指令将表达式 `url` 的值绑定到元素的 `href` attribute 上。在简写中，参数前的一切 (例如 `v-bind:`) 都会被缩略为一个 `:` 字符。

另一个例子是 `v-on` 指令，它将监听 DOM 事件：

```vue-html
<a v-on:click="doSomething"> ... </a>

<!-- 简写 -->
<a @click="doSomething"> ... </a>
```

这里的参数是要监听的事件名称：`click`。`v-on` 也是少部分含有简写的指令之一，简写字符为 `@`。我们之后也会讨论关于事件处理的更多细节。

### 动态参数 {#dynamic-arguments}

同样在指令参数上也可以使用一个 JavaScript 表达式，需要包含在一对方括号内：

```vue-html
<!--
注意，参数表达式有一些约束，
参见下面“动态参数值的限制”与“动态参数语法的限制”章节的解释
-->
<a v-bind:[attributeName]="url"> ... </a>

<!-- 简写 -->
<a :[attributeName]="url"> ... </a>
```

这里的 `attributeName` 会作为一个 JavaScript 表达式被动态执行，计算得到的值会被用作最终的参数。举个例子，如果你的组件实例有一个数据 property `attributeName`，其值为 `"href"`，那么这个绑定就等价于 `v-bind:href`。

相似地，你还可以将一个函数绑定到动态的事件名称上：

```vue-html
<a v-on:[eventName]="doSomething"> ... </a>

<!-- 简写 -->
<a @[eventName]="doSomething">
```

在此示例中，当 `eventName` 的值是 `"focus"` 时，`v-on:[eventName]` 就等价于 `v-on:focus`。

#### 动态参数值的限制 {#dynamic-argument-value-constraints}

动态参数期望结果为一个字符串，或者是 `null`。特殊值 `null` 意为显式移除该绑定。任何其他非字符串的值都将触发一个警告。

#### 动态参数语法的限制 {#dynamic-argument-syntax-constraints}

动态参数表达式因为某些字符的缘故有一些语法限制，比如空格和引号，在 HTML attribute 名称中都是不合法的。例如下面的示例：

```vue-html
<!-- 这会触发一个编译器警告 -->
<a :['foo' + bar]="value"> ... </a>
```

如果你需要传入一个复杂的动态参数，我们推荐使用[计算属性](computed.html)替换复杂的表达式，也是 Vue 最基础的概念之一，我们很快就会讲到。

当使用 DOM 内嵌模板 (直接写在 HTML 文件里的模板) 时，我们需要避免在名称中使用大写字母，因为浏览器会强制将其转换为小写：

```vue-html
<a :[someAttr]="value"> ... </a>
```

上面的例子将会在 DOM 内嵌模板中被转换为 `:[someattr]`。如果你的组件拥有 “someAttr” property 而非 “someattr”，这段代码将不会工作。

### 修饰符 {#modifiers}

修饰符是以点开头的特殊后缀，表明指令需要以一些特殊的方式被绑定。例如 `.prevent` 修饰符会告知 `v-on` 指令对触发的事件调用 `event.preventDefault()`：

```vue-html
<form @submit.prevent="onSubmit">...</form>
```

之后在讲到 [`v-on`](./event-handling.html#event-modifiers) 和 [`v-model`](./forms.html#modifiers) 的功能时，你将会看到其他修饰符的例子。

最后，在这里你可以直观地看到完整的指令语法：

![指令语法图](./images/directive.png)

<!-- https://www.figma.com/file/BGWUknIrtY9HOmbmad0vFr/Directive -->

<!-- zhlint disabled -->
