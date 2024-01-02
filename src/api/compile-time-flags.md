---
outline: deep
---

# 编译时标志 {#compile-time-flags}

:::tip
编译时标志仅在使用 `esm-bundler` 构建Vue时生效 (i.e. `vue/dist/vue.esm-bundler.js`).
:::

当使用带有构建步骤的 Vue 时，可以配置一些编译时标志以启用/禁用某些功能。使用编译时标志的好处是，以这种方式禁用的功能可以通过 tree-shaking 从最终的 bundle 中移除。

即使没有明确配置这些标志，Vue 也会正常工作。但是，建议始终对它们进行配置，以便在可能的情况下适当地删除相关功能。

请参考[配置指南](#configuration-guides)了解如何根据你的构建工具配置它们。

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **Default:** `true`

  启用/禁用选项式 API 支持。禁用此功能将导致较小的包，但如果第三方库依赖选项式 API，则可能影响与它们的兼容性。

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **Default:** `false`

  在生产环境中启用/禁用 devtools 支持。这将导致包中包含更多代码，因此建议仅在调试时启用此功能。

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` <sup class="vt-badge" data-text="3.4+" /> {#VUE_PROD_HYDRATATION_MISMATCH_DETAILS}

- **Default:** `false`

  启用/禁用生产环境构建中水合不匹配的详细警告。这将导致包中包含更多代码，因此建议仅在调试时启用此功能。

## 配置指南 {#configuration-guides}

### Vite {#vite}

`@vitejs/plugin-vue` 会自动为这些标志提供默认值。 要更改默认值，请使用Vite的 [`define` 配置项](https://vitejs.dev/config/shared-options.html#define):

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### vue-cli {#vue-cli}

`@vue/cli-service` 自动为其中一些标志提供默认值。 配置/修改这些值：

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

标志应该使用 webpack 的 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) 定义：

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

标志应该使用 [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace) 定义:

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