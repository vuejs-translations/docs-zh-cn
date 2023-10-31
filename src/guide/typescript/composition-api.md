# TypeScript 与组合式 API {#typescript-with-composition-api}

> 这一章假设你已经阅读了[搭配 TypeScript 使用 Vue](./overview) 的概览。

## 为组件的 props 标注类型 {#typing-component-props}

### 使用 `<script setup>` {#using-script-setup}

当使用 `<script setup>` 时，`defineProps()` 宏函数支持从它的参数中推导类型：

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

这被称之为“运行时声明”，因为传递给 `defineProps()` 的参数会作为运行时的 `props` 选项使用。

然而，通过泛型参数来定义 props 的类型通常更直接：

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

这被称之为“基于类型的声明”。编译器会尽可能地尝试根据类型参数推导出等价的运行时选项。在这种场景下，我们第二个例子中编译出的运行时选项和第一个是完全一致的。

基于类型的声明或者运行时声明可以择一使用，但是不能同时使用。

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

#### 语法限制 {#syntax-limitations}


在 3.2 及以下版本中，`defineProps()` 的泛型类型参数仅限于类型文字或对本地接口的引用。

这个限制在 3.3 中得到了解决。最新版本的 Vue 支持在类型参数位置引用导入和有限的复杂类型。但是，由于类型到运行时转换仍然基于 AST，一些需要实际类型分析的复杂类型，例如条件类型，还未支持。您可以使用条件类型来指定单个 prop 的类型，但不能用于整个 props 对象的类型。

### Props 解构默认值 {#props-default-values}

当使用基于类型的声明时，我们失去了为 props 声明默认值的能力。这可以通过 `withDefaults` 编译器宏解决：

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

这将被编译为等效的运行时 props `default` 选项。此外，`withDefaults` 帮助程序为默认值提供类型检查，并确保返回的 props 类型删除了已声明默认值的属性的可选标志。

### 非 `<script setup>` 场景下 {#without-script-setup}

如果没有使用 `<script setup>`，那么为了开启 props 的类型推导，必须使用 `defineComponent()`。传入 `setup()` 的 props 对象类型是从 `props` 选项中推导而来。

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

### 复杂的 prop 类型 {#complex-prop-types}

通过基于类型的声明，一个 prop 可以像使用其他任何类型一样使用一个复杂类型：

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

对于运行时声明，我们可以使用 `PropType` 工具类型：

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

其工作方式与直接指定 `props` 选项基本相同：

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```

`props` 选项通常用于 Options API，因此你会在[选项式 API 与 TypeScript](/guide/typescript/options-api#typing-component-props) 指南中找到更详细的例子。这些例子中展示的技术也适用于使用 `defineProps()` 的运行时声明。

## 为组件的 emits 标注类型 {#typing-component-emits}

在 `<script setup>` 中，`emit` 函数的类型标注也可以通过运行时声明或是类型声明进行：

```vue
<script setup lang="ts">
// 运行时
const emit = defineEmits(['change', 'update'])

// 基于类型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: 可选的、更简洁的语法
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

类型参数可以是以下的一种：

1. 一个可调用的函数类型，但是写作一个包含[调用签名](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures)的类型字面量。它将被用作返回的 `emit` 函数的类型。
2. 一个类型字面量，其中键是事件名称，值是数组或元组类型，表示事件的附加接受参数。上面的示例使用了具名元组，因此每个参数都可以有一个显式的名称。

我们可以看到，基于类型的声明使我们可以对所触发事件的类型进行更细粒度的控制。

若没有使用 `<script setup>`，`defineComponent()` 也可以根据 `emits` 选项推导暴露在 setup 上下文中的 `emit` 函数的类型：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- 类型检查 / 自动补全
  }
})
```

## 为 `ref()` 标注类型 {#typing-ref}

ref 会根据初始化时的值推导其类型：

```ts
import { ref } from 'vue'

// 推导出的类型：Ref<number>
const year = ref(2020)

// => TS Error: Type 'string' is not assignable to type 'number'.
year.value = '2020'
```

有时我们可能想为 ref 内的值指定一个更复杂的类型，可以通过使用 `Ref` 这个类型：

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // 成功！
```

或者，在调用 `ref()` 时传入一个泛型参数，来覆盖默认的推导行为：

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

## 为 `reactive()` 标注类型 {#typing-reactive}

`reactive()` 也会隐式地从它的参数中推导类型：

```ts
import { reactive } from 'vue'

// 推导得到的类型：{ title: string }
const book = reactive({ title: 'Vue 3 指引' })
```

要显式地标注一个 `reactive` 变量的类型，我们可以使用接口：

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
```

:::tip
不推荐使用 `reactive()` 的泛型参数，因为处理了深层次 ref 解包的返回值与泛型参数的类型不同。
:::

## 为 `computed()` 标注类型 {#typing-computed}

`computed()` 会自动从其计算函数的返回值上推导出类型：

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// 推导得到的类型：ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS Error: Property 'split' does not exist on type 'number'
const result = double.value.split('')
```

你还可以通过泛型参数显式指定类型：

```ts
const double = computed<number>(() => {
  // 若返回值不是 number 类型则会报错
})
```

## 为事件处理函数标注类型 {#typing-event-handlers}

在处理原生 DOM 事件时，应该为我们传递给事件处理函数的参数正确地标注类型。让我们看一下这个例子：

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` 隐式地标注为 `any` 类型
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

没有类型标注时，这个 `event` 参数会隐式地标注为 `any` 类型。这也会在 `tsconfig.json` 中配置了 `"strict": true` 或 `"noImplicitAny": true` 时报出一个 TS 错误。因此，建议显式地为事件处理函数的参数标注类型。此外，你在访问 `event` 上的属性时可能需要使用类型断言：

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## 为 provide / inject 标注类型 {#typing-provide-inject}

provide 和 inject 通常会在不同的组件中运行。要正确地为注入的值标记类型，Vue 提供了一个 `InjectionKey` 接口，它是一个继承自 `Symbol` 的泛型类型，可以用来在提供者和消费者之间同步注入值的类型：

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // 若提供的是非字符串值会导致错误

const foo = inject(key) // foo 的类型：string | undefined
```

建议将注入 key 的类型放在一个单独的文件中，这样它就可以被多个组件导入。

当使用字符串注入 key 时，注入值的类型是 `unknown`，需要通过泛型参数显式声明：

```ts
const foo = inject<string>('foo') // 类型：string | undefined
```

注意注入的值仍然可以是 `undefined`，因为无法保证提供者一定会在运行时 provide 这个值。

当提供了一个默认值后，这个 `undefined` 类型就可以被移除：

```ts
const foo = inject<string>('foo', 'bar') // 类型：string
```

如果你确定该值将始终被提供，则还可以强制转换该值：

```ts
const foo = inject('foo') as string
```

## 为模板引用标注类型 {#typing-template-refs}

模板引用需要通过一个显式指定的泛型参数和一个初始值 `null` 来创建：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

可以通过类似于 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#technical_summary) 的页面来获取正确的 DOM 接口。

注意为了严格的类型安全，有必要在访问 `el.value` 时使用可选链或类型守卫。这是因为直到组件被挂载前，这个 ref 的值都是初始的 `null`，并且在由于 `v-if` 的行为将引用的元素卸载时也可以被设置为 `null`。

## 为组件模板引用标注类型 {#typing-component-template-refs}

有时，你可能需要为一个子组件添加一个模板引用，以便调用它公开的方法。举例来说，我们有一个 `MyModal` 子组件，它有一个打开模态框的方法：

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

为了获取 `MyModal` 的类型，我们首先需要通过 `typeof` 得到其类型，再使用 TypeScript 内置的 `InstanceType` 工具类型来获取其实例类型：

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

注意，如果你想在 TypeScript 文件而不是在 Vue SFC 中使用这种技巧，需要开启 Volar 的 [Takeover 模式](./overview#volar-takeover-mode)。

如果组件的具体类型无法获得，或者你并不关心组件的具体类型，那么可以使用 `ComponentPublicInstance`。这只会包含所有组件都共享的属性，比如 `$el`。

```ts
import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = ref<ComponentPublicInstance | null>(null)
```
