# Attribute 绑定 {#attribute-bindings}

在 Vue 中，mustache 语法(即双大括号)只能用于文本插值。为了给 attribute 绑定一个动态值，我们使用 `v-bind` 指令：

```vue-html
<div v-bind:id="dynamicId"></div>
```

**指令**  是由 `v-` 开头的一种特殊 attribute。它们是 Vue 模板语法的一部分。类似于文本插值，指令值是可以访问组件声明的 JavaScript 表达式。关于 `v-bind` 和指令语法的完整细节请详阅<a target="_blank" href="/guide/essentials/template-syntax.html">指南 - 模板语法</a>。

冒号后面的部分(`:id`)是“指令”的参数。此处，元素的 `id` attribute 将与组件声明的 `dynamicId` property 保持同步。

由于 `v-bind` 使用地非常频繁，它有一个专门的简写语法：

```vue-html
<div :id="dynamicId"></div>
```

现在，试着添加一个动态 `class` 用于绑定 `<h1>`，使用 `titleClass` 的 <span class="options-api">data property</span><span class="composition-api">ref</span> 作为它的值。如果绑定正确，文字将会变为红色。
