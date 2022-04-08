# 优先级 B 规则：强烈推荐

这些规则能够在绝大多数项目中改善可读性和开发体验。即使违反它们，代码还能照常运行。但应尽可能减少不必要的例外。

## 组件文件

**只要有能够拼接文件的构建系统，就把每个组件单独分成文件。**

当你需要编辑一个组件或查阅一个组件的用法时，这可以帮助你更快速地找到它。

<div class="style-example style-example-bad">
<h3>反面示例</h3>

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
<h3>正面示例</h3>

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

## 单文件组件文件名大小写

**[单文件组件](/guide/scaling-up/sfc.html)的文件名应该要么始终是单词大写开头（PascalCase），要么始终是横线连接（kebab-case）。**

单词大写开头对于代码编辑器的自动补全最为友好，因为这使得我们在 JS(X) 和模板中引用组件的方式尽可能地一致。然而，混用大小写的文件命名方式，有时候会导致其在大小写不敏感的文件系统中出现问题，这也是横线连接命名同样完全可取的原因。

<div class="style-example style-example-bad">
<h3>反面示例</h3>

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
<h3>正面示例</h3>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```

</div>

## 基础组件名

**应用特定样式和约定的基础组件（也就是展示类的、无逻辑的或无状态的组件）应该全部以一个特定的前缀开头，比如 `Base`、`App` 或 `V`。**

::: details 详解
这些组件为你的应用奠定了一致的基础样式和行为。它们可能**只**包括：

- HTML 元素
- 其它基础组件
- 第三方 UI 组件

但是它们**绝不会**包括全局状态（比如来自 [Pinia](https://pinia.vuejs.org/) store）。

它们的名字通常包含所包裹元素的名字（比如 `BaseButton`、`BaseTable`），除非没有现成的对应功能的元素（比如 `BaseIcon`）。如果你为特定的上下文构建类似的组件，那它们几乎总会使用这些组件（比如 `BaseButton` 可能会用在 `ButtonSubmit` 上）。

这样做的几个好处：

- 当你在编辑器中以字母顺序排序时，你的应用的基础组件会全部列在一起，这样更容易识别。

- 因为组件名应该始终是多个单词，所以这样做可以避免你在包裹简单组件时随意选择前缀（比如 `MyButton`、`VueButton`）。

- 因为这些组件会被频繁使用，所以你可能想要把它们注册到全局，而不是在各处分别导入它们。结合一个前缀即可使用 Webpack 达到目的：

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

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

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

## 单实例组件名

**只应该拥有单个活跃实例的组件应该以 `The` 前缀命名，以示其唯一性。**

这并不意味着组件只可被用于一个页面，而是**每个页面**只能使用一次。这些组件永远不接受任何 prop，因为它们是为你的应用所定制的，而不是它们所在的上下文。如果你发现有必要添加 prop，那就表明这实际上是一个可复用的组件，只不过**目前**在每个页面里只使用一次。

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```
components/
|- Heading.vue
|- MySidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```

</div>

## 高耦合组件名

**与父组件紧密耦合的子组件应该以父组件名作为前缀命名。**

如果一个组件只在某个特定父组件的上下文中有意义，那么这层关系应该体现在其命名上。因为编辑器通常会按字母顺序组织文件，这么做也可以把相关联的文件排放在一起。

::: details 详解
你也可能会尝试通过在以其父组件命名的目录中嵌套子组件来解决这个问题。比如：

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

或：

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

但是这并不推荐，因为这会导致：

- 存在许多相同名字的文件，使得在编辑器中快速切换文件变得困难；
- 过度嵌套的子目录提高了在编辑器侧边栏中浏览组件所花费的时间。
  :::

<div class="style-example style-example-bad">
<h3>反面示例</h3>

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
<h3>正面示例</h3>

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

## 组件名中的单词排序

**组件名称应该以高阶的（通常是一般化描述的）单词开头，并以描述性的修饰词结尾。**

::: details 详解
你可能会疑惑：

> “为什么我们在给组件命名时不多遵从自然语言呢？”

在自然语言（英文）里，形容词和其它描述语通常都出现在名词之前，否则就需要用到连接词。比如：

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

如果你愿意，你完全可以在组件名里包含这些连接词，但是单词的顺序仍然很重要。

同样要注意**在你的应用中所谓的“高阶”是跟语境有关的**。比如对于一个带搜索表单的应用来说，它可能包含这样的组件：

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

你可能已经注意到了，我们很难看出来哪些组件是针对搜索的。现在我们来根据规则给组件重新命名：

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

- 因为编辑器通常会按字母顺序组织文件，所以现在组件之间的重要关系一目了然。

你也许会想要换种方式解决这个问题，把所有的搜索组件放到“search”目录，把所有的设置组件放到“settings”目录。我们只推荐在非常大型的应用（如有 100+ 个组件）下才考虑这么做，因为：

- 在多级目录间找来找去，通常来说要比在单个 `components` 目录下滚动查找要花费更多的精力。
- 存在组件重名（比如存在多个 `ButtonDelete.vue` 组件）的时候在编辑器里更难快速定位。
- 重构将变得更困难，因为为一个移动了的组件更新相关引用时，查找/替换通常并不高效。
  :::

<div class="style-example style-example-bad">
<h3>反面示例</h3>

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
<h3>正面示例</h3>

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

## 自闭合组件

**Components with no content should be self-closing in [Single-File Components](/guide/scaling-up/sfc.html), string templates, and [JSX](/guide/extras/render-function.html#jsx-tsx) - but never in DOM templates.**

**在[单文件组件](/guide/scaling-up/sfc.html)、字符串模板和 [JSX](/guide/extras/render-function.html#jsx-tsx) 中，没有内容的组件应该是自闭合的——但在 DOM 模板里绝不要这样做。**

自闭合组件表示它们不仅没有内容，而且是**故意**没有内容。其不同之处就好比书中的一页白纸，与贴有“本页有意留白”标签的白纸。而且没有了多余的闭合标签，你的代码也将更简洁。

不幸的是，HTML 并不支持自闭合的自定义元素——除[官方的“空”元素](https://www.w3.org/TR/html/syntax.html#void-elements)外。所以上述策略仅适用于在进入 DOM 之前，Vue 的模板编译器能够触达的地方，然后再产出符合 DOM 规范的 HTML。

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```vue-html
<!-- In Single-File Components, string templates, and JSX -->
<MyComponent></MyComponent>
```

```vue-html
<!-- In DOM templates -->
<my-component/>
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```vue-html
<!-- 在单文件组件、字符串模板和 JSX 中 -->
<MyComponent/>
```

```vue-html
<!-- 在 DOM 模板中 -->
<my-component></my-component>
```

</div>

## 模板中的组件名大小写

**对于绝大多数项目来说，在[单文件组件](/guide/scaling-up/sfc.html)和字符串模板中，组件名应该始终使用 PascalCase——但在 DOM 模板中要用 kebab-case。**

PascalCase 相比 kebab-case 有这样一些优势：

- 编辑器可以在模板里自动补全组件名称，因为 PascalCase 同样适用于 JavaScript。
- `<MyComponent>` 视觉上比 `<my-component>` 更能够和单个单词的 HTML 元素区别开来，因为前者的不同之处有两个大写字母，后者只有一个横线。
- 如果你在模板中使用任何非 Vue 的自定义元素，比如一个 Web Component，PascalCase 确保了你的 Vue 组件在视觉上仍然是易识别的。

不幸的是，由于 HTML 对大小写不敏感的，在 DOM 模板中必须仍需使用 kebab-case。

还请注意，如果你已经是 kebab-case 的重度用户，那么与 HTML 保持一致的命名约定，且在多个项目中保持相同的大小写规则，就可能比上述优势更为重要了。在这些情况下，**在所有的地方都使用 kebab-case 同样是可行的**。

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```vue-html
<!-- 在单文件组件和字符串模板中 -->
<mycomponent/>
```

```vue-html
<!-- 在单文件组件和字符串模板中 -->
<myComponent/>
```

```vue-html
<!-- In DOM templates -->
<MyComponent></MyComponent>
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```vue-html
<!-- 在单文件组件和字符串模板中 -->
<MyComponent/>
```

```vue-html
<!-- 在 DOM 模板中 -->
<my-component></my-component>
```

OR

```vue-html
<!-- 任何地方 -->
<my-component></my-component>
```

</div>

## JS/JSX 中的组件名大小写


**JS/[JSX](/guide/extras/render-function.html#jsx-tsx) 中的组件名应该始终使用 PascalCase，即使在较为简单的应用中，只使用 `app.component` 进行全局组件注册时，可以使用 kebab-case 字符串。**

::: details 详解
在 JavaScript 中，PascalCase 是类和构造函数（本质上来说，任何可以产生多份不同实例的东西）的命名约定。Vue 组件也有实例，因此同样适用 PascalCase。由此带来的额外好处是，在 JSX 和模板)里使用 PascalCase 可以使得代码的读者更容易分辨组件与 HTML 元素。

然而，对于**只用** `app.component` 定义全局组件的应用来说，我们推荐 kebab-case 进行替代。原因是：

- 全局组件很少被 JavaScript 引用，所以遵守 JavaScript 的命名约定意义不大。
- 这些应用往往包含许多 DOM 内的模板，这种情况下是[**必须**使用 kebab-case](#模板中的组件名大小写) 的。
  :::

<div class="style-example style-example-bad">
<h3>反面示例</h3>

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
<h3>正面示例</h3>

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

## 完整单词所组成的组件名称

**组件名称应该倾向于完整的单词，而非缩写。**

编辑器中的自动补全已经让书写长命名的代价非常之低了，而其带来的明确性却是非常宝贵的。不常用的缩写尤其应该避免。

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

</div>

## Prop 命名

**在声明 prop 的时候，其命名应该始终使用 camelCase，而在模板和 [JSX](https://v3.cn.vuejs.org/guide/render-function.html#jsx) 中应该始终使用 kebab-case。**

我们只是单纯地遵循了每种语言的约定。在 JavaScript 中 camelCase 更为自然。而在 HTML 中则是 kebab-case。

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```js
props: {
  'greeting-text': String
}
```

```vue-html
<WelcomeMessage greetingText="hi"/>
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```js
props: {
  greetingText: String
}
```

```vue-html
<WelcomeMessage greeting-text="hi"/>
```

</div>

## 多 attribute 元素

**多 attribute 的元素应该分多行撰写，每个 attribute 一行。**

在 JavaScript 中，用多行分隔对象的多个 property 是很常见的最佳实践，因为这样更易读。模板和 [JSX](/guide/extras/render-function.html#jsx-tsx) 都需要做同样的考量。

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```vue-html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```vue-html
<MyComponent foo="a" bar="b" baz="c"/>
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

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

## 模板中的简单表达式

**组件模板应该只包含简单的表达式，复杂的表达式则应该重构为计算属性或方法。**

复杂表达式会让你的模板变得不那么声明式。我们应该尽量描述应该显示**什么**，而非**如何**计算那个值。而且计算属性和方法使得代码可以复用。

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```vue-html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```vue-html
<!-- 在模板中 -->
{{ normalizedFullName }}
```

```js
// 将复杂表达式转为计算属性
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```

</div>

## 简单化计算属性

**应该把复杂计算属性尽可能多地分割为更简单的计算属性。**

::: details 详解
更简单的、命名得当的计算属性：

- **更易于测试**

  当每个计算属性都仅包含一个非常简单，且依赖很少的表达式时，撰写测试以确保其能够正确地工作就会变得容易许多。

- **更易于阅读**

    简化计算属性要求你为每一个值都起一个描述性的名称，即便它并没有被复用。这使得其他开发者（以及未来的你）更容易专注于他们所关心的代码，并了解现状。

- **更好地“拥抱变化”**

    任何能够被命名的值，都有可能被用在视图上。举个例子，我们可能打算展示一个信息，告诉用户他们节省了多少钱。也可能打算计算税费，但是也许会分开展现，而不是作为总价的一部分。

    小且专注的计算属性对信息将如何被使用所作出的假设更少，因此当需求变更时，重构的工作量也将更小。
  :::

<div class="style-example style-example-bad">
<h3>反面示例</h3>

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

<div class="style-example style-example-good">
<h3>正面示例</h3>

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

## 带引号的 attribute 值

**非空 HTML attribute 的值应该始终带有引号（单引号或双引号，选择未在 JS 里面使用的那个）。**

虽然在 HTML 中不带空格的 attribute 的值是可以不加引号的，但这样做往往导致大**避免**空格，从而使得 attribute 的可读性变差。

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```vue-html
<input type=text>
```

```vue-html
<AppSidebar :style={width:sidebarWidth+'px'}>
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```vue-html
<input type="text">
```

```vue-html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

</div>

## 指令缩写

**指令缩写（用 `:` 表示 `v-bind:`，`@` 表示 `v-on:` 和用 `#` 表示 `v-slot`）应该要么始终使用，要么始终不用。**

<div class="style-example style-example-bad">
<h3>反面示例</h3>

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
<h3>正面示例</h3>

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
