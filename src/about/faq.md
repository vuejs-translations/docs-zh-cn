# 常见问题 {#frequently-asked-questions}

## 谁在维护 Vue？ {#who-maintains-vue}

Vue 是一个独立的社区驱动的项目。它是由[尤雨溪](https://twitter.com/yuxiyou)在 2014 年作为其个人项目创建的。今天，Vue 由[来自世界各地的全职成员和志愿者组成的团队](/about/team)积极活跃地维护着，并由尤雨溪担任项目负责人。你可以在[这部纪录片](https://www.youtube.com/watch?v=OrxmtDw4pVI)中了解更多关于 Vue 的故事。

自 2016 年以来，Vue 的发展主要是通过赞助来保障的，我们在财务上是可维续的。如果你或你的企业从 Vue 中受益，请考虑[赞助](/sponsor/)我们，以支持 Vue 的发展！

## Vue 2 和 Vue 3 之间的区别是什么？ {#what-s-the-difference-between-vue-2-and-vue-3}

Vue 3 是 Vue 当前的最新主版本。它包含了一些 Vue 2 中没有的新特性 (比如 Teleport、Suspense，以及多根元素模板)。同时它也包含了一些与 Vue 2 非兼容性的变更。细节文档请参考 [Vue 3 迁移指南](https://v3-migration.vuejs.org/)。

尽管存在差异，但大多数 Vue API 在两个大版本之间是共享的，所以你的大部分 Vue 2 知识将继续在 Vue 3 中发挥作用。需要注意的是，组合式 API 原本是一个 Vue 3 独有的特性，但目前已兼容至 Vue 2 且在 [Vue 2.7](https://github.com/vuejs/vue/blob/main/CHANGELOG.md#270-2022-07-01) 中可用。

总的来说，Vue 3 提供了更小的包体积、更好的性能、更好的可扩展性和更好的 TypeScript/IDE 支持。如果你现在要开始一个新项目，我们推荐你选择 Vue 3。但也仍然存在一些考虑使用 Vue 2 的理由：

- 你需要支持 IE11。Vue 3 用到了一些 IE11 不支持的现代 JavaScript 特性。

如果你打算将现有的 Vue 2 应用迁移到 Vue 3，请查阅[迁移指南](https://v3-migration.vuejs.org/zh/)。

## Vue 2 仍在维护吗？ {#is-vue-2-still-supported}

Vue 2 在 2022 年 6 月发布了最后一个小版本 (2.7)。目前 Vue 2 已经进入维护模式：它将不再提供新特性，但从 2.7 的发布日期开始的 18 个月内，它将继续针对重大错误修复和安全更新进行发布。这意味着 **Vue 2 在 2023 年 12 月 31 日将到达它的截止维护日期**。

我们相信这将为大多数的生态系统提供了足够长的时间来迁移到 Vue 3。然而，我们也理解可能会有无法在此时间轴上升级的团队或项目仍需满足其安全及合规需求。我们正在与业内专家合作为有这种需求的团队提供 Vue 2 的扩展支持——如果您的团队预期在 2023 年底之后仍然需要使用 Vue 2，请确保提前计划，详见 [Vue 2 延长 LTS](https://v2.vuejs.org/lts/)。

## Vue 使用什么开源协议？ {#what-license-does-vue-use}

Vue 是完全免费的开源项目，且基于 [MIT License](https://opensource.org/licenses/MIT) 发布。

## Vue 支持哪些浏览器？ {#what-browsers-does-vue-support}

最新版本的 Vue (3.x) 只支持[原生支持 ES2015 的浏览器](https://caniuse.com/es6)。这并不包括 IE11。Vue 3.x 使用的 ES2015 功能无法在旧版本的浏览器中进行兼容，如果你需要支持旧版本的浏览器，请使用 Vue 2.x 替代。

## Vue 可靠吗？ {#is-vue-reliable}

Vue 是一个成熟的、经历了无数实战考验的框架。它是目前生产环境中使用最广泛的 JavaScript 框架之一，在全球拥有超过 150 万用户，并且在 npm 上的月下载量超过 1000 万次。

Vue 被世界各地知名且多元的组织在生产环境中使用，包括 Wikimedia 基金会、美国宇航局、苹果、谷歌、微软、GitLab、Zoom、腾讯、微博、哔哩哔哩、快手等等。

## Vue 速度快吗？ {#is-vue-fast}

Vue 3 是性能最强的主流前端框架之一，可以轻松处理大多数 web 应用的场景，并且几乎不需要手动优化。

跑分方面，Vue 在 [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/current.html) 中的表现比 React 和 Angular 要好得多。在该基准测试中，它还与一些生产环境下最快级别的非虚拟 DOM 框架并驾齐驱。

请注意，像上面这样的跑分的侧重点在于原始渲染性能在特定情况下的优化，因此不能完全代表真实世界的性能结果。如果你更关心页面加载性能，欢迎用 [WebPageTest](https://www.webpagetest.org/lighthouse) 或是 [PageSpeed Insights](https://pagespeed.web.dev/) 来测试本站。本文档站是一个完全由 Vue 本身构建，通过静态生成预渲染，并在客户端进行 hydration 的单页应用。它在模拟 4 倍 CPU 降速的 Moto G4 + 低速 4G 网络的情况下依然能获得 100 分的性能得分。

你可以在[渲染机制](/guide/extras/rendering-mechanism)章节了解更多关于 Vue 如何自动优化运行时性能的信息，也可以在[性能优化指南](/guide/best-practices/performance)中了解如何在特别苛刻的情况下优化 Vue 应用。

## Vue 体积小吗？ {#is-vue-lightweight}

当你通过构建工具使用时，Vue 的许多 API 都是可以[“tree-shake”](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)的。例如，如果你不使用内置的 `<Transition>` 组件，它就不会被包含在最终的生产环境包里。

对于一个 Vue 的最少 API 使用的 hello world 应用来说，配合最小化和 brotli 压缩，其基线大小只有 **16kb** 左右。但实际的应用大小取决于你使用了多少框架的可选特性。在极端情况下，如果一个应用使用了 Vue 提供的每一个特性，那么总的运行时大小大约为 **27kb**。

如果不通过构建工具使用 Vue，我们不仅失去了 tree-shaking，而且还必须将模板编译器加载到浏览器。这就使包体积增大到了 **41kb** 左右。因此，如果你为了渐进式增强在没有构建步骤的情况下使用 Vue，则可以考虑使用 [petite-vue](https://github.com/vuejs/petite-vue) (仅 **6kb**) 来代替。

一些诸如 Svelte 的框架使用了一种为单个组件产生极轻量级输出的编译策略。然而，[我们的研究](https://github.com/yyx990803/vue-svelte-size-analysis)表明，包大小的差异在很大程度上取决于应用中的组件数量。虽然 Vue 的基线大小更重，但它生成的每个组件的代码更少。在现实的场景中，Vue 应用很可能最终会更轻。

## Vue 能胜任大规模场景吗？ {#does-vue-scale}

是的。尽管有一种误解是 Vue 只适用于简单的场景，但其实 Vue 完全有能力处理大规模的应用：

- [单文件组件](/guide/scaling-up/sfc)提供了一个模块化的开发模型，让应用的不同部分能够被隔离开发。

- [组合式 API](/guide/reusability/composables) 提供一流的 TypeScript 集成，并为组织、提取和重用复杂逻辑提供了简洁的模式。

- [全面的工具链支持](/guide/scaling-up/tooling)使得开发体验在应用增长的过程中依然可以保持平滑。

- 较低的入门门槛和优秀的文档能够显著降低新手开发者的入职和培训成本。

## 我可以为 Vue 做贡献吗？ {#how-do-i-contribute-to-vue}

非常欢迎！请阅读我们的[社区指南](/about/community-guide)。

## 我应该使用选项式 API 还是组合式 API？ {#should-i-use-options-api-or-composition-api}

如果你是 Vue 的新手，我们在[这里](/guide/introduction#which-to-choose)提供了一个两者之间宏观的比较。

如果你过去使用过选项式 API 且正在评估组合式 API，可以查阅[组合式 API 常见问题](/guide/extras/composition-api-faq)。

## 用 Vue 的时候应该选 JS 还是 TS？ {#should-i-use-javascript-or-typescript-with-vue}

虽然 Vue 本身是用 TypeScript 实现的，并提供一流的 TypeScript 支持，但它并不强制要求用户使用 TypeScript。

在向 Vue 添加新特性时，对 TypeScript 的支持是一个重要的考虑因素。即使你自己不使用 TypeScript，考虑了 TypeScript 支持的 API 设计也通常更容易被 IDE 和静态分析工具分析，因此这对大家都有好处。Vue 的 API 设计也尽可能在 JavaScript 和 TypeScript 中以相同的方式工作。

选用 TypeScript 会涉及在上手复杂性和长期可维护性收益之间作出权衡。这种权衡是否合理取决于你的团队背景和项目规模，但 Vue 并不会真正成为影响这一决定的因素。

## Vue 相比于 Web Components 究竟如何？ {#how-does-vue-compare-to-web-components}

Vue 是在 Web Components 出现之前被创建的，Vue 在某些方面的设计 (例如插槽) 受到了 Web Components 模型的启发。

Web Components 规范相对底层一些，因为它们是以自定义元素为中心的。作为一个框架，Vue 解决了更多上层的问题，如高效的 DOM 渲染、响应式状态管理、工具链、客户端路由和服务器端渲染等。

Vue 完全支持在 Vue 组件中使用原生自定义元素，也支持将 Vue 组件导出为原生自定义元素——请参阅 [Vue 和 Web Components 指南](/guide/extras/web-components)以了解更多细节。

<!-- ## TODO How does Vue compare to React? -->

<!-- ## TODO How does Vue compare to Angular? -->
