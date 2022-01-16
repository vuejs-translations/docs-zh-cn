---
footer: false
---

# 快速开始 {#quick-start}

根据你的使用场景和个人偏好，在使用 Vue 时，你可以选择是否采用构建流程。

## 采用构建工具 {#with-build-tools}

构建工具让我们能使用 Vue [单文件组件](/guide/scaling-up/sfc)(SFC)。Vue 官方的构建流程是基于 [Vite](https://vitejs.dev) 的，一个现代化轻量极速构建工具。

### 线上构建 {#online}

你可以通过 [StackBlitz](https://vite.new/vue) 在线尝试使用单文件组件编写 Vue。StackBlitz 可以在浏览器中直接运行基于 Vite 的构建步骤，所以它和本地构建几乎完全一致并且不需要在你的机器上安装任何依赖。

### 本地构建 {#local}

:::tip 前提条件

- 对命令行较为熟悉
- 已安装 [Node.js](https://nodejs.org/)
  :::

要在你的机器上创建一个启用构建工具的 Vue 项目，请在你的命令行中运行下面的指令（不要带上 `>` 符号）：

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt;</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

这一指令将会安装并执行 [create-vue](https://github.com/vuejs/create-vue)，它是 Vue 官方的项目脚手架工具。你将会看到一些可选功能的提示，比如选择是否使用 TypeScript 和测试:

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Cypress for testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

如果你还不确定是否要开启某个功能，那就直接按下回车键选择 `No`。当项目被创建后，跟随指引信息去安装好依赖，就可以启动开发服务器了：

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm install</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run dev</span></span>
<span class="line"></span></code></pre></div>

你现在应该已经运行起来了你的第一个 Vue 项目！下面是一些补充提示：

- 推荐的 IDE 配置是 [Visual Studio Code](https://code.visualstudio.com/) + [Volar 插件](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)，[WebStorm](https://www.jetbrains.com/webstorm/) 也是可以的。
- 更多工具细节，包括与后端框架的整合，我们都会在 [工具链指引](/guide/scaling-up/tooling.html) 章节进行说明。
- 要了解更多 Vite 构建工具的细节，请查看 [Vite 文档](https://cn.vitejs.dev)。
- 如果你选择使用 TypeScript，请阅读 [在 Vue 中使用 TypeScript](typescript/overview.html)。

当你准备将你的应用程序发布到生产环境中时，运行以下命令：

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"></span></code></pre></div>

此命令会在 `./dist` 文件夹中，为你的应用程序，构建一个可用于生产环境的版本。阅读 [生产环境开发指南](/guide/best-practices/production-deployment.html) 可以了解更多关于应用上线生产环境的内容。

[下一步 >](#next-steps)

## 不使用构建工具 {#without-build-tools}

若想不经过构建流程就可以使用 Vue，那直接复制下面的代码到一个 HTML 文件中，并在浏览器中打开它：

```html
<script src="https://unpkg.com/vue@3"></script>

<div id="app">{{ message }}</div>

<script>
  Vue.createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

上面的例子使用了全局构建版的 Vue，所有的 API 都暴露在了全局变量 `Vue` 上。在全局构建版可用的情况下，为保持一致性，我们将在剩余文档中主要使用 [原生 ES 模块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules) 的语法。若想通过原生 ES 模块使用 Vue，请使用下面这样的 HTML：

```html
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

值得注意的是，我们在代码中是直接从 `'vue'` 导入的，这是因为我们定义了 `<script type="importmap">` 块，使用了一个名为 [导入映射表（Import Maps）](https://caniuse.com/import-maps)的浏览器原生功能。由于目前只有基于 Chromium 的浏览器支持导入映射表，所以我们推荐你在学习过程中使用 Chrome 或 Edge。如果你更偏爱那些还不支持导入映射表的浏览器，这里有 [es-module-shims](https://github.com/guybedford/es-module-shims) 可以提供 polyfill。

你可以在映射表中添加其他的依赖，但请务必确保你使用的是该库的 ES 模块语法版本。

:::tip 不要用在生产环境
基于导入映射表的配置仅为了学习使用，如果你想在生产环境中不采用构建工具的情况下使用 Vue，请务必阅读 [生产开发指南](/guide/best-practices/production-deployment.html#without-build-tools)。
:::

### 通过 HTTP 提供服务 {#serving-over-http}

随着我们逐渐深入学习指引文档，我们可能需要将代码分割成单独的 JavaScript 文件，以便更容易管理。例如：

```html
<!-- index.html -->
<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>count is {{ count }}</div>`
}
```

为了使其能够工作，你需要通过 `http://` 协议为你的 HTML 提供服务，而不是 `file://` 协议。想启动一个本地的 HTTP 服务器，请先安装 [Node.js](https://nodejs.org/zh/)，然后在 HTML 文件所在文件夹下的命令行中运行 `npx serve`。 你也可以使用其他任何 HTTP 服务器，但它必须可以为具有正确 MIME 类型的静态文件提供服务。

可能你也注意到了，这里导入的组件模板是内联的 JavaScript 字符串。如果你正在使用 VSCode，你可以安装 [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) 扩展插件，然后在字符串前加上一个前缀注释 `/*html*/`，这样你就可以为其加上语法高亮了。

## 下一步 {#next-steps}

如果你跳过了 [简介](/guide/introduction)，我们强烈推荐你在移步到后续文档前，返回去阅读一下。

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application.html">
    <p class="next-steps-link">继续阅读指引</p>
    <p class="next-steps-caption">想要阅读更深入的指南，通过更完整的细节了解框架的核心概念。</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">尝试教程</p>
    <p class="next-steps-caption">适合喜欢动手学习的读者，让我们尝试做些真正有用的东西！</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">查看示例</p>
    <p class="next-steps-caption">快速浏览核心功能和常见的用户界面用例</p>
  </a>
</div>
