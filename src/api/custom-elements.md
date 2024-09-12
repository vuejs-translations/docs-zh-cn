# 自定义元素 API {#custom-elements-api}

## defineCustomElement() {#definecustomelement}

此方法接受的参数与 [`defineComponent`](#definecomponent) 相同，但返回一个原生[自定义元素](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements)类构造函数。

- **类型**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & CustomElementsOptions)
      | ComponentOptions['setup'],
    options?: CustomElementsOptions
  ): {
    new (props?: object): HTMLElement
  }

  interface CustomElementsOptions {
    styles?: string[]

    // 以下选项在 3.5+ 版本中支持
    configureApp?: (app: App) => void
    shadowRoot?: boolean
    nonce?: string
  }
  ```

  > 类型为简化版，便于阅读。

- **详情**

  除了常规的组件选项，`defineCustomElement()` 还支持一系列特定于自定义元素的选项：

  - **`styles`**：一个内联 CSS 字符串数组，用于提供应注入元素 shadow root 的 CSS。

  - **`configureApp`** <sup class="vt-badge" data-text="3.5+"/>：一个函数，可用于配置自定义元素的 Vue 应用实例。

  - **`shadowRoot`** <sup class="vt-badge" data-text="3.5+"/>：`boolean`，默认为 `true`。设置为 `false` 以在不带 shadow root 的情况下渲染自定义元素。这意味着自定义元素单文件组件中的 `<style>` 将不再被封装隔离。

  - **`nonce`** <sup class="vt-badge" data-text="3.5+"/>：`string`，如果提供，将在注入到 shadow root 样式标签上设置 `nonce` attribute。

  注意，这些选项也可以不作为组件本身的一部分传递，而是通过第二个参数传递：

  ```js
  import Element from './MyElement.ce.vue'

  defineCustomElement(Element, {
    configureApp(app) {
      // ...
    }
  })
  ```

  返回值是一个自定义元素构造函数，可以使用 [`customElements.define()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomElementRegistry/define) 注册。

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

  - 请注意，使用单文件组件时，`defineCustomElement()` 需要进行[特殊配置](/guide/extras/web-components#sfc-as-custom-element)。

## useHost() <sup class="vt-badge" data-text="3.5+"/> {#usehost}

一个组合式 API 辅助函数，返回当前 Vue 自定义元素的宿主元素。

## useShadowRoot() <sup class="vt-badge" data-text="3.5+"/> {#useshadowroot}

一个组合式 API 辅助函数，返回当前 Vue 自定义元素的 shadow root。

## this.$host <sup class="vt-badge" data-text="3.5+"/> {#this-host}

一个选项式 API 的 property，暴露当前 Vue 自定义元素的宿主元素。
