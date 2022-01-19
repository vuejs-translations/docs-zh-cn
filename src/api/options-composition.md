# Options: Composition

## provide

Provide values that can be injected by descendent components.

- **Type**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **Details:**

  `provide` and [`inject`](#inject) are used together to allow an ancestor component to serve as a dependency injector for all its descendants, regardless of how deep the component hierarchy is, as long as they are in the same parent chain.

  The `provide` option should be either an object or a function that returns an object. This object contains the properties that are available for injection into its descendants. You can use Symbols as keys in this object.

- **Example**

  Basic usage:

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```

  Using a function to provide per-component state:

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

  Note in the above example, the provided `msg` will NOT be reactive. See [Working with Reactivity](/guide/components/provide-inject.html#working-with-reactivity) for more details.

- **See also:** [Provide / Inject](/guide/components/provide-inject.html)

## inject

Declare properties to inject into the current component by locating them from ancestor providers.

- **Type**

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

- **Details**

  The `inject` option should be either:

  - An array of strings, or
  - An object where the keys are the local binding name and the value is either:
    - The key (string or Symbol) to search for in available injections, or
    - An object where:
      - The `from` property is the key (string or Symbol) to search for in available injections, and
      - The `default` property is used as fallback value. Similar to props default values, a factory function is needed for object types to avoid value sharing between multiple component instances.

  An injected property will be `undefined` is neither a matching property nor a default value was provided.

  Note that injected bindings are NOT reactive. This is intentional. However, if the injected value is a reactive object, properties on that object do remain reactive. See [Working with Reactivity](/guide/components/provide-inject.html#working-with-reactivity) for more details.

- **Example**

  Basic usage:

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  Using an injected value as the default for a prop:

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

  Using an injected value as data entry:

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

  Injections can be optional with default value:

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  If it needs to be injected from a property with a different name, use `from` to denote the source property:

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

  Similar to prop defaults, you need to use a factory function for non-primitive values:

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

- **其他相关：** [Provide / Inject](/guide/components/provide-inject.html)

## mixins

An array of option objects to be mixed into the current component.

- **Type**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **详细介绍：**

  The `mixins` option accepts an array of mixin objects. These mixin objects can contain instance options like normal instance objects, and they will be merged against the eventual options using the certain option merging logic. For example, if your mixin contains a `created` hook and the component itself also has one, both functions will be called.

  Mixin hooks are called in the order they are provided, and called before the component's own hooks.

  :::warning No Longer Recommended
  In Vue 2, mixins were the primary mechanism for creating reusable chunks of component logic. While mixins continue to be supported in Vue 3, [Composition API](/guide/reusability/composables.html) is now the preferred approach for code reuse between components.
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

## extends

A "base class" component to extend from.

- **Type:**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **详细介绍：**

  Allows one component to extend another, inheriting its component options.

  From an implementation perspective, `extends` is almost identical to `mixins`. The component specified by `extends` will be treated as though it were the first mixin.

  However, `extends` and `mixins` express different intents. The `mixins` option is primarily used to compose chunks of functionality, whereas `extends` is primarily concerned with inheritance.

  As with `mixins`, any options will be merged using the relevant merge strategy.

- **示例：**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```
