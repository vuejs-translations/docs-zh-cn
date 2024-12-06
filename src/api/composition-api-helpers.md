# 组合式 API：辅助 {#composition-api-helpers}

## useAttrs() {#useattrs}

从 [Setup 上下文](/api/composition-api-setup#setup-context)中返回 `attrs` 对象，其中包含当前组件的[透传 attributes](/guide/components/attrs#fallthrough-attributes)。这是用于 `<script setup>` 中的，因为在 `<script setup>` 中无法获取 setup 上下文对象的。

- **类型**

  ```ts
  function useAttrs(): Record<string, unknown>
  ```

## useSlots() {#useslots}

从 [Setup 上下文](/api/composition-api-setup#setup-context)中返回 `slots` 对象，其中包含父组件传递的插槽。这些插槽为可调用的函数，返回虚拟 DOM 节点。这是用于 `<script setup>` 中的，因为在 `<script setup>` 中无法获取 setup 上下文对象的。

如果使用 TypeScript，建议优先使用 [`defineSlots()`](/api/sfc-script-setup#defineslots)。

- **类型**

  ```ts
  function useSlots(): Record<string, (...args: any[]) => VNode[]>
  ```

## useModel() {#usemodel}

这是驱动 [`defineModel()`](/api/sfc-script-setup#definemodel) 的底层辅助函数。如果使用 `<script setup>`，应当优先使用 `defineModel()`。

- 仅在 3.4+ 版本中可用

- **类型**

  ```ts
  function useModel(
    props: Record<string, any>,
    key: string,
    options?: DefineModelOptions
  ): ModelRef

  type DefineModelOptions<T = any> = {
    get?: (v: T) => any
    set?: (v: T) => any
  }

  type ModelRef<T, M extends PropertyKey = string, G = T, S = T> = Ref<G, S> & [
    ModelRef<T, M, G, S>,
    Record<M, true | undefined>
  ]
  ```

- **示例**

  ```js
  export default {
    props: ['count'],
    emits: ['update:count'],
    setup(props) {
      const msg = useModel(props, 'count')
      msg.value = 1
    }
  }
  ```

- **详细信息**

  `useModel()` 可以用于非单文件组件，例如在使用原始的 `setup()` 函数时。它预期的第一个参数是 `props` 对象，第二个参数是 model 名称。可选的第三个参数可以用于为生成的 model ref 声明自定义的 getter 和 setter。请注意，与 `defineModel()` 不同，你需要自己声明 props 和 emits。

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

返回一个浅层 ref，其值将与模板中的具有匹配 ref attribute 的元素或组件同步。

- **类型**

  ```ts
  function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
  ```

- **示例**

  ```vue
  <script setup>
  import { useTemplateRef, onMounted } from 'vue'

  const inputRef = useTemplateRef('input')

  onMounted(() => {
    inputRef.value.focus()
  })
  </script>

  <template>
    <input ref="input" />
  </template>
  ```

- **参考**
  - [指南 - 模板引用](/guide/essentials/template-refs)
  - [指南 - 为模板引用标注类型](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [指南 - 为组件模板引用标注类型](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

用于为无障碍属性或表单元素生成每个应用内唯一的 ID。

- **类型**

  ```ts
  function useId(): string
  ```

- **示例**

  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">Name:</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```

- **详细信息**

  `useId()` 生成的每个 ID 在每个应用内都是唯一的。它可以用于为表单元素和无障碍属性生成 ID。在同一个组件中多次调用会生成不同的 ID；同一个组件的多个实例调用 `useId()` 也会生成不同的 ID。

  `useId()` 生成的 ID 在服务器端和客户端渲染之间是稳定的，因此可以安全地在 SSR 应用中使用，不会导致激活不匹配。

  如果同一页面上有多个 Vue 应用实例，可以通过 [`app.config.idPrefix`](/api/application#app-config-idprefix) 为每个应用提供一个 ID 前缀，以避免 ID 冲突。
