# 组合选项 {#options-composition}

## provide {#provide}

供给一些值给后代组件用来注入。

- **类型**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **详细信息**

  `provide` 和 [`inject`](#inject) 通常成对一起使用，使一个祖先组件作为其后代组件的依赖注入方，无论这个组件的层级有多深都可以注入成功，只要他们处于同一条传承链上。

  这个 `provide` 选项应该只能是一个对象或是返回一个对象的函数。这个对象包含了可注入其后代组件的属性。你可以在这个对象中使用 Symbol 类型的值作为 key。

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

  请注意，针对上面这个例子，所供给的 `msg` 将**不会**是响应式的。请看 [配合响应性](/guide/components/provide-inject.html#working-with-reactivity) 一节获取更多细节。

- **相关内容：** [依赖注入](/guide/components/provide-inject.html)

## inject {#inject}

通过 key 的索引，声明要从祖先供给方那里注入进当前组件的属性。

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
  - 一个对象，其 key 名就是在当前组件中的属性名，而它的值应该是以下两种之一：
    - 索引可用注入的 key（string 或者 Symbol）
    - 一个对象
      - 它的 `from` 属性是用于索引可用注入的 key（string 或者 Symbol）
      - 它的 `default` 属性用作候补值。和 props 的默认值类似，如果它是一个对象，那么应该使用一个工厂函数来创建，以避免多个组件共享同一个对象。

  如果没有供给所匹配的属性、也没有提供默认值，那么注入的属性将为 `undefined`。

  注意注入绑定并非响应式的。这是有意为之的一个设计。如果要注入的值是一个响应式对象，那么这个对象上的属性将会保留响应性。请看 [配合响应性](/guide/components/provide-inject.html#working-with-reactivity) 一节获取更多细节。

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

  类似 prop 默认值那样使用一个注入值：

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

  将所注入的值作为一个数据项来使用：

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

  如果需要从一个不同名称的属性中注入，请使用 `from` 来指明来源属性：

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

  和 prop 默认值类似，对于非基础类型的值，你都需要使用一个工厂函数：

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

- **相关内容：** [依赖注入](/guide/components/provide-inject.html)

## mixins {#mixins}

一个选项对象的数组，这些对象都将被混入到当前组件的实例中。

- **类型**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **详细信息**

  这个 `mixins` 选项应该是一个 mixin 对象数组。这些 mixin 对象可以像普通的实例对象一样包含实例选项，它们将使用一定的选项合并逻辑与最终的选项进行合并。举个例子，如果你的 mixin 包含了一个 `created` 钩子，而组件自身也有一个，那么这两个函数都会被调用。

  Mixin 钩子的调用顺序与组件的调用顺序相同，并且会在组件自己的钩子之前调用。

  :::warning 不再推荐
  在 Vue 2 中，mixins 是创建可重用组件逻辑的基本方式。尽管 mixins 在 Vue 3 中保留了支持，但对于组件间的逻辑复用，[Composition API](/guide/reusability/composables.html) 是现在更推荐的方式。
  :::

- **示例：**

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

要从中扩展的“基类”组件。

- **类型**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **详细信息**

  使一个组件可以继承另一个组件的组件选项。

  从实现角度来看，`extends` 几乎和 `mixins` 相同。通过 `extends` 声明的选项将会当作第一个 mixin 来处理。

  然而，`extends` 和 `mixins` 表达的是不同的目标。`mixins` 选项基本用于组合功能，而 `extends` 则一般更关注继承关系。

  同 `mixins` 一样，任何与当前组件相同的选项都将使用相应合并策略进行合并。

- **示例：**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```
