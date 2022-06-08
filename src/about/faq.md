# 常见问题

## 谁在维护 Vue？

Vue 是一个独立的社区驱动的项目。它是由[尤雨溪](https://twitter.com/yuxiyou)在 2014 年作为其个人项目创建的。今天，Vue 由来自世界各地的全职成员和志愿者组成的团队积极活跃地维护着，且尤雨溪担任其项目负责人。你可以在[这部纪录片](https://www.youtube.com/watch?v=OrxmtDw4pVI)中了解更多关于 Vue 的故事。

自 2016 年以来，Vue 的发展主要是通过赞助来保障的，我们的财务状况是可维持的。如果你或你的企业从 Vue 中受益，请考虑[赞助](/sponsor/)我们，以支持 Vue 的发展！

## Vue 使用什么开源协议？

Vue 是完全免费的开源项目，且基于 [MIT License](https://opensource.org/licenses/MIT) 发布。

## Vue 支持哪些浏览器？

最新版本的 Vue (3.x) 只支持[原生支持 ES2015 的浏览器](https://caniuse.com/es6)。这并不包括 IE11。Vue 3.x 使用的 ES2015 功能无法在旧版本的浏览器中进行兼容，所以如果你需要支持旧版本的浏览器，请使用 Vue 2.x 取而代之。

## Vue 可靠吗？

Vue 是一个成熟的、经历了无数实战考验的框架。它是目前生产环境中使用最广泛的 JavaScript 框架之一，在全球拥有超过 150 万用户，并且在 npm 上的月下载量接近 1000 万次。

Vue 被世界各地知名且多元的组织在生产环境中使用，包括 Wikimedia 基金会、美国宇航局、苹果、谷歌、微软、GitLab、Zoom、腾讯、微博、哔哩哔哩、快手等等。

## Vue 速度快吗？

Vue 3 是性能最强的主流前端框架之一，可以轻松处理大多数 web 应用的场景，不需要手动优化。

关于压力测试，Vue 在 [js-framework-benchmark](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts-results/table.html) 中的表现比 React 和 Angular 等框架要好得多。在该基准测试中，它还与一些生产环境下最快级别的非虚拟 DOM 框架并驾齐驱。

请注意，像上面这样的合成基准测试的侧重点在于原始渲染性能的专属优化，可能不能完全代表真实世界的性能结果。如果你更关心页面加载性能，以下是通过 [WebPageTest](https://www.webpagetest.org/lighthouse) 生成的 [Lighthouse 审计结果](https://www.webpagetest.org/result/210818_BiDcYB_4a83d7a1f2a7f6fdc76db16a00b4882d/)，该网站由 Vue 驱动，具有静态站点生成器的预渲染、全页面激活和单页应用客户端导航功能。它在模拟 3G 网络和 4 倍 CPU 节流的 Moto G4 上的性能得分为 98 分。

你可以在[渲染机制](/guide/extras/rendering-mechanism.html)章节了解更多关于 Vue 如何自动优化运行时性能的信息，也可以在[性能优化指南](/guide/best-practices/performance.html)中了解如何在特别苛刻的情况下优化 Vue 应用。

## Is Vue lightweight?

When you use a build tool, many of Vue's APIs are ["tree-shakable"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking). For example, if you don't use the built-in `<Transition>` component, it won't be included in the final production bundle.

当你使用构建工具时，Vue的许多API都是 "树形可动 "的。例如，如果你不使用内置的 `<Transition>` 组件，它就不会被包含在最终的生产包里。

A hello world Vue app that only uses the absolutely minimal APIs has a baseline size of only around **16kb**, with minification and brotli compression. The actual size of the application will depend on how many optional features you use from the framework. In the unlikely case where an app uses every single feature that Vue provides, the total runtime size is around **27kb**.

一个只使用绝对最小的API的hello world Vue应用程序的基线大小只有16kb左右，加上minification和brotli压缩。应用程序的实际大小将取决于你使用了多少框架的可选功能。在不太可能的情况下，如果一个应用程序使用了Vue提供的每一个功能，那么总的运行时间大小大约为27kb。

When using Vue without a build tool, we not only lose tree-shaking, but also have to ship the template compiler to the browser. This bloats up the size to around **41kb**. Therefore, if you are using Vue primarily for progressive enhancement without a build step, consider using [petite-vue](https://github.com/vuejs/petite-vue) (only **6kb**) instead.

在没有构建工具的情况下使用Vue，我们不仅失去了树形震荡，而且还必须将模板编译器运送到浏览器。这就使大小膨胀到了41kb左右。因此，如果你主要使用Vue进行渐进式增强，而没有构建步骤，可以考虑使用petite-vue（只有6kb）来代替。

Some frameworks, such as Svelte, use a compilation strategy that produces extremely lightweight output in single-component scenarios. However, [our research](https://github.com/yyx990803/vue-svelte-size-analysis) shows that the size difference heavily depends on the number of components in the application. While Vue has a heavier baseline size, it generates less code per component. In real-world scenarios, a Vue app may very well end up being lighter.

一些框架，如Svelte，使用了一种编译策略，在单组件的情况下产生极轻量级的输出。然而，我们的研究表明，大小差异在很大程度上取决于应用程序中的组件数量。虽然Vue的基线大小更重，但它生成的每个组件的代码更少。在现实世界的场景中，Vue应用程序很可能最终会更轻。
## Does Vue scale?

Yes. Despite a common misconception that Vue is only suitable for simple use cases, Vue is perfectly capable of handling large scale applications:

是的。尽管人们普遍认为Vue只适用于简单的用例，但Vue完全有能力处理大规模的应用。

- [Single-File Components](/guide/scaling-up/sfc) provide a modularized development model that allows different parts of an application to be developed in isolation.
- 单文件组件提供了一个模块化的开发模型，允许应用程序的不同部分被隔离开发。

- [Composition API](/guide/reusability/composables) provides first-class TypeScript integration and enables clean patterns for organizing, extracting and reusing complex logic.
- 组成API提供一流的TypeScript集成，并实现了组织、提取和重复使用复杂逻辑的简洁模式。

- [Comprehensive tooling support](/guide/scaling-up/tooling.html) ensures a smooth development experience as the application grows.
- 全面的工具支持确保了随着应用程序的增长，有一个平稳的开发体验。

- Lower barrier to entry and excellent documentation translate to lower onboarding and training costs for new developers.
- 较低的入门门槛和优秀的文档转化为较低的新开发人员的入职和培训成本。

## How do I contribute to Vue?

We appreciate your interest! Please check out our [Community Guide](/about/community-guide.html).

## What's the difference between Vue 2 and Vue 3?

Vue 3 is the current, latest major version of Vue. It contains new features that are not present in Vue 2 (most notably Composition API), and also contains breaking changes that makes it incompatible with Vue 2. Despite the differences, the majority of Vue APIs are shared between the two major versions, so most of your Vue 2 knowledge will continue to work in Vue 3.

Vue 3是Vue当前最新的主要版本。它包含了Vue 2中没有的新功能（最明显的是Composition API），同时也包含了使其与Vue 2不兼容的突破性变化。尽管存在差异，但大多数Vue API在两个主要版本之间是共享的，所以你的大部分Vue 2知识将继续在Vue 3中发挥作用。

In general, Vue 3 provides smaller bundle sizes, better performance, better scalability, and better TypeScript / IDE support. If you are starting a new project today, Vue 3 is the recommended choice. There are only a few reasons for you to consider Vue 2 as of now:

总的来说，Vue 3提供了更小的捆绑尺寸、更好的性能、更好的可扩展性和更好的TypeScript/IDE支持。如果你今天开始一个新项目，Vue 3是推荐的选择。到现在为止，只有几个理由让你考虑Vue 2。

- You need to support IE11. Vue 3 leverages modern JavaScript features and does not support IE11.
- 你需要支持IE11。Vue 3利用了现代JavaScript特性，不支持IE11。

- You are still waiting for major ecosystem projects like Nuxt or Vuetify to release stable versions for Vue 3. This is reasonable if you do not wish to use beta-stage software. However, do note there are other already stable Vue 3 component libraries such as [Quasar](https://quasar.dev/), [Naive UI](https://www.naiveui.com/) and [Element Plus](https://element-plus.org/).
- 你还在等待Nuxt或Vuetify等主要生态系统项目为Vue 3发布稳定版本。如果你不希望使用测试阶段的软件，这也是合理的。然而，请注意还有其他已经稳定的Vue 3组件库，如Quasar、Naive UI和Element Plus。

If you intend to migrate an existing Vue 2 app to Vue 3, consult the dedicated [Vue 3 Migration Guide](https://v3-migration.vuejs.org/).

如果你打算将现有的Vue 2应用迁移到Vue 3，请查阅专门的Vue 3迁移指南。

Vue 2 will receive a final minor release (2.7) in 2022. This minor release will backport a selected subset of new features from Vue 3. After that, Vue 2 will enter maintenance mode: it will no longer ship new features, but will continue to receive critical bug fixes and security updates for another 18 months.

Vue 2将在2022年收到最后一个小版本（2.7）。这个小版本将从Vue 3中回传一个选定的新功能子集。在此之后，Vue 2将进入维护模式：它将不再提供新的功能，但将继续收到关键的错误修复和安全更新，为期18个月。

## Should I use Options API or Composition API?

If you are new to Vue, we provide a high-level comparison between the two styles [here](/guide/introduction.html#which-to-choose).

If you have previously used Options API and are currently evaluating Composition API, check out [this FAQ](/guide/extras/composition-api-faq).

## Should I use JavaScript or TypeScript with Vue?

While Vue itself is implemented in TypeScript and provides first-class TypeScript support, it does not enforce an opinion on whether you should use TypeScript as a user.

虽然Vue本身是用TypeScript实现的，并提供一流的TypeScript支持，但它并不强制要求你作为一个用户是否应该使用TypeScript。

TypeScript support is an important consideration when new features are added to Vue. APIs that are designed with TypeScript in mind are typically easier for IDEs and linters to understand, even if you aren't using TypeScript yourself. Everybody wins. Vue APIs are also designed to work the same way in both JavaScript and TypeScript as much as possible.

在向Vue添加新功能时，TypeScript支持是一个重要的考虑因素。设计时考虑到TypeScript的API通常更容易被IDE和linters理解，即使你自己不使用TypeScript。人人都是赢家。Vue的API也被设计为尽可能在JavaScript和TypeScript中以相同的方式工作。

Adopting TypeScript involves a trade-off between onboarding complexity and long-term maintainability gains. Whether such a trade-off can be justified can vary depending on your team's background and project scale, but Vue isn't really an influencing factor in making that decision.

采用TypeScript涉及到入职复杂性和长期可维护性收益之间的权衡。这种权衡是否合理，取决于你的团队背景和项目规模，但Vue并不是做出这一决定的真正影响因素。

## How does Vue compare to Web Components?

Vue was created before Web Components were natively available, and some aspects of Vue's design (e.g. slots) were inspired by the Web Components model.

Vue是在Web Components出现之前创建的，Vue设计的某些方面（例如插槽）受到了Web Components模型的启发。

The Web Components specs are relatively low-level, as they are centered around defining custom elements. As a framework, Vue addresses additional higher-level concerns such as efficient DOM rendering, reactive state management, tooling, client-side routing, and server-side rendering.

Web组件的规格相对较低，因为它们是以定义自定义元素为中心的。作为一个框架，Vue解决了更多高层次的问题，如高效的DOM渲染、反应式状态管理、工具化、客户端路由和服务器端渲染。

Vue also fully supports consuming or exporting to native custom elements - check out the [Vue and Web Components Guide](/guide/extras/web-components) for more details.

Vue还完全支持消费或导出到本地自定义元素--查看Vue和Web组件指南以了解更多细节。

<!-- ## TODO How does Vue compare to React? -->

<!-- ## TODO How does Vue compare to Angular? -->
