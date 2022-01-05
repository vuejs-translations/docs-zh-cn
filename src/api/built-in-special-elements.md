# Built-in Special Elements

`<component>` and `<slot>` are component-like features and part of the template syntax. They are not true components and are compiled away during template compilation.

## `<component>`

- **props：**

  - `is` - `string | Component`

- **用途：**

  A "meta component" for rendering dynamic components. The actual component to render is determined by the `is` prop. An `is` prop as a string could be either an HTML tag name or a Component name.

  ```vue-html
  <!-- a dynamic component controlled by -->
  <!-- the `componentId` property on the vm -->
  <component :is="componentId"></component>

  <!-- can also render registered component or component passed as prop -->
  <component :is="$options.components.child"></component>

  <!-- can reference components by string -->
  <component :is="condition ? 'FooComponent' : 'BarComponent'"></component>

  <!-- can be used to render native HTML elements -->
  <component :is="href ? 'a' : 'span'"></component>
  ```

  The built-in components `KeepAlive`, `Transition`, `TransitionGroup`, and `Teleport` can all be passed to `is`, but you must register them if you want to pass them by name. For example:

  ```js
  const { Transition, TransitionGroup } = Vue

  const Component = {
    components: {
      Transition,
      TransitionGroup
    },

    template: `
      <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
        ...
      </component>
    `
  }
  ```

  Registration is not required if you pass the component itself to `is` rather than its name.

- **其他相关：** [Dynamic Components](/guide/essentials/component-basics.html#dynamic-components)

## `<slot>`

- **props：**

  - `name` - `string`, Used for named slot.

- **用途：**

  `<slot>` serve as content distribution outlets in component templates. `<slot>` itself will be replaced.

  For detailed usage, see the guide section linked below.

- **其他相关：** [Content Distribution with Slots](/guide/essentials/component-basics.html#content-distribution-with-slots)
