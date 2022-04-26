# 渲染选项 {#options-rendering}

## template {#template}

组件的字符串模板。

- **类型**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **详细信息**

  通过 `template` 选项提供的模板将会在运行时即时编译。这仅在使用了包含模板编译器的 Vue 构建版本的情况下支持。文件名中带有 `runtime` 的 Vue 构建版本**未包含**模板编译器，例如 `vue.runtime.esm-bundler.js`。请查阅 [发行版文件指南](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) 了解不同构建版本之间的详细区别。

  如果该字符串以 `#` 开头，它将被用作 `querySelector`，并使用所选元素的 `innerHTML` 作为模板字符串。这允许使用原生 `<template>` 元素来创作源模板。

  如果 `render` 选项也同时存在于该组件中，`template` 将被忽略。

  如果应用的根组件不含任何 `template` 或 `render` 选项，Vue 将会尝试使用所挂载元素的 `innerHTML` 来作为模板。

  :::warning 安全性注意
  请仅使用你可以信任的模板来源。不要直接将用户提供的内容用作模板。查看 [安全性指南](/guide/best-practices/security.html#rule-no-1-never-use-non-trusted-templates) 了解更多细节。
  :::

## render {#render}

以编程式来创建组件虚拟 DOM 树的函数。

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

  预编译的模板，例如单文件组件中的模板，会在构建时编译到 `render` 选项中。如果一个组件中同时存在 `render` 和 `template`，则 `render` 将具有更高的优先级。

- **相关内容：**
  - [渲染机制](/guide/extras/rendering-mechanism.html)
  - [渲染函数](/guide/extras/render-function.html)

## compilerOptions {#compileroptions}

配置组件模板的运行时编译器选项。

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

  这个配置选项仅在使用了完整的构建版本（即可以在浏览器中编译模板的独立 `vue.js` ）时才有效。它支持与应用级的 [app.config.compilerOptions](/api/application.html#app-config-compileroptions) 相同的选项，并针对当前组件有更高的优先级。

- **相关内容：** [app.config.compilerOptions](/api/application.html#app-config-compileroptions)
