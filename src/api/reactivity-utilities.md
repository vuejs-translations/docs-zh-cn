# 响应性 API：工具函数 {#reactivity-api-utilities}

## isRef()  {#isref}

检查某个值是否为 ref。

- **类型**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  注意返回值是一个 [类型谓词](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)，这意味着 `isRef` 可以被用作类型守卫：

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // foo 的类型被收敛为了 Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

若参数值是一个 ref 则取出内部的值，否则返回值就是参数本身。这是 `val = isRef(val) ? val.value : val` 计算的一个语法糖。

- **类型**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **示例**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped 现在保证是 number 类型了
  }
  ```

## toRef() {#toref}

可以通过一个响应式对象的属性来创建一个 ref。创建得到的 ref 与源属性保持同步：对源属性的更改将会同步更新 ref，反过来该 ref 的变动也会影响源属性。

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

  注意这和下面这个不同：

  ```js
  const fooRef = ref(state.foo)
  ```

  上面这个 ref **不会** 和 `state.foo` 保持同步，因为这个 `ref()` 接收到的是一个纯字符串值。

  `toRef()` 这个函数在你想把一个 prop 的 ref 传递给一个组合式函数时会很有用：

  ```vue
  <script setup>
  const props = defineProps(/* ... */)

  // 将 `props.foo` 转为一个 ref，接着将其转为
  // 一个组合式函数
  useSomeFeature(toRef(props, 'foo'))
  </script>
  ```

  `toRef()` 即使在源属性已经不存在的情况下，也会返回一个可用的 ref。这使得它在处理可选 prop 的时候会很有用，而可选属性在使用 [`toRefs`](#torefs) 时不会被保留。

## toRefs() {#torefs}

将一个响应式对象转为一个简单对象，其中每个属性都是一个指向源对象相应属性的 ref。每个独立的 ref 都是由 [`toRef()`](#toref) 创建的。

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

  在你要从一个组合式函数中返回响应式对象、而消费者组件想要解构或展开它又不想丢失响应性时，`toRefs` 会很有用：

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

  // 可以在解构时不丢失响应性
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` 只会通过在调用时可以列举出的属性来创建 ref。如果要基于一个可能还不存在的属性创建，请使用 [`toRef`](#toref) 来替代。

## isProxy()  {#isproxy}

检查该对象是否为由 [`reactive()`](./reactivity-core.html#reactive)、[`readonly()`](./reactivity-core.html#readonly)、[`shallowReactive()`](./reactivity-advanced.html#shallowreactive) 或 [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly) 创建的代理。

- **类型**

  ```ts
  function isProxy(value: unknown): boolean
  ```

## isReactive()  {#isreactive}

检查该对象是否为由 [`reactive()`](./reactivity-core.html#reactive) 或 [`shallowReactive()`](./reactivity-advanced.html#shallowreactive) 创建的代理。

- **类型**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly()  {#isreadonly}

检查该对象是否为由 [`readonly()`](./reactivity-core.html#readonly) 或 [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly) 创建的代理。

- **类型**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
