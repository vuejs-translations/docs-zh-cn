# 组件实例 {#component-instance}

:::info
本页文档描述了组件公共实例 (即 `this`) 上暴露的内置属性和方法，

本页罗列的所有属性，除了 `$data` 下的嵌套属性之外，都是只读的。
:::

## $data {#data}

从 [`data`](./options-state#data) 选项函数中返回的对象，会被组件赋为响应式。组件实例将会代理对其数据对象的属性访问。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

表示组件当前已解析的 props 对象。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **详细信息**

  这里只包含通过 [`props`](./options-state#props) 选项声明的 props。组件实例将会代理对其 props 对象上属性的访问。

## $el {#el}

该组件实例管理的 DOM 根节点。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $el: Node | undefined
  }
  ```

- **详细信息**

  `$el` 直到组件[挂载完成 (mounted)](./options-lifecycle#mounted) 之前都会是 `undefined`。

  - 对于单一根元素的组件，`$el` 将会指向该根元素。
  - 对于以文本节点为根的组件，`$el` 将会指向该文本节点。
  - 对于以多个元素为根的组件，`$el` 将是一个仅作占位符的 DOM 节点，Vue 使用它来跟踪组件在 DOM 中的位置 (文本节点或 SSR 激活模式下的注释节点)。

  :::tip
  为保持一致性，我们推荐使用[模板引用](/guide/essentials/template-refs)来直接访问元素而不是依赖 `$el`。
  :::

## $options {#options}

已解析的用于实例化当前组件的组件选项。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **详细信息**

  这个 `$options` 对象暴露了当前组件的已解析选项，并且会是以下几种可能来源的合并结果：

  - 全局 mixin
  - 组件 `extends` 的基组件
  - 组件级 mixin

  它通常用于支持自定义组件选项：

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **参考** [`app.config.optionMergeStrategies`](/api/application#app-config-optionmergestrategies)

## $parent {#parent}

当前组件可能存在的父组件实例，如果当前组件是顶层组件，则为 `null`。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

当前组件树的根组件实例。如果当前实例没有父组件，那么这个值就是它自己。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

一个表示父组件所传入[插槽](/guide/components/slots)的对象。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **详细信息**

  通常用于手写[渲染函数](/guide/extras/render-function)，但也可用于检测是否存在插槽。

  每一个插槽都在 `this.$slots` 上暴露为一个函数，返回一个 vnode 数组，同时 key 名对应着插槽名。默认插槽暴露为 `this.$slots.default`。

  如果插槽是一个[作用域插槽](/guide/components/slots#scoped-slots)，传递给该插槽函数的参数可以作为插槽的 prop 提供给插槽。

- **参考**[渲染函数 - 渲染插槽](/guide/extras/render-function#rendering-slots)

## $refs {#refs}

一个包含 DOM 元素和组件实例的对象，通过[模板引用](/guide/essentials/template-refs)注册。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **参考**

  - [模板引用](/guide/essentials/template-refs)
  - [特殊 Attribute - ref](./built-in-special-attributes.md#ref)

## $attrs {#attrs}

一个包含了组件所有透传 attributes 的对象。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **详细信息**

  [透传 Attributes](/guide/components/attrs) 是指由父组件传入，且没有被子组件声明为 props 或是组件自定义事件的 attributes 和事件处理函数。

  默认情况下，若是单一根节点组件，`$attrs` 中的所有属性都是直接自动继承自组件的根元素。而多根节点组件则不会如此，同时你也可以通过配置 [`inheritAttrs`](./options-misc#inheritattrs) 选项来显式地关闭该行为。

- **参考**

  - [透传 Attribute](/guide/components/attrs)

## $watch() {#watch}

用于命令式地创建侦听器的 API。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **详细信息**

  第一个参数是侦听来源。可以是一个组件的属性名的字符串，一个简单的由点分隔的路径字符串，或是一个 getter 函数。

  第二个参数是回调函数。它接收的参数分别是侦听来源的新值、旧值。

  - **`immediate`**：指定在侦听器创建时是否立即触发回调。在第一次调用时旧值为 `undefined`。
  - **`deep`**：指定在侦听来源是一个对象时，是否强制深度遍历，这样回调函数就会在深层级发生变更时被触发。详见[深层侦听器](/guide/essentials/watchers#deep-watchers)。
  - **`flush`**：指定回调函数的刷新时机。详见[回调刷新时机](/guide/essentials/watchers#callback-flush-timing)及 [`watchEffect()`](/api/reactivity-core#watcheffect)。
  - **`onTrack / onTrigger`**：调试侦听器的依赖，详见[侦听器调试](/guide/extras/reactivity-in-depth#watcher-debugging)。

- **示例**

  侦听一个属性名：

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  侦听一个由 `.` 分隔的路径：

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  对更复杂表达式使用 getter 函数：

  ```js
  this.$watch(
    // 每一次这个 `this.a + this.b` 表达式生成一个
    // 不同的结果，处理函数都会被调用
    // 这就好像我们在侦听一个计算属性
    // 而不定义计算属性本身。
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  停止该侦听器：

  ```js
  const unwatch = this.$watch('a', cb)

  // 之后……
  unwatch()
  ```

- **参考**
  - [选项 - `watch`](/api/options-state#watch)
  - [指南 - 侦听器](/guide/essentials/watchers)

## $emit() {#emit}

在当前组件触发一个自定义事件。任何额外的参数都会传递给事件监听器的回调函数。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **示例**

  ```js
  export default {
    created() {
      // 仅触发事件
      this.$emit('foo')
      // 带有额外的参数
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **参考**

  - [组件 - 事件](/guide/components/events)
  - [`emits` 选项](./options-state#emits)

## $forceUpdate() {#forceupdate}

强制该组件重新渲染。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **详细信息**

  鉴于 Vue 的全自动响应性系统，这个功能应该很少会被用到。唯一可能需要它的情况是，你使用高阶响应式 API 显式创建了一个非响应式的组件状态。

## $nextTick() {#nexttick}

绑定在实例上的 [`nextTick()`](./general#nexttick) 函数。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **详细信息**

  和全局版本的 `nextTick()` 的唯一区别就是组件传递给 `this.$nextTick()` 的回调函数会带上 `this` 上下文，其绑定了当前组件实例。

- **参考** [`nextTick()`](./general#nexttick)
