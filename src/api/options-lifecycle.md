# 生命周期选项 {#options-lifecycle}

:::info 参考
对于生命周期钩子的通用使用方法，请看[指南 - 生命周期钩子](/guide/essentials/lifecycle)
:::

## beforeCreate {#beforecreate}

在组件实例初始化完成之后立即调用。

- **类型**

  ```ts
  interface ComponentOptions {
    beforeCreate?(this: ComponentPublicInstance): void
  }
  ```

- **详细信息**

  会在实例初始化完成、props 解析之后、`data()` 和 `computed` 等选项处理之前立即调用。

  注意，组合式 API 中的 `setup()` 钩子会在所有选项式 API 钩子之前调用，`beforeCreate()` 也不例外。

## created {#created}

在组件实例处理完所有与状态相关的选项后调用。

- **类型**

  ```ts
  interface ComponentOptions {
    created?(this: ComponentPublicInstance): void
  }
  ```

- **详细信息**

  当这个钩子被调用时，以下内容已经设置完成：响应式数据、计算属性、方法和侦听器。然而，此时挂载阶段还未开始，因此 `$el` 属性仍不可用。

## beforeMount {#beforemount}

在组件被挂载之前调用。

- **类型**

  ```ts
  interface ComponentOptions {
    beforeMount?(this: ComponentPublicInstance): void
  }
  ```

- **详细信息**

  当这个钩子被调用时，组件已经完成了其响应式状态的设置，但还没有创建 DOM 节点。它即将首次执行 DOM 渲染过程。

  **这个钩子在服务端渲染时不会被调用。**

## mounted {#mounted}

在组件被挂载之后调用。

- **类型**

  ```ts
  interface ComponentOptions {
    mounted?(this: ComponentPublicInstance): void
  }
  ```

- **详细信息**

  组件在以下情况下被视为已挂载：

  - 所有同步子组件都已经被挂载。(不包含异步组件或 `<Suspense>` 树内的组件)

  - 其自身的 DOM 树已经创建完成并插入了父容器中。注意仅当根容器在文档中时，才可以保证组件 DOM 树也在文档中。

  这个钩子通常用于执行需要访问组件所渲染的 DOM 树相关的副作用，或是在[服务端渲染应用](/guide/scaling-up/ssr)中用于确保 DOM 相关代码仅在客户端被调用。

  **这个钩子在服务端渲染时不会被调用。**

## beforeUpdate {#beforeupdate}

在组件即将因为一个响应式状态变更而更新其 DOM 树之前调用。

- **类型**

  ```ts
  interface ComponentOptions {
    beforeUpdate?(this: ComponentPublicInstance): void
  }
  ```

- **详细信息**

  这个钩子可以用来在 Vue 更新 DOM 之前访问 DOM 状态。在这个钩子中更改状态也是安全的。

  **这个钩子在服务端渲染时不会被调用。**

## updated {#updated}

在组件因为一个响应式状态变更而更新其 DOM 树之后调用。

- **类型**

  ```ts
  interface ComponentOptions {
    updated?(this: ComponentPublicInstance): void
  }
  ```

- **详细信息**

  父组件的更新钩子将在其子组件的更新钩子之后调用。

  这个钩子会在组件的任意 DOM 更新后被调用，这些更新可能是由不同的状态变更导致的。如果你需要在某个特定的状态更改后访问更新后的 DOM，请使用 [nextTick()](/api/general#nexttick) 作为替代。

  **这个钩子在服务端渲染时不会被调用。**

  :::warning
  不要在 updated 钩子中更改组件的状态，这可能会导致无限的更新循环！
  :::

## beforeUnmount {#beforeunmount}

在一个组件实例被卸载之前调用。

- **类型**

  ```ts
  interface ComponentOptions {
    beforeUnmount?(this: ComponentPublicInstance): void
  }
  ```

- **详细信息**

  当这个钩子被调用时，组件实例依然还保有全部的功能。

  **这个钩子在服务端渲染时不会被调用。**

## unmounted {#unmounted}

在一个组件实例被卸载之后调用。

- **类型**

  ```ts
  interface ComponentOptions {
    unmounted?(this: ComponentPublicInstance): void
  }
  ```

- **详细信息**

  一个组件在以下情况下被视为已卸载：

  - 其所有子组件都已经被卸载。

  - 所有相关的响应式作用 (渲染作用以及 `setup()` 时创建的计算属性和侦听器) 都已经停止。

  可以在这个钩子中手动清理一些副作用，例如计时器、DOM 事件监听器或者与服务器的连接。

  **这个钩子在服务端渲染时不会被调用。**

## errorCaptured {#errorcaptured}

在捕获了后代组件传递的错误时调用。

- **类型**

  ```ts
  interface ComponentOptions {
    errorCaptured?(
      this: ComponentPublicInstance,
      err: unknown,
      instance: ComponentPublicInstance | null,
      info: string
    ): boolean | void
  }
  ```

- **详细信息**

  错误可以从以下几个来源中捕获：

  - 组件渲染
  - 事件处理器
  - 生命周期钩子
  - `setup()` 函数
  - 侦听器
  - 自定义指令钩子
  - 过渡钩子

  这个钩子带有三个实参：错误对象、触发该错误的组件实例，以及一个说明错误来源类型的信息字符串。

  你可以在 `errorCaptured()` 中更改组件状态来为用户显示一个错误状态。然而重要的是，不要让错误状态渲染为导致本次错误的内容，否则组件就会进入无限的渲染循环中。

  这个钩子可以通过返回 `false` 来阻止错误继续向上传递。请看下方的传递细节介绍。

  **错误传递规则**

  - 默认情况下，所有的错误都会被发送到应用级的 [`app.config.errorHandler`](/api/application#app-config-errorhandler) (前提是这个函数已经定义)，这样这些错误都能在一个统一的地方报告给分析服务。

  - 如果组件的继承链或组件链上存在多个 `errorCaptured` 钩子，对于同一个错误，这些钩子会被按从底至上的顺序一一调用。这个过程被称为“向上传递”，类似于原生 DOM 事件的冒泡机制。

  - 如果 `errorCaptured` 钩子本身抛出了一个错误，那么这个错误和原来捕获到的错误都将被发送到 `app.config.errorHandler`。

  - `errorCaptured` 钩子可以通过返回 `false` 来阻止错误继续向上传递。即表示“这个错误已经被处理了，应当被忽略”，它将阻止其他的 `errorCaptured` 钩子或 `app.config.errorHandler` 因这个错误而被调用。

## renderTracked <sup class="vt-badge dev-only" /> {#rendertracked}

在一个响应式依赖被组件的渲染作用追踪后调用。

**这个钩子仅在开发模式下可用，且在服务器端渲染期间不会被调用。**

- **类型**

  ```ts
  interface ComponentOptions {
    renderTracked?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **参考**[深入响应式系统](/guide/extras/reactivity-in-depth)

## renderTriggered <sup class="vt-badge dev-only" /> {#rendertriggered}

在一个响应式依赖被组件触发了重新渲染之后调用。

**这个钩子仅在开发模式下可用，且在服务器端渲染期间不会被调用。**

- **类型**

  ```ts
  interface ComponentOptions {
    renderTriggered?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }
  ```

- **参考**[深入响应式系统](/guide/extras/reactivity-in-depth)

## activated {#activated}

若组件实例是 [`<KeepAlive>`](/api/built-in-components#keepalive) 缓存树的一部分，当组件被插入到 DOM 中时调用。

**这个钩子在服务端渲染时不会被调用。**

- **类型**

  ```ts
  interface ComponentOptions {
    activated?(this: ComponentPublicInstance): void
  }
  ```

- **参考**[指南 - 被缓存实例的生命周期](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## deactivated {#deactivated}

若组件实例是 [`<KeepAlive>`](/api/built-in-components#keepalive) 缓存树的一部分，当组件从 DOM 中被移除时调用。

**这个钩子在服务端渲染时不会被调用。**

- **类型**

  ```ts
  interface ComponentOptions {
    deactivated?(this: ComponentPublicInstance): void
  }
  ```

- **参考**[指南 - 被缓存实例的生命周期](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## serverPrefetch <sup class="vt-badge" data-text="SSR only" /> {#serverprefetch}

当组件实例在服务器上被渲染之前要完成的异步函数。

- **类型**

  ```ts
  interface ComponentOptions {
    serverPrefetch?(this: ComponentPublicInstance): Promise<any>
  }
  ```

- **详细信息**

  如果这个钩子返回了一个 Promise，服务端渲染会在渲染该组件前等待该 Promise 完成。

  这个钩子仅会在服务端渲染中执行，可以用于执行一些仅在服务端才有的数据抓取过程。

- **示例**

  ```js
  export default {
    data() {
      return {
        data: null
      }
    },
    async serverPrefetch() {
      // 组件会作为初次请求的一部分被渲染
      // 会在服务端预抓取数据，因为这比客户端更快
      this.data = await fetchOnServer(/* ... */)
    },
    async mounted() {
      if (!this.data) {
        // 如果数据在挂载时是 null，这意味着这个组件
        // 是在客户端动态渲染的，请另外执行一个
        // 客户端请求作为替代
        this.data = await fetchOnClient(/* ... */)
      }
    }
  }
  ```

- **参考**[服务端渲染](/guide/scaling-up/ssr)
