# Vue 与 Web Components {#vue-and-web-components}

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 是一组 web 原生 API 的总称，允许开发者创建可重用的定制元素。

我们认为 Vue 和 Web Components 主要是互补的技术。Vue 为使用和创建定制元素提供了出色的支持。无论你是将自定义元素集成到现有的 Vue 应用程序中，还是使用 Vue 来构建和分发自定义元素都很方便。

## 在 Vue 中使用自定义元素 {#using-custom-elements-in-vue}

Vue [在 Custom Elements Everywhere 测试中取得了 100% 的分数](https://custom-elements-everywhere.com/libraries/vue/results/results.html)。在 Vue 应用中使用自定义元素基本上与使用原生 HTML 元素的效果相同，但需要留意以下几点：

### 跳过组件解析 {#skipping-component-resolution}

默认情况下，Vue 会倾向于解析一个非原生的 HTML 标签为一个注册过的 Vue 组件，而将“渲染一个自定义元素”作为后备选项。这会在开发时导致 Vue 抛出一个“解析组件失败”的警告。要让 Vue 知晓特定元素应该被视为自定义元素并跳过组件解析，我们可以指定 [`compilerOptions.isCustomElement` 这个选项](/api/application.html#app-config-compileroptions)。

如果在开发 Vue 应用时进行了构建配置，则应该在构建配置中传递该选项，因为它是一个编译时选项。

#### 浏览器内编译时的示例配置 {#example-in-browser-config}

```js
// 仅在浏览器内编译时才会工作
// 如果使用了构建工具，请看下面的配置示例
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

#### Vite 示例配置 {#example-vite-config}

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将所有带短横线的标签名都视为自定义元素
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Vue CLI 示例配置 {#example-vue-cli-config}

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // 将所有带 ion- 的标签名都视为自定义元素
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }))
  }
}
```

### 传递 DOM 属性 {#passing-dom-properties}

由于 DOM attribute 只能为字符串值，因此我们只能使用 DOM 对象的属性来传递复杂数据。当为自定义元素设置 props 时，Vue 3 将通过 `in` 操作符自动检查该属性是否已经存在于 DOM 对象上，并且在这个 key 存在时，更倾向于将值设置为一个 DOM 对象的属性。这意味着，在大多数情况下，如果自定义元素遵循[推荐的最佳实践](https://web.dev/index.md/)，你就不需要考虑这个问题。

然而，也会有一些特别的情况：必须将数据以一个 DOM 对象属性的方式传递，但该自定义元素无法正确地定义/反射这个属性 (因为 `in` 检查失败)。在这种情况下，你可以强制使用一个 `v-bind` 绑定、通过 `.prop` 修饰符来设置该 DOM 对象的属性：

```vue-html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- 等价简写 -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## 使用 Vue 构建自定义元素 {#building-custom-elements-with-vue}

自定义元素的主要好处是，它们可以与任何框架一起使用，甚至可以不使用框架。当终端用户可能使用了不同的前端技术栈时，或者当你希望将终端应用程序与它使用的组件实现细节隔离时，它们将成为理想的选择。

### defineCustomElement {#definecustomelement}

Vue 提供了一个和定义一般 Vue 组件几乎完全一致的 [`defineCustomElment`](/api/general.html#definecustomelement) 方法来支持创建自定义元素。这个方法接收的参数和 [`defineComponent`](/api/general.html#definecomponent) 完全相同。但它会返回一个继承自 `HTMLElement` 的自定义元素构造器：

```vue-html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // 这里是同平常一样的 Vue 组件选项
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement 特有的：注入进 shadow root 的 CSS
  styles: [`/* inlined css */`]
})

// 注册自定义元素
// 注册之后，所有此页面中的 `<my-vue-element>` 标签
// 都会被升级
customElements.define('my-vue-element', MyVueElement)

// 你也可以编程式地实例化元素：
// （必须在注册之后）
document.body.appendChild(
  new MyVueElement({
    // 初始化 props（可选）
  })
)
```

#### 生命周期 {#lifecycle}

- 当该元素的 [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) 初次调用时，一个 Vue 自定义元素会在内部挂载一个 Vue 组件实例到它的 shadow root 上。

- 当此元素的 `disconnectedCallback` 被调用时，Vue 会在一个微任务后检查元素是否从文档中脱离。

  - 如果元素仍然在文档中，那么说明它是一次移动，组件实例将被保留；

  - 如果该元素从文档中脱离，那么说明它是一次移除，组件实例将被解除挂载。

#### Props {#props}

- 所有使用 `props` 选项声明了的 props 都会作为属性定义在该自定义元素上。Vue 会自动地、恰当地处理其作为 attribute 还是属性的反射。

  - attribute 总是根据需要反射为相应的属性类型。

  - 基础类型的属性值 (`string`，`boolean` 或 `number`) 会被反射为 attribute。

- 当它们被设为 attribute 时 (永远是字符串)，Vue 也会自动将以 `Boolean` 或 `Number` 类型声明的 prop 转换为所期望的类型。比如下面这样的 props 声明：

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  并以下面这样的方式使用自定义元素：

  ```vue-html
  <my-element selected index="1"></my-element>
  ```

  在组件中，`selected` 会被转换为 `true` (boolean 类型值) 而 `index` 会被转换为 `1` (number 类型值)。

#### 事件 {#events}

通过 `this.$emit` 或者 setup 中的 `emit` 触发的事件都会通过以 [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) 的形式从自定义元素上派发。额外的事件参数 (payload) 将会被暴露为 CustomEvent 对象上的一个 `detail` 数组。

#### 插槽 {#slots}

在一个组件中，插槽将会照常使用 `<slot/>` 渲染。然而，当使用最终的元素时，它只接受[原生插槽的语法](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots)：

- [作用域插槽](/guide/components/slots.html#scoped-slots)是不支持的。

- 当传递具名插槽时，应使用 `slot` attribute 而不是 `v-slot` 指令：

  ```vue-html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### 供给 / 注入 {#provide-inject}

[供给 / 注入 API](/guide/components/provide-inject.html#provide-inject) 和[相应的组合式 API](/api/composition-api-dependency-injection.html#provide-inject) 在 Vue 定义的自定义元素中都可以正常工作。但是请注意，**只会在自定义元素之间**使用。例如一个 Vue 定义的自定义元素就无法注入一个由 Vue 组件所供给的属性。

### SFC 用作自定义元素 {#sfc-as-custom-element}

`defineCustomElement` 也可以搭配 Vue 单文件组件 (SFC) 使用。但是，根据默认的工具链配置，SFC 中的 `<style>` 在生产环境构建时仍然会被抽取和合并到一个单独的 CSS 文件中。当正在使用 SFC 编写自定义元素时，通常需要改为注入 `<style>` 标签到自定义元素的 shadow root 上。

官方的 SFC 工具链支持以“自定义元素模式”导入 SFC (需要 `@vitejs/plugin-vue@^1.4.0` 或 `vue-loader@^16.5.0`)。一个以自定义元素模式加载的 SFC 将会内联其 `<style>` 标签为 CSS 字符串，并将其暴露为组件的 `styles` 选项。这会被 `defineCustomElement` 提取使用，并在初始化时注入到元素的 shadow root 上。

要开启这个模式，只需要将你的组件文件以 `.ce.vue` 结尾即可：

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* 内联 css */"]

// 转换为自定义元素构造器
const ExampleElement = defineCustomElement(Example)

// 注册
customElements.define('my-example', ExampleElement)
```

如果你想要在自定义元素模式下指定需要导入的文件 (例如将所有的 SFC 都视为用作自定义元素)，你可以通过给构建插件传递相应插件的 `customElement` 选项来实现：

- [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### 对 Vue 自定义元素库的说明 {#tips-for-a-vue-custom-elements-library}

当使用 Vue 构建自定义元素时，该元素将依赖于 Vue 的运行时。这会有大约 16kb 的基线体积增长，并视功能的使用情况而增长。这意味着如果只编写一个定制元素，那么使用 Vue 并不理想。你可能想要使用原生 JavaScript、[petite-vue](https://github.com/vuejs/petite-vue)，或其他框架以追求更小的运行时体积。但是，如果你需要编写的是一组具有复杂逻辑的定制元素，那么这个基本体积是非常合理的，因为 Vue 允许用更少的代码编写每个组件。在一起发布的元素越多，收益就会越高。

如果定制元素将在同样使用 Vue 的应用程序中使用，那么你可以选择将构建包中的 Vue 外部化，这样这些自定义元素将与宿主应用程序使用同一份 Vue。

建议按元素分别导出构造函数，以便用户可以灵活地按需导入它们，并使用期望的标签名称注册它们。你还可以导出一个函数来方便用户自动注册所有元素。下面是一个 Vue 自定义元素库的入口文件示例：

```js
import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// 分别导出元素
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

如果你有非常多的组件，你也可以利用构建工具的功能，比如 Vite 的 [glob 导入](https://cn.vitejs.dev/guide/features.html#glob-import)或者 webpack 的 [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext) 来从一个文件夹加载所有的组件。

## Web Components vs. Vue 组件 {#web-components-vs-vue-components}

一些开发者认为应该避免使用框架专有的组件模型，并且认为使用自定义元素可以使应用“永不过时”。在这里，我们将解释为什么我们认为这样的想法过于简单。

自定义元素和 Vue 组件之间确实存在一定程度的功能重叠：它们都允许我们定义具有数据传递、事件发射和生命周期管理的可重用组件。然而，Web Components 的 API 相对来说是更底层的和更基础的。要构建一个实际的应用程序，我们需要相当多平台没有涵盖的附加功能：

- 一个声明式的、高效的模板系统；

- 一个响应式状态管理系统，促进跨组件逻辑提取和重用；

- 一种在服务器上呈现组件并在客户端水合组件的高性能方法 (SSR)，这对 SEO 和 [LCP 这样的 Web 关键指标](https://web.dev/vitals/)非常重要。原生自定义元素 SSR 通常需要在 Node.js 中模拟 DOM，然后序列化更改后的 DOM，而 Vue SSR 则尽可能地将其编译为拼接起来的字符串，这会高效得多。

Vue 的组件模型在设计时考虑到这些需求，将其作为一个更聚合的系统。

当团队中有足够的技术水平时，你可能可以在原生自定义元素的基础上构建等效的组件。但这也意味着你将承担长期维护内部框架的负担，同时失去了像 Vue 这样成熟的框架生态社区所带来的收益。

也有一些别的框架使用自定义元素作为其组件模型的基础，但它们都不可避免地要引入自己的专有解决方案来解决上面列出的问题。使用这些框架通常需要购买他们关于如何解决这些问题的技术决策。不管其广告上怎么宣传，也无法保证之后不会陷入潜在的问题之中。

我们还发现自定义元素在某些领域会受到限制：

- 贪婪的插槽计算会阻碍组件之间的组合。Vue 的[作用域插槽](/guide/components/slots.html#scoped-slots)是一套强有力的组件组合机制，而由于原生插槽的贪婪性质，自定义元素无法支持这些。贪婪插槽也意味着接收组件时不能控制何时或是否呈现插槽内容。

- 在当下要想使用 shadow DOM 局部范围的 CSS，必须将样式嵌入到 JavaScript 中才可以在运行时将其注入到 shadow root 上。这也导致了 SSR 场景下标记中的样式重复。虽然有一些[平台功能](https://github.com/whatwg/html/pull/4898/)在尝试解决这一领域的问题，但是直到现在还没有达到通用支持状态，而且仍有生产性能/ SSR 方面的问题需要解决。可与此同时，Vue 的 SFC 本身就提供了 [CSS 局域化机制](/api/sfc-css-features.html)，并支持抽取样式到纯 CSS 文件中。

Vue 将始终紧跟 Web 平台的最新标准，如果这个平台能让我们的工作变得更简单，我们将乐于利用它的原生功能。但是，我们的目标是提供“当下能办到且办得好”的解决方案。这意味着我们必须以一种批判性的心态来整合新的平台功能，包括补足标准不完善的地方，这是一个不争的事实。
