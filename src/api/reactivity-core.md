# 响应式 API：核心 {#reactivity-api-core}

:::info 参考
要更好地了解响应式 API，推荐阅读下面几个指南中的章节：

- [响应式基础](/guide/essentials/reactivity-fundamentals) (with the API preference set to Composition API)
- [深入响应式系统](/guide/extras/reactivity-in-depth)
  :::

## ref() {#ref}

接受一个内部值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 `.value`。

- **类型**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **详细信息**

  ref 对象是可更改的，也就是说你可以为 `.value` 赋予新的值。它也是响应式的，即所有对 `.value` 的操作都将被追踪，并且写操作会触发与之相关的副作用。

  如果将一个对象赋值给 ref，那么这个对象将通过 [reactive()](#reactive) 转为具有深层次响应式的对象。这也意味着如果对象中包含了嵌套的 ref，它们将被深层地解包。

  若要避免这种深层次的转换，请使用 [`shallowRef()`](./reactivity-advanced#shallowref) 来替代。

- **示例**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value++
  console.log(count.value) // 1
  ```

- **参考**
  - [指南 - `ref()` 的响应式基础](/guide/essentials/reactivity-fundamentals#reactive-variables-with-ref)
  - [指南 - 为 `ref()` 标注类型](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

## computed() {#computed}

接受一个 getter 函数，返回一个只读的响应式 [ref](#ref) 对象。该 ref 通过 `.value` 暴露 getter 函数的返回值。它也可以接受一个带有 `get` 和 `set` 函数的对象来创建一个可写的 ref 对象。

- **类型**

  ```ts
  // 只读
  function computed<T>(
    getter: () => T,
    // 查看下方的 "计算属性调试" 链接
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // 可写的
  function computed<T>(
    options: {
      get: () => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

- **示例**

  创建一个只读的计算属性 ref：

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)

  console.log(plusOne.value) // 2

  plusOne.value++ // 错误
  ```

  创建一个可写的计算属性 ref：

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1
    }
  })

  plusOne.value = 1
  console.log(count.value) // 0
  ```

  调试：

  ```js
  const plusOne = computed(() => count.value + 1, {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **参考**
  - [指南 - 计算属性](/guide/essentials/computed)
  - [指南 - 计算属性调试](/guide/extras/reactivity-in-depth#computed-debugging)
  - [指南 - 为 `computed()` 标注类型](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />

## reactive() {#reactive}

返回一个对象的响应式代理。

- **类型**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **详细信息**

  响应式转换是“深层”的：它会影响到所有嵌套的属性。一个响应式对象也将深层地解包任何 [ref](#ref) 属性，同时保持响应性。

  值得注意的是，当访问到某个响应式数组或 `Map` 这样的原生集合类型中的 ref 元素时，不会执行 ref 的解包。

  若要避免深层响应式转换，只想保留对这个对象顶层次访问的响应性，请使用 [shallowReactive()](./reactivity-advanced#shallowreactive) 作替代。

  返回的对象以及其中嵌套的对象都会通过 [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 包裹，因此**不等于**源对象，建议只使用响应式代理，避免使用原始对象。

- **示例**

  创建一个响应式对象：

  ```js
  const obj = reactive({ count: 0 })
  obj.count++
  ```

  ref 的解包：

  ```ts
  const count = ref(1)
  const obj = reactive({ count })

  // ref 会被解包
  console.log(obj.count === count.value) // true

  // 会更新 `obj.count`
  count.value++
  console.log(count.value) // 2
  console.log(obj.count) // 2

  // 也会更新 `count` ref
  obj.count++
  console.log(obj.count) // 3
  console.log(count.value) // 3
  ```

	注意当访问到某个响应式数组或 `Map` 这样的原生集合类型中的 ref 元素时，**不会**执行 ref 的解包：

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // 这里需要 .value
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // 这里需要 .value
  console.log(map.get('count').value)
  ```

  将一个 [ref](#ref) 赋值给一个 `reactive` 属性时，该 ref 会被自动解包：

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **参考**
  - [指南 - 响应式基础](/guide/essentials/reactivity-fundamentals)
  - [指南 - 为 `reactive()` 标注类型](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

## readonly() {#readonly}

接受一个对象 (不论是响应式还是普通的) 或是一个 [ref](#ref)，返回一个原值的只读代理。

- **类型**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **详细信息**

  只读代理是深层的：对任何嵌套属性的访问都将是只读的。它的 ref 解包行为与 `reactive()` 相同，但解包得到的值是只读的。

  要避免深层级的转换行为，请使用 [shallowReadonly()](./reactivity-advanced#shallowreadonly) 作替代。

- **示例**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // 用来做响应性追踪
    console.log(copy.count)
  })

  // 更改源属性会触发其依赖的侦听器
  original.count++

  // 更改该只读副本将会失败，并会得到一个警告
  copy.count++ // warning!
  ```

## watchEffect() {#watcheffect}

立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。

- **类型**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): StopHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **详细信息**

  第一个参数就是要运行的副作用函数。这个副作用函数的参数也是一个函数，用来注册清理回调。清理回调会在该副作用下一次执行前被调用，可以用来清理无效的副作用，例如等待中的异步请求 (参见下面的示例)。

  第二个参数是一个可选的选项，可以用来调整副作用的刷新时机或调试副作用的依赖。

  默认情况下，侦听器将在组件渲染之前执行。设置 `flush: 'post'` 将会使侦听器延迟到组件渲染之后再执行。详见[回调的触发时机](/guide/essentials/watchers#callback-flush-timing)。在某些特殊情况下 (例如要使缓存失效)，可能有必要在响应式依赖发生改变时立即触发侦听器。这可以通过设置 `flush: 'sync'` 来实现。然而，该设置应谨慎使用，因为如果有多个属性同时更新，这将导致一些性能和数据一致性的问题。

  返回值是一个用来停止该副作用的函数。

- **示例**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> 输出 0

  count.value++
  // -> 输出 1
  ```

  副作用清除：

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(id.value)
    // `cancel` 会在 `id` 更改时调用
    // 以便取消之前
    // 未完成的请求
    onCleanup(cancel)
    data.value = await response
  })
  ```

  停止侦听器：

  ```js
  const stop = watchEffect(() => {})

  // 当不再需要此侦听器时:
  stop()
  ```

  选项：

  ```js
  watchEffect(() => {}, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **参考**
  - [指南 - 侦听器](/guide/essentials/watchers#watcheffect)
  - [指南 - 侦听器调试](/guide/extras/reactivity-in-depth#watcher-debugging)

## watchPostEffect() {#watchposteffect}

[`watchEffect()`](#watcheffect) 使用 `flush: 'post'` 选项时的别名。

## watchSyncEffect() {#watchsynceffect}

[`watchEffect()`](#watcheffect) 使用 `flush: 'sync'` 选项时的别名。

## watch() {#watch}

侦听一个或多个响应式数据源，并在数据源变化时调用所给的回调函数。

- **类型**

  ```ts
  // 侦听单个来源
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): StopHandle

  // 侦听多个来源
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): StopHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // getter
    | T extends object
    ? T
    : never // 响应式对象

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // 默认：false
    deep?: boolean // 默认：false
    flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > 为了便于阅读，对类型进行了简化。

- **详细信息**

  `watch()` 默认是懒侦听的，即仅在侦听源发生变化时才执行回调函数。

  第一个参数是侦听器的**源**。这个来源可以是以下几种：

  - 一个函数，返回一个值
  - 一个 ref
  - 一个响应式对象
  - ...或是由以上类型的值组成的数组

  第二个参数是在发生变化时要调用的回调函数。这个回调函数接受三个参数：新值、旧值，以及一个用于注册副作用清理的回调函数。该回调函数会在副作用下一次重新执行前调用，可以用来清除无效的副作用，例如等待中的异步请求。

	当侦听多个来源时，回调函数接受两个数组，分别对应来源数组中的新值和旧值。

  第三个可选的参数是一个对象，支持以下这些选项：

  - **`immediate`**：在侦听器创建时立即触发回调。第一次调用时旧值是 `undefined`。
  - **`deep`**：如果源是对象，强制深度遍历，以便在深层级变更时触发回调。参考[深层侦听器](/guide/essentials/watchers#deep-watchers)。
  - **`flush`**：调整回调函数的刷新时机。参考[回调的刷新时机](/guide/essentials/watchers#callback-flush-timing)及 [`watchEffect()`](/api/reactivity-core#watcheffect)。
  - **`onTrack / onTrigger`**：调试侦听器的依赖。参考[调试侦听器](/guide/extras/reactivity-in-depth#watcher-debugging)。

  与 [`watchEffect()`](#watcheffect) 相比，`watch()` 使我们可以：

  - 懒执行副作用；
  - 更加明确是应该由哪个状态触发侦听器重新执行；
  - 可以访问所侦听状态的前一个值和当前值。

- **示例**

  侦听一个 getter 函数：

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  侦听一个 ref：

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  当侦听多个来源时，回调函数接受两个数组，分别对应来源数组中的新值和旧值：

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```

  当使用 getter 函数作为源时，回调只在此函数的返回值变化时才会触发。如果你想让回调在深层级变更时也能触发，你需要使用 `{ deep: true }` 强制侦听器进入深层级模式。在深层级模式时，如果回调函数由于深层级的变更而被触发，那么新值和旧值将是同一个对象。

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```

  当直接侦听一个响应式对象时，侦听器会自动启用深层模式：

  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* 深层级变更状态所触发的回调 */
  })
  ```

  `watch()` 和 [`watchEffect()`](#watcheffect) 享有相同的刷新时机和调试选项：

  ```js
  watch(source, callback, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

  停止侦听器：

  ```js
  const stop = watch(source, callback)

  // 当已不再需要该侦听器时：
  stop()
  ```

  副作用清理：

  ```js
  watch(id, async (newId, oldId, onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // 当 `id` 变化时，`cancel` 将被调用，
    // 取消之前的未完成的请求
    onCleanup(cancel)
    data.value = await response
  })
  ```

- **参考**

  - [指南 - 侦听器](/guide/essentials/watchers)
  - [指南 - 侦听器调试](/guide/extras/reactivity-in-depth#watcher-debugging)
