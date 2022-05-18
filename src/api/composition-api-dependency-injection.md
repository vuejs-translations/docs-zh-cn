# 组合式 API：依赖注入 {#composition-api-brdependency-injection}

## provide() {#provide}

供给一个值，可以被后代组件注入。

- **类型**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **详细信息**

  `provide()` 接受两个参数：第一个参数是要注入的 key，可以是一个字符串或者一个 symbol，第二个参数是要注入的值。

  当使用 TypeScript 时，key 可以是一个被转换为 `InjectionKey` 的 symbol。`InjectionKey` 是一个 Vue 提供的工具类型，继承自 `Symbol`，可以用来同步 `provide()` 和 `inject()` 之间值的类型。

  与注册生命周期钩子的 API 类似，`provide()` 必须在组件的 `setup()` 阶段同步调用。

- **示例**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { fooSymbol } from './injectionSymbols'

  // 供给静态值
  provide('foo', 'bar')

  // 供给响应式的值
  const count = ref(0)
  provide('count', count)

  // 供给时将 Symbol 作为 key
  provide(fooSymbol, count)
  </script>
  ```

- **参考：**
  - [指南 - 依赖注入](/guide/components/provide-inject.html)
  - [指南 - 为 provide/inject 标注类型](/guide/typescript/composition-api.html#typing-provide-inject)

## inject() {#inject}

注入一个由祖先组件或整个应用 (通过 `app.provide()`) 供给的值。

- **类型**

  ```ts
  // 没有默认值
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // 带有默认值
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // 使用工厂函数
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **详细信息**

  第一个参数是注入的 key。Vue 会遍历父组件链，通过匹配 key 来确定所供给的值。如果父组件链上多个组件对同一个 key 供给了值，那么离得更近的组件将会“覆盖”链上更远的组件所供给的值。如果没有能通过 key 匹配到值，`inject()` 将返回 `undefined`，除非提供了一个默认值。

  第二个参数是可选的，即在没有匹配到 key 时使用的默认值。它也可以是一个工厂函数，用来返回某些创建起来比较复杂的值。如果默认值本身就是一个函数，那么你必须将 `false` 作为第三个参数传入，表明这个函数就是默认值，而不是一个工厂函数。

  与注册生命周期钩子的 API 类似，`inject()` 必须在组件的 `setup()` 阶段同步调用。

  当使用 TypeScript 时，key 可以是一个被转换为 `InjectionKey` 的 symbol。`InjectionKey` 是一个 Vue 提供的工具类型，继承自 `Symbol`，可以用来同步 `provide()` 和 `inject()` 之间值的类型。

- **示例**

  假设有一个父组件已经供给了一些值，如前面 `provide()` 的例子中所示：

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { fooSymbol } from './injectionSymbols'

  // 注入值的默认方式
  const foo = inject('foo')

  // 注入响应式的值
  const count = inject('count')

  // 通过 Symbol 类型的 key 注入
  const foo2 = inject(fooSymbol)

  // 注入一个值，若为空则使用提供的默认值
  const bar = inject('foo', 'default value')

  // 注入一个值，若为空则使用提供的工厂函数
  const baz = inject('foo', () => new Map())

  // 注入时为了表明提供的默认值是个函数，需要传入第三个参数
  const fn = inject('function', () => {}, false)
  </script>
  ```

- **参考：**
  - [指南 - 依赖注入](/guide/components/provide-inject.html)
  - [指南 - 为 provide/inject 标注类型](/guide/typescript/composition-api.html#typing-provide-inject)
