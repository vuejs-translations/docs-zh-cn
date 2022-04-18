# 渲染选项 {#options-rendering}

## template {#template}

一个组件的字符串模板。

- **类型**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **详细信息**

  通过 `template` 选项提供的模板将会在运行时编译。这仅在 Vue 包含了模板编译器的情况下支持。当使用的 Vue 发行版文件名中带有 `runtime` 时模板编译器是 **未被包含** 的，例如 `vue.runtime.esm-bundler.js`。请看 [发行版文件指南](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) 了解不同构建版本之间的详细区别。

  如果该字符串以 `#` 开头它将会被用作一个 `querySelector`，并会将所选择到的元素的 `innerHTML` 作为其模板字符串。这允许来源模板可以通过原生 `<template>` 元素书写。

  如果 `render` 选项也同时存在于该组件中，`template` 将被忽略。

  如果应用的根组件不含任何 `template` 或 `render` 选项，Vue 将会尝试使用所挂载元素的 `innerHTML` 来作为模板。

  :::warning 安全性注意
  请仅使用你可以信任的模板来源。不要使用任何用户提供的模板。查看 [安全性指南](/guide/best-practices/security.html#rule-no-1-never-use-non-trusted-templates) 了解更多细节。
  :::

## render {#render}

一个编程式创建虚拟 DOM 树的函数。

- **类型**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **详细信息**

  `render` 是字符串模板的一种替代，可以使你利用 JavaScript 的丰富表达力来完全编程式地声明组件最终的渲染输出。

  预编译的模板，例如单文件组件中的那样，将在构建时生成出 `render` 选项，如果一个组件中同时出现了 `render` 和 `template` 选项，`render` 的优先级更高。

- **相关内容：**
  - [渲染机制](/guide/extras/rendering-mechanism.html)
  - [渲染函数](/guide/extras/render-function.html)

## compilerOptions {#compileroptions}

配置运行时编译器编译组件模板的选项。

- **类型**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // 默认：'condense'
      delimiters?: [string, string] // 默认：['{{', '}}']
      comments?: boolean // 默认：false
    }
  }
  ```

- **详细信息**

  这个配置选项仅在使用了完整发行版（即独立的 `vue.js` 可以在浏览器中编译模板）时才有效。它与应用级的 [app.config.compilerOptions](/api/application.html#app-config-compileroptions) 选项配置格式相同，并针对当前组件有更高的优先级。

- **相关内容：** [app.config.compilerOptions](/api/application.html#app-config-compileroptions)
