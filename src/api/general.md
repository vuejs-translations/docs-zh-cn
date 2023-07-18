# 全局 API：常规 {#global-api-general}

## version {#version}

暴露当前所使用的 Vue 版本。

- **类型** `string`

- **示例**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick() {#nexttick}

等待下一次 DOM 更新刷新的工具方法。

- **类型**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **详细信息**

  当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新。

  `nextTick()` 可以在状态改变后立即使用，以等待 DOM 更新完成。你可以传递一个回调函数作为参数，或者 await 返回的 Promise。

- **示例**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM 还未更新
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM 此时已经更新
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>
  <div class="options-api">

  ```vue
  <script>
  import { nextTick } from 'vue'

  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++

        // DOM 还未更新
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM 此时已经更新
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>

- **参考** [`this.$nextTick()`](/api/component-instance#nexttick)

## defineComponent() {#definecomponent}

在定义 Vue 组件时提供类型推导的辅助函数。

- **类型**

  ```ts
  // 选项语法
  function defineComponent(
    component: ComponentOptions
  ): ComponentConstructor

  // 函数语法 (需要 3.3+)
  function defineComponent(
    setup: ComponentOptions['setup'],
    extraOptions?: ComponentOptions
  ): () => any
  ```

  > 为了便于阅读，对类型进行了简化。

- **详细信息**

  第一个参数是一个组件选项对象。返回值将是该选项对象本身，因为该函数实际上在运行时没有任何操作，仅用于提供类型推导。

  注意返回值的类型有一点特别：它会是一个构造函数类型，它的实例类型是根据选项推断出的组件实例类型。这是为了能让该返回值在 TSX 中用作标签时提供类型推导支持。

  你可以像这样从 `defineComponent()` 的返回类型中提取出一个组件的实例类型 (与其选项中的 `this` 的类型等价)：

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### 函数签名 <sup class="vt-badge" data-text="3.3+" /> {#function-signature}

  `defineComponent()` 还有一种备用签名，旨在与组合式 API 和 [渲染函数或 JSX](/guide/extras/render-function.html) 一起使用。

  与传递选项对象不同的是，它需要传入一个函数。这个函数的工作方式与组合式 API 的 [`setup()`](/api/composition-api-setup.html#composition-api-setup) 函数相同：它接收 props 和 setup 上下文。返回值应该是一个渲染函数——支持 `h()` 和 JSX：

  ```js
  import { ref, h } from 'vue'

  const Comp = defineComponent(
    (props) => {
      // 就像在 <script setup> 中一样使用组合式 API
      const count = ref(0)

      return () => {
        // 渲染函数或 JSX
        return h('div', count.value)
      }
    },
    // 其他选项，例如声明 props 和 emits。
    {
      props: {
        /* ... */
      }
    }
  )
  ```

  此签名的主要用例是使用 TypeScript (特别是使用 TSX )，因为它支持泛型：

  ```tsx
  const Comp = defineComponent(
    <T extends string | number>(props: { msg: T; list: T[] }) => {
      // 就像在 <script setup> 中一样使用组合式 API
      const count = ref(0)

      return () => {
        // 渲染函数或 JSX
        return <div>{count.value}</div>
      }
    },
    // 目前仍然需要手动声明运行时的 props
    {
      props: ['msg', 'list']
    }
  )
  ```

  在将来，我们计划提供一个 Babel 插件，自动推断并注入运行时 props (就像在 SFC 中的 `defineProps` 一样)，以便省略运行时 props 的声明。

  ### webpack Treeshaking 的注意事项 {#note-on-webpack-treeshaking}

  因为 `defineComponent()` 是一个函数调用，所以它可能被某些构建工具认为会产生副作用，如 webpack。即使一个组件从未被使用，也有可能不被 tree-shake。

  为了告诉 webpack 这个函数调用可以被安全地 tree-shake，我们可以在函数调用之前添加一个 `/*#__PURE__*/` 形式的注释：

  ```js
  export default /*#__PURE__*/ defineComponent(/* ... */)
  ```

  请注意，如果你的项目中使用的是 Vite，就不需要这么做，因为 Rollup (Vite 底层使用的生产环境打包工具) 可以智能地确定 `defineComponent()` 实际上并没有副作用，所以无需手动注释。

- **参考**[指南 - 配合 TypeScript 使用 Vue](/guide/typescript/overview#general-usage-notes)

## defineAsyncComponent() {#defineasynccomponent}

定义一个异步组件，它在运行时是懒加载的。参数可以是一个异步加载函数，或是对加载行为进行更具体定制的一个选项对象。

- **类型**

  ```ts
  function defineAsyncComponent(
    source: AsyncComponentLoader | AsyncComponentOptions
  ): Component

  type AsyncComponentLoader = () => Promise<Component>

  interface AsyncComponentOptions {
    loader: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
    onError?: (
      error: Error,
      retry: () => void,
      fail: () => void,
      attempts: number
    ) => any
  }
  ```

- **参考**[指南 - 异步组件](/guide/components/async)

## defineCustomElement() {#definecustomelement}

这个方法和 [`defineComponent`](#definecomponent) 接受的参数相同，不同的是会返回一个原生[自定义元素](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)类的构造器。

- **类型**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & { styles?: string[] })
      | ComponentOptions['setup']
  ): {
    new (props?: object): HTMLElement
  }
  ```

  > 为了便于阅读，对类型进行了简化。

- **详细信息**

  除了常规的组件选项，`defineCustomElement()` 还支持一个特别的选项 `styles`，它应该是一个内联 CSS 字符串的数组，所提供的 CSS 会被注入到该元素的 shadow root 上。

  返回值是一个可以通过 [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) 注册的自定义元素构造器。

- **示例**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* 组件选项 */
  })

  // 注册自定义元素
  customElements.define('my-vue-element', MyVueElement)
  ```

- **参考**

  - [指南 - 使用 Vue 构建自定义元素](/guide/extras/web-components#building-custom-elements-with-vue)

  - 另外请注意在使用单文件组件时 `defineCustomElement()` 需要[特殊的配置](/guide/extras/web-components#sfc-as-custom-element)。
