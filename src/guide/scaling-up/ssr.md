---
outline: deep
---

# 服务端渲染 (SSR) {#server-side-rendering-ssr}

## 总览 {#overview}

### 什么是 SSR？ {#what-is-ssr}

Vue.js 是一个用于构建客户端应用的框架。默认情况下，Vue 组件的职责是在浏览器中生成和操作 DOM。然而，Vue 也支持将组件在服务端直接渲染成 HTML 字符串，作为服务端响应返回给浏览器，最后在浏览器端将静态的 HTML“激活”(hydrate) 为能够交互的客户端应用。

一个由服务端渲染的 Vue.js 应用也可以被认为是“同构的”(Isomorphic) 或“通用的”(Universal)，因为应用的大部分代码同时运行在服务端**和**客户端。

### 为什么要用 SSR？ {#why-ssr}

与客户端的单页应用 (SPA) 相比，SSR 的优势主要在于：

- **更快的首屏加载**：这一点在慢网速或者运行缓慢的设备上尤为重要。服务端渲染的 HTML 无需等到所有的 JavaScript 都下载并执行完成之后才显示，所以你的用户将会更快地看到完整渲染的页面。除此之外，数据获取过程在首次访问时在服务端完成，相比于从客户端获取，可能有更快的数据库连接。这通常可以带来更高的[核心 Web 指标](https://web.dev/vitals/)评分、更好的用户体验，而对于那些“首屏加载速度与转化率直接相关”的应用来说，这点可能至关重要。

- **统一的心智模型**：你可以使用相同的语言以及相同的声明式、面向组件的心智模型来开发整个应用，而不需要在后端模板系统和前端框架之间来回切换。

- **更好的 SEO**：搜索引擎爬虫可以直接看到完全渲染的页面。

  :::tip
  截至目前，Google 和 Bing 可以很好地对同步 JavaScript 应用进行索引。这里的“同步”是关键词。如果你的应用以一个 loading 动画开始，然后通过 Ajax 获取内容，爬虫并不会等到内容加载完成再抓取。也就是说，如果 SEO 对你的页面至关重要，而你的内容又是异步获取的，那么 SSR 可能是必需的。
  :::

使用 SSR 时还有一些权衡之处需要考量：

- 开发中的限制。浏览器端特定的代码只能在某些生命周期钩子中使用；一些外部库可能需要特殊处理才能在服务端渲染的应用中运行。

- 更多的与构建配置和部署相关的要求。服务端渲染的应用需要一个能让 Node.js 服务器运行的环境，不像完全静态的 SPA 那样可以部署在任意的静态文件服务器上。

- 更高的服务端负载。在 Node.js 中渲染一个完整的应用要比仅仅托管静态文件更加占用 CPU 资源，因此如果你预期有高流量，请为相应的服务器负载做好准备，并采用合理的缓存策略。

在为你的应用使用 SSR 之前，你首先应该问自己是否真的需要它。这主要取决于首屏加载速度对应用的重要程度。例如，如果你正在开发一个内部的管理面板，初始加载时的那额外几百毫秒对你来说并不重要，这种情况下使用 SSR 就没有太多必要了。然而，在内容展示速度极其重要的场景下，SSR 可以尽可能地帮你实现最优的初始加载性能。

### SSR vs. SSG {#ssr-vs-ssg}

**静态站点生成** (Static-Site Generation，缩写为 SSG)，也被称为预渲染，是另一种流行的构建快速网站的技术。如果用服务端渲染一个页面所需的数据对每个用户来说都是相同的，那么我们可以只渲染一次，提前在构建过程中完成，而不是每次请求进来都重新渲染页面。预渲染的页面生成后作为静态 HTML 文件被服务器托管。

SSG 保留了和 SSR 应用相同的性能表现：它带来了优秀的首屏加载性能。同时，它比 SSR 应用的花销更小，也更容易部署，因为它输出的是静态 HTML 和资源文件。这里的关键词是**静态**：SSG 仅可以用于消费静态数据的页面，即数据在构建期间就是已知的，并且在多次部署期间不会改变。每当数据变化时，都需要重新部署。

如果你调研 SSR 只是为了优化为数不多的营销页面的 SEO (例如 `/`、`/about` 和 `/contact` 等)，那么你可能需要 SSG 而不是 SSR。SSG 也非常适合构建基于内容的网站，比如文档站点或者博客。事实上，你现在正在阅读的这个网站就是使用 [VitePress](https://vitepress.dev/) 静态生成的，它是一个由 Vue 驱动的静态站点生成器。

## 基础教程 {#basic-tutorial}

### 渲染一个应用 {#rendering-an-app}

让我们来看一个 Vue SSR 最基础的实战示例。

1. 创建一个新的文件夹，`cd` 进入
2. 执行 `npm init -y`
3. 在 `package.json` 中添加 `"type": "module"` 使 Node.js 以 [ES modules mode](https://nodejs.org/api/esm.html#modules-ecmascript-modules) 运行
4. 执行 `npm install vue`
5. 创建一个 `example.js` 文件：

```js
// 此文件运行在 Node.js 服务器上
import { createSSRApp } from 'vue'
// Vue 的服务端渲染 API 位于 `vue/server-renderer` 路径下
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`
})

renderToString(app).then((html) => {
  console.log(html)
})
```

接着运行：

```sh
> node example.js
```

它应该会在命令行中打印出如下内容：

```
<button>1</button>
```

[`renderToString()`](/api/ssr#rendertostring) 接收一个 Vue 应用实例作为参数，返回一个 Promise，当 Promise resolve 时得到应用渲染的 HTML。当然你也可以使用 [Node.js Stream API](https://nodejs.org/api/stream.html) 或者 [Web Streams API](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API) 来执行流式渲染。查看 [SSR API 参考](/api/ssr)获取完整的相关细节。

然后我们可以把 Vue SSR 的代码移动到一个服务器请求处理函数里，它将应用的 HTML 片段包装为完整的页面 HTML。接下来的几步我们将会使用 [`express`](https://expressjs.com/)：

- 执行 `npm install express`
- 创建下面的 `server.js` 文件：

```js
import express from 'express'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const server = express()

server.get('/', (req, res) => {
  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.listen(3000, () => {
  console.log('ready')
})
```

最后，执行 `node server.js`，访问 `http://localhost:3000`。你应该可以看到页面中的按钮了。

[在 StackBlitz 上试试](https://stackblitz.com/fork/vue-ssr-example-basic?file=index.js)

### 客户端激活 {#client-hydration}

如果你点击该按钮，你会发现数字并没有改变。这段 HTML 在客户端是完全静态的，因为我们没有在浏览器中加载 Vue。

为了使客户端的应用可交互，Vue 需要执行一个**激活**步骤。在激活过程中，Vue 会创建一个与服务端完全相同的应用实例，然后将每个组件与它应该控制的 DOM 节点相匹配，并添加 DOM 事件监听器。

为了在激活模式下挂载应用，我们应该使用 [`createSSRApp()`](/api/application#createssrapp) 而不是 `createApp()`：

```js{2}
// 该文件运行在浏览器中
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...和服务端完全一致的应用实例
})

// 在客户端挂载一个 SSR 应用时会假定
// HTML 是预渲染的，然后执行激活过程，
// 而不是挂载新的 DOM 节点
app.mount('#app')
```

### 代码结构 {#code-structure}

想想我们该如何在客户端复用服务端的应用实现。这时我们就需要开始考虑 SSR 应用中的代码结构了——我们如何在服务器和客户端之间共享相同的应用代码呢？

这里我们将演示最基础的设置。首先，让我们将应用的创建逻辑拆分到一个单独的文件 `app.js` 中：

```js
// app.js (在服务器和客户端之间共享)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

该文件及其依赖项在服务器和客户端之间共享——我们称它们为**通用代码**。编写通用代码时有一些注意事项，我们将[在下面讨论](#writing-ssr-friendly-code)。

我们在客户端入口导入通用代码，创建应用并执行挂载：

```js
// client.js
import { createApp } from './app.js'

createApp().mount('#app')
```

服务器在请求处理函数中使用相同的应用创建逻辑：

```js{2,5}
// server.js (不相关的代码省略)
import { createApp } from './app.js'

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then(html => {
    // ...
  })
})
```

此外，为了在浏览器中加载客户端文件，我们还需要：

1. 在 `server.js` 中添加 `server.use(express.static('.'))` 来托管客户端文件。
2. 将 `<script type="module" src="/client.js"></script>` 添加到 HTML 外壳以加载客户端入口文件。
3. 通过在 HTML 外壳中添加 [Import Map](https://github.com/WICG/import-maps) 以支持在浏览器中使用 `import * from 'vue'`。

[在 StackBlitz 上尝试完整的示例](https://stackblitz.com/fork/vue-ssr-example?file=index.js)。按钮现在可以交互了！

## 更通用的解决方案 {#higher-level-solutions}

从上面的例子到一个生产就绪的 SSR 应用还需要很多工作。我们将需要：

- 支持 Vue SFC 且满足其他构建步骤要求。事实上，我们需要为同一个应用执行两次构建过程：一次用于客户端，一次用于服务器。

  :::tip
  Vue 组件用在 SSR 时的编译产物不同——模板被编译为字符串拼接而不是 render 函数，以此提高渲染性能。
  :::

- 在服务器请求处理函数中，确保返回的 HTML 包含正确的客户端资源链接和最优的资源加载提示 (如 prefetch 和 preload)。我们可能还需要在 SSR 和 SSG 模式之间切换，甚至在同一个应用中混合使用这两种模式。

- 以一种通用的方式管理路由、数据获取和状态存储。

完整的实现会非常复杂，并且取决于你选择使用的构建工具链。因此，我们强烈建议你使用一种更通用的、更集成化的解决方案，帮你抽象掉那些复杂的东西。下面推荐几个 Vue 生态中的 SSR 解决方案。

### Nuxt {#nuxt}

[Nuxt](https://nuxt.com/) 是一个构建于 Vue 生态系统之上的全栈框架，它为编写 Vue SSR 应用提供了丝滑的开发体验。更棒的是，你还可以把它当作一个静态站点生成器来用！我们强烈建议你试一试。

### Quasar {#quasar}

[Quasar](https://quasar.dev) 是一个基于 Vue 的完整解决方案，它可以让你用同一套代码库构建不同目标的应用，如 SPA、SSR、PWA、移动端应用、桌面端应用以及浏览器插件。除此之外，它还提供了一整套 Material Design 风格的组件库。

### Vite SSR {#vite-ssr}

Vite 提供了内置的 [Vue 服务端渲染支持](https://cn.vitejs.dev/guide/ssr.html)，但它在设计上是偏底层的。如果你想要直接使用 Vite，可以看看 [vite-plugin-ssr](https://vite-plugin-ssr.com/)，一个帮你抽象掉许多复杂细节的社区插件。

你也可以在[这里](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue)查看一个使用手动配置的 Vue + Vite SSR 的示例项目，以它作为基础来构建。请注意，这种方式只有在你有丰富的 SSR 和构建工具经验，并希望对应用的架构做深入的定制时才推荐使用。

## 书写 SSR 友好的代码 {#writing-ssr-friendly-code}

无论你的构建配置或顶层框架的选择如何，下面的原则在所有 Vue SSR 应用中都适用。

### 服务端的响应性 {#reactivity-on-the-server}

在 SSR 期间，每一个请求 URL 都会映射到我们应用中的一个期望状态。因为没有用户交互和 DOM 更新，所以响应性在服务端是不必要的。为了更好的性能，默认情况下响应性在 SSR 期间是禁用的。

### 组件生命周期钩子 {#component-lifecycle-hooks}

因为没有任何动态更新，所以像 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> 或者 <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> 这样的生命周期钩子**不会**在 SSR 期间被调用，而只会在客户端运行。<span class="options-api">只有 `beforeCreate` 和 `created` 这两个钩子会在 SSR 期间被调用。</span>

你应该避免在 <span class="options-api">`beforeCreate` 和 `created` </span><span class="composition-api">`setup()` 或者 `<script setup>` 的根作用域</span>中使用会产生副作用且需要被清理的代码。这类副作用的常见例子是使用 `setInterval` 设置定时器。我们可能会在客户端特有的代码中设置定时器，然后在 <span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> 或 <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span> 中清除。然而，由于 unmount 钩子不会在 SSR 期间被调用，所以定时器会永远存在。为了避免这种情况，请将含有副作用的代码放到 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> 中。

### 访问平台特有 API {#access-to-platform-specific-apis}

通用代码不能访问平台特有的 API，如果你的代码直接使用了浏览器特有的全局变量，比如 `window` 或 `document`，他们会在 Node.js 运行时报错，反过来也一样。

对于在服务器和客户端之间共享，但使用了不同的平台 API 的任务，建议将平台特定的实现封装在一个通用的 API 中，或者使用能为你做这件事的库。例如你可以使用 [`node-fetch`](https://github.com/node-fetch/node-fetch) 在服务端和客户端使用相同的 fetch API。

对于浏览器特有的 API，通常的方法是在仅客户端特有的生命周期钩子中惰性地访问它们，例如 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>。

请注意，如果一个第三方库编写时没有考虑到通用性，那么要将它集成到一个 SSR 应用中可能会很棘手。你*或许*可以通过模拟一些全局变量来让它工作，但这只是一种 hack 手段并且可能会影响到其他库的环境检测代码。

### 跨请求状态污染 {#cross-request-state-pollution}

在状态管理一章中，我们介绍了一种[使用响应式 API 的简单状态管理模式](state-management#simple-state-management-with-reactivity-api)。而在 SSR 环境中，这种模式需要一些额外的调整。

上述模式在一个 JavaScript 模块的根作用域中声明共享的状态。这是一种**单例模式**——即在应用的整个生命周期中只有一个响应式对象的实例。这在纯客户端的 Vue 应用中是可以的，因为对于浏览器的每一个页面访问，应用模块都会重新初始化。

然而，在 SSR 环境下，应用模块通常只在服务器启动时初始化一次。同一个应用模块会在多个服务器请求之间被复用，而我们的单例状态对象也一样。如果我们用单个用户特定的数据对共享的单例状态进行修改，那么这个状态可能会意外地泄露给另一个用户的请求。我们把这种情况称为**跨请求状态污染**。

从技术上讲，我们可以在每个请求上重新初始化所有 JavaScript 模块，就像我们在浏览器中所做的那样。但是，初始化 JavaScript 模块的成本可能很高，因此这会显著影响服务器性能。

推荐的解决方案是在每个请求中为整个应用创建一个全新的实例，包括 router 和全局 store。然后，我们使用[应用层级的 provide 方法](/guide/components/provide-inject#app-level-provide)来提供共享状态，并将其注入到需要它的组件中，而不是直接在组件中将其导入：

```js
// app.js （在服务端和客户端间共享）
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// 每次请求时调用
export function createApp() {
  const app = createSSRApp(/* ... */)
  // 对每个请求都创建新的 store 实例
  const store = createStore(/* ... */)
  // 提供应用级别的 store
  app.provide('store', store)
  // 也为激活过程暴露出 store
  return { app, store }
}
```

像 Pinia 这样的状态管理库在设计时就考虑到了这一点。请参考 [Pinia 的 SSR 指南](https://pinia.vuejs.org/zh/ssr/)以了解更多细节。

### 激活不匹配 {#hydration-mismatch}

如果预渲染的 HTML 的 DOM 结构不符合客户端应用的期望，就会出现激活不匹配。最常见的激活不匹配是以下几种原因导致的：

1. 组件模板中存在不符合规范的 HTML 结构，渲染后的 HTML 被浏览器原生的 HTML 解析行为纠正导致不匹配。举例来说，一个常见的错误是 [`<div>` 不能被放在 `<p>` 中](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it)：

   ```html
   <p><div>hi</div></p>
   ```

   如果我们在服务器渲染的 HTML 中出现这样的代码，当遇到 `<div>` 时，浏览器会结束第一个 `<p>`，并解析为以下 DOM 结构：

   ```html
   <p></p>
   <div>hi</div>
   <p></p>
   ```

2. 渲染所用的数据中包含随机生成的值。由于同一个应用会在服务端和客户端执行两次，每次执行生成的随机数都不能保证相同。避免随机数不匹配有两种选择：

   1. 利用 `v-if` + `onMounted` 让需要用到随机数的模板只在客户端渲染。你所用的上层框架可能也会提供简化这个用例的内置 API，比如 VitePress 的 `<ClientOnly>` 组件。

   2. 使用一个能够接受随机种子的随机数生成库，并确保服务端和客户端使用同样的随机数种子 (比如把种子包含在序列化的状态中，然后在客户端取回)。

3. 服务端和客户端的时区不一致。有时候我们可能会想要把一个时间转换为用户的当地时间，但在服务端的时区跟用户的时区可能并不一致，我们也并不能可靠的在服务端预先知道用户的时区。这种情况下，当地时间的转换也应该作为纯客户端逻辑去执行。

当 Vue 遇到激活不匹配时，它将尝试自动恢复并调整预渲染的 DOM 以匹配客户端的状态。这将导致一些渲染性能的损失，因为需要丢弃不匹配的节点并渲染新的节点，但大多数情况下，应用应该会如预期一样继续工作。尽管如此，最好还是在开发过程中发现并避免激活不匹配。

### 自定义指令 {#custom-directives}

因为大多数的自定义指令都包含了对 DOM 的直接操作，所以它们会在 SSR 时被忽略。但如果你想要自己控制一个自定义指令在 SSR 时应该如何被渲染 (即应该在渲染的元素上添加哪些 attribute)，你可以使用 `getSSRProps` 指令钩子：

```js
const myDirective = {
  mounted(el, binding) {
    // 客户端实现：
    // 直接更新 DOM
    el.id = binding.value
  },
  getSSRProps(binding) {
    // 服务端实现：
    // 返回需要渲染的 prop
    // getSSRProps 只接收一个 binding 参数
    return {
      id: binding.value
    }
  }
}
```

### Teleports {#teleports}

在 SSR 的过程中 Teleport 需要特殊处理。如果渲染的应用包含 Teleport，那么其传送的内容将不会包含在主应用渲染出的字符串中。在大多数情况下，更推荐的方案是在客户端挂载时条件式地渲染 Teleport。

如果你需要激活 Teleport 内容，它们会暴露在服务端渲染上下文对象的 `teleports` 属性下：

```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'teleported content' }
```

跟主应用的 HTML 一样，你需要自己将 Teleport 对应的 HTML 嵌入到最终页面上的正确位置处。

:::tip
请避免在 SSR 的同时把 Teleport 的目标设为 `body`——通常 `<body>` 会包含其他服务端渲染出来的内容，这会使得 Teleport 无法确定激活的正确起始位置。

推荐用一个独立的只包含 teleport 的内容的容器，例如 `<div id="teleported"></div>`。
:::
