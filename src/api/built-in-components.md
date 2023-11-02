---
pageClass: api
---

# 内置组件 {#built-in-components}

:::info 组件注册和使用
内置组件无需注册便可以直接在模板中使用。它们也支持 tree-shake：仅在使用时才会包含在构建中。

在[渲染函数](/guide/extras/render-function)中使用它们时，需要显式导入。例如：

```js
import { h, Transition } from 'vue'

h(Transition, {
  /* props */
})
```

:::

## `<Transition>` {#transition}

为**单个**元素或组件提供动画过渡效果。

- **Props**

  ```ts
  interface TransitionProps {
    /**
     * 用于自动生成过渡 CSS class 名。
     * 例如 `name: 'fade'` 将自动扩展为 `.fade-enter`、
     * `.fade-enter-active` 等。
     */
    name?: string
    /**
     * 是否应用 CSS 过渡 class。
     * 默认：true
     */
    css?: boolean
    /**
     * 指定要等待的过渡事件类型
     * 来确定过渡结束的时间。
     * 默认情况下会自动检测
     * 持续时间较长的类型。
     */
    type?: 'transition' | 'animation'
    /**
     * 显式指定过渡的持续时间。
     * 默认情况下是等待过渡效果的根元素的第一个 `transitionend`
     * 或`animationend`事件。
     */
    duration?: number | { enter: number; leave: number }
    /**
     * 控制离开/进入过渡的时序。
     * 默认情况下是同时的。
     */
    mode?: 'in-out' | 'out-in' | 'default'
    /**
     * 是否对初始渲染使用过渡。
     * 默认：false
     */
    appear?: boolean

    /**
     * 用于自定义过渡 class 的 prop。
     * 在模板中使用短横线命名，例如：enter-from-class="xxx"
     */
    enterFromClass?: string
    enterActiveClass?: string
    enterToClass?: string
    appearFromClass?: string
    appearActiveClass?: string
    appearToClass?: string
    leaveFromClass?: string
    leaveActiveClass?: string
    leaveToClass?: string
  }
  ```

- **事件**

  - `@before-enter`
  - `@before-leave`
  - `@enter`
  - `@leave`
  - `@appear`
  - `@after-enter`
  - `@after-leave`
  - `@after-appear`
  - `@enter-cancelled`
  - `@leave-cancelled` (`v-show` only)
  - `@appear-cancelled`

- **示例**

  简单元素：

  ```vue-html
  <Transition>
    <div v-if="ok">toggled content</div>
  </Transition>
  ```

  通过改变 `key` 属性来强制过度执行：

  ```vue-html
  <Transition>
    <div :key="text">{{ text }}</div>
  </Transition>
  ```

  动态组件，初始渲染时带有过渡模式 + 动画出现：

  ```vue-html
  <Transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </Transition>
  ```

  监听过渡事件：

  ```vue-html
  <Transition @after-enter="onTransitionComplete">
    <div v-show="ok">toggled content</div>
  </Transition>
  ```

- **参考** [`<Transition>` 指南](/guide/built-ins/transition)

## `<TransitionGroup>` {#transitiongroup}

为列表中的**多个**元素或组件提供过渡效果。

- **Props**

  `<TransitionGroup>` 拥有与 `<Transition>` 除了 `mode` 以外所有的 props，并增加了两个额外的 props：

  ```ts
  interface TransitionGroupProps extends Omit<TransitionProps, 'mode'> {
    /**
     * 如果未定义，则渲染为片段 (fragment)。
     */
    tag?: string
    /**
     * 用于自定义过渡期间被应用的 CSS class。
     * 在模板中使用 kebab-case，例如 move-class="xxx"
     */
    moveClass?: string
  }
  ```

- **事件**

  `<TransitionGroup>` 抛出与 `<Transition>` 相同的事件。

- **详细信息**

  默认情况下，`<TransitionGroup>` 不会渲染一个容器 DOM 元素，但是可以通过 `tag` prop 启用。

  注意，每个 `<transition-group>` 的子节点必须有[**独立的 key**](/guide/essentials/list#maintaining-state-with-key)，动画才能正常工作。

  `<TransitionGroup>` 支持通过 CSS transform 控制移动效果。当一个子节点在屏幕上的位置在更新之后发生变化时，它会被添加一个使其位移的 CSS class (基于 `name` attribute 推导，或使用 `move-class` prop 显式配置)。如果使其位移的 class 被添加时 CSS 的 `transform` 属性是“可过渡的”，那么该元素会基于 [FLIP 技巧](https://aerotwist.com/blog/flip-your-animations/)平滑地到达动画终点。

- **示例**

  ```vue-html
  <TransitionGroup tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
  ```

- **参考**[指南 - TransitionGroup](/guide/built-ins/transition-group)

## `<KeepAlive>` {#keepalive}

缓存包裹在其中的动态切换组件。

- **Props**

  ```ts
  interface KeepAliveProps {
    /**
     * 如果指定，则只有与 `include` 名称
     * 匹配的组件才会被缓存。
     */
    include?: MatchPattern
    /**
     * 任何名称与 `exclude`
     * 匹配的组件都不会被缓存。
     */
    exclude?: MatchPattern
    /**
     * 最多可以缓存多少组件实例。
     */
    max?: number | string
  }

  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **详细信息**

  `<KeepAlive>` 包裹动态组件时，会缓存不活跃的组件实例，而不是销毁它们。

  任何时候都只能有一个活跃组件实例作为 `<KeepAlive>` 的直接子节点。

  当一个组件在 `<KeepAlive>` 中被切换时，它的 `activated` 和 `deactivated` 生命周期钩子将被调用，用来替代 `mounted` 和 `unmounted`。这适用于 `<KeepAlive>` 的直接子节点及其所有子孙节点。

- **示例**

  基本用法：

  ```vue-html
  <KeepAlive>
    <component :is="view"></component>
  </KeepAlive>
  ```

  与 `v-if` / `v-else` 分支一起使用时，同一时间只能有一个组件被渲染：

  ```vue-html
  <KeepAlive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </KeepAlive>
  ```

  与 `<Transition>` 一起使用：

  ```vue-html
  <Transition>
    <KeepAlive>
      <component :is="view"></component>
    </KeepAlive>
  </Transition>
  ```

  使用 `include` / `exclude`：

  ```vue-html
  <!-- 用逗号分隔的字符串 -->
  <KeepAlive include="a,b">
    <component :is="view"></component>
  </KeepAlive>

  <!-- 正则表达式 (使用 `v-bind`) -->
  <KeepAlive :include="/a|b/">
    <component :is="view"></component>
  </KeepAlive>

  <!-- 数组 (使用 `v-bind`) -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view"></component>
  </KeepAlive>
  ```

  使用 `max`：

  ```vue-html
  <KeepAlive :max="10">
    <component :is="view"></component>
  </KeepAlive>
  ```

- **参考**[指南 - KeepAlive](/guide/built-ins/keep-alive)

## `<Teleport>` {#teleport}

将其插槽内容渲染到 DOM 中的另一个位置。

- **Props**

  ```ts
  interface TeleportProps {
    /**
     * 必填项。指定目标容器。
     * 可以是选择器或实际元素。
     */
    to: string | HTMLElement
    /**
     * 当值为 `true` 时，内容将保留在其原始位置
     * 而不是移动到目标容器中。
     * 可以动态更改。
     */
    disabled?: boolean
  }
  ```

- **示例**

  指定目标容器：

  ```vue-html
  <Teleport to="#some-id" />
  <Teleport to=".some-class" />
  <Teleport to="[data-teleport]" />
  ```

  有条件地禁用：

  ```vue-html
  <Teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </Teleport>
  ```

- **参考**[指南 - Teleport](/guide/built-ins/teleport)

## `<Suspense>` <sup class="vt-badge experimental" /> {#suspense}

用于协调对组件树中嵌套的异步依赖的处理。

- **Props**

  ```ts
  interface SuspenseProps {
    timeout?: string | number
  }
  ```

- **事件**

  - `@resolve`
  - `@pending`
  - `@fallback`

- **详细信息**

  `<Suspense>` 接受两个插槽：`#default` 和 `#fallback`。它将在内存中渲染默认插槽的同时展示后备插槽内容。

  如果在渲染时遇到异步依赖项 ([异步组件](/guide/components/async)和具有 [`async setup()`](/guide/built-ins/suspense#async-setup) 的组件)，它将等到所有异步依赖项解析完成时再显示默认插槽。

- **参考**[指南 - Suspense](/guide/built-ins/suspense)
