# TypeScript 与组合式 API {#typescript-with-composition-api}


> 这一章假设你已经阅读过了这篇 [搭配 TypeScript 使用 Vue](./overview) 的文档。

## 为组件 props 标注类型 {#typing-component-props}

当使用 `<script setup>`时，这个 `defineProps()` 宏函数支持从它的参数中推导类型：

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

这被称之为 “运行时声明”，因为传递给 `defineProps()` 的参数会作为运行时的 `props` 选项使用。

然而，通过泛型参数来定义 props 的类型通常更简单：

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

这被称之为 “基于类型的声明”。编译器会尽可能地尝试根据类型参数推导出等价的运行时选项。在这种场景下，我们第二个例子中编译出的运行时选项和第一个是完全一致的。

基于类型的声明或者运行时定义两种都可以使用，但一次你只能选择其中之一。

我们也可以将 props 的类型移入一个单独的接口中：

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

:::warning 语法限制
为了生成正确的运行时代码，传给 `defineProps()` 的泛型参数必须是以下之一：

- 一个类型字面量
- 对 **同一个文件** 中的一个接口或对象类型字面量的引用

这个同一个文件的限制在未来的版本中可以被移除。
:::

### props 默认值 <Badge type="warning" text="实验性" /> {#props-default-values}

当使用基于类型的声明，我们失去了未 props 定义默认值的能力。这可以通过目前实验性的 [响应性语法糖](/guide/extras/reactivity-transform.html#reactive-props-destructure) 来解决：

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

// 对 defineProps() 的响应性结构
// 默认值会被编译为等价的运行时选项
const { foo, bar = 100 } = defineProps<Props>()
</script>
```

这个行为目前需要 [显式地选择开启](/guide/extras/reactivity-transform.html#explicit-opt-in)。

### 非 `<script setup>` 的情景 {#without-script-setup}

如果没有在使用 `<script setup>`，那么为了开启 props 的类型推导，必须使用 `defineComponent()`。传入 `setup()` 的 props 对象类型是从 `props` 选项中推导而来。

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- 类型：string
  }
})
```

## 为组件的 emits 标注类型 {#typing-component-emits}

在 `<script setup>` 中，可以通过基于类型的声明或运行时声明让 `emit` 函数被类型化：

```vue
<script setup lang="ts">
// 运行时
const emit = defineEmits(['change', 'update'])

// 基于类型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

这个类型参数应该是一个带 [调用签名](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures) 的类型字面量。这个类型字面量的类型就会是返回的 `emit` 函数的类型。我们可以看到，基于类型的声明使我们可以对所触发事件的类型进行更细粒度的控制。

若没在使用 `<script setup>`，`defineComponent()` 也可以根据 `emits` 选项推导暴露在 setup 上下文上的 `emit` 函数的类型：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- 有类型检查 / 自动补全
  }
})
```

## 为 `ref` 标注类型 {#typing-ref}

ref 会根据初始化时的值推导其类型：

```ts
import { ref } from 'vue'

// 推导出的类型 Ref<number>
const year = ref(2020)

// => TS 错误：类型 'string' 不可以赋值给 'number'
year.value = '2020'
```

有时我们可能想为 ref 内的值指定一个更复杂的类型，那么我们可以使用 `Ref` 这个类型：

```ts
import { ref, Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // 成功！
```

或者在调用 `ref()` 时传入一个泛型参数，来覆盖默认的推导行为：

```ts
// 得到的类型：Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // 成功！
```

如果你指定了一个泛型参数但没有给出初始值，那么最后得到的就将是一个包含 `undefined` 的联合类型：

```ts
// 推导得到的类型：Ref<number | undefined>
const n = ref<number>()
```

## 为 `reactive` 标注类型 {#typing-reactive}

`reactive()` 也会隐式地从它的参数中推导类型：

```ts
import { reactive } from 'vue'

// 推导得到的类型：{ title: string }
const book = reactive({ title: 'Vue 3 指引' })
```

要显式地标注一个 `reactive` 属性的类型，我们可以使用接口：

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
```

:::tip
不推荐使用 `reactive()` 的泛型参数，因为处理了深层次 ref 解套的返回值与泛型参数的类型不同。
:::

## 为 `computed` 标注类型 {#typing-computed}

`computed()` 会从其计算函数的返回值上推导出类型：

```ts
import { ref, computed } from 'vue'

let count = ref(0)

// 推导得到的类型：ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS 错误：属性 'split' 在类型 'number' 上不存在
const result = double.value.split('')
```

你还可以通过泛型参数显式指定类型：

```ts
const double = computed<number>(() => {
  // 若返回值不是 number 类型则会报错
})
```

## 为事件处理器标注类型 {#typing-event-handlers}

在处理原生 DOM 事件时，应该为我们传递给事件处理器的参数正确地标注类型。让我们看一下这个例子：

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` 隐式为 `any` 类型
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

没有类型标注时，这个 `event` 参数会隐式定为类型 `any`。这也会在 `tsconfig.json` 中配置了 `"strict": true` 或 `"noImplicitAny": true` 时报出一个 TS 错误。因此，建议显式地为事件处理器的参数标注类型。此外，你可能需要显式地强制转换 `event` 上的属性：

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## 为供给/注入标注类型 {#typing-provide-inject}

供给和注入通常会在不同的组件中执行。要正确地为注入的值标记类型，
Vue 提供了一个 `InjectionKey` 接口，它是一个继承 `Symbol` 的泛型类型，它可以用来在供给方和消费方之间同步注入值的类型:

```ts
import { provide, inject, InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // 若供给的是非字符串会导致错误

const foo = inject(key) // foo 的类型：string | undefined
```

建议将注入 key 的类型放在一个单独的文件中，这样它就可以被多个组件导入。

当使用注入的 key 字符串时，注入值的类型是 `unknown`，需要通过泛型参数显式声明：

```ts
const foo = inject<string>('foo') // 类型：string | undefined
```

注意注入的值仍然可以是 `undefined`，因为无法保证供给方一定在运行时提供这个值。

当提供了一个默认值后，这个 `undefined` 类型就可以被移除：

```ts
const foo = inject<string>('foo', 'bar') // 类型：string
```

如果你确定始终提供该值，则还可以强制转换该值：

```ts
const foo = inject('foo') as string
```

## 为模板 ref 标注类型 {#typing-template-refs}

模板 ref 需要通过一个显式指定的泛型参数和一个初始值 `null` 来创建：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

注意为了严格的类型安全，有必要在访问 `el.value` 时使用可选链或类型守卫。这厮还因为直到组件被挂载前，这个 ref 的值都是初始的 `null`，并且在由于 `v-if` 的行为将引用的元素卸载时也可以被设置为 `null`。

## 为组件模板 ref 标注类型 {#typing-component-template-refs}

有时，你可能需要为一个子组件添加一个模板 ref，以便调用它公开的方法。举个例子，我们有一个 `MyModal` 子组件，它有一个打开模态框的方法。

```vue
<!-- MyModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isContentShown = ref(false)
const open = () => (isContentShown.value = true)

defineExpose({
  open
})
</script>
```

为了获取 `MyModal` 的类型，我们需要首先通过 `typeof` 得到其类型，再使用 TypeScript 内置的 `InstanceType` 工具类型来获取其实例类型：

```vue{5}
<!-- App.vue -->
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>
```

注意，如果你想在 TypeScript 文件中而不是在 Vue SFC 中使用这种方式，你需要开启 Volar 的 [托管模式](./overview.html#takeover-mode)。
