# 内置特殊元素 {#built-in-special-elements}

:::info 不是组件
`<component>` 和 `<slot>` 具有类似组件的特性，也是模板语法的一部分。它们并非真正的组件，同时在模板编译期间会被编译掉。因此，它们通常在模板中用小写字母书写。
:::

## `<component>` {#component}

一种用于渲染动态组件或元素的“元组件”。

- **Props**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **详细信息**

  要渲染的实际组件由 `is` prop 决定。

  - 当 `is` 是字符串，它既可以是 HTML 标签名也可以是组件的注册名。

  - 或者，`is` 也可以直接绑定到组件的定义。

- **示例**

  按注册名渲染组件 (选项式 API)：

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

  按定义渲染组件 (`<script setup>` 组合式 API):

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

  如果将组件本身传递给 `is` 而不是其名称，则不需要注册，例如在 `<script setup>` 中。

- **相关内容**：[动态组件](/guide/essentials/component-basics.html#dynamic-components)

## `<slot>` {#slot}

表示模板中的插槽内容出口。

- **Props**

  ```ts
  interface SlotProps {
    /**
     * 任何传递给 <slot> 的 prop 都可以作为作用域插槽
     * 的参数传递
     */
    [key: string]: any
    /**
     * 保留，用于指定插槽名。
     */
    name?: string
  }
  ```

- **详细信息**

  `<slot>` 元素可以使用 `name` attribute 来指定插槽名。当没有指定 `name` 时，将会渲染默认插槽。传递给插槽元素的附加 attribute 将作为插槽 prop ，传递给父级中定义的作用域插槽。

  元素本身将被其所匹配的插槽内容替换。

  Vue 模板里的 `<slot>` 元素会被编译到 JavaScript，因此不要与[原生 `<slot>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)进行混淆。

- **相关内容：** [组件 - 插槽](/guide/components/slots.html)
