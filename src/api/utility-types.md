# TypeScript 工具类型 {#utility-types}

:::info
此页面仅列出了一些可能需要解释其使用方式的常用工具类型。有关导出类型的完整列表，请查看[源代码](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131)。
:::

## PropType\<T> {#proptype-t}

用于在用运行时 props 声明时给一个 prop 标注更复杂的类型定义。

- **示例**

  ```ts
  import type { PropType } from 'vue'

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

- **参考**：[指南 - 为组件 props 标注类型](/guide/typescript/options-api#typing-component-props)

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
  类型扩展必须被放置在一个模块 `.ts` 或 `.d.ts` 文件中。查看[类型扩展指南](/guide/typescript/options-api#augmenting-global-properties)了解更多细节
  :::

- **参考**：[指南 - 扩展全局属性](/guide/typescript/options-api#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

用来扩展组件选项类型以支持自定义选项。

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
  类型扩展必须被放置在一个模块 `.ts` 或 `.d.ts` 文件中。查看[类型扩展指南](/guide/typescript/options-api#augmenting-global-properties)了解更多细节。
  :::

- **参考**：[指南 - 扩展自定义选项](/guide/typescript/options-api#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

用于扩展全局可用的 TSX props，以便在 TSX 元素上使用没有在组件选项上定义过的 props。

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
  类型扩展必须被放置在一个模块 `.ts` 或 `.d.ts` 文件中。查看[类型扩展指南](/guide/typescript/options-api#augmenting-global-properties)了解更多细节。
  :::

## CSSProperties {#cssproperties}

用于扩展在样式属性绑定上允许的值的类型。

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
  类型增强必须被放置在一个模块 `.ts` 或 `.d.ts` 文件中。查看[类型增强指南](/guide/typescript/options-api#augmenting-global-properties)了解更多细节。
  :::

:::info 参考
SFC `<style>` 标签支持通过 `v-bind` CSS 函数来链接 CSS 值与组件状态。这允许在没有类型扩展的情况下自定义属性。

- [CSS 中的 v-bind()](/api/sfc-css-features#v-bind-in-css)
  :::
