# 响应性 API：进阶 {#reactivity-api-advanced}

## shallowRef() {#shallowref}

[`ref()`](./reactivity-core.html#ref) 的浅层作用形式。

- **类型**

  ```ts
  function shallowRef<T>(value: T): ShallowRef<T>

  interface ShallowRef<T> {
    value: T
  }
  ```

- **详细信息**

  和 `ref()` 不同，浅层 ref 的内部值将会原样存储和暴露，并且不会被深层递归地转为响应式。只有对 `.value` 的访问是响应式的。

  `shallowRef()` 常常用于对大型数据结构的性能优化或是与外部的状态管理系统集成。

- **示例**

  ```js
  const state = shallowRef({ count: 1 })

  // 不会触发更改
  state.value.count = 2

  // 会触发更改
  state.value = { count: 2 }
  ```

- **相关内容：**
  - [指南 - 减少大型不可变结构的响应性开销](/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures)
  - [指南 - 与其他状态系统集成](/guide/extras/reactivity-in-depth.html#integration-with-external-state-systems)

## triggerRef() {#triggerref}

强制触发依赖于一个 [浅层 ref](#shallowref) 的副作用，这常常用在对浅层 ref 的内部值做了变更之后。

- **类型**

  ```ts
  function triggerRef(ref: ShallowRef): void
  ```

- **示例**

  ```js
  const shallow = shallowRef({
    greet: 'Hello, world'
  })

  // 触发该副作用第一次应该会打印 "Hello, world"
  watchEffect(() => {
    console.log(shallow.value.greet)
  })

  // 这次变更不应触发副作用，因为这个 ref 是浅层的
  shallow.value.greet = 'Hello, universe'

  // 打印 "Hello, universe"
  triggerRef(shallow)
  ```

## customRef()  {#customref}

创建一个自定义的 ref，显式声明对其依赖追踪和更新触发的控制方式。

- **类型**

  ```ts
  function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

  type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
  ) => {
    get: () => T
    set: (value: T) => void
  }
  ```

- **详细信息**

  `customRef()` 预期接受一个工厂函数，这个工厂函数接受 `track` 和 `trigger` 两个函数作为参数，并应该返回一个带 `get` 和 `set` 方法的对象。

  一般来说，`track()` 应该在 `get()` 方法中调用，而 `trigger()` 应该在 `set()` 中调用。然而，你对它们该怎么调用、需不需要调用都有完全的控制权。

- **示例**

  创建一个防抖 ref，即仅在上一次 set 调用后的一端固定间隔后再调用：

  ```js
  import { customRef } from 'vue'
  
  export function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  ```

  在组件中使用：

  ```vue
  <script setup>
  import { useDebouncedRef } from './debouncedRef'
  const text = useDebouncedRef('hello')
  </script>

  <template>
    <input v-model="text" />
  </template>
  ```

  [在 Playground 中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZURlYm91bmNlZFJlZiB9IGZyb20gJy4vZGVib3VuY2VkUmVmLmpzJ1xuY29uc3QgdGV4dCA9IHVzZURlYm91bmNlZFJlZignaGVsbG8nLCAxMDAwKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHA+XG4gICAgVGhpcyB0ZXh0IG9ubHkgdXBkYXRlcyAxIHNlY29uZCBhZnRlciB5b3UndmUgc3RvcHBlZCB0eXBpbmc6XG4gIDwvcD5cbiAgPHA+e3sgdGV4dCB9fTwvcD5cbiAgPGlucHV0IHYtbW9kZWw9XCJ0ZXh0XCIgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsImRlYm91bmNlZFJlZi5qcyI6ImltcG9ydCB7IGN1c3RvbVJlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZURlYm91bmNlZFJlZih2YWx1ZSwgZGVsYXkgPSAyMDApIHtcbiAgbGV0IHRpbWVvdXRcbiAgcmV0dXJuIGN1c3RvbVJlZigodHJhY2ssIHRyaWdnZXIpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0KCkge1xuICAgICAgICB0cmFjaygpXG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgfSxcbiAgICAgIHNldChuZXdWYWx1ZSkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHZhbHVlID0gbmV3VmFsdWVcbiAgICAgICAgICB0cmlnZ2VyKClcbiAgICAgICAgfSwgZGVsYXkpXG4gICAgICB9XG4gICAgfVxuICB9KVxufSJ9)

## shallowReactive()  {#shallowreactive}

[`reactive()`](./reactivity-core.html#reactive) 的浅层作用形式。

- **类型**

  ```ts
  function shallowReactive<T extends object>(target: T): T
  ```

- **详细信息**

  和 `reactive()`不同，这里不会有深层次转换：一个浅层响应式对象里只有根级别的属性是响应式的。属性的值会被原样存储和暴露，这也意味着属性为 ref 的值 **不会** 被自动解包了。

  :::warning 谨慎使用
  浅层数据结构应该只用于组件中的根级状态。请避免将其嵌套在深层次的响应式对象中，因为它会创建一个具有不一致的响应行为的树，这可能很难理解和调试。
  :::

- **示例**

  ```js
  const state = shallowReactive({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // mutating state's own properties is reactive
  state.foo++

  // ...but does not convert nested objects
  isReactive(state.nested) // false

  // NOT reactive
  state.nested.bar++
  ```

## shallowReadonly()  {#shallowreadonly}

Shallow version of [`readonly()`](./reactivity-core.html#readonly).

- **类型**

  ```ts
  function shallowReadonly<T extends object>(target: T): Readonly<T>
  ```

- **详细信息**

  Unlike `readonly()`, there is no deep conversion: only root-level properties are made readonly. Property values are stored and exposed as-is - this also means properties with ref values will **not** be automatically unwrapped.

  :::warning Use with Caution
  Shallow data structures should only be used for root level state in a component. Avoid nesting it inside a deep reactive object as it creates a tree with inconsistent reactivity behavior which can be difficult to understand and debug.
  :::

- **示例**

  ```js
  const state = shallowReadonly({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // mutating state's own properties will fail
  state.foo++

  // ...but works on nested objects
  isReadonly(state.nested) // false

  // works
  state.nested.bar++
  ```

## toRaw()  {#toraw}

Returns the raw, original object of a Vue-created proxy.

- **类型**

  ```ts
  function toRaw<T>(proxy: T): T
  ```

- **详细信息**

  `toRaw()` can return the original object from proxies created by [`reactive()`](./reactivity-core.html#reactive), [`readonly()`](./reactivity-core.html#readonly), [`shallowReactive()`](#shallowreactive) or [`shallowReadonly()`](#shallowreadonly).

  This is an escape hatch that can be used to temporarily read without incurring proxy access / tracking overhead or write without triggering changes. It is **not** recommended to hold a persistent reference to the original object. Use with caution.

- **示例**

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)

  console.log(toRaw(reactiveFoo) === foo) // true
  ```

## markRaw()  {#markraw}

Marks an object so that it will never be converted to a proxy. Returns the object itself.

- **类型**

  ```ts
  function markRaw<T extends object>(value: T): T
  ```

- **示例**

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false

  // also works when nested inside other reactive objects
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

  :::warning Use with Caution
  `markRaw()` and shallow APIs such as `shallowReactive()` allow you to selectively opt-out of the default deep reactive/readonly conversion and embed raw, non-proxied objects in your state graph. They can be used for various reasons:

  - Some values simply should not be made reactive, for example a complex 3rd party class instance, or a Vue component object.

  - Skipping proxy conversion can provide performance improvements when rendering large lists with immutable data sources.

  They are considered advanced because the raw opt-out is only at the root level, so if you set a nested, non-marked raw object into a reactive object and then access it again, you get the proxied version back. This can lead to **identity hazards** - i.e. performing an operation that relies on object identity but using both the raw and the proxied version of the same object:

  ```js
  const foo = markRaw({
    nested: {}
  })

  const bar = reactive({
    // although `foo` is marked as raw, foo.nested is not.
    nested: foo.nested
  })

  console.log(foo.nested === bar.nested) // false
  ```

  Identity hazards are in general rare. However, to properly utilize these APIs while safely avoiding identity hazards requires a solid understanding of how the reactivity system works.

  :::

## effectScope()  {#effectscope}

Creates an effect scope object which can capture the reactive effects (i.e. computed and watchers) created within it so that these effects can be disposed together. For detailed use cases of this API, please consult its corresponding [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md).

- **类型**

  ```ts
  function effectScope(detached?: boolean): EffectScope

  interface EffectScope {
    run<T>(fn: () => T): T | undefined // undefined if scope is inactive
    stop(): void
  }
  ```

- **示例**

  ```js
  const scope = effectScope()

  scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    watch(doubled, () => console.log(doubled.value))

    watchEffect(() => console.log('Count: ', doubled.value))
  })

  // to dispose all effects in the scope
  scope.stop()
  ```

## getCurrentScope()  {#getcurrentscope}

Returns the current active [effect scope](#effectscope) if there is one.

- **类型**

  ```ts
  function getCurrentScope(): EffectScope | undefined
  ```

## onScopeDispose()  {#onscopedispose}

Registers a dispose callback on the current active [effect scope](#effectscope). The callback will be invoked when the associated effect scope is stopped.

This method can be used as a non-component-coupled replacement of `onUnmounted` in reusable composition functions, since each Vue component's `setup()` function is also invoked in an effect scope.

- **类型**

  ```ts
  function onScopeDispose(fn: () => void): void
  ```
