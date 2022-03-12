# 应用实例 API {#application-api} 

## createApp() {#createapp} 

创建一个应用实例。

- **类型**

  ```ts
  function createApp(rootComponent: Component, rootProps?: object): App
  ```

- **详细信息**

  第一个参数是根组件。第二个参数可选，它是要传递给根组件的 props。

- **示例**

  可以直接内联根组件：

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* root component options */
  })
  ```

  也可以使用从别处导入的组件：

  ```js
  import { createApp } from 'vue'
  import App from './App.vue'

  const app = createApp(App)
  ```

- **相关内容：** [指南 - 创建一个 Vue 应用实例](/guide/essentials/application.html)

## createSSRApp()  {#createssrapp}

以 [SSR 激活](/guide/scaling-up/ssr.html#client-hydration) 模式创建一个应用实例。用法与 `createApp()` 完全相同。

## app.mount()  {#appmount}

将应用程序实例挂载在一个容器元素中。

- **类型**

  ```ts
  interface App {
    mount(rootContainer: Element | string): ComponentPublicInstance
  }
  ```

- **详细信息**

  参数可以是一个实际的 DOM 元素或一个 CSS 选择器（使用第一个匹配到的元素）。返回根组件的实例。

  如果该组件有模板或定义了渲染函数，它将替换容器内所有现存的 DOM 节点。否则在运行时编译器可用的情况下，容器元素的 `innerHTML` 将被用作模板。

  在 SSR 激活模式下，它将激活容器内现有的 DOM 节点。如果出现了 [激活异常](/guide/scaling-up/ssr.html#hydration-mismatch)，那么现有的 DOM 节点将会经过变形来匹配预期的输出结果。

  对每个应用实例，`mount()` 仅能调用一次。

- **示例**

  ```js
  import { createApp } from 'vue'
  const app = createApp(/* ... */)

  app.mount('#app')
  ```

  也可以挂载到一个实际的 DOM 元素。

  ```js
  app.mount(document.body.firstChild)
  ```

## app.unmount()  {#appunmount}

卸载一个已经挂载好的应用实例，会触发应用组件树上所有组件的卸载生命周期钩子。

- **类型**

  ```ts
  interface App {
    unmount(): void
  }
  ```

## app.provide()  {#appprovide}

供给一个值，可以被应用中所有后代组件注入。

- **类型**

  ```ts
  interface App {
    provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
  }
  ```

- **详细信息**

  希望将注入的 key 作为第一个参数，并将供给的值作为第二个参数。返回应用程序实例本身。

- **示例**

  ```js
  import { createApp } from 'vue'

  const app = createApp(/* ... */)

  app.provide('message', 'hello')
  ```

  在应用的某个组件中：

  <div class="composition-api">

  ```js
  import { inject } from 'vue'

  export default {
    setup() {
      console.log(inject('message')) // 'hello'
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  export default {
    inject: ['message'],
    created() {
      console.log(this.message) // 'hello'
    }
  }
  ```

  </div>

- **相关内容：**
  - [依赖注入](/guide/components/provide-inject.html)
  - [应用层 Provide](/guide/components/provide-inject.html#app-level-provide)

## app.component() {#appcomponent} 

如果同时传递一个名字和一个组件定义，则注册一个全局组件；如果只传递一个名字，则会得到一个已经注册的组件。

- **类型**

  ```ts
  interface App {
    component(name: string): Component | undefined
    component(name: string, component: Component): this
  }
  ```

- **示例**

  ```js
  import { createApp } from 'vue'

  const app = createApp({})

  // 注册一个选项对象
  app.component('my-component', {
    /* ... */
  })

  // 得到一个已注册的组件
  const MyComponent = app.component('my-component')
  ```

- **相关内容：** [组件注册](/guide/components/registration.html)

## app.directive() {#appdirective} 

如果同时传递一个名字和一个指令定义，则注册一个全局指令；如果只传递一个名字，则会得到一个已经注册的指令。

- **类型**

  ```ts
  interface App {
    directive(name: string): Directive | undefined
    directive(name: string, directive: Directive): this
  }
  ```

- **示例**

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* ... */
  })

  // 注册（对象形式的指令）
  app.directive('my-directive', {
    /* 自定义指令钩子 */
  })

  // 注册（函数形式的指令）
  app.directive('my-directive', () => {
    /* ... */
  })

  // 得到一个已注册的指令
  const myDirective = app.directive('my-directive')
  ```

- **相关内容：** [自定义指令](/guide/reusability/custom-directives.html)

## app.use()  {#appuse}

安装一个 [插件]](/guide/reusability/plugins.html)。

- **类型**

  ```ts
  interface App {
    use(plugin: Plugin, ...options: any[]): this
  }
  ```

- **详细信息**

  希望将插件作为第一个参数，将插件选项作为可选的第二个参数。

  插件可以是一个带 `install()` 方法的对象，亦或直接是一个函数（它自己就将被用作安装方法）。插件选项（`app.use()` 的第二个参数）将会传递给插件的安装方法。

  若 `app.use()` 对同一个插件多次调用，该插件将只被安装一次。

- **示例**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({
    /* ... */
  })

  app.use(MyPlugin)
  ```

- **相关内容：** [插件](/guide/reusability/plugins.html)

## app.mixin() {#appmixin} 

应用一个全局 mixin（适用于该应用程序的范围）。一个全局的 mixin 会将其包含的选项应用于应用程序中的每个组件实例。

:::warning 不推荐
Mixins 在 Vue 3 支持主要是为了向后兼容，因为生态中有许多库使用到。目前 mixin，特别是全局 mixin，都应避免在应用程序代码中使用。

若要进行逻辑重用，推荐采用 [可组合函数](/guide/reusability/composables.html) 来替代。
:::

- **类型**

  ```ts
  interface App {
    mixin(mixin: ComponentOptions): this
  }
  ```

## app.version  {#appversion}

提供当前应用所使用的 Vue 版本号。这在 [插件](/guide/reusability/plugins.html) 中很有用，因为可能需要在不同的 Vue 版本上有不同的逻辑。

- **类型**

  ```ts
  interface App {
    version: string
  }
  ```

- **示例**

  在一个插件中对版本作判断：

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('This plugin requires Vue 3')
      }
    }
  }
  ```

- **相关内容：** [全局 API - version](/api/general.html#version)

## app.config {#appconfig} 

每个应用实例都会暴露一个 `config` 对象，其中包含了对这个应用的配置设定。你可以在挂载应用前更改这些属性（相关文档在下方）。

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

## app.config.errorHandler  {#appconfigerrorhandler}

为应用程序内传递的未捕获的错误指定一个全局处理程序。

- **类型**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info` 是一个 Vue 特定的错误信息
      // 例如：错误是在哪个生命周期的钩子上抛出的
      info: string
    ) => void
  }
  ```

- **详细信息**

  错误处理器接收三个参数：错误对象、触发该错误的组件实例和一个指出错误来源类型信息的字符串。

  它可以从下面这些来源中捕获错误：

  - 组件渲染器
  - 事件处理器
  - 生命周期钩子
  - `setup()` 函数
  - 侦听器
  - 自定义指令钩子
  - 过渡（Transition）钩子

- **示例**

  ```js
  app.config.errorHandler = (err, instance, info) => {
    // 处理错误，例如：报告给一个服务
  }
  ```

## app.config.warnHandler  {#appconfigwarnhandler}

为 Vue 的运行时警告指定一个自定义处理程序。

- **类型**

  ```ts
  interface AppConfig {
    warnHandler?: (
      msg: string,
      instance: ComponentPublicInstance | null,
      trace: string
    ) => void
  }
  ```

- **详细信息**

  警告处理器将接受警告信息作为其第一个参数，来源组件实例为第二个参数，以及组件追踪字符串作为第三个参数。

  这可以用户过滤筛选特定的警告信息，降低控制台输出的冗余。所有的 Vue 警告都需要在开发阶段得到解决，因此仅建议在调试期间选取部分特定警告，并且应该在调试完成之后立刻移除。

  :::tip
  警告仅会在开发阶段显示，因此在生产环境中，这条配置将被忽略。
  :::

- **示例**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace` is the component hierarchy trace
  }
  ```

## app.config.performance  {#appconfigperformance}

设置此项为 `true` 可以在浏览器开发工具的“性能/时间线”页中启用对组件初始化、编译、渲染和修补的性能表现追踪。仅在开发模式和支持 [performance.mark] API 的浏览器中工作。

- **类型**: `boolean`

- **相关内容：** [指南 - 性能](/guide/best-practices/performance.html)

## app.config.compilerOptions  {#appconfigcompileroptions}

配置运行时编译器的选项。设置在此对象上的值都会被传入该“浏览器内”模板编译器之中，并会影响到所配置应用的所有组件。另外你也可以通过 [`compilerOptions` 选项](/) 在每个组件的基础上覆盖这些选项。

::: warning 重要
此配置项仅在完整发行版中可用（即得到的 `vue.js` 可以在浏览器中编译模板）。如果你目前是通过搭配构建配置使用仅含运行时的发行版，那么编译器选项必须通过构建工具传递给 `@vue/compiler-dom`。

- 对于 `vue-loader`：[通过 `compilerOptions` loader 的选项传递](/)。并请阅读 [如何在 `vue-cli` 中配置它](/)。

- 对于 `vite`: [通过 `@vitejs/plugin-vue` 的选项传递](/)。
  :::

### app.compilerOptions.isCustomElement  {#appcompileroptionsiscustomelement}

指定一个检查方法来识别原生自定义元素。

- **类型** `(tag: string) => boolean`

- **详细信息**

  如果该标签需要当作原生自定义元素则应返回 `true`。对匹配到的标签，Vue 会将其渲染为原生元素而非将其视为一个 Vue 组件来解析。

  原生 HTML 和 SVG 标签不需要在此函数中进行匹配，Vue 的解析器会自动识别它们。

- **示例**

  ```js
  // 将所有标签前缀为 `ion-` 的标签视为自定义元素
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **相关内容：** [Vue 与 Web Components](/guide/extras/web-components.html)

### app.compilerOptions.whitespace  {#appcompileroptionswhitespace}

调整模板空格处理行为。

- **类型** `'condense' | 'preserve'`

- **默认** `'condense'`

- **详细信息**

  Vue 移除/缩短了模板中的空格以求更高效的模板输出。默认的策略是“缩短”，表现行为如下：

  1. 元素中开头和结尾的空格字符将被缩短为一个空格。
  2. 包含换行的元素之间的空白字符会被删除。
  3. 文本节点中连续的空白字符被缩短成一个空格。

  设置该选项为 `'preserve'` 则会禁用（2）和（3）两项。

- **示例**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### app.compilerOptions.delimiters  {#appcompileroptionsdelimiters}

调整模板内用于文本插值的分隔符。

- **类型** `[string, string]`

- **默认** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **详细信息**

  此项通常是为了避免与同样使用 mustache 语法的服务器端框架发生冲突。

- **示例**

  ```js
  // 分隔符改为ES6模板字符串样式
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### app.compilerOptions.comments  {#appcompileroptionscomments}

调整对模板中 HTML 注释的处理。

- **类型** `boolean`

- **默认** `false`

- **详细信息**

  默认情况下，Vue 会在生产环境移除所有注释，设置该项为 `true` 会强制 Vue 在生产环境也保留注释。在开发过程中，评论是始终被保留的。这个选项通常在 Vue 与其他依赖 HTML 注释的库一起使用时使用。

- **示例**

  ```js
  app.config.compilerOptions.comments = true
  ```

## app.config.globalProperties  {#appconfigglobalproperties}

该对象用于注册能够被应用内所有组件实例访问到的全局属性。

- **类型**

  ```ts
  interface AppConfig {
    globalProperties: Record<string, any>
  }
  ```

- **详细信息**

  这是对 Vue 2 中 `Vue.prototype` 使用方式的一种替代，此写法在 Vue 3 已经不存在了。与任何全局的东西一样，应该谨慎使用。

  如果全局属性与组件自己的属性冲突，组件自己的属性将具有更高的优先级。

- **用法**

  ```js
  app.config.globalProperties.msg = 'hello'
  ```

  这使得 `msg` 在应用的任意组件模板上都可用，并且也可以通过任意组件实例的 `this` 访问到：

  ```js
  export default {
    mounted() {
      console.log(this.msg) // 'hello'
    }
  }
  ```

## app.config.optionMergeStrategies  {#appconfigoptionmergestrategies}

一个用于定义自定义组件选项的合并策略的对象。

- **类型**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **详细信息**

  一些插件或库对自定义组件选项添加了支持（通过注入全局 mixin）。这些选项在有多个不同来源时可能需要特殊的合并策略（例如 mixin 或组件继承）。

  可以在 `app.config.optionMergeStrategies` 对象上以选项的名称作为 key，可以为一个自定义选项注册分配一个合并策略函数。

  合并策略函数分别接受在父实例和子实例上定义的该选项的值作为第一和第二个参数。

- **示例**

  ```js
  const app = createApp({
    // option from self
    msg: 'Vue',
    // option from a mixin
    mixins: [
      {
        msg: 'Hello '
      }
    ],
    mounted() {
      // 在 this.$options 上暴露被合并的选项
      console.log(this.$options.msg)
    }
  })

  // 为  `msg` 定义一个合并策略函数
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // 打印 'Hello Vue'
  ```

- **相关内容：** [组件实例 - `$options`](/api/component-instance.html#options)
