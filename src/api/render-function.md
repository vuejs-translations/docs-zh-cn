# 渲染函数 API

## h()

创建虚拟 DOM 节点(vnode)。

- **类型**

  ```ts
  // 详细的函数签名
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): VNode

  // 省略 props
  function h(type: string | Component, children?: Children | Slot): VNode

  type Children = string | number | boolean | VNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > 为了便于阅读，对类型进行了简化。

- **详细信息**

  第一个参数可以是一个原生元素的字符串或一个 Vue 组件定义。第二个参数是要传递的 prop ，第三个参数是 children 。

  当创建一个组件 vnode 时， children 必须作为插槽函数传递。如果组件只期望默认插槽，那么可以只传递单个插槽函数。否则，必须作为一个插槽函数的对象来传递。

  为了方便起见，当 children 不是一个插槽对象时， props 可以被省略。

- **示例**

  创建原生元素：

  ```js
  import { h } from 'vue'

  // 除了 type 必填以外，其他的参数都是可选的
  h('div')
  h('div', { id: 'foo' })

  // attribute 和 property 都能在 prop 中书写
  // Vue 会自动将它们分配到正确的位置
  h('div', { class: 'bar', innerHTML: 'hello' })

  // 类与样式可以像在模板中一样
  // 用数组或对象的形式书写
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // 事件监听器应以 onXxx 的形式书写
  h('div', { onClick: () => {} })

  // children 可以是一个字符串
  h('div', { id: 'foo' }, 'hello')

  // 没有 props 时可以省略不写
  h('div', 'hello')
  h('div', [h('span', 'hello')])

  // children 数组可以同时包含 vnode 与字符串
  h('div', ['hello', h('span', 'hello')])
  ```

  创建组件:

  ```js
  import Foo from './Foo.vue'

  // 传递 prop
  h(Foo, {
    // 等同于 some-prop="hello"
    someProp: 'hello',
    // 等同于 @update="() => {}"
    onUpdate: () => {}
  })

  // 传递单个默认插槽
  h(Foo, () => 'default slot')

  // 传递具名插槽
  // 注意 `null` 是必需的
  // 以避免 slot 对象被当成 prop 处理
  h(MyComponent, null, {
    default: () => 'default slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **相关内容：** [指南 - 渲染函数 & JSX - 创建 VNodes](/guide/extras/render-function.html#creating-vnodes)

## mergeProps()

合并多个 props 对象，并对某些 props 进行特殊处理。

- **类型**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **详细信息**

  `mergeProps()` 支持合并多个 props 对象并对以下 props 进行特殊处理：

  - `class`
  - `style`
  - `onXxx` 事件监听器 —— 具有相同名称的多个监听器将会被合并到一个数组中。

  如果你不需要合并行为而只是想要简单的覆盖，则应该选择对原生对象进行扩展而不是使用此 API 。

- **示例**

  ```js
  import { mergeProps } from 'vue'

  const one = {
    class: 'foo',
    onClick: handlerA
  }

  const two = {
    class: { bar: true },
    onClick: handlerB
  }

  const merged = mergeProps(one, two)
  /**
   {
     class: 'foo bar',
     onClick: [handlerA, handlerB]
   }
   */
  ```

## cloneVNode()

克隆一个 vnode 。

- **类型**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **详细信息**

  返回一个克隆的 vnode ，也可以选择将额外的 props 与原 vnode 进行合并。

  Vnode 一旦被创建，那么就应该认为它是不可变的，并且你不应该变更一个已存在的 vnode 的 props 。而是以不同的/额外的 props 克隆它。

  Vnode 具有特殊的内部属性，因此克隆它们并不像对象扩展那么简单。 `cloneVNode()` 处理了大量的内部逻辑。

- **示例**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode()

检查一个值是不是一个 vnode 。

- **类型**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent()

通过其名称手动解析一个已注册的组件。

- **类型**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **详细信息**

  **注意： 如果你可以直接导入组件，那么你将不会需要此 API 。**

  `resolveComponent()` 只能在<span class="composition-api"> `setup()` 或者</span>渲染函数中被调用，以便从正确的组件上下文中进行解析。

  如果没有找到该组件，则会抛出一个运行时警告，并返回 name 字符串。

- **示例**

  <div class="composition-api">

  ```js
  const { h, resolveComponent } = Vue

  export default {
    setup() {
      const ButtonCounter = resolveComponent('ButtonCounter')

      return () => {
        return h(ButtonCounter)
      }
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  const { h, resolveComponent } = Vue

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **相关内容：** [指南 - 渲染函数 & JSX - 组件](/guide/extras/render-function.html#components)

## resolveDirective()

通过其名称手动解析一个已注册的指令。

- **类型**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **详细信息**

  **注意： 如果你可以直接导入组件，那么你将不会需要此 API 。**

  `resolveDirective()` 只能在<span class="composition-api"> `setup()` 或者</span>渲染函数中被调用，以便从正确的组件上下文中进行解析。

  如果没有找到该指令，则会抛出一个运行时警告，并返回 `undefined` 。

- **相关内容：** [指南- 渲染函数 & JSX - 自定义指令](/guide/extras/render-function.html#custom-directives)

## withDirectives()

允许将指令应用于 vnode 。

- **类型**

  ```ts
  function withDirectives(
    vnode: VNode,
    directives: DirectiveArguments
  ): VNode

  // [Directive, value, argument, modifiers]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **详细信息**

  将一个已存在的 vnode 用自定义指令包装。第二个参数是一个自定义指令的数组。每个自定义指令都会以 `[Directive, value, argument, modifiers]` 形式的数组出现。如果不需要数组尾部的元素，则允许将其省略。

- **示例**

  ```js
  import { h, withDirectives } from 'vue'

  // 一个自定义指令
  const pin = {
    mounted() {
      /* ... */
    },
    updated() {
      /* ... */
    }
  }

  // <div v-pin:top.animate="200"></div>
  const vnode = withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
  ```

- **相关内容：** [指南 - 渲染函数 & JSX - 自定义指令](/guide/extras/render-function.html#custom-directives)

## withModifiers()

为事件处理函数添加内置 [`v-on` 修饰符](/guide/essentials/event-handling.html#event-modifiers) 。

- **类型**

  ```ts
  function withModifiers(fn: Function, modifiers: string[]): Function
  ```

- **示例**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // 等同于 v-on.stop.prevent
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **相关内容：** [指南 - 渲染函数 & JSX - 事件修饰符](/guide/extras/render-function.html#event-modifiers)
