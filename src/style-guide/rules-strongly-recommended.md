# 优先级B: 强烈推荐的规则 {#priority-b-rules-strongly-recommended}

这些规则可以提高大多数项目中的可读性和/或开发人员的经验。如果您违反它们，您的代码仍将运行，但是违规应该罕见且需要完善。

## 组件文件 {#component-files}

**每当有构建系统可用于连接文件时，每个组件都应在自己的文件中。**

您需要编辑或查看如何使用它时，这可以帮助您更快地找到组件。

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```

</div>

## 单文件组件文件名大小写 {#single-file-component-filename-casing}

**[单文件组件](https://github.com/vuejs-translations/docs-zh-cn/blob/main/guide/scaling-up/sfc)的文件名应始终是pascalcase或者kebab-case。** 

Pascalcase在代码编辑器中能够获得最佳的自动完成效果，因为它与我们在如何可能的情况下在JS（X）和模板中引用组件的方式是一致的。但是，混合文件名大小写有时可能会在对大小写不敏感的文件系统上造成问题，这就是为什么kebab-case也完全可以接受的原因。

1. pascalCase
   - 首字母大写的驼峰式命名法 
   - 每个单词的首字母都大写
   - 不使用任何分隔符
   - 示例：`FileName.js`、`UserAccount.ts`
2. kebab-case
   - 使用连字符（-）分隔单词 
   - 所有字母都是小写
   - 单词之间用横杠连接
   - 示例：`file-name.js`、`user-account.html`

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```

</div>

## 基础组件名称 {#base-component-names}

**特定于应用程序的样式和约定的基本组件（又称表现组件，dump组件或纯组件）应以特定的前缀（例如`Base` ， `App`或`V` ）开头。**
:::详细说明: 这些组件为您的应用程序中的一致样式和行为奠定了基础。它们可能**只**包含：

-  html元素，
- 其他基本组件，以及
- 第三方UI组件。

但是它们**永远不会**包含全局状态（例如，来自[Pinia](https://pinia.vuejs.org/zh/)商店的组件）。
他们的名称通常包括它们包装的元素的名称（例如`BaseButton` ， `BaseTable` ），除非其特定目的不存在元素（例如`BaseIcon` ）。如果您在更具体的上下文中构建类似的组件，它们几乎总是会消费这些组件（例如，可以在`ButtonSubmit`中使用`BaseButton` ）。
本约定的一些优势：

- 当在编辑器中按字母顺序排列时，您的应用程序的基本组件都会一起列出，从而易于识别。
- 由于组件名称应该始终是多单词组合，​​因此此约定使您不必为简单组件包装纸（例如`MyButton` ， `VueButton` ）选择任意前缀。
- 由于这些组件经常使用，因此您可能需要简单地将它们整体而不是将它们导入到任何地方。前缀使WebPack成为可能：

```js
const requireComponent = require.context(
  './src',
  true,
  /Base[A-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig =
    baseComponentConfig.default || baseComponentConfig
  const baseComponentName =
    baseComponentConfig.name ||
    fileName.replace(/^.+\//, '').replace(/\.\w+$/, '')
  app.component(baseComponentName, baseComponentConfig)
})
```

:::

<div class="style-example style-example-坏的示例">
<h3>坏的示例</h3>


```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```

</div>

## 紧密耦合的组件名称 {#tightly-coupled-component-names}

**与父母紧密耦合的子组件应包含父组件名称为前缀。**

如果组件仅在单亲组件的上下文中有意义，则该关系应在其名称中显而易见。由于编辑器通常按字母顺序整理文件，因此这也使这些相关文件会在一起显示。

:::详细说明： 您可能会想通过将子组件嵌套在以父组件命名的目录中嵌套来解决此问题。例如：

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

或者:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

不建议这样做，因为它导致：

- 会出现许多具有相似名称的文件，使得在代码编辑器中快速切换文件更加困难。
- 许多嵌套的子目录增加了浏览编辑器侧边栏中组件所需的时间。 :::

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```

</div>

## 组件名称中的单词顺序 {#order-of-words-in-component-names}

**组件名称应以最高级别（通常是大多数通用）单词开始，并以描述性修改单词结尾。** 

:::详细信息：您可能想知道：

> “为什么我们要迫使组件名称使用较少的自然语言？”

在英语中，形容词和其他描述符通常会出现在名词之前，例外则需要连接器单词。例如：

- Coffee *with* milk
- Soup *of the* day
- Visitor *to the* museum 

如果需要的话，您绝对可以将这些连接器单词包含在组件名称中，但是顺序仍然很重要。

另请注意，**这里认定的“最高级别”将是您应用程序的上下文**。例如，想象一个带有搜索表格的应用程序。它可能包括这样的组件：

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

您可能会注意到，很难看到哪些组件特定于搜索。现在，让我们根据规则重命名组件：

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

由于编辑器通常按字母顺序组织文件，因此，组件之间的所有重要关系现在一览无余。

您可能很想以不同的方式解决此问题，将所有搜索组件嵌套在“搜索”目录下，然后将所有设置组件嵌套在“设置”目录下。由于以下原因，我们仅建议在非常大的应用程序（例如100+组件）中考虑这种方法：

- 与浏览单个`components`目录相比，浏览嵌套子目录的导航通常需要更多的时间。
- 命名冲突（例如多个`ButtonDelete.vue`组件）使得在代码编辑器中快速导航到特定组件变得更加困难。
- 重构变得更加困难，因为发现和替换位置通常不足以更新对移动组件的相对引用。
  :::

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

</div>

## 自闭合组件 {#self-closing-components}

**没有内容的组件应在[单文件组件](https://github.com/vuejs-translations/docs-zh-cn/blob/main/guide/scaling-up/sfc)，字符串模板和[JSX](https://github.com/vuejs-translations/docs-zh-cn/blob/main/guide/extras/render-function#jsx-tsx)中自闭合 - 但绝不会在DOM模板中。**

自闭合的组件意味着他们不仅没有内容，而且**本来**就不包含内容。如同书中的空白页与一个标有“此页有意保存空白”的空白页之间的区别。您的代码也很干净，没有不必要的关闭标签。

不幸的是，HTML不允许自定义元素自闭合 - 只有[官方的“void”元素](https://www.w3.org/TR/html/syntax.html#void-elements)。这就是为什么只有在VUE的模板编译器可以在DOM之前到达模板，然后使用DOM 规范兼容的HTML时，该策略才有可能。

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```vue-html
<!-- In Single-File Components, string templates, and JSX -->
<MyComponent></MyComponent>
```

```vue-html
<!-- In in-DOM templates -->
<my-component/>
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```vue-html
<!-- In Single-File Components, string templates, and JSX -->
<MyComponent/>
```

```vue-html
<!-- In in-DOM templates -->
<my-component></my-component>
```

</div>

## 模板中的组件名称大小写{#component-name-casing-in-templates}

**In most projects, component names should always be PascalCase in [Single-File Components](/guide/scaling-up/sfc) and string templates - but kebab-case in in-DOM templates.**

PascalCase has a few advantages over kebab-case:

- Editors can autocomplete component names in templates, because PascalCase is also used in JavaScript.
- `<MyComponent>` is more visually distinct from a single-word HTML element than `<my-component>`, because there are two character differences (the two capitals), rather than just one (a hyphen).
- If you use any non-Vue custom elements in your templates, such as a web component, PascalCase ensures that your Vue components remain distinctly visible.

Unfortunately, due to HTML's case insensitivity, in-DOM templates must still use kebab-case.

Also note that if you've already invested heavily in kebab-case, consistency with HTML conventions and being able to use the same casing across all your projects may be more important than the advantages listed above. In those cases, **using kebab-case everywhere is also acceptable.**



**在大多数项目中，组件名称在[单文件组件](https://github.com/vuejs-translations/docs-zh-cn/blob/main/guide/scaling-up/sfc)和字符串模板中应始终采用pascalcase，但在dom模板中却是kebab-case。**

Pascalcase相比kebab-case有以下优势：

- 编辑器可以在模板中自动完成组件名称，因为Pascalcase也用于JavaScript中。
- `<MyComponent>`在视觉上与单个单词命名的HTML元素有所不同，而不是`<my-component>` ，因为有两个字符差异（两个大写），而不是仅仅是一个（连字符）。
- 如果您在模板中使用任何非VUE的自定义元素，例如Web组件，Pascalcase确保您的VUE组件保持清晰可见。

不幸的是，由于HTML的大小写不敏感，IN-DOM模板仍必须使用kebab-case。

另请注意，如果您已经使用了大量的kebab-case方式进行命名，与HTML惯例保持一致，并且能够在所有项目中使用相同的外壳可能比上面列出的优点更重要。在这种情况下，**到处使用kebab-case也可以接受。**

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```vue-html
<!-- In Single-File Components and string templates -->
<mycomponent/>
```

```vue-html
<!-- In Single-File Components and string templates -->
<myComponent/>
```

```vue-html
<!-- In in-DOM templates -->
<MyComponent></MyComponent>
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```vue-html
<!-- In Single-File Components and string templates -->
<MyComponent/>
```

```vue-html
<!-- In in-DOM templates -->
<my-component></my-component>
```

OR

```vue-html
<!-- Everywhere -->
<my-component></my-component>
```

</div>

## js/jsx中的组件名称大小写 {#component-name-casing-in-js-jsx}

**Component names in JS/[JSX](/guide/extras/render-function#jsx-tsx) should always be PascalCase, though they may be kebab-case inside strings for simpler applications that only use global component registration through `app.component`.**

**JS/ [JSX](https://github.com/vuejs-translations/docs-zh-cn/blob/main/guide/extras/render-function#jsx-tsx)中的组件名称应始终是Pascalcase，尽管它们在字符串内部也有kebab案例责罚** 

:::详细信息:  Pascalcase是类和原型构造函数的命名惯例 - 本质上，任何可能具有不同实例的东西。 VUE组件也具有实例，因此也使用Pascalcase也很有意义。作为附加的好处，使用JSX（和模板）中的Pascalcase允许代码的读者更容易地区分组件和HTML元素。

However, for applications that use **only** global component definitions via `app.component`, we recommend kebab-case instead. The reasons are:
但是，对于**仅**通过`app.component`使用全局组件定义的应用程序，我们建议使用kebab-case。原因是：

- 在JavaScript中直接引用全局组件很少见，因此遵循JavaScript的惯例是不太合理的。
- 这些应用程序始终包含许多[**必须**使用烤肉串案例](https://github.com/vuejs-translations/docs-zh-cn/blob/main/src/style-guide/rules-strongly-recommended.md#component-name-casing-in-templates)的内部模板。 :::



<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```js
app.component('myComponent', {
  // ...
})
```

```js
import myComponent from './MyComponent.vue'
```

```js
export default {
  name: 'myComponent'
  // ...
}
```

```js
export default {
  name: 'my-component'
  // ...
}
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```js
app.component('MyComponent', {
  // ...
})
```

```js
app.component('my-component', {
  // ...
})
```

```js
import MyComponent from './MyComponent.vue'
```

```js
export default {
  name: 'MyComponent'
  // ...
}
```

</div>

## 组件名尽量采用单词全部字符 {#full-word-component-names}

**组件名称应该优先使用完整的单词而不是缩写。**

编辑器中的自动完成功能使编写较长名称的成本非常低，而它们提供的清晰度是无价的。特别是，应始终避免使用不常见的缩写。

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```
components/
|- SdSettings.vue
|- UProfOpts.vue
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

</div>

## 属性名大小写 {#prop-name-casing}

**在声明过程中，属性名应该始终使用camelCase。当在in-DOM模板中使用时，props应该是kebab-cased。单文件组件模板和[JSX](https://github.com/vuejs-translations/docs-zh-cn/blob/main/guide/extras/render-function#jsx-tsx)可以使用kebab-case或camelCase道具。大小写应该是一致的--如果你选择使用camelCased 属性名，请确保不要在你的应用程序中使用kebab-cased 属性名。**

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


<div class="options-api">

```js
props: {
  'greeting-text': String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  'greeting-text': String
})
```

</div>

```vue-html
// for in-DOM templates
<welcome-message greetingText="hi"></welcome-message>
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


<div class="options-api">

```js
props: {
  greetingText: String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  greetingText: String
})
```

</div>

```vue-html
// for SFC - please make sure your casing is consistent throughout the project
// you can use either convention but we don't recommend mixing two different casing styles
<WelcomeMessage greeting-text="hi"/>
// or
<WelcomeMessage greetingText="hi"/>
```

```vue-html
// for in-DOM templates
<welcome-message greeting-text="hi"></welcome-message>
```

</div>

## 多属性元素{#multi-attribute-elements}

**具有多个属性的元素应该跨多行，每行一个属性。**

在JavaScript中，将具有多个属性的对象拆分到多行被广泛认为是一种良好的约定，因为这样更易于阅读。我们的模板和[JSX](https://github.com/vuejs-translations/docs-zh-cn/blob/main/guide/extras/render-function#jsx-tsx)值得同样的考虑。

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```vue-html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```vue-html
<MyComponent foo="a" bar="b" baz="c"/>
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```vue-html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

```vue-html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

</div>

## 模版中的简单表达式{#simple-expressions-in-templates}

**组件模板应该只包含简单的表达式，更复杂的表达式应该重构为计算属性或方法。**

模板中的复杂表达式使它们的声明性降低。我们应该努力描述应该出现*什么*，而不是我们*如何*计算该值。计算属性和方法也允许代码被重用。

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```vue-html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```vue-html
<!-- In a template -->
{{ normalizedFullName }}
```

<div class="options-api">

```js
// The complex expression has been moved to a computed property
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```

</div>

<div class="composition-api">

```js
// The complex expression has been moved to a computed property
const normalizedFullName = computed(() =>
  fullName.value
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
)
```

</div>

</div>

## 简单的计算属性{#simple-computed-properties}

**复杂的计算属性应该被分割成尽可能多的简单属性。**

::: 详细说明： 更简单、命名更好的计算属性是：

- **容易测试**

  当每个计算的属性只包含一个非常简单的表达式，依赖关系很少时，编写测试来确认它正确工作要容易得多。

- **更容易阅读**
  简化的计算属性会强制您为每个值指定一个描述性名称，即使它不被重用。这使得其他开发人员（以及未来的您）更容易专注于他们关心的代码并弄清楚发生了什么。

- **更能适应不断变化的需求**

  任何可以命名的值都可能对视图有用。例如，我们可能决定显示一条消息，告诉用户他们节省了多少钱。我们还可能决定计算销售税，但可能会单独显示，而不是作为最终价格的一部分。

  小型、集中的计算属性对如何使用信息做出的假设更少，因此随着需求的变化需要更少的重构。:::

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


<div class="options-api">

```js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```

</div>

<div class="composition-api">

```js
const price = computed(() => {
  const basePrice = manufactureCost.value / (1 - profitMargin.value)
  return basePrice - basePrice * (discountPercent.value || 0)
})
```

</div>

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


<div class="options-api">

```js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```

</div>

<div class="composition-api">

```js
const basePrice = computed(
  () => manufactureCost.value / (1 - profitMargin.value)
)

const discount = computed(
  () => basePrice.value * (discountPercent.value || 0)
)

const finalPrice = computed(() => basePrice.value - discount.value)
```

</div>

</div>

## 引用的属性值{#quoted-attribute-values}

**非空的HTML属性值应该总是在引号内（单引号或双引号，无论哪个在JS中不使用）。**

虽然没有任何空格的属性值在HTML中不需要有引号，但这种做法通常会导致*避免*空格，使属性值可读性较差。

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```vue-html
<input type=text>
```

```vue-html
<AppSidebar :style={width:sidebarWidth+'px'}>
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```vue-html
<input type="text">
```

```vue-html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

</div>

## 指令缩写{#directive-shorthands}

**指令缩写（`：`代表`v-bind：`，`@`代表`v-on：`，`#`代表`v-slot`）应该总是使用或从不使用。**

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```vue-html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```vue-html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

```vue-html
<input
  @input="onInput"
  @focus="onFocus"
>
```

```vue-html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template v-slot:footer>
  <p>Here's some contact info</p>
</template>
```

```vue-html
<template #header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```

</div>
