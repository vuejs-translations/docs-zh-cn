# 应用实例 API  {#application-api}

## createApp()  {#createapp}

<!--
  TODO rework this
  TODO document that you can pass props to the root component
-->

在 Vue 3 之中，能够全局更改 Vue 行为的 API 现在都被移入了应用实例之下，实例由 `createApp` 方法创建。此外，现在它们的影响范围也只限于这个所创建的实例。

```js
import { createApp } from 'vue'

const app = createApp({})
```

调用 `createApp` 会返回一个应用实例。这个实例会提供一个应用程序上下文。该应用实例挂载的整个组件树都会共享这同一份上下文，也即提供了以前在 Vue 2.x 中是 “全局” 的配置。

另外，因为 `createApp` 会返回该实例本身，你还可以链式地调用实例的其他方法，你将在下面的介绍中了解到这些方法。

## createSSRApp()  {#createssrapp}

<!-- TODO -->

## app.mount()  {#appmount}

- **参数：**

  - `{Element | string} rootContainer`
  - `{boolean} isHydrate (optional)`

- **返回值：**

  - 根组件实例

- **用途：**

  所提供 DOM 元素的 `innerHTML` 将会被替换为该应用根组件渲染完成的模板。

- **示例：**

```vue-html
<body>
  <div id="my-app"></div>
</body>
```

```js
import { createApp } from 'vue'

const app = createApp({})
// 做一些其他必要的准备
app.mount('#my-app')
```

- **其他相关：**
  - [生命周期图示](/guide/essentials/lifecycle.html#lifecycle-diagram)

## app.unmount()  {#appunmount}

- **用途：**

  从 DOM 上卸载应用实例的根组件

- **示例：**

```vue-html
<body>
  <div id="my-app"></div>
</body>
```

```js
import { createApp } from 'vue'

const app = createApp({})
// 做一些必要的准备
app.mount('#my-app')

// 应用会在 5 秒之后被卸载
setTimeout(() => app.unmount(), 5000)
```

## app.provide()  {#appprovide}

- **参数：**

  - `{string | Symbol} key`
  - `value`

- **返回值：**

  - 应用实例

- **用途：**

  设置一个可以被应用中所有组件注入的值。其他组件应该使用 `inject` 来注入这个由应用供给的值。

  从 `provide`/`inject` 的视角来看，应用实例可以被认为是最高级别的祖先，它只有根组件这一个子节点。

  这个方法不应该与 [组件的 provide 选项](/) 或者组合式 API 中的 [provide 函数](/) 的概念相混淆。虽然它们都是同一套 `provide`/`inject` 的机制，但它们是用来配置组件级供给的，而非应用级供给。

  应用级的供给在编写插件时非常有用，因为插件一般不会通过组件来供给值。它也是使用 [globalProperties](/) 的另一种替代方案。

  :::tip 注意
  `provide` 和 `inject` 绑定 **不是** 响应式的。这是 Vue 设计时有意为之的。但是如果你传下去了一个响应式对象，该对象的属性的确会保持响应性。
  :::

- **示例：**

  在根组件中注入一个属性，该属性的值由应用实例提供：

```js
import { createApp } from 'vue'

const app = createApp({
  inject: ['user'],
  template: `
    <div>
      {{ user }}
    </div>
  `
})

app.provide('user', 'administrator')
```

- **其他相关：**
  - [Provide / Inject](/guide/components/provide-inject.html)

## app.component()  {#appcomponent}

- **参数：**

  - `{string} name`
  - `{Function | Object} definition (optional)`

- **返回值：**

  - 如果传入了参数 `definition`，那么返回的是组件实例。
  - 如果没有传入参数 `definition`，那么返回的是相应名字的组件定义对象

- **用途：**

  注册或是找回一个全局组件。注册时会自动将传入的 `name` 参数作为组件的 `name`。

- **示例：**

```js
import { createApp } from 'vue'

const app = createApp({})

// 通过一个选项对象注册
app.component('my-component', {
  /* ... */
})

// 找回一个注册了的组件
const MyComponent = app.component('my-component')
```

- **其他相关：** [Components](/)

## app.directive()  {#appdirective}

- **参数：**

  - `{string} name`
  - `{Function | Object} definition (optional)`

- **返回值：**

  - 如果传入了参数 `definition`，那么返回的是组件实例。
  - 如果没有传入参数 `definition`，那么返回的是相应名字的指令定义对象

- **用途：**

  注册或找回一个全局指令

- **示例：**

```js
import { createApp } from 'vue'
const app = createApp({})

// 注册
app.directive('my-directive', {
  // 指令有一系列的生命周期钩子：
  // 在 绑定目标元素的 attribute 之前 或者 事件监听器应用之前 调用
  created() {},
  // 在 所绑定元素所在的组件挂在前 调用
  beforeMount() {},
  // 在 所绑定元素所属的组件挂在后 调用
  mounted() {},
  // 在 所在组件 VNode 更新后 调用
  beforeUpdate() {},
  // 在 所在组件间的 VNode 即其子节点 VNode 都更新完成后 调用
  updated() {},
  // 在 所绑定元素所在的组件被卸载之前 调用
  beforeUnmount() {},
  // 在 所绑定元素所在的组件被卸载之后 调用
  unmounted() {}
})

// 注册（指令函数）
app.directive('my-directive', () => {
  // 这会作为 `mounted` 和 `updated` 调用
})

// 若注册过该名字的指令，将得到该指令定义对象
const myDirective = app.directive('my-directive')
```

下列参数将会被传入指令的钩子函数中：

#### el  {#el}

指令所绑定的元素。这可以用来直接操作 DOM。

#### binding  {#binding}

一个包含下列属性的对象：

- `instance`：使用到该指令的组件实例。
- `value`：传给该指令的值。举个例子，`v-my-directive="1 + 1"`，那么这个值就是 `2`。
- `oldValue`：之前的一个值。仅在 `beforeUpdate` 和 `updated` 中可用。无论该值是否更改，都可以使用。
- `arg`：传给该指令的参数，该项是可选的。比如 `v-my-directive:foo`，那么参数就是 `"foo"`。
- `modifiers`：一个包含修饰符的对象，该项是可选的。比如 `v-my-directive.foo.bar`，那么修饰符对象就会是 `{ foo: true, bar: true }`。
- `dir`：在指令被注册时作为参数传入的对象，举个例子：

```js
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
```

`dir` 就会是下面这个对象：

```js
{
  mounted(el) {
    el.focus()
  }
}
```

#### vnode  {#vnode}

作为上面提到的参数 el 的真实 DOM 元素相对应的一个蓝图表示。

#### prevNode  {#prevnode}

前一个 vnode，仅在 `beforeUpdate` 和 `updated` 钩子中可用。

:::tip 注意
除了 `el` 之外，你应该将其他的参数都视为只读的，并永远不要修改它们。如果你需要跨钩子共享信息，建议通过元素的 [dataset](/) 来实现。
:::

- **其他相关：** [自定义指令](/)

## app.use()  {#appuse}

- **参数：**

  - `{Object | Function} plugin`
  - `...options (optional)`

- **返回值：**

  - 应用实例

- **用途：**

  安装一个 Vue.js 插件。如果插件是一个对象，则必须暴露一个 `install` 方法。如果是一个函数，则它将被视为安装函数。

  安装函数将会此应用实例作为其第一个参数。任何传递给 `use` 的 `options` 都会被作为后续参数直接传入。

  当这个方法在同一个插件上被重复多次调用时，这个插件只会被安装一次。

- **示例：**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({})

  app.use(MyPlugin)
  app.mount('#app')
  ```

- **其他相关：** [插件](/)

## app.mixin()  {#appmixin}

- **参数：**

  - `{Object} mixin`

- **返回值：**

  - The application instance

- **用途：**

  Apply a mixin in the whole application scope. Once registered they can be used in the template of any component within the current application. This can be used by plugin authors to inject custom behavior into components. **Not recommended in application code**.

- **其他相关：** [Global Mixin](/)

## app.version  {#appversion}

- **用途：**

  Provides the installed version of Vue as a string. This is especially useful for community [plugins](/), where you might use different strategies for different versions.

- **示例：**

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])

      if (version < 3) {
        console.warn('This plugin requires Vue 3')
      }

      // ...
    }
  }
  ```

- **See also**: [Global API - version](/)

## app.config  {#appconfig}

Every Vue application exposes a `config` object that contains the configuration settings for that application:

```js
const app = createApp({})

console.log(app.config)
```

You can modify its properties, listed below, before mounting your application.

## app.config.errorHandler  {#appconfigerrorhandler}

- **类型：** `Function`

- **默认值：** `undefined`

- **用途：**

```js
app.config.errorHandler = (err, instance, info) => {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in
}
```

Assign a handler for uncaught errors during component render function and watchers. The handler gets called with the error and the application instance.

> Error tracking services [Sentry](/) and [Bugsnag](/) provide official integrations using this option.

## app.config.warnHandler  {#appconfigwarnhandler}

- **类型：** `Function`

- **默认值：** `undefined`

- **用途：**

```js
app.config.warnHandler = function (msg, instance, trace) {
  // `trace` is the component hierarchy trace
}
```

Assign a custom handler for runtime Vue warnings. Note this only works during development and is ignored in production.

## app.config.globalProperties  {#appconfigglobalproperties}

- **类型：** `[key: string]: any`

- **默认值：** `undefined`

- **用途：**

```js
app.config.globalProperties.foo = 'bar'

app.component('child-component', {
  mounted() {
    console.log(this.foo) // 'bar'
  }
})
```

Adds a global property that can be accessed in any component instance inside the application. The component’s property will take priority when there are conflicting keys.

This can replace Vue 2.x `Vue.prototype` extending:

```js
// Before
Vue.prototype.$http = () => {}

// After
const app = createApp({})
app.config.globalProperties.$http = () => {}
```

## app.config.optionMergeStrategies  {#appconfigoptionmergestrategies}

- **类型：** `{ [key: string]: Function }`

- **默认值：** `{}`

- **用途：**

```js
const app = createApp({
  mounted() {
    console.log(this.$options.hello)
  }
})

app.config.optionMergeStrategies.hello = (parent, child) => {
  return `Hello, ${child}`
}

app.mixin({
  hello: 'Vue'
})

// 'Hello, Vue'
```

Define merging strategies for custom options.

The merge strategy receives the value of that option defined on the parent and child instances as the first and second arguments, respectively.

- **其他相关：** [Custom Option Merging Strategies](/)

## app.config.performance  {#appconfigperformance}

- **类型：** `boolean`

- **默认值：** `false`

- **Usage**:

  Set this to `true` to enable component init, compile, render and patch performance tracing in the browser devtool performance/timeline panel. Only works in development mode and in browsers that support the [performance.mark](/) API.

## app.config.compilerOptions  {#appconfigcompileroptions}

- **类型：** `Object`

Configure runtime compiler options. Values set on this object will be passed to the in-browser template compiler and affect every component in the configured app. Note you can also override these options on a per-component basis using the [`compilerOptions` option](/).

::: warning Important
This config option is only respected when using the full build (i.e. the standalone `vue.js` that can compile templates in the browser). If you are using the runtime-only build with a build setup, compiler options must be passed to `@vue/compiler-dom` via build tool configurations instead.

- For `vue-loader`: [pass via the `compilerOptions` loader option](/). Also see [how to configure it in `vue-cli`](/).

- For `vite`: [pass via `@vitejs/plugin-vue` options](/).
  :::

### compilerOptions.isCustomElement  {#compileroptionsiscustomelement}

- **类型：** `(tag: string) => boolean`

- **默认值：** `undefined`

- **用途：**

```js
// any element starting with 'ion-' will be recognized as a custom one
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('ion-')
```

Specifies a method to recognize custom elements defined outside of Vue (e.g., using the Web Components APIs). If component matches this condition, it won't need local or global registration and Vue won't throw a warning about an `Unknown custom element`.

> Note that all native HTML and SVG tags don't need to be matched in this function - Vue parser performs this check automatically.

### compilerOptions.whitespace  {#compileroptionswhitespace}

- **类型：** `'condense' | 'preserve'`

- **默认值：** `'condense'`

- **用途：**

```js
app.config.compilerOptions.whitespace = 'preserve'
```

By default, Vue removes/condenses whitespaces between template elements to produce more efficient compiled output:

1. Leading / ending whitespaces inside an element are condensed into a single space
2. Whitespaces between elements that contain newlines are removed
3. Consecutive whitespaces in text nodes are condensed into a single space

Setting the value to `'preserve'` will disable (2) and (3).

### compilerOptions.delimiters  {#compileroptionsdelimiters}

- **类型：** `Array<string>`

- **默认值：** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **用途：**

```js
// Delimiters changed to ES6 template string style
app.config.compilerOptions.delimiters = ['${', '}']
```

Sets the delimiters used for text interpolation within the template.

Typically this is used to avoid conflicting with server-side frameworks that also use mustache syntax.

### compilerOptions.comments  {#compileroptionscomments}

- **类型：** `boolean`

- **默认值：** `false`

- **用途：**

```js
app.config.compilerOptions.comments = true
```

By default, Vue will remove HTML comments inside templates in production. Setting this option to `true` will force Vue to preserve comments even in production. Comments are always preserved during development.

This option is typically used when Vue is used with other libraries that rely on HTML comments.
