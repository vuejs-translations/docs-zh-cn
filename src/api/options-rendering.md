# Options: Rendering

## template

- **类型：** `string`

- **详细介绍：**

  A string template to be used as the markup for the component instance. The template will **replace** the `innerHTML` of mounted element. Any existing markup inside the mounted element will be ignored, unless content distribution slots are present in the template.

  If the string starts with `#` it will be used as a `querySelector` and use the selected element's innerHTML as the template string. This allows the use of the common `<script type="x-template">` trick to include templates.

  :::tip Note
  From a security perspective, you should only use Vue templates that you can trust. Never use user-generated content as your template.
  :::

  :::tip Note
  If render function is present in the Vue option, the template will be ignored.
  :::

- **其他相关：**
  - [Content Distribution with Slots](/guide/essentials/component-basics.html#content-distribution-with-slots)

## render

- **类型：** `Function`

- **详细介绍：**

  An alternative to string templates allowing you to leverage the full programmatic power of JavaScript.

- **用途：**

  ```vue-html
  <div id="app" class="demo">
    <my-title blog-title="A Perfect Vue"></my-title>
  </div>
  ```

  ```js
  const { createApp, h } = Vue
  const app = createApp({})

  app.component('my-title', {
    render() {
      return h(
        'h1', // tag name,
        this.blogTitle // tag content
      )
    },
    props: {
      blogTitle: {
        type: String,
        required: true
      }
    }
  })

  app.mount('#app')
  ```

  :::tip Note
  The `render` function has priority over the render function compiled from `template` option or in-DOM HTML template of the mounting element
  :::

- **其他相关：** [Render Functions](/guide/extras/render-function.html)
