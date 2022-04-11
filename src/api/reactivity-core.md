# 响应性 API：核心 {#reactivity-api-core} 

:::info 相关内容
要更好地了解响应性 API，推荐阅读下面几个指南中的章节：

- [响应性基础](/guide/essentials/reactivity-fundamentals.html) (with the API preference set to Composition API)
- [深入响应性系统](/guide/extras/reactivity-in-depth.html)
  :::

## ref()  {#ref}

接受一个值，将其用作内部值来返回一个响应式的、可更改的 ref 对象。只有一个属性 `.value` 用来指向内部的值。

- **类型**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **详细信息**

  ref 对象是可更改的，也就是说你可以为 `.value` 赋予新的值。它也是响应式的，即所有对 `.value` 的操作都将被追踪，并且写操作会触发相应的副作用。

  如果将一个对象赋值给 ref，那么这个对象将通过 [reactive()](#reactive) 转为具有深层次响应性的对象。这也意味着如果对象中包含了嵌套的 ref，它们将被深层地解包。

  若要避免这种深层次的转换，请使用 [`shallowRef()`](./reactivity-advanced.html#shallowref) 来替代。

- **示例**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value++
  console.log(count.value) // 1
  ```

- **相关内容：**
  - [指南 - `ref()` 定义响应式变量](/guide/essentials/reactivity-fundamentals.html#reactive-variables-with-ref)
  - [指南 - 为 `ref()` 标注类型](/guide/typescript/composition-api.html#typing-ref)

## computed() {#computed}

接受一个计算函数，返回一个只读的响应式 [ref](#ref) 对象，即计算函数的返回值。它也可以接受一个带有 `get` 和 `set` 函数的对象来创建一个可写的 ref 对象。

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

- **相关内容：**
  - [指南 - 计算属性](/guide/essentials/computed.html)
  - [指南 - 计算属性调试](/guide/extras/reactivity-in-depth.html#computed-debugging)
  - [指南 - 为 `computed()` 标注类型](/guide/typescript/composition-api.html#typing-computed)

## reactive() {#reactive}

返回一个对象的响应式代理。

- **类型**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **详细信息**

  响应式转换时“深层”的：它会影响到内部所有层次的属性。一个响应式对象也可以深层地解包任何为 [ref](#ref) 的属性，同时保持响应性。

  同时值得注意的是，当访问到某个响应式数组或 `Map` 这样的原生集合类型中为 ref 的元素时，不会执行 ref 的解包。

  若为避免深层响应式转换，只想保留对这个对象顶层次访问的响应性，请使用 [shallowReactive()](./reactivity-advanced.html#shallowreactive) 作替代。

  返回的对象以及其中嵌套的对象都会通过 [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 包裹，因此 **不等于** 源对象，建议只使用响应式代理，避免依赖于原始对象。

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

  注意当访问到某个响应式数组或 `Map` 这样的原生集合类型中为 ref 的元素时，**不会**执行 ref 的解包：

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // 这里需要 .value
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // 这里需要 .value
  console.log(map.get('count').value)
  ```

  将一个 [ref](#ref) 赋值给为一个 `reactive` 属性时，该 ref 会被自动解包：

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **相关内容：**
  - [指南 - 响应式基础](/guide/essentials/reactivity-fundamentals.html)
  - [指南 - 为 `reactive()` 标注类型](/guide/typescript/composition-api.html#typing-reactive)

## readonly()  {#readonly}

接受一个对象（不论是响应式还是一般的）或是一个 [ref](#ref)，返回一个原值的只读代理。

- **类型**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **详细信息**

  一个只读的代理是深层生效的，对任何内部层级的属性的访问都是只读的。它与 `reactive()` 有相同的 ref 解包行为，而解包得的值也同样是只读的。

  要避免深层级的转换行为，请使用 [shallowReadonly()](./reactivity-advanced.html#shallowreadonly) 作替代。

- **示例**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // 用来做响应性追踪
    console.log(copy.count)
  })

  // 更改源属性会触发依赖其只读副本的侦听器
  original.count++

  // 更改该只读副本将会失败，并会得到一个警告
  copy.count++ // warning!
  ```

## watchEffect()  {#watcheffect}

立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。

- **类型**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): StopHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **详细信息**

  第一个函数就是要运行的副作用函数。这个副作用函数的参数也是一个函数，用来注册清理回调。清理回调会在该副作用下一次执行前被调用，可以用来清理无效的副作用，例如等待中的异步请求（参见下面的示例）。

  第二个参数是一个可选的选项，可以用来调整副作用的刷新时机或调试副作用的依赖。

  返回值是一个用来停止该副作用的函数。

- **示例**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> logs 0

  count.value++
  // -> logs 1
  ```

  Side effect cleanup:

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(id.value)
    // `cancel` 会在 `id` 更改时调用
    // 因此，之前的等待中的请求
    // 若没有完成将被取消
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

  Options:

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

- **相关内容**:
  - [指南 - 侦听器](/guide/essentials/watchers.html#watcheffect)
  - [指南 - 侦听器调试](/guide/extras/reactivity-in-depth.html#watcher-debugging)

## watchPostEffect()  {#watchposteffect}

[`watchEffect()`](#watcheffect) 使用 `flush: 'post'` 选项时的别名。

## watchSyncEffect()  {#watchsynceffect}

[`watchEffect()`](#watcheffect) 使用 `flush: 'sync'` 选项时的别名。

## watch()  {#watch}

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

  `watch()` 默认是懒侦听的，即回调函数仅会在侦听源发生变化时才执行。

  第一个参数是侦听器的 **源**。这个来源可以是以下几种：

  - 一个函数，返回一个值
  - 一个 ref
  - 一个响应式对象
  - ...或是以上值可能为以上三种类型的数组

  第二个参数是在发生变化时要调用的回调函数。这个回调函数接受三个参数：新的值、旧的值，以及一个用于注册副作用清理回调的函数。清理副作用的回调会在副作用下一次重新执行前调用，可以用来清除无效的副作用，例如等待中的异步请求。

  当侦听多个来源时，回调函数接受的新、旧值都是所对应源各个值的一个数组。

  第三个可选的参数是一个对象，支持以下这些选项：

  - **`immediate`**：在侦听器创建时立即触发回调。这第一次调用时旧的值会是 `undefined`。
  - **`deep`**：如果源是对象，强制深度遍历，以便在深层级变更时启动回调。相关内容请看 [深层侦听器](/guide/essentials/watchers.html#deep-watchers) 一节。
  - **`flush`**：调整回调函数的刷新时机。相关内容请看 [回调的刷新时机](/guide/essentials/watchers.html#callback-flush-timing) 一节。
  - **`onTrack / onTrigger`**：调试侦听器的依赖。相关内容请看 [调试侦听器](/guide/extras/reactivity-in-depth.html#watcher-debugging) 一节。

  与 [`watchEffect()`](#watcheffect) 相比，`watch()` 使我们可以：

  - 懒执行副作用；
  - 更加明确是应该由哪个状态触发侦听器重新执行；
  - 可以访问所侦听状态的前一个值和当前值。

- **示例**

  侦听源是一个函数：

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  侦听源是一个 ref：

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  当侦听多个来源时，回调函数接受的新、旧值都是所对应源各个值的一个数组：

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```

  当使用函数作源时，侦听器只在此函数的返回值发生变化时才会启动。如果你想让回调在深层级变更时也能启动，你需要明确地用 `{ deep: true }` 强制侦听器进入深层级模式。

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

  当直接侦听一个响应式对象时，侦听器自动处于深层级模式：

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
    }
  })
  ```

- **相关内容**:

  - [指南 - 侦听器](/guide/essentials/watchers.html)
  - [指南 - 侦听器调试](/guide/extras/reactivity-in-depth.html#watcher-debugging)
