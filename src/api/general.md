# 全局 API：常规 {#global-api-general}

## version {#version}

暴露当前所使用的 Vue 版本

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

  当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存到“next tick”以确保每个组件无论发生多少状态改变，都仅执行一次更新。

  `nextTick()` 可以在状态改变后立即使用，以等待 DOM 更新完成。你甚至可以传递一个回调函数作为参数，或者 await 返回的 Promise。

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

- **相关内容：** [`this.$nextTick()`](/api/component-instance.html#nexttick)

## defineComponent() {#definecomponent}

在定义 Vue 组件选项时提供类型提示的帮助函数。

- **类型**

  ```ts
  function defineComponent(
    component: ComponentOptions | ComponentOptions['setup']
  ): ComponentConstructor
  ```

  > 为了便于阅读，对类型进行了简化。

- **详细信息**

  第一个参数是一个组件选项对象。返回值将是相同的选项对象，因为该函数本质上在运行时没有任何操作，仅用于类型推断。

  注意返回值的类型有一点特别：它会是一个构造函数类型，它的实例类型是根据选项推断出的组件实例类型。这是为该返回值在 TSX 中用作标签时提供类型推断支持。

  你可以像这样从 `defineComponent()` 的返回类型中提取出一个组件的实例类型（与其选项中的 `this` 的类型等价）：

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

- **相关内容：** [指南 - 配合 TypeScript 使用 Vue](/guide/typescript/overview.html#general-usage-notes)

## defineAsyncComponent()  {#defineasynccomponent}

定义一个异步组件，它在运行时是懒加载的。参数可以是一个装载函数，或是对装载行为有更进一步控制的一个选项对象。

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

- **相关内容：** [Guide - Async Components](/guide/components/async.html)

## defineCustomElement()  {#definecustomelement}

这个方法和 [`defineComponent`](#definecomponent) 接受的参数相同，不同的是会返回一个原生 [自定义元素](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) 类的构造器。

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

- **相关内容：**

  - [指南 - 使用 Vue 构建自定义元素](/guide/extras/web-components.html#building-custom-elements-with-vue)

  - 另外请注意在使用单文件组件时 `defineCustomElement()` 需要 [特殊的配置](/guide/extras/web-components.html#sfc-as-custom-element)。
