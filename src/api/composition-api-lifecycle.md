# 组合式 API：生命周期钩子 {#composition-api-lifecycle-hooks}

:::info 使用方式注意
所有罗列在本页的 API 都应该在组件的 `setup()` 阶段被同步调用。相关细节请看 [指南 - 生命周期钩子](/guide/essentials/lifecycle.html)。
:::

## onMounted()  {#onmounted}

注册一个在组件挂载完成后执行的回调函数。

- **类型**

  ```ts
  function onMounted(callback: () => void): void
  ```

- **详细信息**

  组件在以下情况下被视为已挂载：

  - 它的所有同步子组件都已经被挂载（不包含异步组件或 `<Suspense>` 树内的组件）。

  - 它的 DOM 树已被创建并插入到父容器中。注意，只有当应用程序的根容器也在文档中时，它才能保证组件的 DOM 树在文档中。

  这个钩子常常用于需要访问到组件已经渲染好的 DOM 元素之时，或是为了在一个 [服务端渲染应用](/guide/scaling-up/ssr.html) 中限制 DOM 相关的代码。

  **这个钩子在服务器端渲染期间不会被调用。**

- **示例**

  通过模板 ref 访问一个元素：

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue'

  const el = ref()

  onMounted(() => {
    el.value // <div>
  })
  </script>

  <template>
    <div ref="el"></div>
  </template>
  ```

## onUpdated()  {#onupdated}

注册一个回调函数，在组件由于响应性状态改变而更新了 DOM 树后调用。

- **类型**

  ```ts
  function onUpdated(callback: () => void): void
  ```

- **详细信息**

  父组件的更新钩子会在其子组件的更新钩子之后被调用。

  这个钩子在组件的任何 DOM 更新之后被调用，这可能是由不同的状态变化引起的。请如果你需要在一个特定的状态改变后访问更新好的 DOM，使用 [nextTick()](/api/general.html#nextTick) 替代。

  **这个钩子在服务器端渲染期间不会被调用。**

  :::warning
  不要在更新的钩子中突变组件的状态，这很可能会导致无限的更新循环。
  :::

- **示例**

  访问更新后的 DOM

  ```vue
  <script setup>
  import { ref, onUpdated } from 'vue'

  const count = ref(0)

  onUpdated(() => {
    // 文本内哦让应该与当前的 `count.value` 一致
    console.log(document.getElementById('count').textContent)
  })
  </script>

  <template>
    <button id="count" @click="count++">{{ count }}</button>
  </template>
  ```

## onUnmounted()  {#onunmounted}

注册一个要在组件卸载后调用的回调。

- **类型**

  ```ts
  function onUnmounted(callback: () => void): void
  ```

- **详细信息**

  组件在以下情况下被认为是卸载的:

  - 它的所有子组件都已卸载。

  - 所有相关的响应式副作用（渲染效果和在 `setup()` 期间创建的计算属性/侦听器）都已经停止。

  可以使用此钩子清除手动创建的副作用，如定时器、DOM事件监听器或服务器连接。

  **这个钩子在服务器端渲染期间不会被调用。**

- **示例**

  ```vue
  <script setup>
  import { onMounted, onUnmounted } from 'vue'

  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      // ...
    })
  })

  onUnmounted(() => clearInterval(intervalId))
  </script>
  ```

## onBeforeMount()  {#onbeforemount}

注册一个钩子在组件被挂载之前被调用。

- **类型**

  ```ts
  function onBeforeMount(callback: () => void): void
  ```

- **详细信息**

  当这个钩子被调用时，组件已经完成了其响应状态的设置，但是还没有创建 DOM 节点。它将第一次执行 DOM 渲染效果。

  **这个钩子在服务器端渲染期间不会被调用。**

## onBeforeUpdate()  {#onbeforeupdate}

注册一个钩子，在组件因为响应式状态改变而要更新 DOM 树之前调用。

- **类型**

  ```ts
  function onBeforeUpdate(callback: () => void): void
  ```

- **详细信息**

  这个钩子可以在 Vue 更新 DOM 之前访问 DOM 状态。在这个钩子中修改组件状态也是安全的。

  **这个钩子在服务器端渲染期间不会被调用。**

## onBeforeUnmount()  {#onbeforeunmount}

注册一个钩子，在组件实例被卸载之前调用。

- **类型**

  ```ts
  function onBeforeUnmount(callback: () => void): void
  ```

- **详细信息**

  当这个钩子被调用时，组件实例的功能仍然是完整的。

  **这个钩子在服务器端渲染期间不会被调用。**

## onErrorCaptured()  {#onerrorcaptured}

注册一个钩子，当从下级组件抛上来的错误被捕获时被调用。

- **类型**

  ```ts
  function onErrorCaptured(callback: ErrorCapturedHook): void

  type ErrorCapturedHook = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => boolean | void
  ```

- **详细信息**

  错误可以从以下来源捕获:

  - 组件渲染
  - 事件处理器
  - 生命周期钩子
  - `setup()` 函数
  - 侦听器
  - 自定义指令钩子
  - 过渡钩子

  该钩子接收三个参数：错误对象、触发该错误的组件实例和指定错误源类型的信息字符串。

  你可以在 `errorCaptured()` 之中改变组件状态来展示一个错误给用户。然而，更重要的是，错误状态不应该呈现导致错误的原始内容。否则，组件将被扔进一个无限渲染循环。

  若在此钩子中返回 `false` 则会阻止错误继续传播。见下面的错误传播细节描述。

  **错误传播规则**

  - 默认情况下，所有的错误都会一直向上抛，直到被应用级的 [`app.config.errorHandler`](/api/application.html#app-config-errorhandler) 捕获（前提是这个处理函数已被定义）。这样所有的错误都可以被上报给一处统计服务用于分析。

  - 如果有多个 `errorCaptured` 钩子存在于一个组件的继承链或父组件链上，那么对同一个错误，它们中每一个都会被调用。

  - 如果该 `errorCaptured` 钩子自己也抛出了一个错误，则会和之前捕获到的错误一起被上抛至 `app.config.errorHandler`。

  - 一个 `errorCaptured` 钩子可以返回 `false` 来阻止错误继续传播。这实际上就是在说“这个错误已经被处理，可以被忽略”。它会组织任何其他的 `errorCaptured` 钩子或 `app.config.errorHandler` 对此错误进行调用。

## onRenderTracked() <sup class="vt-badge dev-only" />  {#onrendertracked}

注册一个调试钩子，当组件的渲染效果跟踪了一个响应性依赖时调用。

**这个钩子仅在开发模式下可用，且在服务器端渲染期间不会被调用。**

- **类型**

  ```ts
  function onRenderTracked(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **相关内容：** [Reactivity in Depth](/guide/extras/reactivity-in-depth.html)

## onRenderTriggered() <sup class="vt-badge dev-only" />  {#onrendertriggered}

注册一个调试钩子，当响应性依赖触发组件的渲染效果重新运行时调用。

**这个钩子仅在开发模式下可用，且在服务器端渲染期间不会被调用。**

- **类型**

  ```ts
  function onRenderTriggered(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

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

## onActivated()  {#onactivated}

注册一个回调函数，当组件实例作为树的一部分被 [`<KeepAlive>`](/api/built-in-components.html#keepalive) 缓存，被插入到 DOM 中时调用。

**这个钩子在服务器端渲染期间不会被调用。**

- **类型**

  ```ts
  function onActivated(callback: () => void): void
  ```

- **相关内容：** [指南 - 缓存实例的生命周期](/guide/built-ins/keep-alive.html#lifecycle-of-cached-instance)

## onDeactivated()  {#ondeactivated}

注册一个回调函数，当组件实例作为树的一部分被 [`<KeepAlive>`](/api/built-in-components.html#keepalive) 缓存，从 DOM 中移除时调用。

**这个钩子在服务器端渲染期间不会被调用。**

- **类型**

  ```ts
  function onDeactivated(callback: () => void): void
  ```

- **相关内容：** [Guide - Lifecycle of Cached Instance](/guide/built-ins/keep-alive.html#lifecycle-of-cached-instance)

## onServerPrefetch() <sup class="vt-badge" data-text="SSR only" />  {#onserverprefetch}

在组件实例在服务器上渲染之前，注册一个要完成的异步函数。

- **类型**

  ```ts
  function onServerPrefetch(callback: () => Promise<any>): void
  ```

- **详细信息**

  如果回调返回一个Promise，服务器渲染器将在渲染组件之前等待，直到 Promise 完成。

  这个钩子只在服务器端渲染期间被调用，可以用来抓取服务器相关的数据。

- **示例**

  ```vue
  <script setup>
  import { ref, onServerPrefetch, onMounted } from 'vue'

  const data = ref(null)

  onServerPrefetch(async () => {
    // 组件作为初始请求的一部分被渲染
    // 在服务器上预抓取数据，因为它比在客户端上更快。
    data.value = await fetchOnServer(/* ... */)
  })

  onMounted(async () => {
    if (!data.value) {
      // 如果数据在挂载时为空值，这意味着该组件
      // 是在客户端动态渲染的。将转而执行
      // 一个客户端侧的抓取请求
      data.value = await fetchOnClient(/* ... */)
    }
  })
  </script>
  ```

- **相关内容：** [服务端渲染](/guide/scaling-up/ssr.html)
