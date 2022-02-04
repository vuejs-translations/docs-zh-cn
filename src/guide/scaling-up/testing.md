# 测试 {#testing}

## 总览 {#overview}

在构建可靠的应用程序时，自动化测试可以在构建新特性、重构代码和修复 BUG 方面发挥关键作用。

在一个 Vue 应用程序中，自动化测试可以覆盖不同类型的需要：

- **逻辑**：验证非 UI 层面的渲染逻辑是否正确实现。这通常涉及整个应用的业务逻辑（如状态管理存储）和一些工具函数。

- **视图**：给出特定的 props / 状态输入，验证单个组件以及整个组件树是否按照预期渲染出了正确的视图。

- **交互**：模拟用户行为，例如单击或输入，验证单个组件或整个组件树是否呈现正确的更新输出。

- **用户体验**：模拟用户在尝试解决一个问题时所需的一系列交互动作，查看最终效果是否符合预期。

对于不同的测试需求，我们需要使用不同的测试技术方案：

- **单元测试** 涵盖了一系列 **逻辑** 测试。
- **组件测试** 涵盖了 **视图** 和 **交互** 的测试。
- **端到端（E2E）测试** 对应了 **用户体验** 的测试。

我们会简单地说说他们分别是什么、如果针对 Vue 实现它们以及一些基本的建议。

## 单元测试 {#unit-testing}

编写单元测试是为了验证小的、独立的代码单元是否按预期工作。它们关注的是逻辑上的正确性，可以很容易地进行验证。最常见的单元测试的例子是测试一个函数是否根据不同的输入参数返回预期的值。

如前所述，单元测试通常适用于验证整个应用程序的业务逻辑或工具函数，不涉及实际的 UI 渲染。这些通常是 Vue 组件之外的纯 JavaScript / TypeScript 模块。因此，在 Vue 应用程序中编写单元测试与使用其他框架的应用程序没有明显区别。

有一类 Vue 应用中特有的函数被称为 [可组合函数](/guide/reusability/composables.html)，在测试过程中可能需要特殊处理。
你可以跳转到下方查看 [测试可组合函数](#testing-composables) 了解更多细节。

### 推荐 {#recommendation-3}

- [Vitest](https://vitest.dev/)

  因为官方的项目配置是由 `create-vue` 创建、基于 [Vite](https://vitejs.dev/) 的，因此我们推荐你利用同一套 Vite 的配置和转换管道。[Vitest](https://vitest.dev/) 是一个单元测试框架，正是针对此目标设计的。由 Vue / Vite 团队成员开发和维护。在 Vite 的项目集成它会非常简单，而且速度非常快。

:::warning 积极开发中
Vitest 是一个非常新的项目，仍然在以非常快的速度不断发展中。虽然它暂时还是不稳定的，但团队正在努力使它满足生产环境的需要。
:::

### 其他选择 {#other-options}

- [Peeky](https://peeky.dev/) 是另一速度极快的单元测试运行器，对 Vite 集成提供第一优先级支持。它也是由 Vue 核心团队成员创建并且提供了一个图形界面。

- [Jest](https://jestjs.io/) 是一个广受欢迎的单元测试框架，并可以搭配 [vite-jest](https://github.com/sodatea/vite-jest) 这个包与 Vite 一同使用。不过，我们只推荐你在已有一套 Jest 测试配置、且需要迁移到基于 Vite 的项目时使用它，因为 Vitest 提供了更无缝的集成和更好的性能。

## 组件测试 {#component-testing}

在 Vue 应用程序中，主要用组件来构建用户界面。因此，当涉及到视觉和交互测试时，组件是一个很自然的独立单元。从粒度的角度来看，组件测试位于单元测试之上，可以被认为是集成测试的一种形式。在某些情况下，我们将测试单个的组件，但在其他情况下，我们可以测试一棵组件树，以确保它们被正确集成。

组件测试主要需要关心组件的公开接口而不是内部实现细节，或者换句话说，**测试这个组件能做什么，而不是要测试怎么做**。

- **推荐**

  - 对于 **视图** 的测试：根据输入 prop 和插槽断言渲染输出是否正确。
  - 对于 **交互** 的测试：断言渲染的更新是否正确或触发的事件是否正确地响应了用户输入事件。

- **不推荐**

  不推荐去断言一个组件实例的私有状态或测试一个组件的私有方法。测试实现细节会使测试代码太脆弱，因为当实现发生变化时，它们更有可能失败并需要更新重写。

  组件的最终工作是渲染正确的 DOM 输出，所以专注于 DOM 输出的测试提供了足够的正确性保证（如果你不需要更多其他方面测试的话），同时更加健壮、需要的改动更少。

  如果一个方法需要测试，把它提取到一个独立的实用函数中，并为它写一个专门的单元测试。如果它不能被直截了当地抽离出来，那么对它的调用应该作为交互测试的一部分。

### 推荐 {#recommendation-2}

- [Vitest](https://vitest.dev/) 或其他上述单元测试框架都可以通过在 Node.js 中模拟 DOM 来做组件测试。请看 [添加 Vitest 到项目中](#adding-vitest-to-a-project) 这一小节了解更多细节。

### 函数库 {#libraries}

组件测试通常包括单独挂载正在测试的组件、触发模拟用户输入事件和断言呈现的DOM输出。有专门的实用程序库可以简化这些任务。

- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) 是一个 Vue 的测试库，专注于测试组件而不依赖其他实现细节。因其良好的设计使得代码重构也变得非常容易。它的指导原则是测试代码越接近软件的使用方式，它们就越值得信赖。

- [`@vue/test-utils`](https://github.com/vuejs/vue-test-utils) 是官方的底层组件测试库，用来提供给用户访问 Vue 特有的 API。`@testing-library/vue` 也是基于此库构建的。

我们推荐使用 `@testing-library/vue` 作为你应用的, 因为它更匹配整个应用程序的测试优先级。应该仅在你构建更高级别组件、并需要测试内部的 Vue 特有 API 时再使用 `@vue/test-utils`。

### 其他选择 {#other-options-2}

- [Cypress](https://www.cypress.io/) 是一个 E2E 测试解决方案，但也支持 [组件测试](https://docs.cypress.io/guides/component-testing/introduction)，可以在测试组件时在真实浏览器中运行，展示的是真实 DOM 所渲染的界面。

- [Nightwatch v2](https://v2.nightwatchjs.org/) 是另一个 E2E 测试运行器，在 v2 版本中对 Vue 组件测试提供了支持（Nightwatch v2 版本的 [示例项目](https://github.com/nightwatchjs-community/todo-vue)）。

## E2E 测试 {#e2e-testing}

虽然单元测试为所写的代码提供了一定程度的验证，但单元测试和组件测试在部署到生产时，对应用程序整体覆盖的能力有限。因此，端到（E2E）测试针对的可以说是应用程序最重要的方面：当用户实际使用你的应用程序时发生了什么。

换句话说，E2E 测试验证了你的应用程序中的所有层级。这不仅包括你的前端代码，还包括所有相关的后端服务和基础设施，它们更能代表你的用户将身处的环境。通过测试用户行为如何影响你的应用程序，E2E 测试往往是应用程序是否能够如预期运行的关键。

### 选择一个 E2E 测试解决方案 {#choosing-an-e2e-testing-solution}

虽然市面上对 Web 上的端到端（E2E）测试的评价并不好，因为不可靠且拖慢了开发过程，但现代 E2E 工具已经在创建更可靠、更有用和交互性更好的测试方面取得了很大进步。在选择 E2E 测试框架时，以下小节会为你给应用程序选择测试框架时需要注意的事项提供了一些指导和说明。

#### 跨浏览器测试 {#cross-browser-testing}

E2E 测试的一个最基本的收益就是你可以了解你的应用程序在多个不同浏览器上运行的情况。尽管理想情况应该是 100% 的跨浏览器覆盖率，但重要的是要注意跨浏览器测试对团队资源的回报是递减的，因为需要额外的时间和机器能力来持续运行它们。因此，在选择应用程序所需的跨浏览器测试量时，注意权衡是很有必要的。

#### 更快的反馈 {#faster-feedback-loops}

E2E 测试和相应开发过程的主要问题之一是，运行整个套件需要很长的时间。通常情况下，这只在持续集成和部署（CI/CD）管道中进行。现代的 E2E 测试框架通过增加并行化等功能来帮助解决这个问题，这使得 CI/CD 管道的运行速度往往比以前快了几倍。此外，在本地开发时，能够有选择地运行你正在工作的页面的单个测试，同时还提供测试的热重载，大大提高了开发人员的工作流程和生产力。

#### 第一优先级的调试体验 {#first-class-debugging-experience}

传统上，开发人员依靠扫描终端窗口中的日志来帮助确定测试中出现的问题，而现代 E2E 测试框架允许开发人员利用他们已经熟悉的工具，例如浏览器开发工具。

#### 无头模式下的可见性 {#visibility-in-headless-mode}

当 E2E 测试在 CI/CD 管道中运行时，它们通常在无头浏览器（即不带界面的浏览器）中运行。因此，当错误发生时，现代 E2E 测试框架能够在不同的测试阶段看到应用程序的快照和/或视频，对此类关键功能会提供第一优先级的支持，这保证了对错误发生原因更有迹可循。而在很早以前，要手动维护这些集成是非常繁琐的。

### 推荐 {#recommendation}

- [Cypress](https://www.cypress.io/)

  总的来说，我们认为 Cypress 提供了最完整的 E2E 解决方案，具有信息丰富的图形界面、出色的调试性、内置断言和存根、抗剥落性、并行化和快照等诸多特性。如上所述，它还提供对 [组件测试](https://docs.cypress.io/guides/component-testing/introduction) 的支持。不过，它只支持测试基于 Chromium 的浏览器和 Firefox。

### 其它选项 {#other-options-3}

- [Playwright](https://playwright.dev/) 也是一个非常好的 E2E 测试解决方案，支持测试范围更广的浏览器品类（主要是 WebKit 型的）。查看这篇文章 [《为什么选择 Playwright》](https://playwright.dev/docs/why-playwright) 了解更多细节。

- [Nightwatch v2](https://v2.nightwatchjs.org/) 是一个基于 [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver) 的 E2E 测试解决方案。它的浏览器品类支持范围是最广的。

## 使用指南 {#recipes}

### 添加 Vitest 到项目中 {#adding-vitest-to-a-project}

在一个基于 Vite 的 Vue 项目中，运行如下命令：

```sh
> npm install -D vitest happy-dom @testing-library/vue@next
```

接着，更新你的 Vite 配置，添加上 `test` 这个选项块：

```js{6-12}
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  test: {
    // 启用类似 jest 的全局测试 API
    global: true,
    // 使用 happy-dom 模拟 DOM
    // 这需要你安装 happy-dom 作为对等依赖（peer dependency）
    environment: 'happy-dom'
  }
})
```

接着在你的项目中创建名字以 `*.test.js` 结尾的文件。你可以把所有的测试文件放在项目根目录下的 `test` 目录中，或者放在源文件旁边的 `test` 目录中。Vitest 会使用命名规则自动搜索它们。

```js
// MyComponent.test.js
import { render } from '@testing-library/vue'
import MyComponent from './MyComponent.vue'

test('这应该会成功！', () => {
  const { getByText } = render(MyComponent, {
    props: {
      /* ... */
    }
  })

  // 断言输出
  getByText('...')
})
```

最后，在 `package.json` 之中添加测试命令，然后运行它：

```json{4}
{
  // ...
  "scripts": {
    "test": "vitest"
  }
}
```

```sh
> npm test
```

### 测试可组合函数 {#testing-composables}

> 这一小节假设你已经读过了 [可组合函数](/guide/reusability/composables.html) 这一章。

当涉及到测试可组合函数时，我们可以根据是否依赖宿主组件实例把它们分为两类：

当一个可组合函数使用以下 API 时，它依赖于一个宿主组件实例。

- 生命周期钩子
- 供给/注入

如果一个可组合程序只使用响应性 API，那么它可以通过直接调用它并断言其返回的状态/方法来进行测试。

```js
// counter.js
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return {
    count,
    increment
  }
}
```

```js
// counter.test.js
import { useCounter } from './counter.js'

test('useCounter', () => {
  const { count, increment } = useCounter()
  expect(count.value).toBe(0)

  increment()
  expect(count.value).toBe(1)
})
```

一个依赖生命周期钩子或供给/注入的可组合函数需要被包裹在一个宿主组件中才可以测试。我们可以创建下面这样的帮手函数：

```js
// test-utils.js
import { createApp } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // 假设忽略模板警告
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  // 返回结果与应用实例
  // 用来测试供给和组件卸载
  return [result, app]
}
```
```js
import { withSetup } from './test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
  const [result, app] = withSetup(() => useFoo(123))
  // 为注入的测试模拟一方供给
  app.provide(...)
  // 执行断言
  expect(result.foo.value).toBe(1)
  // 如果需要的话可以这样触发
  app.unmount()
})
```

对于更复杂的可组合函数，通过使用 [组件测试] 编写针对这个包裹组件的测试，这会容易很多。

<!-- TODO link to this from composables page -->

<!--
TODO more testing recipes can be added in the future e.g.
- How to set up CI via GitHub actions
- How to do mocking in component testing
-->
