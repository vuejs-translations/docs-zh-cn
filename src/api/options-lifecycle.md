# 生命周期选项 {#options-lifecycle}

:::info 相关内容
对于生命周期钩子的通用使用方法，请看 [指南 - 生命周期钩子](/guide/essentials/lifecycle.html)
:::

## beforeCreate {#beforecreate}

在组件实例初始化之前调用。

- **类型**

  ```ts
  interface ComponentOptions {
    beforeCreate?(this: ComponentPublicInstance): void
  }
  ```

- **详细信息**

  会在组件被初始化、 props 解析后的那一刻、且是处理其他如 `data()` 或 `computed`之类的属性之前被立刻调用。

  注意，组合式 API 的 `setup()` 钩子会在任何选项式 API 钩子之前调用，即使是 `beforeCreate()`。

## created {#created}

在组件实例处理完所有与状态相关的选项后调用。

- **类型**

  ```ts
  interface ComponentOptions {
    created?(this: ComponentPublicInstance): void
  }
  ```

- **详细信息**

  当这个钩子被调用时，接下来的这些内容已经设置完成：响应式数据、计算属性、方法和侦听器。然而，挂载阶段此时仍未开始，因而 `$el` 属性此时还不可用。

## beforeMount {#beforemount}

在组件被挂载之前调用。

- **类型**

  ```ts
  interface ComponentOptions {
    beforeMount?(this: ComponentPublicInstance): void
  }
  ```

- **详细信息**

  当这个钩子被调用时候，组件已经完成了设置其响应式状态，但还没有创建 DOM 节点。它即将首次执行其 DOM 渲染过程。

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

  - 所有其同步子组件都已经背挂载。（不包含异步组件或 `<Suspense>` 树内的组件）

  - 其自身的 DOM 树已经完成创建、插入到了其父容器中。注意仅在根容器也在文档中时才可以保证组件 DOM 树已在文档中。

  这个钩子通常用于执行需要访问组件所渲染的 DOM 树相关的副作用，或是用于约束[服务端渲染应用](/guide/scaling-up/ssr.html)中仅在客户端中与 DOM 相关的代码。

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

在组件即将因为一个响应式状态变更而更新其 DOM 树之后调用。

- **类型**

  ```ts
  interface ComponentOptions {
    updated?(this: ComponentPublicInstance): void
  }
  ```

- **详细信息**

  一个父组件的更新钩子是在其子组件的更新钩子之后调用。

  这个钩子会在组件的任意 DOM 更新后被调用，可能由于不同的状态变更导致的。如果你需要在某个特定的状态更改后访问更新后的 DOM，请使用 [nextTick()](/api/general.html#nexttick) 作替代。

  **这个钩子在服务端渲染时不会被调用。**

  :::warning
  不要在更新钩子中更改组件的状态，这将导致一个无限的更新循环！
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

  - 所有其相关的响应式副作用（渲染作用以及 `setup()` 时创建的计算属性和侦听器）都已经停止。

  可以在这个钩子中手动清理一些副作用，例如计时器、DOM 事件监听器或者与服务器的连接。

  **这个钩子在服务端渲染时不会被调用。**

## errorCaptured {#errorcaptured}

在捕获从子组件上抛的错误时调用。

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

  你可以在 `errorCaptured()` 中更改组件状态来为用户显示一个错误状态。然而，使错误的状态不渲染出原本导致此次出错的内容是很重要的，否则组件就会进入一个无限的渲染循环中。

  这个钩子可以通过返回 `false` 来终止错误继续传播、上抛。请看下方的传播细节介绍。

  **错误传播规则**

  - 默认情况下，所有的错误都会被抛送到应用级的 [`app.config.errorHandler`](/api/application.html#app-config-errorhandler)，前提是已经定义了这个函数，以求这些错误都能在一个统一的位置被报告给一个分析服务。

  - 如果组件的继承链上有多个 `errorCaptured` 钩子存在，对同一个错误所有这些钩子都会调用。

  - 如果 `errorCaptured` 钩子自己就抛出了一个错误，那么不仅是原来捕获到的错误，还有这个新的错误都将被抛送给 `app.config.errorHandler`。

  - 一个 `errorCaptured` 钩子可以通过返回 `false` 来阻止错误继续传播。这即是在表示“这个错误已经被处理了，应该被忽略”，它将阻止任何其他的 `errorCaptured` 钩子或 `app.config.errorHandler` 根据这个错误再被调用。

## renderTracked <sup class="vt-badge dev-only" /> {#rendertracked}

在一个响应式依赖被组件的渲染作用追踪后调用。

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

- **相关内容：** [Reactivity in Depth](/guide/extras/reactivity-in-depth.html)

## renderTriggered <sup class="vt-badge dev-only" /> {#rendertriggered-sup-classvt-badge-dev-only}

在一个响应式依赖被组件触发了重新渲染之后调用。

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

- **相关内容：** [Reactivity in Depth](/guide/extras/reactivity-in-depth.html)

## activated {#activated}

在组件实例作为 [`<KeepAlive>`](/api/built-in-components.html#keepalive) 子树的一部分被缓存、插入到 DOM 中时调用。

**这个钩子在服务端渲染时不会被调用。**

- **类型**

  ```ts
  interface ComponentOptions {
    activated?(this: ComponentPublicInstance): void
  }
  ```

- **相关内容：** [指南 - 被缓存实例的生命周期](/guide/built-ins/keep-alive.html#lifecycle-of-cached-instance)

## deactivated {#deactivated}

在组件实例作为 [`<KeepAlive>`](/api/built-in-components.html#keepalive) 子树的一部分被缓存、从 DOM 中被移除时调用。

**这个钩子在服务端渲染时不会被调用。**

- **类型**

  ```ts
  interface ComponentOptions {
    deactivated?(this: ComponentPublicInstance): void
  }
  ```

- **相关内容：** [指南 - 被缓存实例的生命周期](/guide/built-ins/keep-alive.html#lifecycle-of-cached-instance)

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
        // 客户端请求做替代
        this.data = await fetchOnClient(/* ... */)
      }
    }
  }
  ```

- **相关内容：** [服务端渲染](/guide/scaling-up/ssr.html)
