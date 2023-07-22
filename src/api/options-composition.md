# 组合选项 {#options-composition}

## provide {#provide}

用于提供可以被后代组件注入的值。

- **类型**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **详细信息**

  `provide` 和 [`inject`](#inject) 通常成对一起使用，使一个祖先组件作为其后代组件的依赖注入方，无论这个组件的层级有多深都可以注入成功，只要他们处于同一条组件链上。

  这个 `provide` 选项应当是一个对象或是返回一个对象的函数。这个对象包含了可注入其后代组件的属性。你可以在这个对象中使用 Symbol 类型的值作为 key。

- **示例**

  基本使用方式：

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```

  使用函数可以提供其组件中的状态：

  ```js
  export default {
    data() {
      return {
        msg: 'foo'
      }
    }
    provide() {
      return {
        msg: this.msg
      }
    }
  }
  ```

  请注意，针对上面这个例子，所供给的 `msg` 将**不会**是响应式的。请查看[和响应式数据配合使用](/guide/components/provide-inject#working-with-reactivity)一节获取更多细节。

- **参考**[依赖注入](/guide/components/provide-inject)

## inject {#inject}

用于声明要通过从上层提供方匹配并注入进当前组件的属性。

- **类型**

  ```ts
  interface ComponentOptions {
    inject?: ArrayInjectOptions | ObjectInjectOptions
  }

  type ArrayInjectOptions = string[]

  type ObjectInjectOptions = {
    [key: string | symbol]:
      | string
      | symbol
      | { from?: string | symbol; default?: any }
  }
  ```

- **详细信息**

  该 `inject` 选项应该是以下两种之一：

  - 一个字符串数组
  - 一个对象，其 key 名就是在当前组件中的本地绑定名称，而它的值应该是以下两种之一：
    - 匹配可用注入的 key (string 或者 Symbol)
    - 一个对象
      - 它的 `from` 属性是一个 key (string 或者 Symbol)，用于匹配可用的注入
      - 它的 `default` 属性用作候补值。和 props 的默认值类似，如果它是一个对象，那么应该使用一个工厂函数来创建，以避免多个组件共享同一个对象。

  如果没有供给相匹配的属性、也没有提供默认值，那么注入的属性将为 `undefined`。

  请注意，注入绑定并非响应式的。这是有意为之的一个设计。如果要注入的值是一个响应式对象，那么这个对象上的属性将会保留响应性。请看[配合响应性](/guide/components/provide-inject#working-with-reactivity)一节获取更多细节。

- **示例**

  基本使用方式：

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  使用注入的值作为 props 的默认值：

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  使用注入的值作为 data：

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  注入项可以选择是否带有默认值：

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  如果需要从不同名字的属性中注入，请使用 `from` 指明来源属性。

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  和 props 默认值类似，对于非原始数据类型的值，你需要使用工厂函数：

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **参考**[依赖注入](/guide/components/provide-inject)

## mixins {#mixins}

一个包含组件选项对象的数组，这些选项都将被混入到当前组件的实例中。

- **类型**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **详细信息**

  `mixins` 选项接受一个 mixin 对象数组。这些 mixin 对象可以像普通的实例对象一样包含实例选项，它们将使用一定的选项合并逻辑与最终的选项进行合并。举例来说，如果你的 mixin 包含了一个 `created` 钩子，而组件自身也有一个，那么这两个函数都会被调用。

  Mixin 钩子的调用顺序与提供它们的选项顺序相同，且会在组件自身的钩子前被调用。

  :::warning 不再推荐
  在 Vue 2 中，mixins 是创建可重用组件逻辑的主要方式。尽管在 Vue 3 中保留了 mixins 支持，但对于组件间的逻辑复用，[使用组合式 API 的组合式函数](/guide/reusability/composables)是现在更推荐的方式。
  :::

- **示例**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

## extends {#extends}

要继承的“基类”组件。

- **类型**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **详细信息**

  使一个组件可以继承另一个组件的组件选项。

  从实现角度来看，`extends` 几乎和 `mixins` 相同。通过 `extends` 指定的组件将会当作第一个 mixin 来处理。

  然而，`extends` 和 `mixins` 表达的是不同的目标。`mixins` 选项基本用于组合功能，而 `extends` 则一般更关注继承关系。

  同 `mixins` 一样，所有选项 (`setup()` 除外) 都将使用相关的策略进行合并。

- **示例**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

  :::warning 不建议用于组合式 API
  `extends` 是为选项式 API 设计的，不会处理 `setup()` 钩子的合并。

  在组合式 API 中，逻辑复用的首选模式是“组合”而不是“继承”。如果一个组件中的逻辑需要复用，考虑将相关逻辑提取到[组合式函数](/guide/reusability/composables#composables)中。

  如果你仍然想要通过组合式 API 来“继承”一个组件，可以在继承组件的 `setup()` 中调用基类组件的 `setup()`：

  ```js
  import Base from './Base.js'
  export default {
    extends: Base,
    setup(props, ctx) {
      return {
        ...Base.setup(props, ctx),
        // 本地绑定
      }
    }
  }
  ```
  :::
