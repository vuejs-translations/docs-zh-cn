# \<script setup> {#script-setup}

`<script setup>` 是在单文件组件 (SFC) 中使用组合式 API 的编译时语法糖。当同时使用单文件组件与组合式 API 时该语法是默认推荐。相比于普通的 `<script>` 语法，它具有更多优势：

- 更少的样板内容，更简洁的代码。
- 能够使用纯 TypeScript 声明 props 和自定义事件。
- 更好的运行时性能 (其模板会被编译成同一作用域内的渲染函数，避免了渲染上下文代理对象)。
- 更好的 IDE 类型推导性能 (减少了语言服务器从代码中抽取类型的工作)。

## 基本语法 {#basic-syntax}

要启用该语法，需要在 `<script>` 代码块上添加 `setup` attribute：

```vue
<script setup>
console.log('hello script setup')
</script>
```

里面的代码会被编译成组件 `setup()` 函数的内容。这意味着与普通的 `<script>` 只在组件被首次引入的时候执行一次不同，`<script setup>` 中的代码会在**每次组件实例被创建的时候执行**。

### 顶层的绑定会被暴露给模板 {#top-level-bindings-are-exposed-to-template}

当使用 `<script setup>` 的时候，任何在 `<script setup>` 声明的顶层的绑定 (包括变量，函数声明，以及 import 导入的内容) 都能在模板中直接使用：

```vue
<script setup>
// 变量
const msg = 'Hello!'

// 函数
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

import 导入的内容也会以同样的方式暴露。这意味着我们可以在模板表达式中直接使用导入的 helper 函数，而不需要通过 `methods` 选项来暴露它：

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## 响应式 {#reactivity}

响应式状态需要明确使用[响应式 API](/api/reactivity-core) 来创建。和 `setup()` 函数的返回值一样，ref 在模板中使用的时候会自动解包：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## 使用组件 {#using-components}

`<script setup>` 范围里的值也能被直接作为自定义组件的标签名使用：

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

这里 `MyComponent` 应当被理解为像是在引用一个变量。如果你使用过 JSX，此处的心智模型是类似的。其 kebab-case 格式的 `<my-component>` 同样能在模板中使用——不过，我们强烈建议使用 PascalCase 格式以保持一致性。同时这也有助于区分原生的自定义元素。

### 动态组件 {#dynamic-components}

由于组件是通过变量引用而不是基于字符串组件名注册的，在 `<script setup>` 中要使用动态组件的时候，应该使用动态的 `:is` 来绑定：

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

请注意组件是如何在三元表达式中被当做变量使用的。

### 递归组件 {#recursive-components}

一个单文件组件可以通过它的文件名被其自己所引用。例如：名为 `FooBar.vue` 的组件可以在其模板中用 `<FooBar/>` 引用它自己。

请注意这种方式相比于导入的组件优先级更低。如果有具名的导入和组件自身推导的名字冲突了，可以为导入的组件添加别名：

```js
import { FooBar as FooBarChild } from './components'
```

### 命名空间组件 {#namespaced-components}

可以使用带 `.` 的组件标签，例如 `<Foo.Bar>` 来引用嵌套在对象属性中的组件。这在需要从单个文件中导入多个组件的时候非常有用：

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

## 使用自定义指令 {#using-custom-directives}

全局注册的自定义指令将正常工作。本地的自定义指令在 `<script setup>` 中不需要显式注册，但他们必须遵循 `vNameOfDirective` 这样的命名规范：

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // 在元素上做些操作
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```

如果指令是从别处导入的，可以通过重命名来使其符合命名规范：

```vue
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## defineProps() 和 defineEmits() {#defineprops-defineemits}

为了在声明 `props` 和 `emits` 选项时获得完整的类型推导支持，我们可以使用 `defineProps` 和 `defineEmits` API，它们将自动地在 `<script setup>` 中可用：

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// setup 代码
</script>
```

- `defineProps` 和 `defineEmits` 都是只能在 `<script setup>` 中使用的**编译器宏**。他们不需要导入，且会随着 `<script setup>` 的处理过程一同被编译掉。

- `defineProps` 接收与 `props` 选项相同的值，`defineEmits` 接收与 `emits` 选项相同的值。

- `defineProps` 和 `defineEmits` 在选项传入后，会提供恰当的类型推导。

- 传入到 `defineProps` 和 `defineEmits` 的选项会从 setup 中提升到模块的作用域。因此，传入的选项不能引用在 setup 作用域中声明的局部变量。这样做会引起编译错误。但是，它*可以*引用导入的绑定，因为它们也在模块作用域内。

### 针对类型的 props/emit 声明<sup class="vt-badge ts" /> {#type-only-props-emit-declarations}

props 和 emit 也可以通过给 `defineProps` 和 `defineEmits` 传递纯类型参数的方式来声明：

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+：另一种更简洁的语法
const emit = defineEmits<{
  change: [id: number] // 具名元组语法
  update: [value: string]
}>()
```

- `defineProps` 或 `defineEmits` 要么使用运行时声明，要么使用类型声明。同时使用两种声明方式会导致编译报错。

- 使用类型声明的时候，静态分析会自动生成等效的运行时声明，从而在避免双重声明的前提下确保正确的运行时行为。

  - 在开发模式下，编译器会试着从类型来推导对应的运行时验证。例如这里从 `foo: string` 类型中推断出 `foo: String`。如果类型是对导入类型的引用，这里的推导结果会是 `foo: null` (与 `any` 类型相等)，因为编译器没有外部文件的信息。

  - 在生产模式下，编译器会生成数组格式的声明来减少打包体积 (这里的 props 会被编译成 `['foo', 'bar']`)。

- 在 3.2 及以下版本中，`defineProps()` 的泛型类型参数只能使用类型字面量或者本地接口的引用。

  这个限制已经在 3.3 版本中解决。最新版本的 Vue 支持在类型参数的位置引用导入的和有限的复杂类型。然而，由于类型到运行时的转换仍然基于 AST，因此并不支持使用需要实际类型分析的复杂类型，例如条件类型等。你可以在单个 prop 的类型上使用条件类型，但不能对整个 props 对象使用。

### 响应式 Props 解构 <sup class="vt-badge" data-text="3.5+" /> {#reactive-props-destructure}

在 Vue 3.5 及以上版本中，从 `defineProps` 返回值解构出的变量是响应式的。当在同一个 `<script setup>` 块中的代码访问从 `defineProps` 解构出的变量时，Vue 的编译器会自动在前面添加 `props.`。

```ts
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // 在 3.5 之前仅运行一次
  // 在 3.5+ 版本中会在 "foo" prop 改变时重新运行
  console.log(foo)
})
```

以上编译成以下等效内容：

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` 由编译器转换为 `props.foo`
  console.log(props.foo)
})
```

此外，你可以使用 JavaScript 原生的默认值语法声明 props 的默认值。这在使用基于类型的 props 声明时特别有用。

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

### 使用类型声明时的默认 props 值 <sup class="vt-badge ts" /> {#default-props-values-when-using-type-declaration}

在 3.5 及以上版本中，当使用响应式 Props 解构时，可以自然地声明默认值。但在 3.4 及以下版本中，默认情况下并未启用响应式 Props 解构。为了用基于类型声明的方式声明 props 的默认值，需要使用 `withDefaults` 编译器宏：

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

上面代码会被编译为等价的运行时 props 的 `default` 选项。此外，`withDefaults` 辅助函数提供了对默认值的类型检查，并确保返回的 `props` 的类型删除了已声明默认值的属性的可选标志。

:::info
请注意，在使用 `withDefaults` 时，默认值为可变引用类型 (如数组或对象) 应该封装在函数中，以避免意外修改和外部副作用。这样可以确保每个组件实例都获得默认值的自己的副本。在使用默认值解构时，这**不**是必要的。
:::

## defineModel() {#definemodel}

- 仅在 3.4+ 中可用

这个宏可以用来声明一个双向绑定 prop，通过父组件的 `v-model` 来使用。[组件 `v-model`](/guide/components/v-model) 指南中也讨论了示例用法。

在底层，这个宏声明了一个 model prop 和一个相应的值更新事件。如果第一个参数是一个字符串字面量，它将被用作 prop 名称；否则，prop 名称将默认为 `"modelValue"`。在这两种情况下，你都可以再传递一个额外的对象，它可以包含 prop 的选项和 model ref 的值转换选项。

```js
// 声明 "modelValue" prop，由父组件通过 v-model 使用
const model = defineModel()
// 或者：声明带选项的 "modelValue" prop
const model = defineModel({ type: String })

// 在被修改时，触发 "update:modelValue" 事件
model.value = "hello"

// 声明 "count" prop，由父组件通过 v-model:count 使用
const count = defineModel("count")
// 或者：声明带选项的 "count" prop
const count = defineModel("count", { type: Number, default: 0 })

function inc() {
  // 在被修改时，触发 "update:count" 事件
  count.value++
}
```

:::warning
如果为 `defineModel` prop 设置了一个 `default` 值且父组件没有为该 prop 提供任何值，会导致父组件与子组件之间不同步。在下面的示例中，父组件的 `myRef` 是 undefined，而子组件的 `model` 是 1：

```js
// 子组件：
const model = defineModel({ default: 1 })

// 父组件
const myRef = ref()
```

```html
<Child v-model="myRef"></Child>
```

:::

### 修饰符和转换器 {#modifiers-and-transformers}

为了获取 `v-model` 指令使用的修饰符，我们可以像这样解构 `defineModel()` 的返回值：

```js
const [modelValue, modelModifiers] = defineModel()

// 对应 v-model.trim
if (modelModifiers.trim) {
  // ...
}
```

当存在修饰符时，我们可能需要在读取或将其同步回父组件时对其值进行转换。我们可以通过使用 `get` 和 `set` 转换器选项来实现这一点：

```js
const [modelValue, modelModifiers] = defineModel({
  // get() 省略了，因为这里不需要它
  set(value) {
    // 如果使用了 .trim 修饰符，则返回裁剪过后的值
    if (modelModifiers.trim) {
      return value.trim()
    }
    // 否则，原样返回
    return value
  }
})
```

### 在 TypeScript 中使用 <sup class="vt-badge ts" /> {#usage-with-typescript}

与 `defineProps` 和 `defineEmits` 一样，`defineModel` 也可以接收类型参数来指定 model 值和修饰符的类型：

```ts
const modelValue = defineModel<string>()
//    ^? Ref<string | undefined>

// 用带有选项的默认 model，设置 required 去掉了可能的 undefined 值
const modelValue = defineModel<string>({ required: true })
//    ^? Ref<string>

const [modelValue, modifiers] = defineModel<string, "trim" | "uppercase">()
//                 ^? Record<'trim' | 'uppercase', true | undefined>
```

## defineExpose() {#defineexpose}

使用 `<script setup>` 的组件是**默认关闭**的——即通过模板引用或者 `$parent` 链获取到的组件的公开实例，**不会**暴露任何在 `<script setup>` 中声明的绑定。

可以通过 `defineExpose` 编译器宏来显式指定在 `<script setup>` 组件中要暴露出去的属性：

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

当父组件通过模板引用的方式获取到当前组件的实例，获取到的实例会像这样 `{ a: number, b: number }` (ref 会和在普通实例中一样被自动解包)

## defineOptions() {#defineoptions}

- 仅在 3.3+ 中支持

这个宏可以用来直接在 `<script setup>` 中声明组件选项，而不必使用单独的 `<script>` 块：

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
  customOptions: {
    /* ... */
  }
})
</script>
```

- 这是一个宏定义，选项将会被提升到模块作用域中，无法访问 `<script setup>` 中不是字面常数的局部变量。

## defineSlots() <sup class="vt-badge ts"/> {#defineslots}

- 仅在 3.3+ 中支持

这个宏可以用于为 IDE 提供插槽名称和 props 类型检查的类型提示。

`defineSlots()` 只接受类型参数，没有运行时参数。类型参数应该是一个类型字面量，其中属性键是插槽名称，值类型是插槽函数。函数的第一个参数是插槽期望接收的 props，其类型将用于模板中的插槽 props。返回类型目前被忽略，可以是 `any`，但我们将来可能会利用它来检查插槽内容。

它还返回 `slots` 对象，该对象等同于在 setup 上下文中暴露或由 `useSlots()` 返回的 `slots` 对象。

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```

## `useSlots()` 和 `useAttrs()` {#useslots-useattrs}

在 `<script setup>` 使用 `slots` 和 `attrs` 的情况应该是相对来说较为罕见的，因为可以在模板中直接通过 `$slots` 和 `$attrs` 来访问它们。在你的确需要使用它们的罕见场景中，可以分别用 `useSlots` 和 `useAttrs` 两个辅助函数：

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` 和 `useAttrs` 是真实的运行时函数，它的返回与 `setupContext.slots` 和 `setupContext.attrs` 等价。它们同样也能在普通的组合式 API 中使用。

## 与普通的 `<script>` 一起使用 {#usage-alongside-normal-script}

`<script setup>` 可以和普通的 `<script>` 一起使用。普通的 `<script>` 在有这些需要的情况下或许会被使用到：

- 声明无法在 `<script setup>` 中声明的选项，例如 `inheritAttrs` 或插件的自定义选项 (在 3.3+ 中可以通过 [`defineOptions`](/api/sfc-script-setup#defineoptions) 替代)。
- 声明模块的具名导出 (named exports)。
- 运行只需要在模块作用域执行一次的副作用，或是创建单例对象。

```vue
<script>
// 普通 <script>，在模块作用域下执行 (仅一次)
runSideEffectOnce()

// 声明额外的选项
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// 在 setup() 作用域中执行 (对每个实例皆如此)
</script>
```

在同一组件中将 `<script setup>` 与 `<script>` 结合使用的支持仅限于上述情况。具体来说：

- **不要**为已经可以用 `<script setup>` 定义的选项使用单独的 `<script>` 部分，如 `props` 和 `emits`。
- 在 `<script setup>` 中创建的变量不会作为属性添加到组件实例中，这使得它们无法从选项式 API 中访问。我们强烈反对以这种方式混合 API。

如果你发现自己处于以上任一不被支持的场景中，那么你应该考虑切换到一个显式的 [`setup()`](/api/composition-api-setup) 函数，而不是使用 `<script setup>`。

## 顶层 `await` {#top-level-await}

`<script setup>` 中可以使用顶层 `await`。结果代码会被编译成 `async setup()`：

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

另外，await 的表达式会自动编译成在 `await` 之后保留当前组件实例上下文的格式。

:::warning 注意
`async setup()` 必须与 [`Suspense`](/guide/built-ins/suspense.html) 组合使用，该特性目前仍处于实验阶段。我们计划在未来的版本中完成该特性并编写文档——但如果你现在就感兴趣，可以参考其[测试](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts)来了解其工作方式。
:::

## 导入语句 {#imports-statements}

Vue 中的导入语句遵循 [ECMAScript 模块规范](https://nodejs.org/api/esm.html)。
此外，你还可以使用构建工具配置中定义的别名：

```vue
<script setup>
import { ref } from 'vue'
import { componentA } from './Components'
import { componentB } from '@/Components'
import { componentC } from '~/Components'
</script>
```

## 泛型 <sup class="vt-badge ts" /> {#generics}

可以使用 `<script>` 标签上的 `generic` 属性声明泛型类型参数：

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

`generic` 的值与 TypeScript 中位于 `<...>` 之间的参数列表完全相同。例如，你可以使用多个参数，`extends` 约束，默认类型和引用导入的类型：

```vue
<script
  setup
  lang="ts"
  generic="T extends string | number, U extends Item"
>
import type { Item } from './types'
defineProps<{
  id: T
  list: U[]
}>()
</script>
```

为了在 `ref` 中使用泛型组件的引用，你需要使用 [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers) 库，因为 `InstanceType` 在这种场景下不起作用。

```vue
<script
  setup
  lang="ts"
>
import componentWithoutGenerics from '../component-without-generics.vue';
import genericComponent from '../generic-component.vue';

import type { ComponentExposed } from 'vue-component-type-helpers';

// 适用于没有泛型的组件
ref<InstanceType<typeof componentWithoutGenerics>>();

ref<ComponentExposed<typeof genericComponent>>();
```

## 限制 {#restrictions}

- 由于模块执行语义的差异，`<script setup>` 中的代码依赖单文件组件的上下文。当将其移动到外部的 `.js` 或者 `.ts` 文件中的时候，对于开发者和工具来说都会感到混乱。因此，**`<script setup>`** 不能和 `src` attribute 一起使用。
- `<script setup>` 不支持 DOM 内根组件模板。([相关讨论](https://github.com/vuejs/core/issues/8391))
