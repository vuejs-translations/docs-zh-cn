# 工具类型 {#utility-types}

:::info
本页文档罗列出了一部分可能需要解释一下使用方式的常用工具类型。若要获取这些工具类型的完整列表，请查看[源代码](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131)。
:::

## PropType\<T> {#proptypet}

在定义运行时 props 时用更高阶的类型定义来标注一个 prop。

- **示例**

  ```ts
  import { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // 提供一个比 `Object` 更具体的类型
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **相关内容：** [指南 - 为组件 props 标注类型](/guide/typescript/options-api.html#typing-component-props)

## ComponentCustomProperties {#componentcustomproperties}

用于增强组件实例类型以支持自定义全局属性。

- **示例**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

  :::tip
  类型扩充必须被放置在一个模块 `.ts` 或 `.d.ts` 文件中。查看 [类型扩充指南](/guide/typescript/options-api.html#augmenting-global-properties) 了解更多细节
  :::

- **相关内容：** [指南 - 扩充全局属性](/guide/typescript/options-api.html#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

用来扩充组件选项类型以支持自定义选项。

- **示例**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip
  类型扩充必须被放置在一个模块 `.ts` 或 `.d.ts` 文件中。查看 [类型扩充指南](/guide/typescript/options-api.html#augmenting-global-properties) 了解更多细节。
  :::

- **相关内容：** [指南 - 扩充自定义选项](/guide/typescript/options-api.html#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

用于扩充允许的TSX prop，以便在 TSX 元素上使用没有在组件选项上定义过的 prop。

- **示例**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // 现在即使没有在组件选项上定义过 hello 这个 prop 也依然能通过类型检查了
  <MyComponent hello="world" />
  ```

  :::tip
  类型扩充必须被放置在一个模块 `.ts` 或 `.d.ts` 文件中。查看 [类型扩充指南](/guide/typescript/options-api.html#augmenting-global-properties) 了解更多细节。
  :::

## CSSProperties {#cssproperties}

用于扩充在样式属性绑定上允许的值的类型。

- **示例**

  允许任意自定义 CSS 属性：

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```
  ```html
  <div :style="{ '--bg-color': 'blue' }">
  ```

 :::tip
  类型扩充必须被放置在一个模块 `.ts` 或 `.d.ts` 文件中。查看 [类型扩充指南](/guide/typescript/options-api.html#augmenting-global-properties) 了解更多细节。
  :::
  
  :::info 相关内容
SFC `<style>` 标签支持通过 `v-bind:CSS` 函数来链接 CSS 值与组件状态。这允许在没有类型扩充的情况下自定义属性。

- [CSS 中的 v-bind()](/api/sfc-css-features.html#v-bind-in-css)
  :::
