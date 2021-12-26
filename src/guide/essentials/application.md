---
title: 创建一个 Vue 应用
---
# 创建一个 Vue 应用 {#creating-a-vue-application}

## 应用实例 {#the-app-instance}

每个 Vue 应用都是通过 [`createApp`](/api/application#createapp) 函数创建一个新的 **应用实例**：

```js
import { createApp } from 'vue'

const app = createApp({
  /* 根组件选项 */
})
```

## 根组件 {#the-root-component}

我们传入 `createApp` 的对象实际上是一个组件，每个应用都需要一个 “根组件”，它将包含其他组件作为其子组件。

如果你正在使用单文件组件，我们可以直接从另一个文件中导入根组件。

```js
import { createApp } from 'vue'
// 从一个单文件组件中导入根组件
import App from './App.vue'

const app = createApp(App)
```

虽然本指南中的许多示例只需要一个组件，但大多数实际应用程序都会将一些可重用的组件组织成一颗嵌套的树。例如，待办事项应用程序的组件树可能是这样的：

```
App (root component)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

我们会在后续的指引中讨论如何定义和组合多个组件。在那之前，我们会先关注一个组件内到地发生了什么。

## 挂载应用 {#mounting-the-app}

应用实例必须在调用了 `.mount()` 方法后才会渲染出来。该方法接收一个 “容器” 参数，可以是一个实际的 DOM 元素或是一个 CSS 选择器字符串。

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

应用根组件的内容将会被渲染在容器元素里面。容器元素自己将不会被视为应用的一部分。

`.mount()` 方法应该始终在整个应用配置和注册完成后被调用。同时请注意它的返回值是根组件实例而非应用实例，这点与其他资源注册方法不同。

### DOM 中的根组件模板 {#in-dom-root-component-template}

当未采用构建步骤使用 Vue 时，我们可以在挂载容器中直接书写组件模板：

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

如果根组件没有 `template` 选项的话，Vue 会自动使用容器的 `innerHTML` 作为模板。


## 应用配置 {#app-configurations}

应用实例会暴露一个 `.config` 对象来让我们能够配置一小部分应用整体层面的选项，例如定义一个整个应用级的错误处理器，它将捕获所有子组件中上抛的未处理的错误。

```js
app.config.errorHandler = (err) => {
  /* 处理错误 */
}
```

应用实例还提供了一些方法来注册应用全局范围的资源，例如注册一个组件：

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

这使得 `TodoDeleteButton` 在应用的任何地方都是可用的。我们会在后续指引中讨论关于组件和其他资源的注册。你也可以在 [API 参考](/api/application) 中浏览应用实例API 的完整列表。

确保在安装应用程序之前应用所有的应用程序配置！

## 多个应用实例 {#multiple-app-instances}

你可以在一个页面上拥有多个应用实例。`createApp` API 允许多个 Vue 应用共存于同一个页面上，它们每一个都是隔离的，有自己有自己的配置和全局资源。

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

如果你正在使用 Vue 来增强服务端渲染 HTML，并且只想要 Vue 去控制一个大型页面中特殊的一小部分，应避免挂载独一个 Vue 应用实例到整个页面上，而是应该创建多个小的应用实例，将它们挂载到所需的元素上去。
