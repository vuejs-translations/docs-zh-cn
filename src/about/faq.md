# 常见问题

## 谁在维护 Vue？ {#who-maintains-vue}

Vue 是一个独立的社区驱动的项目。它是由[尤雨溪](https://twitter.com/yuxiyou)在 2014 年作为其个人项目创建的。今天，Vue 由[来自世界各地的全职成员和志愿者组成的团队](/about/team)积极活跃地维护着，且尤雨溪担任其项目负责人。你可以在[这部纪录片](https://www.youtube.com/watch?v=OrxmtDw4pVI)中了解更多关于 Vue 的故事。

自 2016 年以来，Vue 的发展主要是通过赞助来保障的，我们的财务状况是可维持的。如果你或你的企业从 Vue 中受益，请考虑[赞助](/sponsor/)我们，以支持 Vue 的发展！

## Vue 使用什么开源协议？ {#what-license-does-vue-use}

Vue 是完全免费的开源项目，且基于 [MIT License](https://opensource.org/licenses/MIT) 发布。

## Vue 支持哪些浏览器？ {#what-browsers-does-vue-support}

最新版本的 Vue (3.x) 只支持[原生支持 ES2015 的浏览器](https://caniuse.com/es6)。这并不包括 IE11。Vue 3.x 使用的 ES2015 功能无法在旧版本的浏览器中进行兼容，所以如果你需要支持旧版本的浏览器，请使用 Vue 2.x 取而代之。

## Vue 可靠吗？ {#is-vue-reliable}

Vue 是一个成熟的、经历了无数实战考验的框架。它是目前生产环境中使用最广泛的 JavaScript 框架之一，在全球拥有超过 150 万用户，并且在 npm 上的月下载量接近 1000 万次。

Vue 被世界各地知名且多元的组织在生产环境中使用，包括 Wikimedia 基金会、美国宇航局、苹果、谷歌、微软、GitLab、Zoom、腾讯、微博、哔哩哔哩、快手等等。

## Vue 速度快吗？ {#is-vue-fast}

Vue 3 是性能最强的主流前端框架之一，可以轻松处理大多数 web 应用的场景，不需要手动优化。

关于压力测试，Vue 在 [js-framework-benchmark](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts-results/table.html) 中的表现比 React 和 Angular 等框架要好得多。在该基准测试中，它还与一些生产环境下最快级别的非虚拟 DOM 框架并驾齐驱。

请注意，像上面这样的合成基准测试的侧重点在于原始渲染性能的专属优化，可能不能完全代表真实世界的性能结果。如果你更关心页面加载性能，以下是通过 [WebPageTest](https://www.webpagetest.org/lighthouse) 生成的 [Lighthouse 审计结果](https://www.webpagetest.org/result/210818_BiDcYB_4a83d7a1f2a7f6fdc76db16a00b4882d/)，该网站由 Vue 驱动，具有静态站点生成器的预渲染、全页面激活和单页应用客户端导航功能。它在模拟 3G 网络和 4 倍 CPU 节流的 Moto G4 上的性能得分为 98 分。

你可以在[渲染机制](/guide/extras/rendering-mechanism.html)章节了解更多关于 Vue 如何自动优化运行时性能的信息，也可以在[性能优化指南](/guide/best-practices/performance.html)中了解如何在特别苛刻的情况下优化 Vue 应用。

## Vue 体积小吗？ {#is-vue-lightweight}

当你通过构建工具使用时，Vue 的许多 API 都是可以[“tree-shake”](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)的。例如，如果你不使用内置的 `<Transition>` 组件，它就不会被包含在最终的生产环境包里。

对于一个 Vue 的最少 API 使用的 hello world 应用来说，配合最小化和 brotli 压缩，其基线大小只有 **16kb** 左右。但实际的应用大小取决于你使用了多少框架的可选特性。在极端情况下，如果一个应用使用了 Vue 提供的每一个特性，那么总的运行时大小大约为 **27kb**。

如果不通过构建工具使用 Vue，我们不仅失去了 tree-shaking，而且还必须将模板编译器加载到浏览器。这就使包体积增大到了 **41kb** 左右。因此，如果你为了渐进式增强在没有构建步骤的情况下使用 Vue，则可以考虑使用 [petite-vue](https://github.com/vuejs/petite-vue) (仅 **6kb**) 来代替。

一些诸如 Svelte 的框架使用了一种为单个组件产生极轻量级输出的编译策略。然而，[我们的研究](https://github.com/yyx990803/vue-svelte-size-analysis)表明，包大小的差异在很大程度上取决于应用程序中的组件数量。虽然 Vue 的基线大小更重，但它生成的每个组件的代码更少。在现实世界的场景中，Vue 应用很可能最终会更轻。

## Vue 的规模扩展性如何？ {#does-vue-scale}

是的。尽管人们普遍认为 Vue 只适用于简单的用例，但 Vue 完全有能力处理大规模的应用：

- [单文件组件](/guide/scaling-up/sfc)提供了一个模块化的开发模型，允许应用程序的不同部分被隔离开发。

- [组合式 API](/guide/reusability/composables) 提供一流的 TypeScript 集成，并为组织、提取和重用复杂逻辑提供了简洁的模式。

- [全面的工具链支持](/guide/scaling-up/tooling.html)使得开发体验在应用增长的过程中依然可以保持平滑。

- 我们通过较低的入门门槛和优秀的文档降低了新手开发者的入职和培训成本。

## 我可以为 Vue 做贡献吗？ {#how-do-i-contribute-to-vue}

我们非常感激你的兴趣！请阅读我们的[社区指南](/about/community-guide.html)。

## Vue 2 和 Vue 3 之间的区别是什么？ {#what-s-the-difference-between-vue-2-and-vue-3}

Vue 3 是 Vue 当前的最新大版本。它包含了 Vue 2 中没有的新特性 (比如最明显的组合式 API)，同时也包含了一些与 Vue 2 不兼容的变更。尽管存在差异，但大多数 Vue API 在两个大版本之间是共享的，所以你的大部分 Vue 2 知识将继续在 Vue 3 中发挥作用。

总的来说，Vue 3 提供了更小的包体积、更好的性能、更好的可扩展性和更好的 TypeScript/IDE 支持。如果你现在要开始一个新项目，我们推荐你选择 Vue 3。但也仍然存在一些考虑使用 Vue 2 的理由：

- 你需要支持 IE11。Vue 3 用到了一些 IE11 不支持的现代 JavaScript 特性。

- 你还在等待 Nuxt 或 Vuetify 等主要生态系统项目为 Vue 3 发布稳定版本。如果你不希望使用 beta 阶段的软件，这也是合理的。然而请注意这里还有一些其他已经稳定的 Vue 3 的组件库，如 [Quasar](https://quasar.dev/)、[Naive UI](https://www.naiveui.com/) 以及 [Element Plus](https://element-plus.org/)。

如果你打算将现有的 Vue 2 应用迁移到 Vue 3，请查阅我们特别整理的 [Vue 3 迁移指南](https://v3-migration.vuejs.org/)。

Vue 2 将在 2022 年发布最后一个小版本 (2.7)。这个小版本将带回一些选定的 Vue 3 新特性子集。在此之后，Vue 2 将进入维护模式：它将不再提供新特性，但将继续针对重大错误修复和安全更新进行发布，为期 18 个月。

## 我应该使用选项式 API 还是组合式 API？ {#should-i-use-options-api-or-composition-api}

如果你是 Vue 的新手，我们在[这里](/guide/introduction.html#which-to-choose)提供了一个两者之间宏观的比较。

如果你过去使用过选项式 API 且正在评估组合式 API，可以查阅[这份常见问题](/guide/extras/composition-api-faq)。

## 我应该结合 JavaScript 还是 TypeScript 使用 Vue？ {#should-i-use-javascript-or-typescript-with-vue}

虽然 Vue 本身是用 TypeScript 实现的，并提供一流的 TypeScript 支持，但它并不强制要求用户使用 TypeScript。

在向 Vue 添加新特性时，对 TypeScript 对支持是一个重要的考虑因素。基于 TypeScript 考量的 API 设计通常更容易被 IDE 和 lint 工具理解，即使你自己不使用 TypeScript。这是一种双赢。Vue 的 API 设计也尽可能在 JavaScript 和 TypeScript 中以相同的方式工作。

选用 TypeScript 会涉及在上手复杂性和长期可维护性收益之间作出权衡。这种权衡是否合理取决于你的团队背景和项目规模，但 Vue 并不会真正成为影响这一决定的因素。

## Vue 相比于 Web Components 究竟如何？ {#how-does-vue-compare-to-web-components}

Vue 是在 Web Components 出现之前被创建的，Vue 在某些方面的设计 (例如插槽) 受到了 Web Components 模型的启发。

Web Components 规范相对底层一些，因为它们是以自定义元素为中心的。作为一个框架，Vue 解决了更多上层的问题，如高效的 DOM 渲染、响应式状态管理、工具链、客户端路由和服务器端渲染等。

Vue 还完全支持消费或导出到原生自定义元素——查看 [Vue 和 Web Components 指南](/guide/extras/web-components)以了解更多细节。

<!-- ## TODO How does Vue compare to React? -->

<!-- ## TODO How does Vue compare to Angular? -->
