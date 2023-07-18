# 使用 Vue 的多种方式 {#ways-of-using-vue}

我们相信在 Web 的世界里没有一种方案可以解决所有问题。正因如此，Vue 被设计成一个灵活的、可以渐进式集成的框架。根据使用场景的不同需要，相应地有多种不同的方式来使用 Vue，以此在技术栈复杂度、开发体验和性能表现间取得最佳平衡。

## 独立脚本 {#standalone-script}

Vue 可以以一个单独 JS 文件的形式使用，无需构建步骤！如果你的后端框架已经渲染了大部分的 HTML，或者你的前端逻辑并不复杂，不需要构建步骤，这是最简单的使用 Vue 的方式。在这些场景中你可以将 Vue 看作一个更加声明式的 jQuery 替代品。

Vue 也提供了另一个更适用于此类无构建步骤场景的版本 [petite-vue](https://github.com/vuejs/petite-vue)。它为渐进式增强已有的 HTML 作了特别的优化，功能更加精简，十分轻量。

## 作为 Web Component 嵌入 {#embedded-web-components}

你可以用 Vue 来[构建标准的 Web Component](/guide/extras/web-components)，这些 Web Component 可以嵌入到任何 HTML 页面中，无论它们是如何被渲染的。这个方式让你能够在不需要顾虑最终使用场景的情况下使用 Vue：因为生成的 Web Component 可以嵌入到旧应用、静态 HTML，甚至用其他框架构建的应用中。

## 单页面应用 (SPA) {#single-page-application-spa}

一些应用在前端需要具有丰富的交互性、较深的会话和复杂的状态逻辑。构建这类应用的最佳方法是使用这样一种架构：Vue 不仅控制整个页面，还负责处理抓取新数据，并在无需重新加载的前提下处理页面切换。这种类型的应用通常称为单页应用 (Single-Page application，缩写为 SPA)。

Vue 提供了核心功能库和[全面的工具链支持](/guide/scaling-up/tooling)，为现代 SPA 提供了极佳的开发体验，覆盖以下方面：

- 客户端路由
- 极其快速的构建工具
- IDE 支持
- 浏览器开发工具
- TypeScript 支持
- 测试工具

SPA 一般要求后端提供 API 数据接口，但你也可以将 Vue 和如 [Inertia.js](https://inertiajs.com) 之类的解决方案搭配使用，在保留侧重服务端的开发模型的同时获得 SPA 的益处。

## 全栈 / SSR {#fullstack-ssr}

纯客户端的 SPA 在首屏加载和 SEO 方面有显著的问题，因为浏览器会收到一个巨大的 HTML 空页面，只有等到 JavaScript 加载完毕才会渲染出内容。

Vue 提供了一系列 API，支持将一个 Vue 应用在服务端渲染成 HTML 字符串。这能让服务器直接返回渲染好的 HTML，让用户在 JavaScript 下载完毕前就看到页面内容。Vue 之后会在客户端对应用进行“激活 (hydrate)”使其重获可交互性。这被称为[服务端渲染 (SSR)](/guide/scaling-up/ssr)，它能够极大地改善应用在 Web 核心指标上的性能表现，如[最大内容绘制 (LCP)](https://web.dev/lcp/)。

Vue 生态中有一些针对此类场景的、基于 Vue 的上层框架，比如 [NuxtJS](https://nuxt.com/)，能让你用 Vue 和 JavaScript 开发一个全栈应用。

## JAMStack / SSG {#jamstack-ssg}

如果所需的数据是静态的，那么服务端渲染可以提前完成。这意味着我们可以将整个应用预渲染为 HTML，并将其作为静态文件部署。这增强了站点的性能表现，也使部署变得更容易，因为我们无需根据请求动态地渲染页面。Vue 仍可通过激活在客户端提供交互。这一技术通常被称为静态站点生成 (SSG)，也被称为 [JAMStack](https://jamstack.org/what-is-jamstack/)。

SSG 有两种风格：单页和多页。这两种风格都能将站点预渲染为静态 HTML，区别在于：

- 单页 SSG 在初始页面加载后将其“激活”为 SPA。这需要更多的前期 JS 加载和激活成本，但后续的导航将更快，因为它只需要部分地更新页面内容，而无需重新加载整个页面。

- 多页 SSG 每次导航都会加载一个新页面。好处是它可以仅需最少的 JS——或者如果页面无需交互则根本不需要 JS！一些多页面 SSG 框架，如 [Astro](https://astro.build/) 也支持“部分激活”——它允许你通过 Vue 组件在静态 HTML 中创建交互式的“孤岛”。

单页 SSG 更适合于重交互、深会话的场景，或需要在导航之间持久化元素或状态。否则，多页 SSG 将是更好的选择。

Vue 团队也维护了一个名为 [VitePress](https://vitepress.dev/) 的静态站点生成器，你正在阅读的文档就是基于它构建的！VitePress 支持两种形式的 SSG。另外，[NuxtJS](https://nuxt.com/) 也支持 SSG。你甚至可以在同一个 Nuxt 应用中通过不同的路由提供 SSR 和 SSG。

## Web 之外... {#beyond-the-web}

尽管 Vue 主要是为构建 Web 应用而设计的，但它绝不仅仅局限于浏览器。你还可以：

- 配合 [Electron](https://www.electronjs.org/) 或 [Tauri](https://tauri.studio/en/) 构建桌面应用
- 配合 [Ionic Vue](https://ionicframework.com/docs/vue/overview) 构建移动端应用
- 使用 [Quasar](https://quasar.dev/) 用同一套代码同时开发桌面端和移动端应用
- 使用 Vue 的[自定义渲染 API](/api/custom-renderer) 来构建不同目标的渲染器，比如 [WebGL](https://troisjs.github.io/) 甚至是[终端命令行](https://github.com/vue-terminal/vue-termui)！
