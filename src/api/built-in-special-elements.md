# 内置特殊元素 {#built-in-special-elements}

:::info 不是组件
`<component>` 和 `<slot>` 具有类似组件的特性，也是模板语法的一部分。它们并非真正的组件，同时在模板编译期间会被编译掉。因此，它们通常在模板中用小写字母书写。
:::

## `<component>` {#component}

一种用于渲染动态组件或元素的 “元组件” 。

- **Props**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **详细信息**

  要渲染的实际组件由 `is` prop 决定。

  - 当 `is` 是字符串，它既可以是 HTML 标签名也可以是组件的注册名。

  - 或者， `is` 也可以直接绑定到组件的定义。

- **示例**

  按注册名渲染组件 （选项式 API）：

  ```vue
  <script>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: { Foo, Bar },
    data() {
      return {
        view: 'Foo'
      }
    }
  }
  </script>

  <template>
    <component :is="view" />
  </template>
  ```

  按定义渲染组件 （ `<script setup>` 组合式 API):

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  渲染 HTML 元素：

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  [内置组件](./built-in-components.html)都可以传递给 `is`，但是如果想通过名称传递则必须先对其进行注册。举个例子：

  ```vue
  <script>
  import { Transition, TransitionGroup } from 'vue'

  export default {
    components: {
      Transition,
      TransitionGroup
    }
  }
  </script>

  <template>
    <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
      ...
    </component>
  </template>
  ```

  如果将组件本身传递给 `is` 而不是其名称，则不需要注册，例如在 `<script setup>`。

- **相关内容：** [动态组件](/guide/essentials/component-basics.html#dynamic-components)

## `<slot>` {#slot}

Denotes slot content outlets in templates.

- **Props**

  ```ts
  interface SlotProps {
    /**
     * Any props passed to <slot> to passed as arguments
     * for scoped slots
     */
    [key: string]: any
    /**
     * Reserved for specifying slot name.
     */
    name?: string
  }
  ```

- **详细信息**

  The `<slot>` element can use the `name` attribute to specify a slot name. When no `name` is specified, it will render the default slot. Additional attributes passed to the slot element will be passed as slot props to the scoped slot defined in the parent.

  The element itself will be replaced by its matched slot content.

  `<slot>` elements in Vue templates are compiled into JavaScript, so they are not to be confused with [native `<slot>` elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot).

- **相关内容：** [Component - Slots](/guide/components/slots.html)
