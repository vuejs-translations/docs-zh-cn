# 传送门 {#teleport}

Vue 鼓励我们通过将视图和相关行为封装成组件来构建用户界面。我们可以把它们嵌套在一起，构建一棵树，组成一个应用程序的用户界面。

然而，虽然有时一个组件的模板的一部分在逻辑上属于这个组件，而从技术角度来看，最好是将模板的这一部分移到 DOM 的其他地方，在 Vue 应用之外。

一个常见的情况是创建一个全屏的模态框。在大多数情况下，你希望模态框的逻辑存在于组件中，但模态框的位置难以只通过 CSS 来描述，可能需要改变组件的构成。

试想下面这样的 HTML 结构：

```vue-html
<body>
  <div style="position: relative;">
    <h3>Vue 3 传送门的小提示</h3>
    <div>
      <modal-button></modal-button>
    </div>
  </div>
</body>
```

接着来看一看这个 `modal-button`。

该组件会有一个 `button` 元素来触发模态框的开启，还有一个 `div` 元素，有一个 `.modal` 的 CSS 类，其中将包含模态框的内容和一个关闭它的按钮。

```js
const app = Vue.createApp({});

app.component('modal-button', {
  template: `
    <button @click="modalOpen = true">
        打开全屏模态框！
    </button>

    <div v-if="modalOpen" class="modal">
      <div>
        我是一个模态框！ 
        <button @click="modalOpen = false">
          关闭
        </button>
      </div>
    </div>
  `,
  data() {
    return {
      modalOpen: false
    }
  }
})
```

当在初始的 HTML 结构中使用此组件时，我们会发现一个问题：模态框被渲染在了深层嵌套的 `div` 中，且此模态框的 `position: relative` 是以 `div` 作为相对定位的父元素。

传送门（Teleport）为我们控制提供了一种简洁的方式，让我们能够控制在 DOM 中一段 HTML 呈现在哪个父节点下，而不必求助于全局状态或将其分割成两个组件。

因此让我们修改一下 `modal-button`，用上 `<teleport>`并让 Vue "**传送** 这一段 HTML **到** ‘**body**’ 标签下"。

```js
app.component('modal-button', {
  template: `
    <button @click="modalOpen = true">
        打开全屏模态框！（使用传送门)
    </button>

    <teleport to="body">
      <div v-if="modalOpen" class="modal">
        <div>
          我是被传入的模态框！
          （我的父元素是 "body"）
          <button @click="modalOpen = false">
            关闭
          </button>
        </div>
      </div>
    </teleport>
  `,
  data() {
    return {
      modalOpen: false
    }
  }
})
```

最终，当我们点击开启模态框的按钮，Vue 会正确地将该模态框渲染为 `body` 标签下的一个子元素。

<!-- <common-codepen-snippet title="Vue 3 Teleport" slug="gOPNvjR" tab="js,result" /> -->

## 配合 Vue 组件使用 {#using-with-vue-components}

若 `<teleport>` 包含一个 Vue 组件，那么该组件始终和这个使用了 `<teleport>` 的组件保持逻辑上的父子关系：

```js
const app = Vue.createApp({
  template: `
    <h1>Root instance</h1>
    <parent-component />
  `
})

app.component('parent-component', {
  template: `
    <h2>This is a parent component</h2>
    <teleport to="#endofbody">
      <child-component name="John" />
    </teleport>
  `
})

app.component('child-component', {
  props: ['name'],
  template: `
    <div>Hello, {{ name }}</div>
  `
})
```

在这个例子中，即使 `child-component` 被渲染在了其他地方，逻辑上它仍然是 `parent-component` 的子组件并会从它那里得到一个 `name` prop。

这也意味着来自父组件的注入也会按预期工作，子组件将在 Vue Devtools 中嵌套在父级组件下面，而不是放在实际内容移动到的地方。

## 在同一目标上使用多个传送门 {#using-multiple-teleports-on-the-same-target}

一个常见的应用场景就是写一个可重用的 `<Modal>` 组件，可能同时存在多个实例。对于此类场景，多个 `<teleport>` 组件可以将其内容挂载在同一个目标元素上，而顺序就是简单的顺次追加，后挂载的将排在目标元素下更后面的位置上。

```vue-html
<teleport to="#modals">
  <div>A</div>
</teleport>
<teleport to="#modals">
  <div>B</div>
</teleport>

<!-- result-->
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

你可以在 [API 参考](/api/built-in-components.html#teleport) 中查看 `<teleport>` 组件的选项。
