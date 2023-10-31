---
outline: deep
---

# 搭配 TypeScript 使用 Vue {#using-vue-with-typescript}

像 TypeScript 这样的类型系统可以在编译时通过静态分析检测出很多常见错误。这减少了生产环境中的运行时错误，也让我们在重构大型项目的时候更有信心。通过 IDE 中基于类型的自动补全，TypeScript 还改善了开发体验和效率。

Vue 本身就是用 TypeScript 编写的，并对 TypeScript 提供了一等公民的支持。所有的 Vue 官方库都自带了类型声明文件，开箱即用。

## 项目配置 {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue)，即官方的项目脚手架工具，提供了搭建基于 [Vite](https://cn.vitejs.dev/) 且 TypeScript 就绪的 Vue 项目的选项。

### 总览 {#overview}

在基于 Vite 的配置中，开发服务器和打包器将只会对 TypeScript 文件执行语法转译，而不会执行任何类型检查，这保证了 Vite 开发服务器在使用 TypeScript 时也能始终保持飞快的速度。

- 在开发阶段，我们推荐你依赖一个好的 [IDE 配置](#ide-support)来获取即时的类型错误反馈。

- 对于单文件组件，你可以使用工具 [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) 在命令行检查类型和生成类型声明文件。`vue-tsc` 是对 TypeScript 自身命令行界面 `tsc` 的一个封装。它的工作方式基本和 `tsc` 一致。除了 TypeScript 文件，它还支持 Vue 的单文件组件。你可以在开启 Vite 开发服务器的同时以侦听模式运行 `vue-tsc`，或是使用 [vite-plugin-checker](https://vite-plugin-checker.netlify.app/) 这样在另一个 worker 线程里做静态检查的插件。

- Vue CLI 也提供了对 TypeScript 的支持，但是已经不推荐了。详见[下方的说明](#note-on-vue-cli-and-ts-loader)。

### IDE 支持 {#ide-support}

- 强烈推荐 [Visual Studio Code](https://code.visualstudio.com/) (VSCode)，因为它对 TypeScript 有着很好的内置支持。

  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 是官方的 VSCode 扩展，提供了 Vue 单文件组件中的 TypeScript 支持，还伴随着一些其他非常棒的特性。

    :::tip
    Volar 取代了我们之前为 Vue 2 提供的官方 VSCode 扩展 [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)。如果你之前已经安装了 Vetur，请确保在 Vue 3 的项目中禁用它。
    :::

  - [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) 用于支持在 TS 中 import `*.vue` 文件。

- [WebStorm](https://www.jetbrains.com/webstorm/) 对 TypeScript 和 Vue 也都提供了开箱即用的支持。其他的 JetBrains IDE 也同样可以通过一个[免费插件](https://plugins.jetbrains.com/plugin/9442-vue-js)支持。从 2023.2 版开始，WebStorm 和 Vue 插件内置了对 Vue 语言服务器的支持。你可以在设置 > 语言和框架 > TypeScript > Vue 下将 Vue 服务设置为在所有 TypeScript 版本上使用 Volar 集成。默认情况下，Volar 将用于 TypeScript 5.0 及更高版本。

### 配置 `tsconfig.json` {#configuring-tsconfig-json}

通过 `create-vue` 搭建的项目包含了预先配置好的 `tsconfig.json`。其底层配置抽象于 [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) 包中。在项目内我们使用 [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) 来确保运行在不同环境下的代码的类型正确 (比如应用代码和测试代码应该有不同的全局变量)。

手动配置 `tsconfig.json` 时，请留意以下选项：

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) 应当设置为 `true`，因为 Vite 使用 [esbuild](https://esbuild.github.io/) 来转译 TypeScript，并受限于单文件转译的限制。

- 如果你正在使用选项式 API，需要将 [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) 设置为 `true` (或者至少开启 [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis)，它是 `strict` 模式的一部分)，才可以获得对组件选项中 `this` 的类型检查。否则 `this` 会被认为是 `any`。

- 如果你在构建工具中配置了路径解析别名，例如 `@/*` 这个别名被默认配置在了 `create-vue` 项目中，你需要通过 [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths) 选项为 TypeScript 再配置一遍。

参考：

- [官方 TypeScript 编译选项文档](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [esbuild TypeScript 编译注意事项](https://esbuild.github.io/content-types/#typescript-caveats)

### Volar Takeover 模式 {#volar-takeover-mode}

> 这一章节仅针对 VSCode + Volar。

为了让 Vue 单文件组件和 TypeScript 一起工作，Volar 创建了一个针对 Vue 的 TS 语言服务实例，将其用于 Vue 单文件组件。同时，普通的 TS 文件依然由 VSCode 内置的 TS 语言服务来处理。这也是为什么我们需要安装 [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) 来支持在 TS 文件中引入 Vue 单文件组件。这套默认设置能够工作，但在每个项目里我们都运行了两个语言服务实例：一个来自 Volar，一个来自 VSCode 的内置服务。这在大型项目里可能会带来一些性能问题。

为了优化性能，Volar 提供了一个叫做“Takeover 模式”的功能。在这个模式下，Volar 能够使用一个 TS 语言服务实例同时为 Vue 和 TS 文件提供支持。

要开启 Takeover 模式，你需要执行以下步骤来**在你的项目的工作空间中**禁用 VSCode 的内置 TS 语言服务：

1. 在当前项目的工作空间下，用 `Ctrl + Shift + P` (macOS：`Cmd + Shift + P`) 唤起命令面板。
2. 输入 `built`，然后选择“Extensions：Show Built-in Extensions”。
3. 在插件搜索框内输入 `typescript` (不要删除 `@builtin` 前缀)。
4. 点击“TypeScript and JavaScript Language Features”右下角的小齿轮，然后选择“Disable (Workspace)”。
5. 重新加载工作空间。Takeover 模式将会在你打开一个 Vue 或者 TS 文件时自动启用。

<img src="./images/takeover-mode.png" width="590" height="426" style="margin:0px auto;border-radius:8px">

### 关于 Vue CLI 和 `ts-loader` {#note-on-vue-cli-and-ts-loader}

像 Vue CLI 这样的基于 webpack 搭建的项目，通常是在模块编译的过程中顺道执行类型检查，例如使用 `ts-loader`。然而这并不是一个理想的解决方案，因为类型系统需要了解整个模块关系才能执行类型检查。loader 中只适合单个模块的编译，并不适合做需要全局信息的工作。这导致了下面的问题：

- `ts-loader` 只能对在它之前的 loader 编译转换后的代码执行类型检查，这和我们在 IDE 或 `vue-tsc` 中看到的基于源代码的错误提示并不一致。

- 类型检查可能会很慢。当它和代码转换在相同的线程/进程中执行时，它会显著影响整个应用的构建速度。

- 我们已经在 IDE 中通过单独的进程运行着类型检查了，却还要在构建流程中执行类型检查导致降低开发体验，这似乎不太划算。

如果你正通过 Vue CLI 使用 Vue 3 和 TypeScript，我们强烈建议你迁移到 Vite。我们也在为 CLI 开发仅执行 TS 语法转译的选项，以允许你切换至 `vue-tsc` 来执行类型检查。

## 常见使用说明 {#general-usage-notes}

### `defineComponent()` {#definecomponent}

为了让 TypeScript 正确地推导出组件选项内的类型，我们需要通过 [`defineComponent()`](/api/general#definecomponent) 这个全局 API 来定义组件：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 启用了类型推导
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // 类型：string | undefined
    this.msg // 类型：string
    this.count // 类型：number
  }
})
```

当没有结合 `<script setup>` 使用组合式 API 时，`defineComponent()` 也支持对传递给 `setup()` 的 prop 的推导：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 启用了类型推导
  props: {
    message: String
  },
  setup(props) {
    props.message // 类型：string | undefined
  }
})
```

参考：

- [webpack Treeshaking 的注意事项](/api/general#note-on-webpack-treeshaking)
- [对 `defineComponent` 的类型测试](https://github.com/vuejs/core/blob/main/packages/dts-test/defineComponent.test-d.tsx)

:::tip
`defineComponent()` 也支持对纯 JavaScript 编写的组件进行类型推导。
:::

### 在单文件组件中的用法 {#usage-in-single-file-components}

要在单文件组件中使用 TypeScript，需要在 `<script>` 标签上加上 `lang="ts"` 的 attribute。当 `lang="ts"` 存在时，所有的模板内表达式都将享受到更严格的类型检查。

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- 启用了类型检查和自动补全 -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` 也可以用于 `<script setup>`：

```vue
<script setup lang="ts">
// 启用了 TypeScript
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- 启用了类型检查和自动补全 -->
  {{ count.toFixed(2) }}
</template>
```

### 模板中的 TypeScript {#typescript-in-templates}

在使用了 `<script lang="ts">` 或 `<script setup lang="ts">` 后，`<template>` 在绑定表达式中也支持 TypeScript。这对需要在模板表达式中执行类型转换的情况下非常有用。

这里有一个假想的例子：

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- 出错，因为 x 可能是字符串 -->
  {{ x.toFixed(2) }}
</template>
```

可以使用内联类型强制转换解决此问题：

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
如果正在使用 Vue CLI 或基于 webpack 的配置，支持模板内表达式的 TypeScript 需要 `vue-loader@^16.8.0`。
:::

### 使用 TSX

Vue 也支持使用 JSX / TSX 编写组件。详情请查阅[渲染函数 & JSX](/guide/extras/render-function.html#jsx-tsx)。

## 泛型组件 {#generic-components}

泛型组件支持两种使用方式：

- 在单文件组件中：[在 `<script setup>` 上使用 `generic` 属性](/api/sfc-script-setup.html#generics)
- 渲染函数 / JSX 组件：[`defineComponent()` 的函数签名](/api/general.html#function-signature)

## 特定 API 的使用指南 {#api-specific-recipes}

- [TS 与组合式 API](./composition-api)
- [TS 与选项式 API](./options-api)
