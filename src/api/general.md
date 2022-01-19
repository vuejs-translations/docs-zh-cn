# Global API: General

## version

Exposes the current version of Vue.

- **Type:** `string`

- **Example**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick()

A utility for waiting for the next DOM update flush.

- **Type**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **Details**

  When you mutate reactive state in Vue, the resulting DOM updates are not applied synchronously. Instead, Vue buffers them until the "next tick" to ensure that each component updates only once no matter how many state changes you have made.

  `nextTick()` can be used immediately after a state change to wait for the DOM updates to complete. You can either pass a callback as an argument, or await the returned Promise.

- **Example**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM not yet updated
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM is now updated
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

        // DOM not yet updated
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM is now updated
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

- **See also:** [`this.$nextTick()`](/api/component-instance.html#nexttick)

## defineComponent()

A type helper for defining a Vue component with type inference.

- **Type**

  ```ts
  function defineComponent(
    component: ComponentOptions | ComponentOptions['setup']
  ): ComponentConstructor
  ```

  > Type is simplified for readability.

- **Details**

  The first argument expects a component options object. The return value will be the same options object, since the function is essentially a runtime no-op for type inference purposes only.

  Note that the return type is a bit special: it will be a constructor type whose instance type is the inferred component instance type based on the options. This is used for type inference when the returned type is used as a tag in TSX.

  You can extract the instance type of a component (equivalent to the type of `this` in its options) from the return type of `defineComponent()` like this:

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

- **See also:** [Guide - Using Vue with TypeScript](/guide/typescript/overview.html#general-usage-notes)

## defineAsyncComponent()

Define an async component which is lazy loaded only when it is rendered. The argument can either be a loader function, or an options object for more advanced control of the loading behavior.

- **Type**

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

- **See also:** [Guide - Async Components](/guide/components/async.html)

## defineCustomElement()

This method accepts the same argument as [`defineComponent`](#definecomponent), but instead returns a native [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) class constructor.

- **Type**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & { styles?: string[] })
      | ComponentOptions['setup']
  ): {
    new (props?: object): HTMLElement
  }
  ```

  > Type is simplified for readability.

- **Details**

  In addition to normal component options, `defineCustomElement()` also supports a special option `styles`, which should be an array of inlined CSS strings, for providing CSS that should be injected into the element's shadow root.

  The return value is a custom element constructor that can be registered using [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Example**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* component options */
  })

  // Register the custom element.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **See also:**

  - [Guide - Building Custom Elements with Vue](/guide/extras/web-components.html#building-custom-elements-with-vue)

  - Also note that `defineCustomElement()` requires [special config](/guide/extras/web-components.html#sfc-as-custom-element) when used with Single-File Components.
