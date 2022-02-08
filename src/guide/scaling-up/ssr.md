---
outline: deep
---

# 服务端渲染 (SSR) {#server-side-rendering-ssr}

## 总览 {#overview}

### 什么是 SSR？ {#what-is-ssr}

Vue.js 是一个用于构建客户端应用程序的框架。默认情况下，Vue 组件的功能是在浏览器中产生和操作 DOM。但是我们也可以将该组件在服务端渲染成 HTML 字符串后直接返回给浏览器，最后再并将静态标记“水化”为可交互的客户端应用。

一个由服务端渲染的 Vue.js 应用可以被认为是“同构”或者“通用”的，因为应用程序的大部分代码都可以在**服务端**和**客户端**上运行。

### 为什么要用 SSR？ {#why-ssr}

与传统 SPA (单页应用程序 (Single-Page Application)) 相比，服务器端渲染 (SSR) 的优势主要在于：

- **更快的内容到达时间**：更快的内容到达时间 (time-to-content)，特别是对于缓慢的网络情况或运行缓慢的设备。无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的标记，所以你的用户将会更快速地看到完整渲染的页面。通常可以达到更好的 [Web 应用核心指标](https://web.dev/vitals/)、产生更好的用户体验，并且对于那些“内容到达时间 (time-to-content) 与转化率直接相关”的应用程序而言，服务器端渲染 (SSR) 至关重要。

- **更统一的心智模型**：在开发整个应用程序时，你可以使用相同的语言和相同的声明式、面向组件的心理模型，而不需要在后端模板系统和前端框架之间来回切换。

- **更好的 SEO**：由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。

  :::tip
  请注意，截至目前，Google 和 Bing 可以很好对同步 JavaScript 应用程序进行索引。在这里，同步是关键。如果你的应用程序初始展示 loading 菊花图，然后通过 Ajax 获取内容，抓取工具并不会等待异步完成后再行抓取页面内容。也就是说，如果 SEO 对你的站点至关重要，而你的页面又是异步获取内容，则你可能需要服务器端渲染 (SSR) 解决此问题。
  :::

使用服务器端渲染 (SSR) 时还需要有一些权衡之处：

- 开发时需注意限制条件。仅供浏览器使用的代码，只能在某些生命周期钩子函数中使用；一些外部扩展库可能需要特殊处理，才能在服务器渲染应用程序中运行。

- 涉及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态 SPA 不同，服务器渲染应用程序，需要处于 Node.js 服务器运行环境。

- 更高的服务器端负载。在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的服务器更加占用 CPU 资源，因此如果你预期在高流量环境下使用，请准备充足的服务器负载，并采用更合理的缓存策略。

在对你的应用程序使用 SSR 之前，你应该问的第一个问题是：你是否真的需要它。这主要取决于内容到达时间对应用程序的重要程度。例如，如果你正在构建一个内部系统的仪表盘，初始加载时的额外几百毫秒并不重要，这种情况下去使用 SSR 将是一个小题大作之举。然而，如果对内容到达时间的要求是你应用中最关键的指标，那么 SSR 可以帮助你实现最优的初始加载性能。

### SSR vs. SSG {#ssr-vs-ssg}

**静态站点生成 (SSG)**，也被称为预渲染，是另一种流行的快速构建网站的技术。如果服务器渲染页面所需的数据对于每个用户来说都是相同的，那么我们可以只渲染一次，而不是每次出现请求时都呈现页面，提前在构建过程中。预构建的页面被生成并作为静态 HTML 文件提供。

SSG 保持了和 SSR 应用相同的性能表现：它提供了更短的内容到达耗时。同时它也更容易比一般的 SSR 应用更容易部署，因为其输出的都是静态资源与 HTML。关键是这个**静态**：SSG 仅可以用于页面为静态数据的场合，即数据在构建期间就已经完全获取到了，并在部署时不会再变化。每次数据变化时，都需要重新部署。

如果你只是想要使用 SSR 来提升一些销售页面的 SEO (例如 `/`、`/about` 和 `/contact` 等)，那么你应该考虑采用 SSG 代替 SSR。SSG 也非常适合构建基于内容的网站，比如文档或者博客。事实上，你现在正在阅读的这篇文档就是使用 [VitePress](https://vitepress.vuejs.org/) 所生成的，这是一个由 Vue 驱动的静态站点生成器。

## 基本使用 {#basic-usage}

### 渲染一个应用 {#rendering-an-app}

Vue 的服务端渲染 API 都被暴露在 `vue/server-renderer` 之下。

让我们看看一个 Vue SSR 最基本骨架的实战示例。首先，创建一个新的文件夹，并在其中运行 `npm install vue`。接着，创建一个 `example.mjs` 文件：

```js
// example.mjs
// 这会用 Node.js 运行在服务器上
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
const app = createSSRApp({
  data: () => ({ msg: 'hello' }),
  template: `<div>{{ msg }}</div>`
})
;(async () => {
  const html = await renderToString(app)
  console.log(html)
})()
```

接着运行：

```sh
> node example.mjs
```

...将会打印出下面的内容：

```html
<div>hello</div>
```

[`renderToString()`](/api/ssr.html#rendertostring) 接收一个 Vue 应用实例为参数，会返回一个 Promise，完成时得到该应用渲染完成的 HTML。当然你也可以使用 [Node.js Stream API](https://nodejs.org/api/stream.html) 或者 [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 来执行流式渲染。查看 [SSR API 参考](/api/ssr.html)获取完整的相关细节。

### 客户端水合 {#client-hydration}

在真实的 SSR 应用中，服务端渲染出的标记基本上都会是以下面这样的方式内嵌于 HTML 页面中：

```html{6}
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>
    <div id="app">
      <div>hello</div> <!-- 服务端渲染出的内容 -->
    </div>
  </body>
</html>
```

在客户端侧，Vue 需要执行**水合**这一步骤。它会创建与服务端相同的 Vue 应用，将每个组件匹配到它应该控制的 DOM 节点，并附加事件监听器，使应用变得可以交互。

和只有客户端的应用唯一不同的地方就是我们需要使用 [`createSSRApp()`](/api/application.html#createssrapp) 而不是 `createApp()`：

```js{2}
// 这运行在浏览器中
import { createSSRApp } from 'vue'
const app = createSSRApp({
  // ...和服务端完全一致的组件实例
})
// 挂载一个 SSR 应用在客户端，假设
// HTML 已经被预渲染，并会执行
// 水合过程，而不是挂载新的 DOM 节点
app.mount('#app')
```

## 高阶解决方案 {#higher-level-solutions}

虽然到目前为止的例子都比较简单，但满足生产环境需求的 SSR 应用程序是全栈项目，涉及到的东西远不止 Vue 的 API。我们将需要：

- 构建两次应用程序：一次用于客户端，另一次用于服务器。

  :::tip
  Vue 组件在用于 SSR 时的编译方式是不同的，模板被编译成字符串，而不是虚拟 DOM 渲染函数，以获得更高效的渲染性能。
  :::

- 在服务器的请求处理程序中，需要用正确的外壳标记来渲染 HTML 页面，包括客户端资源的 `<link>` 和资源标记。我们可能还需要在 SSR 和 SSG 模式之间作选择，甚至在同一个应用中混合使用这两种模式。

- 以通用方式管理路由、数据获取和状态管理存储。

这是相当高级别的，且高度依赖于你所选择的内置工具链的工作。因此，我们强烈建议采用更高阶的、相对独立的解决方案，为你抽象出复杂的东西。下面我们将介绍 Vue 生态系统中几个推荐的 SSR 解决方案。

### Nuxt {#nuxt}

[Nuxt](https://v3.nuxtjs.org/) 是一个高阶框架，构建于 Vue 生态系统之上，这为编写通用 Vue 应用程序提供了一种更简洁高效的开发体验。此外更好的是，你也可以用它来做静态站点生成！我们强烈建议你试一试它。

### Quasar {#quasar}

[Quasar](https://quasar.dev) 是一个完全基于 Vue 的解决方案，使你可以构建目标为 SPA、SSR、PWA、移动端、桌面端和浏览器插件的应用，而只需要一套代码。它不仅只提供了一套构建步骤，还提供了一整套 Material Design 的组件库。

### Vite SSR {#vite-ssr}

Vite 提供了内置的[对 Vue 服务端渲染](https://vitejs.dev/guide/ssr.html)的支持，但更加偏底层。如果你想要直接使用 Vite，请查看 [vite-plugin-ssr](https://vite-plugin-ssr.com/)，这是一个社区插件，为你抽象出了许多具有复杂的细节。

你也可以在[这里](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue)查看一个 Vue + Vite SSR 项目示例，这可以作为一个项目的起点。请注意，只有当您有使用过 SSR / 构建工具的经验，并且真正想要对更高级别的体系结构进行完全控制时，才建议您这样做。

## 书写 SSR 友好的代码 {#writing-ssr-friendly-code}

无论你的构建设置或高层框架选择如何，有一些原则适用于所有 Vue SSR 应用程序。

### 服务端的响应性 {#reactivity-on-the-server}

在 SSR 期间，每一个请求 URL 都会映射到我们应用中的一个期望状态。没有用户交互和 DOM 更新，因此响应性在服务端是不需要的。为了更好的性能，默认情况下响应性在 SSR 期间是禁用的。

### 组件生命周期钩子 {#component-lifecycle-hooks}

因为没有任何动态更新，像 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> 或者 <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> 这样的生命周期钩子**不会**被在 SSR 期间调用，并只会在客户端侧运行。<span class="options-api">只有 `beforeCreate` 和 `created`</span> 这两个钩子会在 SSR 期间被调用。

你应该避免在代码中产生需要在 <span class="options-api">`beforeCreate` 和 `created`</span><span class="composition-api">`setup()` 或 `<script setup>` 顶层级</span>中清理的副作用。这类副作用的常见例子是使用 `setInterval` 设置的一个定时器，在仅供客户端的代码中我们可能会设置一个定时器并在 <span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> 或 <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span> 中卸载。但是由于卸载钩子不会在 SSR 期间调用，所以这个定时器会永远循环。为避免这种情况，请将含这类副作用的代码改为放到 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> 中。

### 访问平台特有 API {#access-to-platform-specific-apis}

通用代码不能假设可以访问特定于平台的 API，因此如果你的代码直接使用了浏览器专供的全局变量，比如 `window` 或 `document`，会在 Node.js 执行它们时抛出错误。

对于服务器和客户端之间共享的任务，但使用了不同的平台 API，建议将特定平台的实现封装在一个通用的 API 中，或者使用能为你做这件事的库。例如你可以使用 [`node-fetch`](https://github.com/node-fetch/node-fetch) 在服务端和客户端使用相同的 fetch API。

对于仅供浏览器的 API，通常的方法是在仅客户端生命周期钩子中惰性地访问它们，例如 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>。

请注意，如果一个第三方库编写时没有考虑到普遍的使用。将它集成到一个 SSR 应用程序中可能会很棘手。你或许可以通过模仿一些全局变量来让它工作，但这可能会很麻烦，并且可能会干扰其他库的环境检测代码。

### 跨请求状态污染 {#cross-request-state-pollution}

在状态管理一章中，我们介绍了一种[使用响应性 API 的简单状态管理模式](state-management.html#simple-state-management-with-reactivity-api)。而在 SSR 环境中，这种模式需要一些额外的调整。

该模式将以**单例模式**共享状态声明。这意味着在我们应用程序的整个生命周期中，只有一个响应式对象的实例。这在纯客户端的 Vue 应用中是可以的，因为我们的应用代码在每个浏览器页面访问时都是全新初始化的。

然而，在 SSR 环境下，应用程序代码即在服务器启动时通常只在初始化一次。在这种情况下，我们应用程序中的状态管理单例将在服务器处理的多个请求中被共享。如果我们用一个用户的特定数据对共享的 store 单例进行更改，它可能会意外地泄露给另一个用户的请求。我们把这称为**跨请求的状态污染**。

推荐的解决方案是在每个请求中创建一个新的应用程序和共享对象的实例。然后，我们使用[应用级的供给](/guide/components/provide-inject.html#app-level-provide)来提供共享状态，并将其注入给需要它的组件中，而不是直接在我们的组件中将其导入：

```js
// app.js （在服务端和客户端间共享）
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

export function createApp() {
  const app = createSSRApp(/* ... */)
  // 对每个请求都创建新的 store 实例
  const store = createStore(/* ... */)
  // 应用级别的 store 供给
  app.provide('store', store)
  // 也为水合时暴露出 store
  return { app, store }
}
```

像 Pinia 这样的状态管理库在设计时就考虑到了这一点。请参考 [Pinia 的 SSR 指南](https://pinia.vuejs.org/ssr/)以了解更多细节。

### 水合不匹配 {#hydration-mismatch}

如果预渲染的 DOM 结构不符合客户端侧的期望，那么就是出现水合不匹配错误。在大多数场景中，这是由于浏览器的原生 HTML 解析行为试图纠正 HTML 字符串中的无效结构造成的。举个例子，一个问题就是 [`<div>` 无法被放置在 `<p>` 中](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it)：

```html
<p><div>hi</div></p>
```

如果我们在服务器渲染的 HTML 中产生这样的代码，当遇到 `<div>` 时，浏览器将终止第一个 `<p>`，并将其解析为以下 DOM 结构：

```html
<p></p>
<div>hi</div>
<p></p>
```

当 Vue 遇到水合不匹配时，它将尝试自动恢复并调整预渲染的 DOM 以匹配客户端的状态。这将导致一些渲染性能的损失，因为不正确的节点被丢弃，新的节点被加载，但在大多数情况下，应用程序应该会继续按预期工作。也就是说，最好还是在开发过程中消除水化不匹配。

### 自定义指令 {#custom-directives}

因为大多数的自定义指令都包含了对 DOM 的直接操作，所以它们会在 SSR 时被忽略。但如果你想要自己控制一个自定义指令在 SSR 时应该如何被渲染 (即应该在原上添加哪些 attribute)，你可以使用 `getSSRProps` 指令钩子：

```js
const myDirective = {
  mounted(el) {
    el.id = 'foo'
  },
  getSSRProps(binding, vnode) {
    // the hook the directive binding and the element vnode as arguments.
    // return props to be added to the vnode.
    return {
      id: 'foo'
    }
  }
}
```
