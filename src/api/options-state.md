# 状态选项 {#options-state}

## data {#data}

用于声明组件初始响应式状态的函数。

- **类型**

  ```ts
  interface ComponentOptions {
    data?(
      this: ComponentPublicInstance,
      vm: ComponentPublicInstance
    ): object
  }
  ```

- **详细信息**

  该函数应当返回一个普通 JavaScript 对象，Vue 会将它转换为响应式对象。实例创建后，可以通过 `this.$data` 访问该响应式对象。组件实例也代理了该数据对象上所有的属性，因此 `this.a` 等价于 `this.$data.a`。

  所有会用到的顶层数据属性都应该提前在这个对象中声明。虽然理论上可以向 `this.$data` 添加新属性，但并不推荐这么做。如果一个属性的值在一开始还获取不到，应当先用 `undefined` 或是 `null` 值来占位，让 Vue 知道这个属性是存在的。

  以 `_` 或 `$` 开头的属性将**不会**被组件实例代理，因为它们可能和 Vue 的内置属性、API 方法冲突。你必须以 `this.$data._property` 的方式访问它们。

  **不**推荐返回一个可能改变自身状态的对象，如浏览器 API 原生对象或是带原型的类实例等。理想情况下，返回的对象应是一个纯粹代表组件状态的普通对象。

- **示例**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    created() {
      console.log(this.a) // 1
      console.log(this.$data) // { a: 1 }
    }
  }
  ```

  注意，如果你为 `data` 属性使用了一个箭头函数，则 `this` 将不会指向该组件实例，不过你仍然可以通过该函数的第一个参数来访问实例：

  ```js
  data: (vm) => ({ a: vm.myProp })
  ```

- **参考**[深入响应式系统](/guide/extras/reactivity-in-depth)

## props {#props}

用于声明一个组件的 props。

- **类型**

  ```ts
  interface ComponentOptions {
    props?: ArrayPropsOptions | ObjectPropsOptions
  }

  type ArrayPropsOptions = string[]

  type ObjectPropsOptions = { [key: string]: Prop }

  type Prop<T = any> = PropOptions<T> | PropType<T> | null

  interface PropOptions<T> {
    type?: PropType<T>
    required?: boolean
    default?: T | ((rawProps: object) => T)
    validator?: (value: unknown) => boolean
  }

  type PropType<T> = { new (): T } | { new (): T }[]
  ```

  > 为了便于阅读，对类型进行了简化。

- **详细信息**

  在 Vue 中，所有的组件 props 都需要被显式声明。组件 props 可以通过两种方式声明：

  - 使用字符串数组的简易形式。
  - 使用对象的完整形式。该对象的每个属性键是对应 prop 的名称，值则是该 prop 应具有的类型的构造函数，或是更高级的选项。

  在基于对象的语法中，每个 prop 可以进一步定义如下选项：

  - **`type`**：可以是下列原生构造函数之一：`String`、`Number`、`Boolean`、`Array`、`Object`、`Date`、`Function`、`Symbol`、任何自定义构造函数，或由上述内容组成的数组。在开发模式中，Vue 会检查一个 prop 的值是否匹配其声明的类型，如果不匹配则会抛出警告。详见 [Prop 校验](/guide/components/props#prop-validation)。

    还要注意，一个 `Boolean` 类型的 prop 会影响它在开发或生产模式下的值转换行为。详见 [Boolean 类型转换](/guide/components/props#boolean-casting)。

  - **`default`**：为该 prop 指定一个当其没有被传入或值为 `undefined` 时的默认值。对象或数组的默认值必须从一个工厂函数返回。工厂函数也接收原始 prop 对象作为参数。

  - **`required`**：定义该 prop 是否必需传入。在非生产环境中，如果 required 值为[真值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)且 prop 未被传入，一个控制台警告将会被抛出。

  - **`validator`**：将 prop 值作为唯一参数传入的自定义验证函数。在开发模式下，如果该函数返回一个[假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) (即验证失败)，一个控制台警告将会被抛出。

- **示例**

  简易声明：

  ```js
  export default {
    props: ['size', 'myMessage']
  }
  ```

  对象声明，带有验证：

  ```js
  export default {
    props: {
      // 类型检查
      height: Number,
      // 类型检查 + 其他验证
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
          return value >= 0
        }
      }
    }
  }
  ```

- **参考**
  - [指南 - Props](/guide/components/props)
  - [指南 - 为组件的 props 标注类型](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

## computed {#computed}

用于声明要在组件实例上暴露的计算属性。

- **类型**

  ```ts
  interface ComponentOptions {
    computed?: {
      [key: string]: ComputedGetter<any> | WritableComputedOptions<any>
    }
  }

  type ComputedGetter<T> = (
    this: ComponentPublicInstance,
    vm: ComponentPublicInstance
  ) => T

  type ComputedSetter<T> = (
    this: ComponentPublicInstance,
    value: T
  ) => void

  type WritableComputedOptions<T> = {
    get: ComputedGetter<T>
    set: ComputedSetter<T>
  }
  ```

- **详细信息**

  该选项接收一个对象，其中键是计算属性的名称，值是一个计算属性 getter，或一个具有 `get` 和 `set` 方法的对象 (用于声明可写的计算属性)。

  所有的 getters 和 setters 会将它们的 `this` 上下文自动绑定为组件实例。

  注意，如果你为一个计算属性使用了箭头函数，则 `this` 不会指向该组件实例，不过你仍然可以通过该函数的第一个参数来访问实例：

  ```js
  export default {
    computed: {
      aDouble: (vm) => vm.a * 2
    }
  }
  ```

- **示例**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    computed: {
      // 只读
      aDouble() {
        return this.a * 2
      },
      // 可写
      aPlus: {
        get() {
          return this.a + 1
        },
        set(v) {
          this.a = v - 1
        }
      }
    },
    created() {
      console.log(this.aDouble) // => 2
      console.log(this.aPlus) // => 2

      this.aPlus = 3
      console.log(this.a) // => 2
      console.log(this.aDouble) // => 4
    }
  }
  ```

- **参考**
  - [指南 - 计算属性](/guide/essentials/computed)
  - [指南 - 为计算属性标记类型](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

## methods {#methods}

用于声明要混入到组件实例中的方法。

- **类型**

  ```ts
  interface ComponentOptions {
    methods?: {
      [key: string]: (this: ComponentPublicInstance, ...args: any[]) => any
    }
  }
  ```

- **详细信息**

  声明的方法可以直接通过组件实例访问，或者在模板语法表达式中使用。所有的方法都会将它们的 `this` 上下文自动绑定为组件实例，即使在传递时也如此。

  在声明方法时避免使用箭头函数，因为它们不能通过 `this` 访问组件实例。

- **示例**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    methods: {
      plus() {
        this.a++
      }
    },
    created() {
      this.plus()
      console.log(this.a) // => 2
    }
  }
  ```

- **参考**[事件处理](/guide/essentials/event-handling)

## watch {#watch}

用于声明在数据更改时调用的侦听回调。

- **类型**

  ```ts
  interface ComponentOptions {
    watch?: {
      [key: string]: WatchOptionItem | WatchOptionItem[]
    }
  }

  type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type ObjectWatchOptionItem = {
    handler: WatchCallback | string
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > 为了便于阅读，对类型进行了简化。

- **详细信息**

  `watch` 选项期望接受一个对象，其中键是需要侦听的响应式组件实例属性 (例如，通过 `data` 或 `computed` 声明的属性)——值是相应的回调函数。该回调函数接受被侦听源的新值和旧值。

  除了一个根级属性，键名也可以是一个简单的由点分隔的路径，例如 `a.b.c`。注意，这种用法**不支持**复杂表达式——仅支持由点分隔的路径。如果你需要侦听复杂的数据源，可以使用命令式的 [`$watch()`](/api/component-instance#watch) API。

  值也可以是一个方法名称的字符串 (通过 `methods` 声明)，或包含额外选项的对象。当使用对象语法时，回调函数应被声明在 `handler` 中。额外的选项包含：

  - **`immediate`**：在侦听器创建时立即触发回调。第一次调用时，旧值将为 `undefined`。
  - **`deep`**：如果源是对象或数组，则强制深度遍历源，以便在深度变更时触发回调。详见[深层侦听器](/guide/essentials/watchers#deep-watchers)。
  - **`flush`**：调整回调的刷新时机。详见[回调的触发时机](/guide/essentials/watchers#callback-flush-timing)及 [`watchEffect()`](/api/reactivity-core#watcheffect)。
  - **`onTrack / onTrigger`**：调试侦听器的依赖关系。详见[侦听器调试](/guide/extras/reactivity-in-depth#watcher-debugging)。

  声明侦听器回调时避免使用箭头函数，因为它们将无法通过 `this` 访问组件实例。

- **示例**

  ```js
  export default {
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 4
        },
        e: 5,
        f: 6
      }
    },
    watch: {
      // 侦听根级属性
      a(val, oldVal) {
        console.log(`new: ${val}, old: ${oldVal}`)
      },
      // 字符串方法名称
      b: 'someMethod',
      // 该回调将会在被侦听的对象的属性改变时调动，无论其被嵌套多深
      c: {
        handler(val, oldVal) {
          console.log('c changed')
        },
        deep: true
      },
      // 侦听单个嵌套属性：
      'c.d': function (val, oldVal) {
        // do something
      },
      // 该回调将会在侦听开始之后立即调用
      e: {
        handler(val, oldVal) {
          console.log('e changed')
        },
        immediate: true
      },
      // 你可以传入回调数组，它们将会被逐一调用
      f: [
        'handle1',
        function handle2(val, oldVal) {
          console.log('handle2 triggered')
        },
        {
          handler: function handle3(val, oldVal) {
            console.log('handle3 triggered')
          }
          /* ... */
        }
      ]
    },
    methods: {
      someMethod() {
        console.log('b changed')
      },
      handle1() {
        console.log('handle 1 triggered')
      }
    },
    created() {
      this.a = 3 // => new: 3, old: 1
    }
  }
  ```

- **参考**[侦听器](/guide/essentials/watchers)

## emits {#emits}

用于声明由组件触发的自定义事件。

- **类型**

  ```ts
  interface ComponentOptions {
    emits?: ArrayEmitsOptions | ObjectEmitsOptions
  }

  type ArrayEmitsOptions = string[]

  type ObjectEmitsOptions = { [key: string]: EmitValidator | null }

  type EmitValidator = (...args: unknown[]) => boolean
  ```

- **详细信息**

  可以以两种形式声明触发的事件：

  - 使用字符串数组的简易形式。
  - 使用对象的完整形式。该对象的每个属性键是事件的名称，值是 `null` 或一个验证函数。

  验证函数会接收到传递给组件的 `$emit` 调用的额外参数。例如，如果 `this.$emit('foo', 1)` 被调用，`foo` 相应的验证函数将接受参数 `1`。验证函数应返回布尔值，以表明事件参数是否通过了验证。

  注意，`emits` 选项会影响一个监听器被解析为组件事件监听器，还是原生 DOM 事件监听器。被声明为组件事件的监听器不会被透传到组件的根元素上，且将从组件的 `$attrs` 对象中移除。详见[透传 Attributes](/guide/components/attrs)。

- **示例**

  数组语法：

  ```js
  export default {
    emits: ['check'],
    created() {
      this.$emit('check')
    }
  }
  ```

  对象语法：

  ```js
  export default {
    emits: {
      // 没有验证函数
      click: null,

      // 具有验证函数
      submit: (payload) => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`Invalid submit event payload!`)
          return false
        }
      }
    }
  }
  ```

- **参考**
  - [指南 - 透传 Attributes](/guide/components/attrs)
  - [指南 - 为组件的 emits 标注类型](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

## expose {#expose}

用于声明当组件实例被父组件通过模板引用访问时暴露的公共属性。

- **类型**

  ```ts
  interface ComponentOptions {
    expose?: string[]
  }
  ```

- **详细信息**

  默认情况下，当通过 `$parent`、`$root` 或模板引用访问时，组件实例将向父组件暴露所有的实例属性。这可能不是我们希望看到的，因为组件很可能拥有一些应保持私有的内部状态或方法，以避免紧耦合。

  `expose` 选项值应当是一个包含要暴露的属性名称字符串的数组。当使用 `expose` 时，只有显式列出的属性将在组件实例上暴露。

  `expose` 仅影响用户定义的属性——它不会过滤掉内置的组件实例属性。

- **示例**

  ```js
  export default {
    // 只有 `publicMethod` 在公共实例上可用
    expose: ['publicMethod'],
    methods: {
      publicMethod() {
        // ...
      },
      privateMethod() {
        // ...
      }
    }
  }
  ```
