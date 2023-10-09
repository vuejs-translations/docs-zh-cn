# 渲染函数 API {#render-function-apis}

## h() {#h}

创建虚拟 DOM 节点 (vnode)。

- **类型**

  ```ts
  // 完整参数签名
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

  第一个参数既可以是一个字符串 (用于原生元素) 也可以是一个 Vue 组件定义。第二个参数是要传递的 prop，第三个参数是子节点。

  当创建一个组件的 vnode 时，子节点必须以插槽函数进行传递。如果组件只有默认槽，可以使用单个插槽函数进行传递。否则，必须以插槽函数的对象形式来传递。

  为了方便阅读，当子节点不是插槽对象时，可以省略 prop 参数。

- **示例**

  创建原生元素：

  ```js
  import { h } from 'vue'

  // 除了 type 外，其他参数都是可选的
  h('div')
  h('div', { id: 'foo' })

  // attribute 和 property 都可以用于 prop
  // Vue 会自动选择正确的方式来分配它
  h('div', { class: 'bar', innerHTML: 'hello' })

  // class 与 style 可以像在模板中一样
  // 用数组或对象的形式书写
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // 事件监听器应以 onXxx 的形式书写
  h('div', { onClick: () => {} })

  // children 可以是一个字符串
  h('div', { id: 'foo' }, 'hello')

  // 没有 prop 时可以省略不写
  h('div', 'hello')
  h('div', [h('span', 'hello')])

  // children 数组可以同时包含 vnode 和字符串
  h('div', ['hello', h('span', 'hello')])
  ```

  创建组件：

  ```js
  import Foo from './Foo.vue'

  // 传递 prop
  h(Foo, {
    // 等价于 some-prop="hello"
    someProp: 'hello',
    // 等价于 @update="() => {}"
    onUpdate: () => {}
  })

  // 传递单个默认插槽
  h(Foo, () => 'default slot')

  // 传递具名插槽
  // 注意，需要使用 `null` 来避免
  // 插槽对象被当作是 prop
  h(MyComponent, null, {
    default: () => 'default slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **参考**[指南 - 渲染函数 - 创建 VNode](/guide/extras/render-function#creating-vnodes)

## mergeProps() {#mergeprops}

合并多个 props 对象，用于处理含有特定的 props 参数的情况。

- **类型**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **详细信息**

  `mergeProps()` 支持以下特定 props 参数的处理，将它们合并成一个对象。

  - `class`
  - `style`
  - `onXxx` 事件监听器——多个同名的事件监听器将被合并到一个数组。

  如果你不需要合并行为而是简单覆盖，可以使用原生 object spread 语法来代替。

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

## cloneVNode() {#clonevnode}

克隆一个 vnode。

- **类型**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **详细信息**

  返回一个克隆的 vnode，可在原有基础上添加一些额外的 prop。

  Vnode 被认为是一旦创建就不能修改的，你不应该修改已创建的 vnode 的 prop，而应该附带不同的/额外的 prop 来克隆它。

  Vnode 具有特殊的内部属性，因此克隆它并不像 object spread 一样简单。`cloneVNode()` 处理了大部分这样的内部逻辑。

- **示例**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode() {#isvnode}

判断一个值是否为 vnode 类型。

- **类型**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent() {#resolvecomponent}

按名称手动解析已注册的组件。

- **类型**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **详细信息**

  **备注：如果你可以直接引入组件就不需使用此方法。**

  为了能从正确的组件上下文进行解析，`resolveComponent()` 必须在<span class="composition-api"> `setup()` 或</span>渲染函数内调用。

  如果组件未找到，会抛出一个运行时警告，并返回组件名字符串。

- **示例**

  <div class="composition-api">

  ```js
  import { h, resolveComponent } from 'vue'

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
  import { h, resolveComponent } from 'vue'

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **参考**[指南 - 渲染函数 - 组件](/guide/extras/render-function#components)

## resolveDirective() {#resolvedirective}

按名称手动解析已注册的指令。

- **类型**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **详细信息**

  **备注：如果你可以直接引入指令就不需使用此方法。**

  为了能从正确的组件上下文进行解析，`resolveDirective()` 必须在<span class="composition-api"> `setup()` 或</span>渲染函数内调用。

  如果指令没有找到，会抛出一个运行时警告，并返回 `undefined`。

- **参考**[指南 - 渲染函数 - 自定义指令](/guide/extras/render-function#custom-directives)

## withDirectives() {#withdirectives}

用于给 vnode 增加自定义指令。

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

  用自定义指令包装一个现有的 vnode。第二个参数是自定义指令数组。每个自定义指令也可以表示为 `[Directive, value, argument, modifiers]` 形式的数组。如果不需要，可以省略数组的尾元素。

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

- **参考**[指南 - 渲染函数 - 自定义指令](/guide/extras/render-function#custom-directives)

## withModifiers() {#withmodifiers}

用于向事件处理函数添加内置 [`v-on` 修饰符](/guide/essentials/event-handling#event-modifiers)。

- **类型**

  ```ts
  function withModifiers(fn: Function, modifiers: string[]): Function
  ```

- **示例**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // 等价于 v-on:click.stop.prevent
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **参考**[指南 - 渲染函数 - 事件修饰符](/guide/extras/render-function#event-modifiers)
