# 插件 {#plugins}

## 介绍 {#introduction}

插件 (Plugins) 是一种能为 Vue 添加全局功能的工具代码。下面是如何安装一个插件的示例：

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* 可选的选项 */
})
```

一个插件可以是一个拥有 `install()` 方法的对象，也可以直接是一个安装函数本身。安装函数会接收到安装它的[应用实例](/api/application)和传递给 `app.use()` 的额外选项作为参数：

```js
const myPlugin = {
  install(app, options) {
    // 配置此应用
  }
}
```

插件没有严格定义的使用范围，但是插件发挥作用的常见场景主要包括以下几种：

1. 通过 [`app.component()`](/api/application#app-component) 和 [`app.directive()`](/api/application#app-directive) 注册一到多个全局组件或自定义指令。

2. 通过 [`app.provide()`](/api/application#app-provide) 使一个资源[可被注入](/guide/components/provide-inject)进整个应用。

3. 向 [`app.config.globalProperties`](/api/application#app-config-globalproperties) 中添加一些全局实例属性或方法

4. 一个可能上述三种都包含了的功能库 (例如 [vue-router](https://github.com/vuejs/vue-router-next))。

## 编写一个插件 {#writing-a-plugin}

为了更好地理解如何构建 Vue.js 插件，我们可以试着写一个简单的 `i18n` ([国际化 (Internationalization)](https://en.wikipedia.org/wiki/Internationalization_and_localization) 的缩写) 插件。

让我们从设置插件对象开始。建议在一个单独的文件中创建并导出它，以保证更好地管理逻辑，如下所示：

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // 在这里编写插件代码
  }
}
```

我们希望有一个翻译函数，这个函数接收一个以 `.` 作为分隔符的 `key` 字符串，用来在用户提供的翻译字典中查找对应语言的文本。期望的使用方式如下：

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

这个函数应当能够在任意模板中被全局调用。这一点可以通过在插件中将它添加到 `app.config.globalProperties` 上来实现：

```js{4-11}
// plugins/i18n.js
export default {
  install: (app, options) => {
    // 注入一个全局可用的 $translate() 方法
    app.config.globalProperties.$translate = (key) => {
      // 获取 `options` 对象的深层属性
      // 使用 `key` 作为索引
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

我们的 `$translate` 函数会接收一个例如 `greetings.hello` 的字符串，在用户提供的翻译字典中查找，并返回翻译得到的值。

用于查找的翻译字典对象则应当在插件被安装时作为 `app.use()` 的额外参数被传入：

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

这样，我们一开始的表达式 `$translate('greetings.hello')` 就会在运行时被替换为 `Bonjour!` 了。

TypeScript 用户请参考：[扩展全局属性](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

:::tip
请谨慎使用全局属性，如果在整个应用中使用不同插件注入的太多全局属性，很容易让应用变得难以理解和维护。
:::

### 插件中的 Provide / Inject {#provide-inject-with-plugins}

在插件中，我们可以通过 `provide` 来为插件用户供给一些内容。举例来说，我们可以将插件接收到的 `options` 参数提供给整个应用，让任何组件都能使用这个翻译字典对象。

```js{10}
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

现在，插件用户就可以在他们的组件中以 `i18n` 为 key 注入并访问插件的选项对象了。

<div class="composition-api">

```vue
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>
