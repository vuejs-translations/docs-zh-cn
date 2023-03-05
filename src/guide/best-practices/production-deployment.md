# 生产部署 {#production-deployment}

## 开发环境 vs. 生产环境 {#development-vs-production}

在开发过程中，Vue 提供了许多功能来提升开发体验：

- 对常见错误和隐患的警告
- 对组件 props / 自定义事件的校验
- [响应性调试钩子](/guide/extras/reactivity-in-depth#reactivity-debugging)
- 开发工具集成

然而，这些功能在生产环境中并不会被使用，一些警告检查也会产生少量的性能开销。当部署到生产环境中时，我们应该移除所有未使用的、仅用于开发环境的代码分支，来获得更小的包体积和更好的性能。

## 不使用构建工具 {#without-build-tools}

如果你没有使用任何构建工具，而是从 CDN 或其他源来加载 Vue，请确保在部署时使用的是生产环境版本（以 `.prod.js` 结尾的构建文件）。生产环境版本会被最小化，并移除了所有仅用于开发环境的代码分支。

- 如果需要使用全局变量版本（通过 `Vue` 全局变量访问）：请使用 `vue.global.prod.js`。
- 如果需要 ESM 版本（通过原生 ESM 导入访问）：请使用 `vue.esm-browser.prod.js`。

更多细节请参考[构建文件指南](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use)。

## 使用构建工具 {#with-build-tools}

通过 `create-vue`（基于 Vite）或是 Vue CLI（基于 webpack）搭建的项目都已经预先做好了针对生产环境的配置。

如果使用了自定义的构建，请确保：

1. `vue` 被解析为 `vue.runtime.esm-bundler.js`。
2. [编译时功能标记](https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags)已被正确配置。
3. <code>process.env<wbr>.NODE_ENV</code> 会在构建时被替换为 `"production"`。

其他参考：

- [Vite 生产环境指南](https://cn.vitejs.dev/guide/build.html)
- [Vite 部署指南](https://cn.vitejs.dev/guide/static-deploy.html)
- [Vue CLI 部署指南](https://cli.vuejs.org/zh/guide/deployment.html)

## 追踪运行时错误 {#tracking-runtime-errors}

[应用级错误处理](/api/application#app-config-errorhandler) 可以用来向追踪服务报告错误：

```js
import { createApp } from 'vue'
const app = createApp(...)
app.config.errorHandler = (err, instance, info) => {
  // 向追踪服务报告错误
}
```

诸如 [Sentry](https://docs.sentry.io/platforms/javascript/guides/vue/) 和 [Bugsnag](https://docs.bugsnag.com/platforms/javascript/vue/) 等服务也为 Vue 提供了官方集成。

<!-- zhlint disabled -->
