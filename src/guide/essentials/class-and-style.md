# Class 与 Style 绑定 {#class-and-style-bindings}

数据绑定的一个常见需求场景是操纵元素的 CSS class 列表和内联样式。因为它们都是 attribute，我们可以使用 `v-bind` 来做这件事：我们只需要通过表达式计算出一个字符串作为最终结果即可。然而频繁地连接字符串让人很闹心，也很容易出错。因此，Vue 专门为 `class` 和 `style` 的 `v-bind` 用法提供了特殊的功能增强。除了字符串外，表达式的结果还可以是对象或数组。

## 绑定 HTML class {#binding-html-classes}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3" title="动态 CSS class - 免费 Vue.js 课程"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-dynamic-css-classes-with-vue" title="动态 CSS class - 免费 Vue.js 课程"/>
</div>

### 绑定对象 {#binding-to-objects}

我们可以给 `:class` (`v-bind:class` 的缩写) 传递一个对象来动态切换 class：

```vue-html
<div :class="{ active: isActive }"></div>
```

上面的语法表示 `active` 是否存在取决于数据属性 `isActive` 的[真假值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)。

你可以在对象中写多个字段来操作多个 class。此外，`:class` 指令也可以和一般的 `class` attribute 共存。所以可以有下面这样的状态：

<div class="composition-api">

```js
const isActive = ref(true)
const hasError = ref(false)
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

</div>

使用的模板如下：

```vue-html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

它将会被渲染成：

```vue-html
<div class="static active"></div>
```

当 `isActive` 或者 `hasError` 改变时，class 列表会随之更新。举个例子，如果 `hasError` 变为 `true`，class 列表也会变成 `"static active text-danger"`。

绑定的对象也不一定写成内联的形式：

<div class="composition-api">

```js
const classObject = reactive({
  active: true,
  'text-danger': false
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

这也会渲染出相同的结果。我们也可以绑定一个返回对象的[计算属性](./computed)。这才是一个通用且好用的实践。

<div class="composition-api">

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

### 绑定数组 {#binding-to-arrays}

我们可以给 `:class` 绑定一个数组以应用一系列 CSS class：

<div class="composition-api">

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

</div>

```vue-html
<div :class="[activeClass, errorClass]"></div>
```

渲染的结果是：

```vue-html
<div class="active text-danger"></div>
```

如果你也想在数组中按条件触发某个 class，你可以使用三元表达式：

```vue-html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

`errorClass` 会一直存在，但 `activeClass` 只会在 `isActive` 为真时才存在。

然而，这可能在有多个依赖条件的 class 时会有些冗长。因此也可以在数组中使用对象语法：

```vue-html
<div :class="[{ active: isActive }, errorClass]"></div>
```

### 和组件配合 {#with-components}

> 本节假设你已经有 [Vue 组件](/guide/essentials/component-basics)的知识基础。如果没有，你也可以暂时跳过，以后再阅读。

对于只有一个根元素的组件，当你使用了 `class` attribute 时，这些 class 会被添加到根元素上，并与该元素上已有的 class 合并。

举个例子，如果你声明了一个组件名叫 `my-component`，模板如下：

```vue-html
<!-- 子组件模板 -->
<p class="foo bar">Hi!</p>
```

在使用时添加一些 class：

```vue-html
<!-- 在使用组件时 -->
<my-component class="baz boo"></my-component>
```

渲染出的 HTML 为：

```vue-html
<p class="foo bar baz boo">Hi</p>
```

Class 的绑定也是同样的：

```vue-html
<my-component :class="{ active: isActive }"></my-component>
```

当 `isActive` 为真时，被渲染的 HTML 会是：

```vue-html
<p class="foo bar active">Hi</p>
```

如果你的组件有多个根元素，你将需要指定哪个根元素来接收这个 class。你可以通过组件的 `$attrs` property 来实现指定：

```vue-html
<!-- my-component 模板使用 $attrs 时 -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

```vue-html
<my-component class="baz"></my-component>
```

这将被渲染为：

```html
<p class="baz">Hi!</p>
<span>This is a child component</span>
```

你可以在[透传 Attribute](/guide/components/attrs.html) 一章中学习到更多组件的 attribute 继承的细节。

## 绑定内联样式 {#binding-inline-styles}

### 绑定对象 {#binding-to-objects-2}

`:style` 支持绑定 JavaScript 对象值，对应的是 [HTML 元素的 `style` 属性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style)：

<div class="composition-api">

```js
const activeColor = ref('red')
const fontSize = ref(30)
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

</div>

```vue-html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

尽管推荐使用 camelCase，但 `:style` 也支持 kebab-cased 形式的 CSS 属性 key (对应其 CSS 中的实际名称)，举个例子：

```vue-html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

直接绑定一个样式对象通常是一个好主意，这样可以使模板更加简洁：

<div class="composition-api">

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '13px'
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

</div>

```vue-html
<div :style="styleObject"></div>
```

同样的，如果样式对象需要更复杂的逻辑，也可以使用返回样式对象的计算属性。

### 绑定数组 {#binding-to-arrays-2}

我们还可以给 `:style` 绑定一个包含多个样式对象的数组。这些对象会被合并和应用到同一元素上：

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```

### 自动前缀 {#auto-prefixing}

当你在 `:style` 中使用了需要[浏览器特殊前缀](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix)的 CSS 属性时，Vue 会自动为他们加上相应的前缀。Vue 是在运行时检查该属性是否支持在当前浏览器中使用。如果浏览器不支持某个属性，那么将测试加上各个浏览器特殊前缀，以找到哪一个是被支持的。

### 样式多值 {#multiple-values}

你可以对一个样式属性提供多个 (不同前缀的) 值，举个例子：

```vue-html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

数组仅会渲染浏览器支持的最后一个值。在这个示例中，在支持不需要特别加前缀的浏览器中都会渲染为 `display: flex` 的弹性盒子。
