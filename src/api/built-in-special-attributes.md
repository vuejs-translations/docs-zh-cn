# 内置特殊 attribute {#built-in-special-attributes}

## key {#key}

`key` 特殊 attribute 主要作为 Vue 的虚拟 DOM 算法提示，在比较新旧节点列表时用于识别 vnode。

- **预期：** `number | string | symbol`

- **详细信息**

  不传 key，Vue 使用最小化元素移动算法，并尽可能地就地更新/复用相同类型的元素。传了 key，将根据 key 的变化顺序来重新排列元素，并且会移除/销毁 key 不存在的元素。

  父元素相同的子元素必须具有 **唯一 key** 。重复的 key 将会导致渲染异常。

  最常见的用例是与 `v-for` 结合：

  ```vue-html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  也可以用于强制替换一个元素/组件而不是复用它。当你想这么做时它可能会很有用：

  - 在适当的时候触发组件的生命周期钩子
  - 触发 transition

  举个例子：

  ```vue-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  当 `text` 变化时，`<span>` 总是会被替换而不是更新，因此 transition 将会被触发。

- **相关内容：** [指南 - 列表渲染 - 通过 `key` 管理状态](/guide/essentials/list.html#maintaining-state-with-key)

## ref

Denotes a [template ref](/guide/essentials/template-refs.html).

- **Expects:** `string | Function`

- **详细信息**

  `ref` is used to register a reference to an element or a child component.

  In Options API, the reference will be registered under the component's `this.$refs` object:

  ```vue-html
  <!-- stored as this.$refs.p -->
  <p ref="p">hello</p>
  ```

  In Composition API, the reference will be stored in a ref with matching name:

  ```vue
  <script setup>
  import { ref } from 'vue'

  const p = ref()
  </script>

  <template>
    <p ref="p">hello</p>
  </template>
  ```

  If used on a plain DOM element, the reference will be that element; if used on a child component, the reference will be the child component instance.

  Alternatively `ref` can accept a function value which provides full control over where to store the reference:

  ```vue-html
  <ChildComponent :ref="(el) => child = el" />
  ```

  An important note about the ref registration timing: because the refs themselves are created as a result of the render function, you must wait until the component is mounted before accessing them.

  `this.$refs` is also non-reactive, therefore you should not attempt to use it in templates for data-binding.

- **相关内容：** [Template Refs](/guide/essentials/template-refs.html)

## is

Used for binding [dynamic components](/guide/essentials/component-basics.html#dynamic-components).

- **Expects:** `string | Component`

- **Usage on native elements** <sup class="vt-badge">3.1+</sup>

  When the `is` attribute is used on a native HTML element, it will be interpreted as a [Customized built-in element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example), which is a native web platform feature.

  There is, however, a use case where you may need Vue to replace a native element with a Vue component, as explained in [DOM Template Parsing Caveats](/guide/essentials/component-basics.html#dom-template-parsing-caveats). You can prefix the value of the `is` attribute with `vue:` so that Vue will render the element as a Vue component instead:

  ```vue-html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **相关内容：**

  - [Built-in Special Element - `<component>`](/api/built-in-special-elements.html#component)
  - [Dynamic Components](/guide/essentials/component-basics.html#dynamic-components)
