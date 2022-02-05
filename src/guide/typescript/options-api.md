# TypeScript 与选项式 API {#typescript-with-options-api}

> 这一章假设你已经阅读过了这篇 [搭配 TypeScript 使用 Vue](./overview) 的文档。

:::tip
虽然 Vue 的确支持在选项式 API 中使用 TypeScript，但还是推荐你搭配 TypeScript 和组合式 API 来使用 Vue，因为它提供了更简单、高效和更可靠的类型推导。
:::

## 为组件 props 标注类型 {#typing-component-props}

选项式 API 中对 props 的类型推导需要用 `defineComponent()` 来包裹组件。有了它，Vue 才可以通过 `props` 来推断出 props 的类型，另外还有一些其他的选项，比如 `required: true` 和 `default`：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 启用类型推导
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

然而，这种运行时 props 选项仅支持使用构造函数来作为一个 prop 的类型，而没有办法指定多层级对象或函数签名之类的复杂类型。

要标记更复杂的 props 类型，我们可以使用 `PropType` 这个工具类型。

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // 比 `Object` 提供更确定的类型
      type: Object as PropType<Book>,
      required: true
    },
    // 也可以标记函数类型
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // TS 错误：类型为 'string' 的参数无法
    // 赋值给类型为 'number' 的参数
    this.callback?.('123')
  }
})
```

### 约定 {#caveats}

因为一个 TypeScript 的 [设计限制](https://github.com/microsoft/TypeScript/issues/38845)，你在使用函数作为 prop 的 `validator` 和 `default` 选项值时需要格外小心，确保使用箭头函数：

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

const Component = defineComponent({
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

## 为组件的 emits 标注类型 {#typing-component-emits}

我们可以使用对象值作为 `emits` 选项的值，为所触发的事件声明期望的载荷内容类型。并且触发到所有未声明的事件时都会抛出一个类型错误：

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

一个计算属性可以根据其返回值来推导得出类型：

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

在某些场景中，你可能想要显式的标记出计算属性的类型以确保实现是正确的：

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // 显式标注出返回值类型作为此计算属性类型
    greeting(): string {
      return this.message + '!'
    },

    // 标注一个可写的计算属性的类型
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

显式的类型标注可能在某些 TypeScript 无法推导类型的循环引用的边界情况下是必须指定的。

## 为事件处理器标注类型 {#typing-event-handlers}

在处理原生 DOM 事件时，应该为我们传递给事件处理器的参数正确地标注类型。让我们看一下这个例子：

```vue
<script lang="ts">
export default {
  methods: {
    handleChange(event) {
      // `event` 隐式定位 `any` 类型
      console.log(event.target.value)
    }
  }
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

没有类型标注时，这个 `event` 参数会隐式定为类型 `any`。这也会在 `tsconfig.json` 中配置了 `"strict": true` 或 `"noImplicitAny": true` 时报出一个 TS 错误。因此，建议显式地为事件处理器的参数标注类型。此外，你可能需要显式地强制转换 `event` 上的属性：

```ts
export default {
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
}
```

## 扩充全局属性 {#augmenting-global-properties}

某些插件通过 [`app.config.globalProperties`](/api/application.html#app-config-globalproperties) 为所有组件都全局安装了一些属性。举个例子，我们可能为了请求数据 安装了 `this.$http`，或者为了国际化翻译安装了 `this.$translate`。为了使 TypeScript 更好地支持这个行为，Vue 暴露了一个 `ComponentCustomProperties` 接口，它被设计成通过 [TypeScript 模块扩充](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) 来进行属性扩充：

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

你也可以看看：

- [对组件类型扩展的 TypeScript 单元测试](https://github.com/vuejs/core/blob/main/test-dts/componentTypeExtensions.test-d.tsx)

### 类型扩充的位置 {#type-augmentation-placement}

我们可以将这些类型扩充放在一个 `.ts` 文件或一个以整个项目为范围的 `*.d.ts` 文件中。无论哪一种，你都需要在 `tsconfig.json` 中将其引入。对于库或插件作者，这个文件应该在 `package.json` 的 `type` 属性中被列出。

In order to take advantage of module augmentation, you will need to ensure the augmentation is placed in a [TypeScript module](https://www.typescriptlang.org/docs/handbook/modules.html). That is to say, the file needs to contain at least one top-level `import` or `export`, even if it is just `export {}`. If the augmentation is placed outside of a module, it will overwrite the original types rather than augmenting them!

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

没有确切的类型标注，这个钩子函数的参数会隐式定为 `any` 类型。我们可以为 `ComponentCustomOptions` 接口扩充自定义的选项来支持：

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: any, from: any, next: () => void): void
  }
}
```

现在这个 `beforeRouterEnter` 选项会被准确地类型化。注意这只是一个例子，像 `vue-router` 这样类型完备的库应该在它们自己的类型定义中自动执行这些扩充。

这种类型扩充和全局属性扩充受到 [相同的限制](#type-augmentation-placement)。

你也可以看看：

- [对组件类型扩展的 TypeScript 单元测试](https://github.com/vuejs/core/blob/main/test-dts/componentTypeExtensions.test-d.tsx)

<!-- zhlint disabled -->
