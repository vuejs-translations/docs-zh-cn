# 服务端渲染 API

## renderToString()

- **导出自 `vue/server-renderer`**

- **类型**

  ```ts
  function renderToString(
    input: App | VNode,
    context?: SSRContext
  ): Promise<string>
  ```

- **示例**

  ```js
  import { createSSRApp } from 'vue'
  import { renderToString } from 'vue/server-renderer'

  const app = createSSRApp({
    data: () => ({ msg: 'hello' }),
    template: `<div>{{ msg }}</div>`
  })

  ;(async () => {
    const html = await renderToString(app)
    console.log(html)
  })()
  ```

  ### 处理 Teleport

  如果渲染的应用包含 Teleport，那么 teleport 内容将不会作为渲染字符的一部分。在大多数情况下，最佳方案是在挂载时有条件的渲染 Teleport。

  如果你需要激活 teleport 内容，他位于服务端渲染上下文对象的 `teleports` property中：

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'teleported content' }
  ```

- **相关内容：** [Guide - Server-Side Rendering](/guide/scaling-up/ssr.html)

## renderToNodeStream()

渲染输入作为 [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable)。

- **导出自 `vue/server-renderer`**

- **类型**

  ```ts
  function renderToNodeStream(
    input: App | VNode,
    context?: SSRContext
  ): Readable
  ```

- **示例**

  ```js
  // 内置 Node.js http 处理器
  renderToNodeStream(app).pipe(res)
  ```

  :::tip 备注
  ESM构建的 `vue/server-renderer` 不支持此方法,它与 Node.js 环境分离。使用 [`pipeToNodeWritable`](#pipetonodewritable) 代替。
  :::

## pipeToNodeWritable()

渲染和传输到现有的 [Node.js Writable stream](https://nodejs.org/api/stream.html#stream_writable_streams) 实例。

- **导出自 `vue/server-renderer`**

- **类型**

  ```ts
  function pipeToNodeWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: Writable
  ): void
  ```

- **示例**

  ```js
  // 内置 Node.js http 处理器
  pipeToNodeWritable(app, {}, res)
  ```

## renderToWebStream()

渲染输入作为 [Web ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)。

- **导出自 `vue/server-renderer`**

- **类型**

  ```ts
  function renderToWebStream(
    input: App | VNode,
    context?: SSRContext
  ): ReadableStream
  ```

- **示例**

  ```js
  // 内置一个支持ReadableStream的环境
  return new Response(renderToWebStream(app))
  ```

  :::tip 备注
  在这些环境中，不能在全局作用域暴露出 `ReadableStream` 的构造函数，使用 [`pipeToWebWritable()`](#pipetowebwritable) 代替。
  :::

## pipeToWebWritable()

渲染和传输到现有的 [Web WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) 实例。

- **导出自 `vue/server-renderer`**

- **类型**

  ```ts
  function pipeToWebWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: WritableStream
  ): void
  ```

- **示例**

  通常与 [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream) 结合使用：

  ```js
  // 诸如CloudFlare workers这样的环境中，TransformStream 是可用的。
  // 在 Node.js， TransformStream 需要从 'stream/web' 显示导入
  const { readable, writable } = new TransformStream()
  pipeToWebWritable(app, {}, writable)

  return new Response(readable)
  ```

## renderToSimpleStream()

在流模式中使用一个简单的可读接口进行渲染输入。

- **导出自 `vue/server-renderer`**

- **类型**

  ```ts
  function renderToSimpleStream(
    input: App | VNode,
    context: SSRContext,
    options: SimpleReadable
  ): SimpleReadable

  interface SimpleReadable {
    push(content: string | null): void
    destroy(err: any): void
  }
  ```

- **示例**

  ```js
  let res = ''

  renderToSimpleStream(
    app,
    {},
    {
      push(chunk) {
        if (chunk === null) {
          // done
          console(`render complete: ${res}`)
        } else {
          res += chunk
        }
      },
      destroy(err) {
        // error encountered
      }
    }
  )
  ```

## useSSRContext()

一种用于检索已传递给 `renderToString()` 或其他服务端渲染API上下文对象的运行时API。

- **类型**

  ```ts
  function useSSRContext<T = Record<string, any>>(): T | undefined
  ```

- **示例**

  被检索的上下文能够作为附加信息用于渲染最终的 HTML （例如头部元数据）

  ```vue
  <script setup>
  import { useSSRContext } from 'vue'

  // 确保只在服务端渲染时调用
  // https://vitejs.dev/guide/ssr.html#conditional-logic
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    // ...附加 property 给上下文
  }
  </script>
  ```
