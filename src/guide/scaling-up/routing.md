# 路由 {#routing}

## 官方路由 {#official-router}

对于大多数的单页面应用，都推荐使用官方支持的 [路由库](https://github.com/vuejs/vue-router-next)。要了解更多细节，请查看 vue-router 的 [文档](https://next.router.vuejs.org/)。

## 从头开始实现一个简单的路由 {#simple-routing-from-scratch}

如果你只需要一个简单的路由，并不希望包含一个功能完整的路由库，你可以像下面这样动态地渲染页面级的组件：

```js
const { createApp, h } = Vue

const NotFoundComponent = { template: '<p>Page not found</p>' }
const HomeComponent = { template: '<p>Home page</p>' }
const AboutComponent = { template: '<p>About page</p>' }

const routes = {
  '/': HomeComponent,
  '/about': AboutComponent
}

const SimpleRouter = {
  data: () => ({
    currentRoute: window.location.pathname
  }),

  computed: {
    CurrentComponent() {
      return routes[this.currentRoute] || NotFoundComponent
    }
  },

  render() {
    return h(this.CurrentComponent)
  }
}

createApp(SimpleRouter).mount('#app')
```

配合 [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API)，你可以构建一个非常基础，但功能完整的客户端路由。你可以查看 [这个实战示例](https://github.com/phanan/vue-3.0-simple-routing-example)。

## 集成第三方路由库 {#integrating-3rd-party-routers}

如果你更想使用一个第三方的路由库，比如 [Page.js](https://github.com/visionmedia/page.js) 或 [Director](https://github.com/flatiron/director)，[集成方式](https://github.com/phanan/vue-3.0-simple-routing-example/compare/master...pagejs) 也十分简单直接。这里有一个使用 Page.js 的 [完整示例](https://github.com/phanan/vue-3.0-simple-routing-example/tree/pagejs)。
