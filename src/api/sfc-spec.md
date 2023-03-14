# SFC 语法定义 {#sfc-syntax-specification}

## 总览 {#overview}

一个 Vue 单文件组件 (SFC)，通常使用 `*.vue` 作为文件扩展名，它是一种使用了类似 HTML 语法的自定义文件格式，用于定义 Vue 组件。一个 Vue 单文件组件在语法上是兼容 HTML 的。

每一个 `*.vue` 文件都由三种顶层语言块构成：`<template>`、`<script>` 和 `<style>`，以及一些其他的自定义块：

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  This could be e.g. documentation for the component.
</custom1>
```

## 相应语言块 {#language-blocks}

### `<template>` {#template}

- 每个 `*.vue` 文件最多可以包含一个顶层 `<template>` 块。

- 语块包裹的内容将会被提取、传递给 `@vue/compiler-dom`，预编译为 JavaScript 渲染函数，并附在导出的组件上作为其 `render` 选项。

### `<script>` {#script}

- 每个 `*.vue` 文件最多可以包含一个 `<script>` 块。(使用 [`<script setup>`](/api/sfc-script-setup) 的情况除外)

- 这个脚本代码块将作为 ES 模块执行。

- **默认导出**应该是 Vue 的组件选项对象，可以是一个对象字面量或是 [defineComponent](/api/general#definecomponent) 函数的返回值。

### `<script setup>` {#script-setup}

- 每个 `*.vue` 文件最多可以包含一个 `<script setup>`。(不包括一般的 `<script>`)

- 这个脚本块将被预处理为组件的 `setup()` 函数，这意味着它将**为每一个组件实例**都执行。`<script setup>` 中的顶层绑定都将自动暴露给模板。要了解更多细节，请看 [`<script setup>` 的专门文档](/api/sfc-script-setup)。

### `<style>` {#style}

- 每个 `*.vue` 文件可以包含多个 `<style>` 标签。

- 一个 `<style>` 标签可以使用 `scoped` 或 `module` attribute (查看 [SFC 样式功能](/api/sfc-css-features)了解更多细节) 来帮助封装当前组件的样式。使用了不同封装模式的多个 `<style>` 标签可以被混合入同一个组件。

### 自定义块 {#custom-blocks}

在一个 `*.vue` 文件中可以为任何项目特定需求使用额外的自定义块。举例来说，一个用作写文档的 `<docs>` 块。这里是一些自定义块的真实用例：

- [Gridsome：`<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql：`<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n：`<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#i18n-custom-block)

自定义块的处理需要依赖工具链。如果你想要在构建中集成你的自定义语块，请参见 [SFC 自定义块集成工具链指南](/guide/scaling-up/tooling#sfc-custom-block-integrations)获取更多细节。

## 自动名称推导 {#automatic-name-inference}

SFC 在以下场景中会根据**文件名**自动推导其组件名：

- 开发警告信息中需要格式化组件名时；
- DevTools 中观察组件时；
- 递归组件自引用时。例如一个名为 `FooBar.vue` 的组件可以在模板中通过 `<FooBar/>` 引用自己。(同名情况下) 这比明确注册/导入的组件优先级低。

## 预处理器 {#pre-processors}

代码块可以使用 `lang` 这个 attribute 来声明预处理器语言，最常见的用例就是在 `<script>` 中使用 TypeScript：

```vue-html
<script lang="ts">
  // use TypeScript
</script>
```

`lang` 在任意块上都能使用，比如我们可以在 `<style>` 标签中使用 [Sass](https://sass-lang.com/) 或是 `<template>` 中使用 [Pug](https://pugjs.org/api/getting-started.html)：

```vue-html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

注意对不同预处理器的集成会根据你所使用的工具链而有所不同，具体细节请查看相应的工具链文档来确认：

- [Vite](https://cn.vitejs.dev/guide/features.html#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/zh/guide/css.html#%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8)
- [webpack + vue-loader](https://vue-loader.vuejs.org/zh/guide/pre-processors.html#%E4%BD%BF%E7%94%A8%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8)

## `src` 导入 {#src-imports}

如果你更喜欢将 `*.vue` 组件分散到多个文件中，可以为一个语块使用 `src` 这个 attribute 来导入一个外部文件：

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

请注意 `src` 导入和 JS 模块导入遵循相同的路径解析规则，这意味着：

- 相对路径需要以 `./` 开头
- 你也可以从 npm 依赖中导入资源

```vue
<!-- 从所安装的 "todomvc-app-css" npm 包中导入一个文件 -->
<style src="todomvc-app-css/index.css" />
```

`src` 导入对自定义语块也同样适用：

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

## 注释 {#comments}

在每一个语块中你都可以按照相应语言 (HTML、CSS、JavaScript 和 Pug 等等) 的语法书写注释。对于顶层注释，请使用 HTML 的注释语法 `<!-- comment contents here -->`
