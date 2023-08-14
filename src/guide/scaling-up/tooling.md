# 工具链 {#tooling}

## 在线尝试 {#try-it-online}

你不需要在机器上安装任何东西，也可以尝试基于单文件组件的 Vue 开发体验。我们提供了一个在线的演练场，可以在浏览器中访问：

- [Vue SFC 演练场](https://play.vuejs.org)
  - 自动随着 Vue 仓库最新的提交更新
  - 支持检查编译输出的结果
- [StackBlitz 中的 Vue + Vite](https://vite.new/vue)
  - 类似 IDE 的环境，但实际是在浏览器中运行 Vite 开发服务器
  - 和本地开发效果更接近

在报告 Bug 时，我们也建议使用这些在线演练场来提供最小化重现。

## 项目脚手架 {#project-scaffolding}

### Vite {#vite}

[Vite](https://cn.vitejs.dev/) 是一个轻量级的、速度极快的构建工具，对 Vue SFC 提供第一优先级支持。作者是尤雨溪，同时也是 Vue 的作者！

要使用 Vite 来创建一个 Vue 项目，非常简单：

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">$</span> <span style="color:#A6ACCD;">npm create vue@latest</span></span></code></pre></div>

这个命令会安装和执行 [create-vue](https://github.com/vuejs/create-vue)，它是 Vue 提供的官方脚手架工具。跟随命令行的提示继续操作即可。

- 要学习更多关于 Vite 的知识，请查看 [Vite 官方文档](https://cn.vitejs.dev)。
- 若要了解如何为一个 Vite 项目配置 Vue 相关的特殊行为，比如向 Vue 编译器传递相关选项，请查看 [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme) 的文档。

上面提到的两种在线演练场也支持将文件作为一个 Vite 项目下载。

### Vue CLI {#vue-cli}

[Vue CLI](https://cli.vuejs.org/zh/) 是官方提供的基于 Webpack 的 Vue 工具链，它现在处于维护模式。我们建议使用 Vite 开始新的项目，除非你依赖特定的 Webpack 的特性。在大多数情况下，Vite 将提供更优秀的开发体验。

关于从 Vue CLI 迁移到 Vite 的资源：

- [VueSchool.io 的 Vue CLI -> Vite 迁移指南](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [迁移支持工具 / 插件](https://github.com/vitejs/awesome-vite#vue-cli)

### 浏览器内模板编译注意事项 {#note-on-in-browser-template-compilation}

当以无构建步骤方式使用 Vue 时，组件模板要么是写在页面的 HTML 中，要么是内联的 JavaScript 字符串。在这些场景中，为了执行动态模板编译，Vue 需要将模板编译器运行在浏览器中。相对的，如果我们使用了构建步骤，由于提前编译了模板，那么就无须再在浏览器中运行了。为了减小打包出的客户端代码体积，Vue 提供了[多种格式的“构建文件”](https://unpkg.com/browse/vue@3/dist/)以适配不同场景下的优化需求。

- 前缀为 `vue.runtime.*` 的文件是**只包含运行时的版本**：不包含编译器，当使用这个版本时，所有的模板都必须由构建步骤预先编译。

- 名称中不包含 `.runtime` 的文件则是**完全版**：即包含了编译器，并支持在浏览器中直接编译模板。然而，体积也会因此增长大约 14kb。

默认的工具链中都会使用仅含运行时的版本，因为所有 SFC 中的模板都已经被预编译了。如果因为某些原因，在有构建步骤时，你仍需要浏览器内的模板编译，你可以更改构建工具配置，将 `vue` 改为相应的版本 `vue/dist/vue.esm-bundler.js`。

如果你需要一种更轻量级，不依赖构建步骤的替代方案，也可以看看 [petite-vue](https://github.com/vuejs/petite-vue)。

## IDE 支持 {#ide-support}

- 推荐使用的 IDE 是 [VSCode](https://code.visualstudio.com/)，配合 [Vue 语言特性 (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 插件。该插件提供了语法高亮、TypeScript 支持，以及模板内表达式与组件 props 的智能提示。

  :::tip
  Volar 取代了我们之前为 Vue 2 提供的官方 VSCode 扩展 [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)。如果你之前已经安装了 Vetur，请确保在 Vue 3 的项目中禁用它。
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) 同样也为 Vue 的单文件组件提供了很好的内置支持。

- 其他支持[语言服务协议](https://microsoft.github.io/language-server-protocol/) (LSP) 的 IDE 也可以通过 LSP 享受到 Volar 所提供的核心功能：

  - Sublime Text 通过 [LSP-Volar](https://github.com/sublimelsp/LSP-volar) 支持。

  - vim / Neovim 通过 [coc-volar](https://github.com/yaegassy/coc-volar) 支持。

  - emacs 通过 [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/) 支持。

## 浏览器开发者插件 {#browser-devtools}

<VueSchoolLink href="https://vueschool.io/lessons/using-vue-dev-tools-with-vuejs-3" title="免费的 Vue.js Devtools 课程"/>

Vue 的浏览器开发者插件使我们可以浏览一个 Vue 应用的组件树，查看各个组件的状态，追踪状态管理的事件，还可以进行组件性能分析。

![devtools 截图](https://raw.githubusercontent.com/vuejs/devtools/main/media/screenshot-shadow.png)

- [文档](https://devtools.vuejs.org/)
- [Chrome 扩展商店页](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Firefox 所属插件页](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Edge 扩展](https://microsoftedge.microsoft.com/addons/detail/vuejs-devtools/olofadcdnkkjdfgjcmjaadnlehnnihnl)
- [独立的 Electron 应用所属插件](https://devtools.vuejs.org/guide/installation.html#standalone)

## TypeScript {#typescript}

具体细节请参考章节：[配合 TypeScript 使用 Vue](/guide/typescript/overview)。

- [Volar](https://github.com/johnsoncodehk/volar) 插件能够为 `<script lang="ts">` 块提供类型检查，也能对模板内表达式和组件之间 props 提供自动补全和类型验证。

- 使用 [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/vue-tsc) 可以在命令行中执行相同的类型检查，通常用来生成单文件组件的 `d.ts` 文件。

## 测试 {#testing}

具体细节请参考章节：[测试指南](/guide/scaling-up/testing)。

- [Cypress](https://www.cypress.io/) 推荐用于 E2E 测试。也可以通过 [Cypress 组件测试运行器](https://docs.cypress.io/guides/component-testing/introduction)来给 Vue SFC 作单文件组件测试。

- [Vitest](https://vitest.dev/) 是一个追求更快运行速度的测试运行器，由 Vue / Vite 团队成员开发。主要针对基于 Vite 的应用设计，可以为组件提供即时响应的测试反馈。

- [Jest](https://jestjs.io/) 可以通过 [vite-jest](https://github.com/sodatea/vite-jest) 配合 Vite 使用。不过只推荐在你已经有一套基于 Jest 的测试集、且想要迁移到基于 Vite 的开发配置时使用，因为 Vitest 也能够提供类似的功能，且后者与 Vite 的集成更方便高效。

## 代码规范 {#linting}

Vue 团队维护着 [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) 项目，它是一个 [ESLint](https://eslint.org/) 插件，会提供 SFC 相关规则的定义。

之前使用 Vue CLI 的用户可能习惯于通过 webpack loader 来配置规范检查器。然而，若基于 Vite 构建，我们一般推荐：

1. `npm install -D eslint eslint-plugin-vue`，然后遵照 `eslint-plugin-vue` 的[指引](https://eslint.vuejs.org/user-guide/#usage)进行配置。

2. 启用 ESLint IDE 插件，比如 [ESLint for VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)，然后你就可以在开发时获得规范检查器的反馈。这同时也避免了启动开发服务器时不必要的规范检查。

3. 将 ESLint 格式检查作为一个生产构建的步骤，保证你可以在最终打包时获得完整的规范检查反馈。

4. (可选) 启用类似 [lint-staged](https://github.com/okonet/lint-staged) 一类的工具在 git commit 提交时自动执行规范检查。

## 格式化 {#formatting}

- [Volar](https://github.com/johnsoncodehk/volar) VSCode 插件为 Vue SFC 提供了开箱即用的格式化功能。

- 除此之外，[Prettier](https://prettier.io/) 也提供了内置的 Vue SFC 格式化支持。

## SFC 自定义块集成 {#sfc-custom-block-integrations}

自定义块被编译成导入到同一 Vue 文件的不同请求查询。这取决于底层构建工具如何处理这类导入请求。

- 如果使用 Vite，需使用一个自定义 Vite 插件将自定义块转换为可执行的 JavaScript 代码。[示例](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)。

- 如果使用 Vue CLI 或只是 webpack，需要使用一个 loader 来配置如何转换匹配到的自定义块。[示例](https://vue-loader.vuejs.org/zh/guide/custom-blocks.html)。

## 底层库 {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [文档](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

这个包是 Vue 核心 monorepo 的一部分，并始终和 `vue` 主包版本号保持一致。它已经成为 `vue` 主包的一个依赖并代理到了 `vue/compiler-sfc` 目录下，因此你无需单独安装它。

这个包本身提供了处理 Vue SFC 的底层的功能，并只适用于需要支持 Vue SFC 相关工具链的开发者。

:::tip
请始终选择通过 `vue/compiler-sfc` 的深度导入来使用这个包，因为这样可以确保其与 Vue 运行时版本同步。<!-- TODO: need check -->
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [文档](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

为 Vite 提供 Vue SFC 支持的官方插件。

### `vue-loader` {#vue-loader}

- [文档](https://vue-loader.vuejs.org/zh/)

为 webpack 提供 Vue SFC 支持的官方 loader。如果你正在使用 Vue CLI，也可以看看[如何在 Vue CLI 中更改 `vue-loader` 选项的文档](https://cli.vuejs.org/zh/guide/webpack.html#%E4%BF%AE%E6%94%B9-loader-%E9%80%89%E9%A1%B9)。

## 其他在线演练场 {#other-online-playgrounds}

- [VueUse Playground](https://play.vueuse.org)
- [Vue + Vite on Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue on CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue on Codepen](https://codepen.io/pen/editor/vue)
- [Vue on Components.studio](https://components.studio/create/vue3)
- [Vue on WebComponents.dev](https://webcomponents.dev/create/cevue)

<!-- TODO ## Backend Framework Integrations -->
