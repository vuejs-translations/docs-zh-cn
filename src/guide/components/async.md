# 异步组件 {#async-components}

## 基础使用 {#basic-usage}

在大型项目中，我们可能需要拆分应用为更小的块，并仅在需要时再从服务器加载。要做到这一点，Vue 提供了一个 [`defineAsyncComponent`](/api/general.html#defineasynccomponent) 方法：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器获取组件
    resolve(/* 获取到的组件 */)
  })
})
// ... 像使用其他一般组件一样使用 `AsyncComp`
```

如你所见，此方法接收一个返回 Promise 的加载函数。这个 Promise 的 `resolve` 回调方法应该在从服务器获得组件定义时调用。我们也可以在调用 `reject(reason)` 表明加载失败。

[ES 模块动态导入](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports)也会返回一个 Promise，所以多数情况下我们会将其和 `defineAsyncComponent` 搭配使用，类似 Vite 和 Webpack 这样的构建工具也支持这种语法，因此我们也可以用它来导入 Vue 单文件组件：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

最后得到的 `AsyncComp` 是一个被包裹了的组件，仅在页面需要它渲染时才调用加载函数。另外，他还会将 props 传给内部的组件，因此，你可以使用这个异步的包裹组件无缝地替换原始组件，同时实现延迟加载。

<div class="options-api">

你也可以在[局部注册组件](/guide/components/registration.html#local-registration)时使用 `defineAsyncComponent`：

```js
import { defineAsyncComponent } from 'vue'

export default {
  // ...
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
  }
}
```

</div>

## 加载与错误状态 {#loading-and-error-states}

异步操作不可避免地会涉及到加载和错误状态，因此 `defineAsyncComponent()` 也支持在选项中处理这些状态：

```js
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载完成的组件前的延迟，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超过了该时间
  // 也会显示报错组件
  timeout: 3000
})
```

如果提供了一个加载组件，它将在加载内部组件时首先显示。在加载组件显示之前有一个默认的 200ms 延迟，这是因为在网络状况较好时，加载完成得太快。导致最终组件的替换可能看起来像是闪烁。

如果提供了一个报错组件，当加载器函数返回的 Promise 被 reject 时，它将被显示出来。你还可以指定一个超时时间，在请求花费太长时间后显示。

## 搭配 Suspense 使用 {#using-with-suspense}

异步组件可以搭配内置的 `<Suspense>` 组件一起使用，若想了解 `<Suspense>` 和异步组件之间交互，请参阅文档中 [`<Suspense>`](/guide/built-ins/suspense.html) 这一章。
