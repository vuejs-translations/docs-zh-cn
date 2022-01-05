# Options: Misc

## directives

- **类型：** `Object`

- **详细介绍：**

  A hash of directives to be made available to the component instance.

- **用途：**

  ```js
  const app = createApp({})

  app.component('focused-input', {
    directives: {
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    },
    template: `<input v-focus>`
  })
  ```

- **其他相关：** [Custom Directives](/guide/reusability/custom-directives.html)

## components

- **类型：** `Object`

- **详细介绍：**

  A hash of components to be made available to the component instance.

- **用途：**

  ```js
  const Foo = {
    template: `<div>Foo</div>`
  }

  const app = createApp({
    components: {
      Foo
    },
    template: `<Foo />`
  })
  ```

- **其他相关：** [Components](/guide/essentials/component-basics.html)

## name

- **类型：** `string`

- **详细介绍：**

  Allow the component to recursively invoke itself in its template. Note that when a component is registered globally with [`app.component`](/api/application.html#app-component), the global ID is automatically set as its name.

  Another benefit of specifying a `name` option is debugging. Named components result in more helpful warning messages. Also, when inspecting an app in the [vue-devtools](https://github.com/vuejs/vue-devtools), unnamed components will show up as `<AnonymousComponent>`, which isn't very informative. By providing the `name` option, you will get a much more informative component tree.

## inheritAttrs

- **类型：** `boolean`

- **默认值：** `true`

- **详细介绍：**

  By default, parent scope attribute bindings that are not recognized as props will "fallthrough". This means that when we have a single-root component, these bindings will be applied to the root element of the child component as normal HTML attributes. When authoring a component that wraps a target element or another component, this may not always be the desired behavior. By setting `inheritAttrs` to `false`, this default behavior can be disabled. The attributes are available via the `$attrs` instance property and can be explicitly bound to a non-root element using `v-bind`.

- **用途：**

  ```js
  app.component('base-input', {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input'],
    template: `
      <label>
        {{ label }}
        <input
          v-bind="$attrs"
          v-bind:value="value"
          v-on:input="$emit('input', $event.target.value)"
        >
      </label>
    `
  })
  ```

- **其他相关：** [Disabling Attribute Inheritance](/guide/components/attrs.html#disabling-attribute-inheritance)

## compilerOptions <Badge text="3.1+" />

- **类型：** `Object`

- **详细介绍：**

  This is the component-level equivalent of the [app-level `compilerOptions` config](/api/application.html#app-config-compileroptions).

- **用途：**

  ```js
  const Foo = {
    // ...
    compilerOptions: {
      delimiters: ['${', '}'],
      comments: true
    }
  }
  ```

  ::: tip Important
  Similar to the app-level `compilerOptions` config, this option is only respected when using the full build with in-browser template compilation.
  :::

## delimiters <Badge text="deprecated" type="warning" />

Deprecated in 3.1.0. Use `compilerOptions.delimiters` instead.
