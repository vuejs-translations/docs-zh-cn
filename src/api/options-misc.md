# 其他杂项选项 {#options-misc}

## name {#name}

用于显式声明组件展示时的名称。

- **类型**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **详细信息**

  组件的名字有以下用途：

  - 在组件自己的模板中递归引用自己时
  - 在 Vue 开发者工具中的组件树显示时
  - 在组件抛出的警告追踪栈信息中显示时

  当你在使用单文件组件时，组件已经会根据其文件名推导出其名称。举例来说，一个名为 `MyComponent.vue` 的文件会推导出显示名称为“MyComponent”。

  另一种场景是当一个组件通过 [`app.component`](/api/application#app-component) 被全局注册时，这个全局 ID 就自动被设为了其名称。

  使用 `name` 选项使你可以覆盖推导出的名称，或是在没有推导出名字时显式提供一个。(例如没有使用构建工具时，或是一个内联的非 SFC 式的组件)

  有一种场景下 `name` 必须是已显式声明的：即 [`<KeepAlive>`](/guide/built-ins/keep-alive) 通过其 `include / exclude` prop 来匹配其需要缓存的组件时。

  :::tip
  在 3.2.34 或以上的版本中，使用 `<script setup>` 的单文件组件会自动根据文件名生成对应的 `name` 选项，即使是在配合 `<KeepAlive>` 使用时也无需再手动声明。
  :::

## inheritAttrs {#inheritattrs}

用于控制是否启用默认的组件 attribute 透传行为。

- **类型**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // 默认值：true
  }
  ```

- **详细信息**

  默认情况下，父组件传递的，但没有被子组件解析为 props 的 attributes 绑定会被“透传”。这意味着当我们有一个单根节点的子组件时，这些绑定会被作为一个常规的 HTML attribute 应用在子组件的根节点元素上。当你编写的组件想要在一个目标元素或其他组件外面包一层时，可能并不期望这样的行为。我们可以通过设置 `inheritAttrs` 为 `false` 来禁用这个默认行为。这些 attributes 可以通过 `$attrs` 这个实例属性来访问，并且可以通过 `v-bind` 来显式绑定在一个非根节点的元素上。

- **示例**

  <div class="options-api">

  ```vue
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>
  <div class="composition-api">

  在一个使用了 `<script setup>` 的组件中声明这个选项时，可以使用 [`defineOptions`](/api/sfc-script-setup#defineoptions) 宏：

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({
    inheritAttrs: false
  })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  从 3.3 开始你也可以直接在 `<script setup>` 中使用 `defineOptions`：

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({ inheritAttrs: false })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>

- **参考**[透传 attribute](/guide/components/attrs)

## components {#components}

一个对象，用于注册对当前组件实例可用的组件。

- **类型**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **示例**

  ```js
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: {
      // 简写
      Foo,
      // 注册为一个不同的名称
      RenamedBar: Bar
    }
  }
  ```

- **参考**[组件注册](/guide/components/registration)

## directives {#directives}

一个对象，用于注册对当前组件实例可用的指令。

- **类型**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **示例**

  ```js
  export default {
    directives: {
      // 在模板中启用 v-focus
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```vue-html
  <input v-focus>
  ```

  这个列表中的指令都在当前组件实例中可用。

- **参考**[自定义指令](/guide/reusability/custom-directives)
