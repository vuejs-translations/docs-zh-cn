# 响应性 API：工具函数 {#reactivity-api-utilities}

## isRef()  {#isref}

检查某个值是否为 ref。

- **类型**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  请注意，返回值是一个 [类型谓词](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)，这意味着 `isRef` 可以被用作类型守卫：

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // foo 的类型被收窄为了 Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

如果参数是 ref，则返回内部值，否则返回参数本身。这是 `val = isRef(val) ? val.value : val` 计算的一个语法糖。

- **类型**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **示例**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped 现在保证为 number 类型
  }
  ```

## toRef() {#toref}

可用于为响应式对象上的 property 创建 ref。这样创建的 ref 与其源 property 保持同步：改变源 property 将更新 ref，反之亦然。

- **类型**

  ```ts
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **示例**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const fooRef = toRef(state, 'foo')

  // 更改该 ref 会更新源属性
  fooRef.value++
  console.log(state.foo) // 2

  // 更改源属性也会更新该 ref
  state.foo++
  console.log(fooRef.value) // 3
  ```

  请注意，这不同于：

  ```js
  const fooRef = ref(state.foo)
  ```

  上面这个 ref **不会** 和 `state.foo` 保持同步，因为这个 `ref()` 接收到的是一个纯数值。

  `toRef()` 这个函数在你想把一个 prop 的 ref 传递给一个组合式函数时会很有用：

  ```vue
  <script setup>
  import { toRef } from 'vue'
  
  const props = defineProps(/* ... */)

  // 将 `props.foo` 转换为 ref，然后传入
  // 一个组合式函数
  useSomeFeature(toRef(props, 'foo'))
  </script>
  ```

  当 `toRef` 与组件 prop 结合使用时，关于对 prop 做出更改的通用限制依然有效。尝试将新的值传递给 ref 等效于尝试直接更改 prop，这是不允许的。在这种场景下，你可能可以考虑使用带有 `get` 和 `set` 的 [`computed`](./reactivity-core.html#computed) 替代。详情请见 [在组件上使用 `v-model`](/guide/components/events.html#usage-with-v-model) 指南。

  即使源 property 当前不存在，`toRef()` 也会返回一个可用的 ref。这让它在处理可选 prop 的时候格外实用，而可选 prop 在使用 [`toRefs`](#torefs) 时不会被保留。

## toRefs() {#torefs}

将一个响应式对象转换为一个普通对象，这个普通对象的每个 property 都是指向源对象相应 property 的 ref。每个单独的 ref 都是使用 [`toRef()`](#toref) 创建的。

- **类型**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **示例**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  stateAsRefs 的类型：{
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // 这个 ref 和源属性已经“链接上了”
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  当从组合式函数中返回响应式对象时，`toRefs` 大有作为，使用它，消费者组件可以解构/扩展返回的对象而不会失去响应性：

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...基于状态的操作逻辑

    // 在返回时都转为 ref
    return toRefs(state)
  }

  // 可以解构而不会失去响应性
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` 在调用时只会为源对象上可以列举出的 property 创建 ref。如果要为可能还不存在的 property 创建 ref，请改用 [`toRef`](#toref) 。

## isProxy()  {#isproxy}

检查一个对象是否是由 [`reactive()`](./reactivity-core.html#reactive)、[`readonly()`](./reactivity-core.html#readonly)、[`shallowReactive()`](./reactivity-advanced.html#shallowreactive) 或 [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly) 创建的代理。

- **类型**

  ```ts
  function isProxy(value: unknown): boolean
  ```

## isReactive()  {#isreactive}

检查一个对象是否是由 [`reactive()`](./reactivity-core.html#reactive) 或 [`shallowReactive()`](./reactivity-advanced.html#shallowreactive) 创建的代理。

- **类型**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly()  {#isreadonly}

检查一个对象是否是由 [`readonly()`](./reactivity-core.html#readonly) 或 [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly) 创建的代理。

- **类型**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
