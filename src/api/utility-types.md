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

- **参考**[指南 - 为组件 props 标注类型](/guide/typescript/options-api#typing-component-props)

## MaybeRef\<T> {#mayberef}

`T | Ref<T>` 的别名。对于标注[组合式函数](/guide/reusability/composables.html)的参数很有用。

- 仅在 3.3+ 版本中支持。

## MaybeRefOrGetter\<T> {#maybereforgetter}

`T | Ref<T> | (() => T)` 的别名。对于标注[组合式函数](/guide/reusability/composables.html)的参数很有用。

- 仅在 3.3+ 版本中支持。

## ExtractPropTypes\<T> {#extractproptypes}

从运行时的 props 选项对象中提取 props 类型。提取到的类型是面向内部的，也就是说组件接收到的是解析后的 props。这意味着 boolean 类型的 props 和带有默认值的 props 总是一个定义的值，即使它们不是必需的。

要提取面向外部的 props，即父组件允许传递的 props，请使用 [`ExtractPublicPropTypes`](#extractpublicproptypes)。

- **示例**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```

## ExtractPublicPropTypes\<T> {#extractpublicproptypes}

从运行时的 props 选项对象中提取 prop。提取的类型是面向外部的，即父组件允许传递的 props。

- **示例**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

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

- **参考**[指南 - 扩展全局属性](/guide/typescript/options-api#augmenting-global-properties)

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

- **参考**[指南 - 扩展自定义选项](/guide/typescript/options-api#augmenting-custom-options)

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
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

:::tip
类型增强必须被放置在一个模块 `.ts` 或 `.d.ts` 文件中。查看[类型增强指南](/guide/typescript/options-api#augmenting-global-properties)了解更多细节。
:::

:::info 参考
SFC `<style>` 标签支持通过 `v-bind` CSS 函数来链接 CSS 值与组件状态。这允许在没有类型扩展的情况下自定义属性。

- [CSS 中的 v-bind()](/api/sfc-css-features#v-bind-in-css)
:::
