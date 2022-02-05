# 使用 Vue 的多种方式 {#ways-of-using-vue}

在 Web 的世界中从来就没有可以适配所有场景、解决所有问题的的银弹。正因如此，Vue 被设计成一个灵活地、可以渐进式集成的框架。根据使用场景的不同需要，相应地有多种不同的方式来使用 Vue，以此平衡技术栈、开发体验和性能表现之间的复杂程度。

## 独立脚本 {#standalone-script}

Vue 可以是一个独立的脚本文件，无需构建步骤！如果你已经有了一个后端框架、承担大部分的 HTML 渲染，或者你的前端逻辑并不复杂，不需要构建步骤，这会是你集成 Vue 最容易的方式。你可以在这些场景中将 Vue 想象成 jQuery 的一个更加声明式的替代。

Vue 也提供了另一个适用于此类无构建步骤场景的替代版 [petite-vue](https://github.com/vuejs/petite-vue)，主要为渐进式增强已有的 HTML 作了特别的优化。功能更加精简，十分轻量。

## 嵌入 Web Component {#embedded-web-components}

你可以用 Vue 来[构建标准的 Web Component](/guide/extras/web-components)，这可以被嵌入在任何 HTML 页面中，无论它们是如何被渲染的。这个选项使你以一种完全与消费侧无关的方式利用 Vue 来生成 Web Component，它们可以嵌入旧版本的应用程序、静态 HTML，甚至用其他框架构建的应用程序。

## 单页面应用 (SPA) {#single-page-application-spa}

一些应用程序在前端需要有丰富的交互性和并不简单的有状态逻辑。构建这类应用程序的最佳方法是使用这样一种架构：Vue 不仅控制整个页面，还可以处理数据更新和导航，而无需重新加载页面。这种类型的应用程序通常称为单页面应用 (Single-Page application，SPA)。

Vue 提供了核心功能库和[综合性的工具链支持](/guide/scaling-up/tooling)，为现代 SPA 提供了非常好的开发体验，包括以下内容：

- 客户端侧路由
- 极其快速的构建工具
- IDE 支持
- 浏览器开发工具
- TypeScript 集成
- 测试工具

SPA 一般都依赖后端来暴露 API 端点，但你也可以将 Vue 和如 [Inertia.js](https://inertiajs.com) 之类的解决方案搭配使用，在保留以服务器为中心的开发模型的同时获得 SPA 的益处。

## 全栈 / SSR {#fullstack-ssr}

纯客户端的 SPA 在首屏加载和 SEO 方面有显著的问题。这是因为浏览器会收到一个巨大的 HTML 空页面，必须等到 JavaScript 加载完毕再渲染。

Vue 为服务端将一个 Vue 应用程序渲染成 HTML 字符串提供了第一优先级支持的 API。这使得可以从服务器得到渲染好的 HTML，使得用户在 JavaScript 还在下载的过程中也能立即看到页面内容。Vue 之后会在客户端侧对应用进行“水化 (hydrate)”使其重获可交互性。这被称为[服务端渲染 (SSR)](/guide/scaling-up/ssr)，它极大地改善了 Web 应用在重要的核心指标上的表现，如[最大内容绘制 (LCP)](https://web.dev/lcp/)。

也有一些针对此类场景、基于 Vue 构建的框架，比如 [NuxtJS](https://v3.nuxtjs.org/)，使你可以使用 Vue 和 JavaScript 开发一个全栈应用。

## JAMStack / SSG {#jamstack-ssg}

服务端渲染在所需数据为静态的前提下，可以使渲染提前完成。这意味着我们可以预先渲染整个应用为 HTML，并将其作为静态文件提供。这增强了站点的性能表现，使部署也变得更容易，因为我们无需根据请求的不同动态地渲染页面。Vue 仍可以通过水化在客户端侧提供交互。这一技术概念通常被称为静态站点生成 (SSG)，也被称为 [JAMStack](https://jamstack.org/what-is-jamstack/)。

Vue 团队维护了一个静态站点生成器 [VitePress](https://vitepress.vuejs.org/)，你正在阅读的本文档也正是基于它构建的！另外，[NuxtJS](https://v3.nuxtjs.org/) 也支持 SSG。你甚至可以在同一个 Nuxt 应用中通过不同的路由提供 SSR 和 SSG。

## Web 之外...{#beyond-the-web}

尽管 Vue 主要是为构建 Web 应用程序而设计的，但它绝不仅仅局限于浏览器。你还可以：

- 配合 [Electron](https://www.electronjs.org/) 或 [Tauri](https://tauri.studio/en/) 构建桌面应用
- 配合 [Ionic Vue](https://ionicframework.com/docs/vue/overview) 构建移动端应用
- 使用 [Quasar](https://quasar.dev/) 用同一套代码库同时开发桌面端和移动端应用
- 使用 Vue 的[自定义渲染 API](/api/custom-renderer) 来构建不同目标的渲染器，比如 [WebGL](https://troisjs.github.io/) 甚至是[终端命令行](https://github.com/ycmjason/vuminal)！
