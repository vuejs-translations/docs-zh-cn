# 内置的特殊 Attributes {#built-in-special-attributes}

## key {#key}

`key` 这个特殊的 attribute 主要作为 Vue 的虚拟 DOM 算法提示，在比较新旧节点列表时用于识别 vnode。

- **预期**：`number | string | symbol`

- **详细信息**

  在没有 key 的情况下，Vue 将使用一种最小化元素移动的算法，并尽可能地就地更新/复用相同类型的元素。如果传了 key，则将根据 key 的变化顺序来重新排列元素，并且将始终移除/销毁 key 已经不存在的元素。

  同一个父元素下的子元素必须具有**唯一的 key**。重复的 key 将会导致渲染异常。

  最常见的用例是与 `v-for` 结合：

  ```vue-html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  也可以用于强制替换一个元素/组件而不是复用它。当你想这么做时它可能会很有用：

  - 在适当的时候触发组件的生命周期钩子
  - 触发过渡

  举例来说：

  ```vue-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  当 `text` 变化时，`<span>` 总是会被替换而不是更新，因此 transition 将会被触发。

- **参考**[指南 - 列表渲染 - 通过 `key` 管理状态](/guide/essentials/list#maintaining-state-with-key)

## ref {#ref}

用于注册[模板引用](/guide/essentials/template-refs)。

- **预期**：`string | Function`

- **详细信息**

  `ref` 用于注册元素或子组件的引用。

  使用选项式 API，引用将被注册在组件的 `this.$refs` 对象里：

  ```vue-html
  <!-- 存储为 this.$refs.p -->
  <p ref="p">hello</p>
  ```

  使用组合式 API，引用将存储在与名字匹配的 ref 里：

  ```vue
  <script setup>
  import { ref } from 'vue'

  const p = ref()
  </script>

  <template>
    <p ref="p">hello</p>
  </template>
  ```

  如果用于普通 DOM 元素，引用将是元素本身；如果用于子组件，引用将是子组件的实例。

  或者 `ref` 可以接收一个函数值，用于对存储引用位置的完全控制：

  ```vue-html
  <ChildComponent :ref="(el) => child = el" />
  ```

  关于 ref 注册时机的重要说明：因为 ref 本身是作为渲染函数的结果来创建的，必须等待组件挂载后才能对它进行访问。

  `this.$refs` 也是非响应式的，因此你不应该尝试在模板中使用它来进行数据绑定。

- **参考**
  - [指南 - 模板引用](/guide/essentials/template-refs)
  - [指南 - 为模板引用标注类型](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [指南 - 为组件模板引用标注类型](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## is {#is}

用于绑定[动态组件](/guide/essentials/component-basics#dynamic-components)。

- **预期**：`string | Component`

- **用于原生元素** <sup class="vt-badge">3.1+</sup>

  当 `is` attribute 用于原生 HTML 元素时，它将被当作 [Customized built-in element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example)，其为原生 web 平台的特性。

  但是，在这种用例中，你可能需要 Vue 用其组件来替换原生元素，如 [DOM 内模板解析注意事项](/guide/essentials/component-basics#in-dom-template-parsing-caveats)所述。你可以在 `is` attribute 的值中加上 `vue:` 前缀，这样 Vue 就会把该元素渲染为 Vue 组件：

  ```vue-html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **参考**

  - [内置特殊元素 - `<component>`](/api/built-in-special-elements#component)
  - [动态组件](/guide/essentials/component-basics#dynamic-components)
