<script setup>
import TestingApiSwitcher from './TestingApiSwitcher.vue'
</script>

# 测试 {#testing}

## 为什么需要测试 {#why-test}

自动化测试能够预防无意引入的 bug，并鼓励开发者将应用分解为可测试、可维护的函数、模块、类和组件。这能够帮助你和你的团队更快速、自信地构建复杂的 Vue 应用。与任何应用一样，新的 Vue 应用可能会以多种方式崩溃，因此，在发布前发现并解决这些问题就变得十分重要。

在本篇指引中，我们将介绍一些基本术语，并就你的 Vue 3 应用应选择哪些工具提供一些建议。

还有一个特定用于 Vue 的小节，介绍了组合式函数的测试，详情请参阅[测试组合式函数](#testing-composables)。

## 何时测试 {#when-to-test}

越早越好！我们建议你尽快开始编写测试。拖得越久，应用就会有越多的依赖和复杂性，想要开始添加测试也就越困难。

## 测试的类型 {#testing-types}

当设计你的 Vue 应用的测试策略时，你应该利用以下几种测试类型：

- **单元测试**：检查给定函数、类或组合式函数的输入是否产生预期的输出或副作用。
- **组件测试**：检查你的组件是否正常挂载和渲染、是否可以与之互动，以及表现是否符合预期。这些测试比单元测试导入了更多的代码，更复杂，需要更多时间来执行。
- **端到端测试**：检查跨越多个页面的功能，并对生产构建的 Vue 应用进行实际的网络请求。这些测试通常涉及到建立一个数据库或其他后端。

每种测试类型在你的应用的测试策略中都发挥着作用，保护你免受不同类型的问题的影响。

## 总览 {#overview}

我们将简要地讨论这些测试是什么，以及如何在 Vue 应用中实现它们，并提供一些普适性建议。

## 单元测试 {#unit-testing}

编写单元测试是为了验证小的、独立的代码单元是否按预期工作。一个单元测试通常覆盖一个单个函数、类、组合式函数或模块。单元测试侧重于逻辑上的正确性，只关注应用整体功能的一小部分。他们可能会模拟你的应用环境的很大一部分（如初始状态、复杂的类、第三方模块和网络请求）。

一般来说，单元测试将捕获函数的业务逻辑和逻辑正确性的问题。

以这个 `increment` 函数为例：

```js
// helpers.js
export function increment (current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}
```

因为它很独立，可以很容易地调用 `increment` 函数并断言它是否返回了所期望的内容，所以我们将编写一个单元测试。

如果任何一条断言失败了，那么问题一定是出在 `increment` 函数上。

```js{4-16}
// helpers.spec.js
import { increment } from './helpers'

describe('increment', () => {
  test('increments the current number by 1', () => {
    expect(increment(0, 10)).toBe(1)
  })

  test('does not increment the current number over the max', () => {
    expect(increment(10, 10)).toBe(10)
  })

  test('has a default max of 10', () => {
    expect(increment(10)).toBe(10)
  })
})
```

如前所述，单元测试通常适用于独立的业务逻辑、组件、类、模块或函数，不涉及 UI 渲染、网络请求或其他环境问题。

这些通常是与 Vue 无关的纯 JavaScript/TypeScript 模块。一般来说，在 Vue 应用中为业务逻辑编写单元测试与使用其他框架的应用没有明显区别。

但有两种情况，你必须对 Vue 的特定功能进行单元测试：

1. 组合式函数
2. 组件

### 组合式函数 {#composables}

有一类 Vue 应用中特有的函数被称为 [组合式函数](/guide/reusability/composables)，在测试过程中可能需要特殊处理。
你可以跳转到下方查看 [测试组合式函数](#testing-composables) 了解更多细节。

### 组件的单元测试 {#unit-testing-components}

一个组件可以通过两种方式测试：

1. 白盒：单元测试

   白盒测试知晓一个组件的实现细节和依赖关系。它们更专注于将组件进行更 **独立** 的测试。这些测试通常会涉及到模拟一些组件的部分子组件，以及设置插件的状态和依赖性（例如 Pinia）。

2. 黑盒：组件测试

   黑盒测试不知晓一个组件的实现细节。这些测试尽可能少地模拟，以测试组件在整个系统中的集成情况。它们通常会渲染所有子组件，因而会被认为更像一种“集成测试”。请查看下方的[组件测试建议](#component-testing)作进一步了解。

### 推荐方案 {#recommendation}

- [Vitest](https://vitest.dev/)

  因为由 `create-vue` 创建的官方项目配置是基于 [Vite](https://cn.vitejs.dev/) 的，所以我们推荐你使用一个可以利用同一套 Vite 配置和转换管道的单元测试框架。[Vitest](https://cn.vitest.dev/) 正是一个针对此目标设计的单元测试框架，它由 Vue / Vite 团队成员开发和维护。在 Vite 的项目集成它会非常简单，而且速度非常快。

### 其他选择 {#other-options}

- [Peeky](https://peeky.dev/) 是另一速度极快的单元测试运行器，对 Vite 集成提供第一优先级支持。它也是由 Vue 核心团队成员创建的，并提供了一个基于图形用户界面（GUI）的测试界面。

- [Jest](https://jestjs.io/) 是一个广受欢迎的单元测试框架，并可通过 [vite-jest](https://github.com/sodatea/vite-jest) 这个包在 Vite 中使用。不过，我们只推荐你在已有一套 Jest 测试配置、且需要迁移到基于 Vite 的项目时使用它，因为 Vitest 提供了更无缝的集成和更好的性能。

## 组件测试 {#component-testing}

在 Vue 应用中，主要用组件来构建用户界面。因此，当验证应用的行为时，组件是一个很自然的独立单元。从粒度的角度来看，组件测试位于单元测试之上，可以被认为是集成测试的一种形式。你的 Vue 应用中大部分内容都应该由组件测试来覆盖，我们建议每个 Vue 组件都应有自己的组件测试文件。

组件测试应该捕捉组件中的 prop、事件、提供的插槽、样式、CSS class 名、生命周期钩子，和其他相关的问题。

组件测试不应该模拟子组件，而应该像用户一样，通过与组件互动来测试组件和其子组件之间的交互。例如，组件测试应该像用户那样点击一个元素，而不是编程式地与组件进行交互。

组件测试主要需要关心组件的公开接口而不是内部实现细节。对于大部分的组件来说，公开接口包括触发的事件、prop 和插槽。当进行测试时，请记住，**测试这个组件做了什么，而不是测试它是怎么做到的**。

- **推荐的做法**

  - 对于 **视图** 的测试：根据输入 prop 和插槽断言渲染输出是否正确。
  - 对于 **交互** 的测试：断言渲染的更新是否正确或触发的事件是否正确地响应了用户输入事件。

  在下面的例子中，我们展示了一个步进器（Stepper）组件，它拥有一个标记为 `increment` 的可点击的 DOM 元素。我们还传入了一个名为 `max` 的 prop 防止步进器增长超过 `2`，因此如果我们点击了按钮 3 次，视图将仍然显示 `2`。

  我们不了解这个步进器的实现细节，只知道“输入”是这个 `max` prop，“输出”是这个组件状态所呈现出的视图。

<TestingApiSwitcher>

<div class="testing-library-api">

```js
const { getByText } = render(Stepper, {
  props: {
    max: 1
  }
})

getByText('0') // 隐式断言 "0" 在这个组件中

const button = getByText('increment')

// 向我们的增长按钮发送一个点击事件。
await fireEvent.click(button)

getByText('1')

await fireEvent.click(button)
```

</div>

<div class="vtu-api">

```js
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

const wrapper = mount(Stepper, {
  props: {
    max: 1
  }
})

expect(wrapper.find(valueSelector).text()).toContain('0')

await wrapper.find(buttonSelector).trigger('click')

expect(wrapper.find(valueSelector).text()).toContain('1')
```

</div>

<div class="cypress-api">

```js
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

mount(Stepper, {
  props: {
    max: 1
  }
})

cy.get(valueSelector).should('be.visible').and('contain.text', '0')
  .get(buttonSelector).click()
  .get(valueSelector).should('contain.text', '1')
```

</div>

</TestingApiSwitcher>

- **应避免的做法**

  不要去断言一个组件实例的私有状态或测试一个组件的私有方法。测试实现细节会使测试代码太脆弱，因为当实现发生变化时，它们更有可能失败并需要更新重写。

  组件的最终工作是渲染正确的 DOM 输出，所以专注于 DOM 输出的测试提供了足够的正确性保证（如果你不需要更多其他方面测试的话），同时更加健壮、需要的改动更少。

  不要完全依赖快照测试。断言 HTML 字符串并不能完全说明正确性。应当编写有意图的测试。

  如果一个方法需要测试，把它提取到一个独立的实用函数中，并为它写一个专门的单元测试。如果它不能被直截了当地抽离出来，那么对它的调用应该作为交互测试的一部分。

### 推荐方案 {#recommendation-1}

- [Vitest](https://vitest.dev/) 对于组件和组合式函数都采用无头渲染的方式 (例如 VueUse 中的 [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) 函数)。组件和 DOM 都可以通过 [@vue/test-utils](https://github.com/vuejs/test-utils) 来测试。

- [Cypress 组件测试](https://on.cypress.io/component) 会预期其准确地渲染样式或者触发原生 DOM 事件。可以搭配 [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro) 这个库一同进行测试。

Vitest 和基于浏览器的运行器之间的主要区别是速度和执行上下文。简而言之，基于浏览器的运行器，如 Cypress，可以捕捉到基于 Node 的运行器（如 Vitest）所不能捕捉的问题（比如样式问题、原生 DOM 事件、Cookies、本地存储和网络故障），但基于浏览器的运行器比 Vitest *慢几个数量级*，因为它们要执行打开浏览器，编译样式表以及其他步骤。Cypress 是一个基于浏览器的运行器，支持组件测试。请阅读 [Vitest 文档的“比较”这一章](https://vitest.dev/guide/comparisons.html#cypress) 了解 Vitest 和 Cypress 最新的比较信息。

### 组件挂载库 {#mounting-libraries}

组件测试通常涉及到单独挂载被测试的组件，触发模拟的用户输入事件，并对渲染的 DOM 输出进行断言。有一些专门的工具库可以使这些任务变得更简单。

- [`@vue/test-utils`](https://github.com/vuejs/test-utils) 是官方的底层组件测试库，用来提供给用户访问 Vue 特有的 API。`@testing-library/vue` 也是基于此库构建的。

- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) 是一个专注于测试组件而不依赖于实现细节的 Vue 测试库。它的指导原则是：测试越是类似于软件的使用方式，它们就能提供越多的信心。

我们推荐在应用中使用 `@vue/test-utils` 测试组件。`@testing-library/vue` 在测试带有 Suspense 的异步组件时存在问题，在使用时需要谨慎。

### 其他选择 {#other-options-1}

- [Nightwatch](https://v2.nightwatchjs.org/) 是一个端到端测试运行器，支持 Vue 的组件测试。(Nightwatch v2 版本的 [示例项目](https://github.com/nightwatchjs-community/todo-vue))

- [WebdriverIO](https://webdriver.io/docs/component-testing/vue) 用于跨浏览器组件测试，该测试依赖于基于标准自动化的原生用户交互。也可以与测试库一起使用。

## 端到端（E2E）测试 {#e2e-testing}

虽然单元测试为所写的代码提供了一定程度的验证，但单元测试和组件测试在部署到生产时，对应用整体覆盖的能力有限。因此，端到端测试针对的可以说是应用最重要的方面：当用户实际使用你的应用时发生了什么。

端到端测试的重点是多页面的应用表现，针对你的应用在生产环境下进行网络请求。他们通常需要建立一个数据库或其他形式的后端，甚至可能针对一个预备上线的环境运行。

端到端测试通常会捕捉到路由、状态管理库、顶级组件（常见为 App 或 Layout）、公共资源或任何请求处理方面的问题。如上所述，它们可以捕捉到单元测试或组件测试无法捕捉的关键问题。

端到端测试不导入任何 Vue 应用的代码，而是完全依靠在真实浏览器中浏览整个页面来测试你的应用。

端到端测试验证了你的应用中的许多层。可以在你的本地构建的应用中，甚至是一个预上线的环境中运行。针对预上线环境的测试不仅包括你的前端代码和静态服务器，还包括所有相关的后端服务和基础设施。

> 你的测试越是类似于你的软件的使用方式，它们就越能值得你信赖。- [Kent C. Dodds](https://twitter.com/kentcdodds/status/977018512689455106) - Testing Library 的作者

通过测试用户操作如何影响你的应用，端到端测试通常是提高应用能否正常运行的置信度的关键。

### 选择一个端到端测试解决方案 {#choosing-an-e2e-testing-solution}

虽然因为不可靠且拖慢了开发过程，市面上对 Web 上的端到端测试的评价并不好，但现代端到端工具已经在创建更可靠、更有用和交互性更好的测试方面取得了很大进步。在选择端到端测试框架时，以下小节会为你给应用选择测试框架时需要注意的事项提供一些指导。

#### 跨浏览器测试 {#cross-browser-testing}

端到端测试的一个主要优点是你可以了解你的应用在多个不同浏览器上运行的情况。尽管理想情况应该是 100% 的跨浏览器覆盖率，但很重要的一点是跨浏览器测试对团队资源的回报是递减的，因为需要额外的时间和机器来持续运行它们。因此，在选择应用所需的跨浏览器测试的数量时，注意权衡是很有必要的。

#### 更快的反馈 {#faster-feedback-loops}

端到端测试和相应开发过程的主要问题之一是，运行整个套件需要很长的时间。通常情况下，这只在持续集成和部署（CI/CD）管道中进行。现代的端到端测试框架通过增加并行化等功能来帮助解决这个问题，这使得 CI/CD 管道的运行速度比以前快了几倍。此外，在本地开发时，能够有选择地为你正在工作的页面运行单个测试，同时还提供测试的热重载，大大提高了开发者的工作流程和生产力。

#### 第一优先级的调试体验 {#first-class-debugging-experience}

传统上，开发者依靠扫描终端窗口中的日志来帮助确定测试中出现的问题，而现代端到端测试框架允许开发者利用他们已经熟悉的工具，例如浏览器开发工具。

#### 无头模式下的可见性 {#visibility-in-headless-mode}

当端到端测试在 CI/CD 管道中运行时，它们通常在无头浏览器（即不带界面的浏览器）中运行。因此，当错误发生时，现代端到端测试框架的一个关键特性是能够在不同的测试阶段查看应用的快照、视频，从而深入了解错误的原因。而在很早以前，要手动维护这些集成是非常繁琐的。

### 推荐方案 {#recommendation-2}

- [Cypress](https://www.cypress.io/)

  总的来说，我们认为 Cypress 提供了最完整的端到端解决方案，其具有信息丰富的图形界面、出色的调试性、内置断言和存根、抗剥落性、并行化和快照等诸多特性。而且如上所述，它还提供对 [组件测试](https://docs.cypress.io/guides/component-testing/introduction) 的支持。不过，它只支持测试基于 Chromium 的浏览器和 Firefox。

### 其他选项 {#other-options-2}

- [Playwright](https://playwright.dev/) 也是一个非常好的端到端测试解决方案，支持测试范围更广的浏览器品类（主要是 WebKit 型的）。查看这篇文章 [《为什么选择 Playwright》](https://playwright.dev/docs/why-playwright) 了解更多细节。

- [Nightwatch](https://nightwatchjs.org/) 是一个基于 [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver) 的端到端测试解决方案。它的浏览器品类支持范围是最广的。

- [WebdriverIO](https://webdriver.io/) 是一个基于 WebDriver 协议的网络和移动测试的自动化测试框架。

## 用例指南 {#recipes}

### 添加 Vitest 到项目中 {#adding-vitest-to-a-project}

在一个基于 Vite 的 Vue 项目中，运行如下命令：

```sh
> npm install -D vitest happy-dom @testing-library/vue
```

接着，更新你的 Vite 配置，添加上 `test` 选项：

```js{6-12}
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  test: {
    // 启用类似 jest 的全局测试 API
    globals: true,
    // 使用 happy-dom 模拟 DOM
    // 这需要你安装 happy-dom 作为对等依赖（peer dependency）
    environment: 'happy-dom'
  }
})
```

:::tip
如果你在使用 TypeScript，请将 `vitest/globals` 添加到 `tsconfig.json` 的 `types` 字段当中。

```json
// tsconfig.json

{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

:::

接着在你的项目中创建名字以 `*.test.js` 结尾的文件。你可以把所有的测试文件放在项目根目录下的 `test` 目录中，或者放在源文件旁边的 `test` 目录中。Vitest 会使用命名规则自动搜索它们。

```js
// MyComponent.test.js
import { render } from '@testing-library/vue'
import MyComponent from './MyComponent.vue'

test('it should work', () => {
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

### 测试组合式函数 {#testing-composables}

> 这一小节假设你已经读过了[组合式函数](/guide/reusability/composables)这一章。

当涉及到测试组合式函数时，我们可以根据是否依赖宿主组件实例把它们分为两类。

当一个组合式函数使用以下 API 时，它依赖于一个宿主组件实例：

- 生命周期钩子
- 供给/注入

如果一个组合式程序只使用响应式 API，那么它可以通过直接调用并断言其返回的状态或方法来进行测试。

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

一个依赖生命周期钩子或供给/注入的组合式函数需要被包装在一个宿主组件中才可以测试。我们可以创建下面这样的帮手函数：

```js
// test-utils.js
import { createApp } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // 忽略模板警告
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

对于更复杂的组合式函数，通过使用[组件测试](#component-testing)编写针对这个包装器组件的测试，这会容易很多。

<!--
TODO more testing recipes can be added in the future e.g.
- How to set up CI via GitHub actions
- How to do mocking in component testing
-->

<!-- zhlint disabled -->
