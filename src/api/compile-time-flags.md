---
outline: deep
---

# 编译时标志 {#compile-time-flags}

:::tip
编译时标志仅在使用 Vue 的 `esm-bundler` 构建版本时生效 (即 `vue/dist/vue.esm-bundler.js`)。
:::

当以带有构建步骤的方式使用 Vue 时，可以配置一些编译时标志以启用/禁用特定的功能。使用编译时标志的好处是，以这种方式禁用的功能可以通过 tree-shaking 从最终的打包结果中移除。

即使没有显式地配置这些标志，Vue 也会正常工作。然而，建议始终对它们进行配置，以便在可能的情况下正确地删除相关功能。

请参考[配置指南](#configuration-guides)来了解如何根据你的构建工具进行配置。

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **默认值：** `true`

  启用/禁用选项式 API 支持。禁用此功能将减小打包结果的体积，但如果第三方库依赖选项式 API，则可能影响兼容性。

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **默认值：** `false`

  在生产环境中启用/禁用开发者工具支持。启用会在打包结果中包含更多代码，因此建议仅在调试时启用此功能。

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` <sup class="vt-badge" data-text="3.4+" /> {#VUE_PROD_HYDRATATION_MISMATCH_DETAILS}

- **默认值：** `false`

  启用/禁用生产环境构建下激活 (hydration) 不匹配的详细警告。启用会在打包结果中包含更多代码，因此建议仅在调试时启用此功能。

## 配置指南 {#configuration-guides}

### Vite {#vite}

`@vitejs/plugin-vue` 会自动为这些标志提供默认值。要更改默认值，请使用 Vite 的 [`define` 配置项](https://vitejs.dev/config/shared-options.html#define)：


```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // 启用生产环境构建下激活不匹配的详细警告
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### vue-cli {#vue-cli}

`@vue/cli-service` 自动为其中一些标志提供默认值。要配置/修改这些值：

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
```

### webpack {#webpack}

应该使用 webpack 的 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) 定义这些标志：

```js
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

### Rollup {#rollup}

应该使用 [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace) 定义这些标志：

```js
// rollup.config.js
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```
