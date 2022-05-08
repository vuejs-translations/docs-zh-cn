# TypeScript 与选项式 API {#typescript-with-options-api}

> 这一章假设你已经阅读了[搭配 TypeScript 使用 Vue](./overview) 的概览。

:::tip
虽然 Vue 的确支持在选项式 API 中使用 TypeScript，但还是推荐通过 TypeScript 与组合式 API 来使用 Vue，因为它提供了更简单、更高效和更可靠的类型推导。
:::

## 为组件的 prop 标注类型 {#typing-component-props}

选项式 API 中对 prop 的类型推导需要用 `defineComponent()` 来包装组件。有了它，Vue 才可以通过 `props` 以及一些额外的选项，比如 `required: true` 和 `default` 来推导出 prop 的类型：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 启用了类型推导
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // 类型：string | undefined
    this.id // 类型：number | string | undefined
    this.msg // 类型：string
    this.metadata // 类型：any
  }
})
```

然而，这种运行时 `props` 选项仅支持使用构造函数来作为一个 prop 的类型——没有办法指定多层级对象或函数签名之类的复杂类型。

我们可以使用 `PropType` 这个工具类型来标记更复杂的 prop 类型：

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // 提供相对 `Object` 更确定的类型
      type: Object as PropType<Book>,
      required: true
    },
    // 也可以标记函数
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // TS Error: argument of type 'string' is not
    // assignable to parameter of type 'number'
    this.callback?.('123')
  }
})
```

### 注意事项 {#caveats}

因为一个 TypeScript 的 [设计限制](https://github.com/microsoft/TypeScript/issues/38845)，你在使用函数作为 prop 的 `validator` 和 `default` 选项值时需要格外小心——确保使用箭头函数：

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // 确保使用箭头函数
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

这会防止 Typescript 将 `this` 根据函数内的环境作出不符合我们期望的类型推导。

## 为组件的 emit 标注类型 {#typing-component-emits}

我们可以为使用了对象语法作为 `emits` 选项所触发的事件声明期望的载荷内容类型。并且，所有未声明的事件调用时都会抛出一个类型错误：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // 执行运行时校验
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // 类型错误
      })

      this.$emit('non-declared-event') // 类型错误
    }
  }
})
```

## 为计算属性标记类型 {#typing-computed-properties}

一个计算属性根据其返回值来推导其类型：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // 类型：string
  }
})
```

在某些场景中，你可能想要显式地标记出计算属性的类型以确保其实现是正确的：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // 显式标注返回类型
    greeting(): string {
      return this.message + '!'
    },

    // 标注一个可写的计算属性
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

在某些 TypeScript 因循环引用而无法推导类型的情况下，可能必须进行显式的类型标注。

## 为事件处理器标注类型 {#typing-event-handlers}

在处理原生 DOM 事件时，应该为我们传递给事件处理器的参数正确地标注类型。让我们看一下这个例子：

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `event` 隐式地标注为 `any` 类型
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

没有类型标注时，这个 `event` 参数会隐式地标注为 `any` 类型。这也会在 `tsconfig.json` 中配置了 `"strict": true` 或 `"noImplicitAny": true` 时抛出一个 TS 错误。因此，建议显式地为事件处理器的参数标注类型。此外，你可能需要显式地强制转换 `event` 上的 property：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## 扩充全局 property {#augmenting-global-properties}

某些插件通过 [`app.config.globalProperties`](/api/application.html#app-config-globalproperties) 为所有组件都安装了全局可用的 property。举个例子，我们可能为了请求数据而安装了 `this.$http`，或者为了国际化而安装了 `this.$translate`。为了使 TypeScript 更好地支持这个行为，Vue 暴露了一个被设计为可以通过 [TypeScript 模块扩充](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)来扩充的 `ComponentCustomProperties` 接口：

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

参考：

- [对组件类型扩展的 TypeScript 单元测试](https://github.com/vuejs/core/blob/main/test-dts/componentTypeExtensions.test-d.tsx)

### 类型扩充的位置 {#type-augmentation-placement}

我们可以将这些类型扩充放在一个 `.ts` 文件，或是一个以整个项目为范围的 `*.d.ts` 文件中。无论哪一种，确保在 `tsconfig.json` 中将其引入。对于库或插件作者，这个文件应该在 `package.json` 的 `types` property 中被列出。

为了利用模块扩充的优势，你需要确保将扩充的模块放在 [TypeScript 模块](https://www.typescriptlang.org/docs/handbook/modules.html) 中。 也就是说，该文件需要包含至少一个顶级的 `import` 或 `export`，即使它只是 `export {}`。如果扩充被放在模块之外，它将覆盖原始类型，而不是扩充!

## 扩充自定义选项 {#augmenting-custom-options}

某些插件，比如 `vue-router`，提供了一些自定义的组件选项，比如 `beforeRouteEnter`：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

如果没有确切的类型标注，这个钩子函数的参数会隐式地标注为 `any` 类型。我们可以为 `ComponentCustomOptions` 接口扩充自定义的选项来支持：

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

现在这个 `beforeRouterEnter` 选项会被准确地标注类型。注意这只是一个例子——像 `vue-router` 这种类型完备的库应该在它们自己的类型定义中自动执行这些扩充。

这种类型扩充和全局 property 扩充受到[相同的限制](#type-augmentation-placement)。

参考：

- [对组件类型扩展的 TypeScript 单元测试](https://github.com/vuejs/core/blob/main/test-dts/componentTypeExtensions.test-d.tsx)

<!-- zhlint disabled -->
