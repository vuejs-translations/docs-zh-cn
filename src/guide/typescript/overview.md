---
aside: deep
---

# 搭配 TypeScript 使用 Vue {#using-vue-with-typescript}

像 TypeScript 这样的一个类型系统可以通过编译时期的静态分析检测出大部分的常见错误。这将减少生产环境中发生运行时错误的概率，并使得我们能够更自信地在大型项目中重构代码。TypeScript 也通过基于类型的自动补全为开发者带来了良好的开发体验。

Vue 本身就是用 TypeScript 编写的，对 TypeScript 提供第一优先级支持。所有的 Vue 官方库的包中都提供了类型定义文件，开箱即用。

## 项目启动 {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue) 是官方的项目脚手架工具，提供了多种选项来搭建一个由 [Vite](https://vitejs.dev/) 驱动、基于 TypeScript 的 Vue 项目。

### 总览 {#overview}

在基于 Vite 的配置中，开发服务器和打包器将只会对 TypeScript 文件执行语法转译，而不会执行任何类型检查，这保证了 Vite 开发服务器在使用 TypeScript 时也能始终保持飞快的速度。

- 在开发阶段，我们推荐你依赖一个好的 [IDE 配置](#ide-support) 来获取即时的类型错误反馈。

- 如果你正在使用 SFC，可以使用 [`vue-tsc`](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc) 这个命令行工具作类型检查和类型定义文件生成。`vue-tsc` 是对 `tsc` 这个命令行工具的一个封装。它基本和 `tsc` 工作方式一致，除了 TypeScript 文件之外添加了对 Vue 文件的支持。

- `vue-tsc` 目前还不支持 watch 模式，但这在计划之中。于此通知，如果你想要类型检查成为你 dev 命令的一部分，你可以看看 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker)。

- Vue CLI 也提供了 TypeScript 的支持，但是已经不推荐了。查看 [下方的说明](#note-on-vue-cli-and-ts-loader) 了解详情。

### IDE 支持 {#ide-support}

- 强烈推荐 [Visual Studio Code](https://code.visualstudio.com/)（VSCode），因为它对 TypeScript 有着开箱即用且丰富完善的支持。

- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) 是我们的官方 VSCode 扩展，提供了 Vue SFC 中的 TypeScript 支持，还伴随一些其他非常棒的特性。

  :::tip
  Volar 替代了 [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)，那是我们之前为 Vue 2 提供的官方 VSCode 扩展。如果你已经安装了 Vetur，请在 Vue 3 项目中禁用。
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) 也对 TypeScript 和 Vue 提供了开箱即用的支持。

### 配置 `tsconfig.json` {#configuring-tsconfigjson}

通过 `create-vue` 搭建的项目包含了一份 [预配置好的 `tsconfig.json`](https://github.com/vuejs/create-vue/blob/main/template/config/typescript/tsconfig.json) 文件。包含以下需要注意的选项：

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) 被设置为了 `true`，因为 Vite 用 [esbuild](https://esbuild.github.io/) 来对 TypeScript 作转译，并受限于单文件转译的限制。

- 如果你正在使用选项式 API，需要设置 [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) 为 `true`（或者至少开启 [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis)，它是 `strict` 模式的一部分），才可以获得对组件选项中 `this` 的类型检查。否则 `this` 会被认为是 `any`。

- 如果你在你的构建工具中配置了路径解析别名，例如 `@/*` 这个别名酒杯默认配置在了 `create-vue` 搭建的项目中，你需要同时通过 [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths) 选项再为 TypeScript 配置一遍。

同时你也可以看看：

- [官方 TypeScript 编译选项文档](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [esbuild TypeScript 编译约定](https://esbuild.github.io/content-types/#typescript-caveats)

### 托管模式 {#takeover-mode}

> 这一章节仅对 VSCode + Volar 有效。

要让 Vue SFC 和 TypeScript 一起工作，Volar 单独创建了一个 TypeScript 语言服务实例，用来对 Vue 作一些特定支持，并在 Vue SFC 中使用。这个默认行为的确能够工作，但有两个缺陷：

1. 对每一个项目我们都同时运行了两套 TS 语言服务实例，这并不是特别高效。

2. 纯 TypeScript 文件值仍只能使用内置 TS 语言服务，而对 Vue SFC 相关内容一无所知。因此我们必须对 `*.vue` 模块做如下的 shim 操作：

   ```ts
   // 在一个 d.ts 类型定义文件中
   declare module '*.vue' {
     import { DefineComponent } from 'vue'
     const component: DefineComponent<{}, {}, any>
     export default component
   }
   ```

Volar 提供了一个叫做 “托管模式” 的功能，用来解决这个问题。在托管模式中，Volar 同时对 Vue 和 TS 文件提供支持，只使用一套 TS 语言服务实例。所以我们无需再做上面的 shim 操作。

要开启托管模式，你需要在项目的工作空间中禁用 VSCode 的内置 TypeScript 语言服务。查看这些 [指引](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) 获取更多相关设置细节。

### 对 Vue CLI 和 `ts-loader` 的说明 {#note-on-vue-cli-and-ts-loader}

在像 Vue CLI 这样基于 Webpack 搭建的项目中，一般是在模块转换的管道中执行类型检查，例如使用 `ts-loader`。然而这并不是一个简洁的解决方案，因为类型系统需要了解整个模块关系才能执行类型检查。单个模块的转换步骤并不适合该任务。这导致了下面的问题：

- `ts-loader` 只可以对转换后的代码执行类型检查，这和我们在 IDE 中看到的或 `vue-tsc` 中得到的可以映射回源代码的错误可能并不一致。

- 类型检查可能很慢。当它和代码转换在相同的线程/进程中执行时，它会显著影响整个应用程序的构建速度。

- 我们已经在 IDE 中通过单独的进程运行着类型检查了，因此这降低开发体验的一步并没有带来足够的收益。

如果你正通过 Vue CLI 使用 Vue 3 和 TypeScript，我们强烈建议你迁移到 Vite，我们也在开发为 CLI 提供仅执行 TS 语法转译的选项，让你可以也切换为使用 `vue-tsc`。

## 常见使用说明 {#general-usage-notes}

### `defineComponent()` {#definecomponent}

要让 TypeScript 能够正确地推导出组件内选项的类型，我们需要通过 [`defineComponent()`](/api/general.html#definecomponent) 这个全局 API 来定义组件：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 启用类型推导
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

当没有使用 `<script setup>` 但也在使用组合式 API、向 `setup()` 中传参时，`defineComponent()` 也支持对 props 的推导：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 启用类型推导
  props: {
    message: String
  },
  setup(props) {
    props.message // 类型：string | undefined
  }
})
```

你也可以看看 [对 `defineComponent` 的类型测试代码](https://github.com/vuejs/vue-next/blob/master/test-dts/defineComponent.test-d.tsx)。

:::tip
`defineComponent()` 也支持对纯 JavaScript 编写的组件进行类型推断。
:::

### 在单文件组件中的用法 {#usage-in-single-file-components}

要在 SFC 中使用 TypeScript，需要在 `<script>` 标签上加上 `lang="ts"` 的 attribute。当 `lang="ts"` 存在时，所有的模板内表达式都将享受到更严格的类型检查。

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
// 启用 TypeScript
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- 启用了类型检查和自动补全 -->
  {{ count.toFixed(2) }}
</template>
```

### 模板中的 TypeScript {#typescript-in-templates}

在使用 `<script lang="ts">` 或 `<script setup lang="ts">` 后，`<template>` 在绑定表达式时也支持 TypeScript，这在需要在模板表达式中执行类型转换的情况下非常有用。

这里有一个假想的例子：

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- 发生错误，因为 x 可能为 string -->
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
如果正在使用 Vue CLI 或基于 Webpack 的配置，支持模板内表达式的 TypeScript 需要 `vue-loader@^16.8.0`。
:::

## 不同 API 风格的使用指南 {#api-specific-recipes}

- [TS 与组合式 API](./composition-api)
- [TS 与选项式 API](./options-api)
