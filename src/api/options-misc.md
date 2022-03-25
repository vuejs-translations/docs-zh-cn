# 其他杂项选项 {#options-misc}

## name {#name}

显式声明组件展示时的名称。

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

  当你在使用单文件组件时，组件已经会根据其文件名推导出其名称。举个例子，一个名为 `MyComponent.vue` 的文件会推导出显示名称为“MyComponent”。

  另一种场景是裆一个组件通过 [`app.component`](/api/application.html#app-component) 被全局注册时，这个全局 ID 就自动被设为了其名称。

  使用 `name` 选项使你可以覆盖推导出的名称，或是在没有推导出名字时显式提供一个。（例如没有使用构建工具时，或是一个内联的非 SFC 式的组件）

  有一种场景下 `name` 必须是已显式声明的：即 [`<KeepAlive>`](/guide/built-ins/keep-alive.html) 通过其 `include / exclude` prop 来匹配其需要缓存的组件时。

## inheritAttrs {#inheritattrs}

- **类型**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // default: true
  }
  ```

- **详细信息**

  默认情况下，父组件范围内没有被识别为 prop 的 attribute 绑定将“透传"。这意味着当我们有一个单根节点的组件时，这些绑定会被应用在子组件的根节点元素上，作为一个常规的 HTML attribute。当编写一个包裹目标元素或其他组件的组件时，这不一定是所期望的行为。通过设置 `inheritAttrs` 为 `false`，可以禁用这个默认行为。attributes 可以通过 `$attrs` 这个实例属性来访问，并且可以通过 `v-bind` 来显式绑定在一个非根节点的元素上。

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

  在一个组件的 `<script setup>` 中声明这个选项时，需要一个额外的 `<script>` 块：

  ```vue
  <script>
  export default {
    inheritAttrs: false
  }
  </script>

  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
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

- **相关内容：** [透传 attribute](/guide/components/attrs.html)

## components {#components}

一个用来为当前组件注册其可用组件的对象。

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
      // 使用一个不同的名称注册
      RenamedBar: Bar
    }
  }
  ```

- **相关内容：** [组件注册](/guide/components/registration.html)

## directives {#directives}

一个用来为当前组件注册其可用指令的对象。

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

- **相关内容：** [自定义指令](/guide/reusability/custom-directives.html)
