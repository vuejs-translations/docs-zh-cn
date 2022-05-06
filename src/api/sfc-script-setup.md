# 单文件组件 `<script setup>` {#script-setup}

`<script setup>` 是在单文件组件 (SFC) 中使用组合式 API 的编译时语法糖。相比于普通的 `<script>` 语法，它具有更多优势：

- 更少的样板内容，更简洁的代码。
- 能够使用纯 Typescript 声明 props 和抛出事件。
- 更好的运行时性能 (其模板会被编译成与其同一作用域的渲染函数，没有任何的中间代理)。
- 更好的 IDE 类型推断性能 (减少语言服务器从代码中抽离类型的工作)。

## 基本语法 {#basic-syntax}

要使用这个语法，需要将 `setup` attribute 添加到 `<script>` 代码块上：

```vue
<script setup>
console.log('hello script setup')
</script>
```

里面的代码会被编译成组件 `setup()` 函数的内容。这意味着与普通的 `<script>` 只在组件被首次引入的时候执行一次不同，`<script setup>` 中的代码会在**每次组件实例被创建的时候执行**。

### 顶层的绑定会被暴露给模板  {#top-level-bindings-are-exposed-to-template}

当使用 `<script setup>` 的时候，任何在 `<script setup>` 声明的顶层的绑定 (包括变量，函数声明，以及 import 引入的内容) 都能在模板中直接使用：

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
  <div @click="log">{{ msg }}</div>
</template>
```

import 导入的内容也会以同样的方式暴露。意味着可以在模板表达式中直接使用导入的 helper 函数，并不需要通过 `methods` 选项来暴露它：

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## 响应式 {#reactivity}

响应式状态需要明确使用[响应式 APIs](/api/reactivity-core.html) 来创建。和从 `setup()` 函数中返回值一样，ref 值在模板中使用的时候会自动解包：

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

将 `MyComponent` 看做被一个变量所引用。如果你使用过 JSX，在这里的使用它的心智模型是一样的。其 kebab-case 格式的 `<my-component>` 同样能在模板中使用。不过，我们强烈建议使用 PascalCase 格式以保持一致性。同时也有助于区分原生的自定义元素。

### 动态组件 {#dynamic-components}

由于组件被引用为变量而不是作为字符串键来注册的，在 `<script setup>` 中要使用动态组件的时候，就应该使用动态的 `:is` 来绑定：

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

请注意这种方式相比于 import 导入的组件优先级更低。如果有命名的 import 导入和组件的推断名冲突了，可以使用 import 别名导入：

```js
import { FooBar as FooBarChild } from './components'
```

### 命名空间组件 {#namespaced-components}

可以使用带点的组件标记，例如 `<Foo.Bar>` 来引用嵌套在对象属性中的组件。这在需要从单个文件中导入多个组件的时候非常有用：

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

全局注册的自定义指令将以符合预期的方式工作，且本地注册的指令可以直接在模板中使用，就像上文所提及的组件一样。但这里有一个需要注意的限制：必须以 `vNameOfDirective` 的形式来命名本地自定义指令，以使得它们可以直接在模板中使用。

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

导入的指令同样能够工作，并且能够通过重命名来使其符合命名规范

```vue
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## `defineProps()` 和 `defineEmits()` {#defineprops-defineemits}

在 `<script setup>` 中必须使用 `defineProps` 和 `defineEmits` API 来声明 `props` 和 `emits` ，它们具备完整的类型推断并且在 `<script setup>` 中是直接可用的：

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// setup code
</script>
```

- `defineProps` 和 `defineEmits` 都是只在 `<script setup>` 中才能使用的**编译器宏**。他们不需要导入且会随着 `<script setup>` 处理过程一同被编译掉。

- `defineProps` 接收与 `props` 选项相同的值，`defineEmits` 也接收 `emits` 选项相同的值。

- `defineProps` 和 `defineEmits` 在选项传入后，会提供恰当的类型推断。

- 传入到 `defineProps` 和 `defineEmits` 的选项会从 setup 中提升到模块的范围。因此，传入的选项不能引用在 setup 范围中声明的局部变量。这样做会引起编译错误。但是，它*可以*引用导入的绑定，因为它们也在模块范围内。

如果使用了 Typescript，[使用纯类型声明来声明 prop 和 emits](#typescript-only-features) 也是可以的。

## `defineExpose` {#defineexpose}

使用 `<script setup>` 的组件是**默认关闭**的，也即通过模板 ref 或者 `$parent` 链获取到的组件的公开实例，不会暴露任何在 `<script setup>` 中声明的绑定。

为了在 `<script setup>` 组件中明确要暴露出去的属性，使用 `defineExpose` 编译器宏：

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

当父组件通过模板 ref 的方式获取到当前组件的实例，获取到的实例会像这样 `{ a: number, b: number }` (ref 会和在普通实例中一样被自动解包)

## `useSlots()` 和 `useAttrs()` {#useslots-useattrs}

在 `<script setup>` 使用 `slots` 和 `attrs` 的情况应该是很罕见的，因为可以在模板中通过 `$slots` 和 `$attrs` 来访问它们。在你的确需要使用它们的罕见场景中，可以分别用 `useSlots` 和 `useAttrs` 两个辅助函数：

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` 和 `useAttrs` 是真实的运行时函数，它会返回与 `setupContext.slots` 和 `setupContext.attrs` 等价的值，同样也能在普通的组合式 API 中使用。

## 与普通的 `<script>` 一起使用 {#usage-alongside-normal-script}

`<script setup>` 可以和普通的 `<script>` 一起使用。普通的 `<script>` 在有这些需要的情况下或许会被使用到：

- 无法在 `<script setup>` 声明的选项，例如 `inheritAttrs` 或通过插件启用的自定义的选项。
- 声明命名导出。
- 运行副作用或者创建只需要执行一次的对象。

```vue
<script>
// 普通 <script>, 在模块范围下执行(只执行一次)
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

## 顶层 `await` {#top-level-await}

`<script setup>` 中可以使用顶层 `await`。结果代码会被编译成 `async setup()`：

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

另外，await 的表达式会自动编译成在 `await` 之后保留当前组件实例上下文的格式。

:::warning 注意
`async setup()` 必须与 `Suspense` 组合使用，`Suspense` 目前还是处于实验阶段的特性。我们打算在将来的某个发布版本中开发完成并提供文档 - 如果你现在感兴趣，可以参照 [tests](https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/__tests__/components/Suspense.spec.ts) 看它是如何工作的。
:::

## 仅限 TypeScript 的功能 {#typescript-only-features}

### 仅限类型的 props/emit 声明 {#type-only-propsemit-declarations}

props 和 emits 都可以使用传递字面量类型的纯类型语法做为参数给 `defineProps` 和 `defineEmits` 来声明：

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
```

- `defineProps` 或 `defineEmits` 只能是要么使用运行时声明，要么使用类型声明。同时使用两种声明方式会导致编译报错。

- 使用类型声明的时候，静态分析会自动生成等效的运行时声明，以消除双重声明的需要并仍然确保正确的运行时行为。

  - 在开发环境下，编译器会试着从类型来推断对应的运行时验证。例如这里从 `foo: string` 类型中推断出 `foo: String`。如果类型是对导入类型的引用，这里的推断结果会是 `foo: null` (与 `any` 类型相等)，因为编译器没有外部文件的信息。

  - 在生产模式下，编译器会生成数组格式的声明来减少打包体积 (这里的 props 会被编译成 `['foo', 'bar']`)。

  - 生成的代码仍然是有着类型的 Typescript 代码，它会在后续的流程中被其它工具处理。

- 截至目前，类型声明参数必须是以下内容之一，以确保正确的静态分析：

  - 类型字面量
  - 在同一文件中的接口或类型字面量的引用

  现在还不支持复杂的类型和从其它文件进行类型导入。理论上来说，将来是可能实现类型导入的。

### 使用类型声明时的默认 props 值 {#default-props-values-when-using-type-declaration}

仅限类型的 `defineProps` 声明的不足之处在于，它没有可以给 props 提供默认值的方式。为了解决这个问题，提供了 `withDefaults` 编译器宏：

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

## 限制  {#restrictions}

由于模块执行语义的差异，`<script setup>` 中的代码依赖单文件组件的上下文。当将其移动到外部的 `.js` 或者 `.ts` 文件中的时候，对于开发者和工具来说都会感到混乱。因而 **`<script setup>`** 不能和 `src` attribute 一起使用。
