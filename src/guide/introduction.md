---
footer: false
---

# 简介 {#introduction}

:::info 你正在阅读的是 Vue 3 的文档！
- Vue 2 中文文档已被迁移至 [v2.cn.vuejs.org](https://v2.cn.vuejs.org/)。
- 想从 Vue 2 升级？请参考[迁移指南](https://v3-migration.vuejs.org/)。
:::

<style src="/@theme/styles/vue-mastery.css"></style>
<div class="vue-mastery-link">
  <a href="https://www.vuemastery.com/courses-path/beginner" target="_blank">
    <div class="banner-wrapper">
      <img class="banner" alt="Vue Mastery banner" width="96px" height="56px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vuemastery-graphical-link-96x56.png" />
    </div>
    <p class="description">在 <span>VueMastery</span> 上观看视频课程学习 Vue</p>
    <div class="logo-wrapper">
        <img alt="Vue Mastery Logo" width="25px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vue-mastery-logo.png" />
    </div>
  </a>
</div>

## 什么是 Vue？ {#what-is-vue}

Vue (发音为 /vjuː/，类似 **view**) 是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型，帮助你高效地开发用户界面，无论任务是简单还是复杂。

下面是一个最基本的示例：

```js
import { createApp } from 'vue'

createApp({
  data() {
    return {
      count: 0
    }
  }
}).mount('#app')
```

```vue-html
<div id="app">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>
```

**结果展示**

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<div class="demo">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>

上面的示例展示了两个 Vue 的核心功能：

- **声明式渲染**：Vue 通过自己的模板语法扩展了标准 HTML，使得我们可以声明式地描述基于 JavaScript 状态输出的 HTML。

- **响应性**：Vue 会自动跟踪 JavaScript 状态变化并在改变发生时响应式地更新 DOM。

你可能已经有了些疑问——别担心。我们会在接下来的文档中覆盖到每一个细节。现在，请继续阅读，这会让你对 Vue 所提供的功能有一个宏观的认知。

:::tip 预备知识
文档接下来的部分假设你对 HTML、CSS 和 JavaScript 已经基本熟悉。如果你对前端开发完全陌生，最好不要直接在一开始针对一个框架进行学习——最好是掌握了基础知识再回到这里。如果之前有其他框架的经验会很有帮助，但不是必须的。
:::

## 渐进式框架 {#the-progressive-framework}

Vue 是一个框架和生态，功能覆盖了大部分前端开发常见的需求。但 Web 世界又是十分多样化的，我们在 Web 上构建的东西可能在形式和规模上有很大不同。考虑到这一点，Vue 被设计成具有灵活性和可逐步集成的特点。根据你的需求场景，Vue 可以按不同的方式使用：

- 增强静态的 HTML 而无需构建步骤
- 在任何页面中作为 Web Components 嵌入
- 单页应用 (SPA)
- 全栈 / 服务端渲染 (SSR)
- Jamstack / 静态站点生成 (SSG)
- 目标为桌面端、移动端、WebGL，甚至是命令行终端

如果你是初学者，可能觉得这些概念令人生畏，别担心！理解教程和指南的内容只需要具备基础的 HTML 和 JavaScript 知识。你即使不是这些方面的专家，也能够跟上。

如果你是有经验的开发者，对于如何以最好的方式在你的项目中引入 Vue，或者是对上述的概念很好奇，我们将在[使用 Vue 的多种方式](/guide/extras/ways-of-using-vue)中讨论有关它们的更多细节。

无论再怎么灵活，关于 Vue 是如何工作的核心知识在所有这些用例中都是通用的。即使你现在只是一个初学者，随着你的不断成长，直到未来有能力实现更雄心勃勃的目标时，这一路上获得的知识都将会一直有用。如果你已经是一个老手，你可以根据你要解决的问题来选择使用 Vue 的最佳方式，同时保留相同的生产力。这就是为什么我们将 Vue 称为“渐进式框架”：它是一个可以与你共同成长、适应你不同需求的框架。

## 单文件组件 {#single-file-components}

在大多数启用了构建工具的 Vue 项目中，我们可以使用一种类似 HTML 格式的文件来书写 Vue 组件，它被称为**单文件组件** (也被称为 `*.vue` 文件，英文缩写为 **SFC**)。顾名思义，Vue 的单文件组件会将一个组件的逻辑 (JavaScript)，模板 (HTML) 和样式 (CSS) 封装在同一个文件里。下面我们将用单文件组件的格式重写上面的计数器示例：

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

单文件组件是 Vue 的标志性功能。如果你的用例需要进行构建，我们推荐用它来编写 Vue 组件。你可以在后续相关章节里了解更多关于[单文件组件的用法及用途](/guide/scaling-up/sfc)。但你暂时只需要知道 Vue 会帮忙处理所有这些构建配置就好。

## API 风格 {#api-styles}

Vue 的组件可以按两种不同的风格书写：**选项式 API** 和**组合式 API**。

### 选项式 API {#options-api}

使用选项式 API，我们可以用包含多个选项的对象来描述组件的逻辑，例如 `data`、`methods` 和 `mounted`。选项所定义的属性都会暴露在函数内部的 `this` 上，它会指向当前的组件实例。

```vue
<script>
export default {
  // data() 返回的属性将会成为响应式的状态
  // 并且暴露在 `this` 上
  data() {
    return {
      count: 0
    }
  },

  // methods 是一些用来更改状态与触发更新的函数
  // 它们可以在模板中作为事件监听器绑定
  methods: {
    increment() {
      this.count++
    }
  },

  // 生命周期钩子会在组件生命周期的各个不同阶段被调用
  // 例如这个函数就会在组件挂载完成后被调用
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLy8gcmVhY3RpdmUgc3RhdGVcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDBcbiAgICB9XG4gIH0sXG5cbiAgLy8gZnVuY3Rpb25zIHRoYXQgbXV0YXRlIHN0YXRlIGFuZCB0cmlnZ2VyIHVwZGF0ZXNcbiAgbWV0aG9kczoge1xuICAgIGluY3JlbWVudCgpIHtcbiAgICAgIHRoaXMuY291bnQrK1xuICAgIH1cbiAgfSxcblxuICAvLyBsaWZlY3ljbGUgaG9va3NcbiAgbW91bnRlZCgpIHtcbiAgICBjb25zb2xlLmxvZyhgVGhlIGluaXRpYWwgY291bnQgaXMgJHt0aGlzLmNvdW50fS5gKVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPkNvdW50IGlzOiB7eyBjb3VudCB9fTwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4ifQ==)

### 组合式 API {#composition-api}


通过组合式 API，我们可以使用导入的 API 函数来描述组件逻辑。在单文件组件中，组合式 API 通常会与 [`<script setup>`](/api/sfc-script-setup) 搭配使用。这个 `setup` attribute 是一个标识，告诉 Vue 需要在编译时进行转换，来减少使用组合式 API 时的样板代码。例如，`<script setup>` 中的导入和顶层变量/函数都能够在模板中直接使用。

下面是使用了组合式 API 与 `<script setup>` 改造后和上面的模板完全一样的组件：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 响应式状态
const count = ref(0)

// 用来修改状态、触发更新的函数
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgb25Nb3VudGVkIH0gZnJvbSAndnVlJ1xuXG4vLyByZWFjdGl2ZSBzdGF0ZVxuY29uc3QgY291bnQgPSByZWYoMClcblxuLy8gZnVuY3Rpb25zIHRoYXQgbXV0YXRlIHN0YXRlIGFuZCB0cmlnZ2VyIHVwZGF0ZXNcbmZ1bmN0aW9uIGluY3JlbWVudCgpIHtcbiAgY291bnQudmFsdWUrK1xufVxuXG4vLyBsaWZlY3ljbGUgaG9va3Ncbm9uTW91bnRlZCgoKSA9PiB7XG4gIGNvbnNvbGUubG9nKGBUaGUgaW5pdGlhbCBjb3VudCBpcyAke2NvdW50LnZhbHVlfS5gKVxufSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxidXR0b24gQGNsaWNrPVwiaW5jcmVtZW50XCI+Q291bnQgaXM6IHt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

### 该选哪一个？{#which-one-to-choose}

首先，这两种 API 风格都能够覆盖大部分的应用场景。它们只是同一个底层系统所提供的两套不同的接口。实际上，选项式 API 也是用组合式 API 实现的！关于 Vue 的基础概念和知识在它们之间都是通用的。

选项式 API 以“组件实例”的概念为中心 (即上述例子中的 `this`)，对于有面向对象语言背景的用户来说，这通常与基于类的心智模型更为一致。同时，它将响应性相关的细节抽象出来，并强制按照选项来组织代码，从而对初学者而言更为友好。

组合式 API 的核心思想是直接在函数作用域内定义响应式状态变量，并将从多个函数中得到的状态组合起来处理复杂问题。这种形式更加自由，也需要你对 Vue 的响应式系统有更深的理解才能高效使用。相应的，它的灵活性也使得组织和重用逻辑的模式变得更加强大。

在[组合式 API FAQ](/guide/extras/composition-api-faq) 章节中，你可以了解更多关于这两种 API 风格的对比以及组合式 API 所带来的潜在收益。

如果你是使用 Vue 的新手，这里是我们总结的推荐：

- 出于学习目的使用时，我们推荐你采用自己更容易理解的方式。再强调一下，这两种风格的核心概念是通用的。一旦你熟悉了其中一种，另一种也无师自通。

- 出于生产目的使用时

  - 如果你不需要使用构建工具，或者只在低复杂度的场景中使用 Vue，可以采用选项式 API，例如需要渐进式集成的时候。

  - 当你想用 Vue 构建更大更完整的应用时，推荐使用组合式 API 和单文件组件。

你不必在学习阶段就确定自己非要使用哪一种风格。在接下来的文档中我们会为你提供一系列两种风格的代码供你参考，你可以随时通过左上角的 **API 风格偏好**来做切换。

## 还有其他问题？ {#still-got-question}

请查看我们的 [FAQ](/about/faq)。

## 选择你的学习路径 {#pick-your-learning-path}

不同的开发者有不同的学习方式。尽管在可能的情况下，我们推荐你通读所有内容，但你还是可以自由地选择一种自己喜欢的学习路径！

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">尝试教程</p>
    <p class="next-steps-caption">适合喜欢边动手边学的读者。</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">继续阅读该指南</p>
    <p class="next-steps-caption">该指南会带你了解框架的每个方面的细节。</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">查看示例</p>
    <p class="next-steps-caption">浏览核心功能和常见用户界面的示例。</p>
  </a>
</div>
