# 安全 {#security}

## 报告漏洞 {#reporting-vulnerabilities}

当一个漏洞被上报时，它会立刻成为我们最关心的问题，会有全职的贡献者暂时搁置其他所有任务来解决这个问题。如需报告漏洞，请发送电子邮件至 [security@vuejs.org](mailto:security@vuejs.org)。

虽然很少发现新的漏洞，但我们仍建议始终使用最新版本的 Vue 及其官方配套库，以确保你的应用尽可能地安全。

## 首要规则：不要使用无法信赖的模板 {#rule-no-1-never-use-non-trusted-templates}

使用 Vue 时最基本的安全规则就是**不要将无法信赖的内容作为你的组件模板**。使用无法信赖的模板相当于允许任意的 JavaScript 在你的应用中执行。更糟糕的是，如果在服务端渲染时执行了这些代码，可能会导致服务器被攻击。举例来说：

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // 永远不要这样做！
}).mount('#app')
```

Vue 模板会被编译成 JavaScript，而模板内的表达式将作为渲染过程的一部分被执行。尽管这些表达式在特定的渲染环境中执行，但由于全局执行环境的复杂性，Vue 作为一个开发框架，要在性能开销合理的前提下完全避免潜在的恶意代码执行是不现实的。避免这类问题最直接的方法是确保你的 Vue 模板始终是可信的，并且完全由你控制。

## Vue 自身的安全机制 {#what-vue-does-to-protect-you}

### HTML 内容 {#html-content}

无论是使用模板还是渲染函数，内容都是自动转义的。这意味着在这个模板中：

```vue-html
<h1>{{ userProvidedString }}</h1>
```

如果 `userProvidedString` 包含了：

```js
'<script>alert("hi")</script>'
```

那么它将被转义为如下的 HTML：

```vue-html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

从而防止脚本注入。这种转义是使用 `textContent` 这样的浏览器原生 API 完成的，所以只有当浏览器本身存在漏洞时，才会存在漏洞。

### Attribute 绑定 {#attribute-bindings}

同样地，动态 attribute 的绑定也会被自动转义。这意味着在这个模板中：

```vue-html
<h1 :title="userProvidedString">
  hello
</h1>
```

如果 `userProvidedString` 包含了：

```js
'" onclick="alert(\'hi\')'
```

那么它将被转义为如下的 HTML：

```vue-html
&quot; onclick=&quot;alert('hi')
```

从而防止在 `title` attribute 解析时，注入任意的 HTML。这种转义是使用 `setAttribute` 这样的浏览器原生 API 完成的，所以只有当浏览器本身存在漏洞时，才会存在漏洞。

## 潜在的危险 {#potential-dangers}

在任何 Web 应用中，允许以 HTML、CSS 或 JavaScript 形式执行未经无害化处理的、用户提供的内容都有潜在的安全隐患，因此这应尽可能避免。不过，有时候一些风险或许是可以接受的。

例如，像 CodePen 和 JSFiddle 这样的服务允许执行用户提供的内容，但这是在 iframe 这样一个可预期的沙盒环境中。当一个重要的功能本身会伴随某种程度的漏洞时，就需要你自行权衡该功能的重要性和该漏洞所带来的最坏情况。

### 注入 HTML {#html-injection}

我们现在已经知道 Vue 会自动转义 HTML 内容，防止你意外地将可执行的 HTML 注入到你的应用中。然而，**在你知道 HTML 安全的情况下**，你还是可以显式地渲染 HTML 内容。

- 使用模板：

  ```vue-html
  <div v-html="userProvidedHtml"></div>
  ```

- 使用渲染函数：

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- 以 JSX 形式使用渲染函数：

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::warning 警告
用户提供的 HTML 永远不能被认为是 100% 安全的，除非它在 iframe 这样的沙盒环境中，或者该 HTML 只会被该用户看到。此外，允许用户编写自己的 Vue 模板也会带来类似的危险。
:::

### URL 注入 {#url-injection}

在这样一个使用 URL 的场景中：

```vue-html
<a :href="userProvidedUrl">
  click me
</a>
```

如果这个 URL 允许通过 `javascript:` 执行 JavaScript，即没有进行无害化处理，那么就会有一些潜在的安全问题。可以使用一些库来解决此类问题，比如 [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url)，但请注意：如果你发现你需要在前端做 URL 无害化处理，那你的应用已经存在一个更严重的安全问题了。**任何用户提供的 URL 在被保存到数据库之前在应该先在后端做无害化处理**。这样，连接到你 API 的*每一个*客户端都可以避免这个问题，包括原生移动应用。另外，即使是经过无害化处理的 URL，Vue 也不能保证它们指向安全的目的地。

### 样式注入 {#style-injection}

我们来看这样一个例子：

```vue-html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  click me
</a>
```

我们假设 `sanitizedUrl` 已进行无害化处理，它是一个正常 URL 而非 JavaScript。然而，由于 `userProvidedStyles` 的存在，恶意用户仍然能利用 CSS 进行“点击劫持”，例如，可以在“登录”按钮上方覆盖一个透明的链接。如果用户控制的页面 `https://user-controlled-website.com/` 专门仿造了你应用的登录页，那么他们就有可能捕获用户的真实登录信息。

你可以想象，如果允许在 `<style>` 元素中插入用户提供的内容，会造成更大的漏洞，因为这使得用户能控制整个页面的样式。因此 Vue 阻止了在模板中像这样渲染 style 标签：

```vue-html
<style>{{ userProvidedStyles }}</style>
```

为了避免用户的点击被劫持，我们建议仅在沙盒环境的 iframe 中允许用户控制 CSS。或者，当用户控制样式绑定时，我们建议使用其[对象值形式](/guide/essentials/class-and-style#object-syntax-2)并仅允许用户提供能够安全控制的、特定的属性，就像这样：

```vue-html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### JavaScript 注入 {#javascript-injection}

我们强烈建议任何时候都不要在 Vue 中渲染 `<script>`，因为模板和渲染函数不应有其他副作用。但是，渲染 `<script>` 并不是插入在运行时执行的 JavaScript 字符串的唯一方法。

每个 HTML 元素都有能接受字符串形式 JavaScript 的 attribute，例如 `onclick`、`onfocus` 和 `onmouseenter`。绑定任何用户提供的 JavaScript 给这些事件 attribute 都具有潜在风险，因此需要避免这么做。

:::warning 警告
用户提供的 JavaScript 永远不能被认为是 100% 安全的，除非它在 iframe 这样的沙盒环境中，或者该段代码只会在该用户登录的页面上被执行。
:::

有时我们会收到漏洞报告，说在 Vue 模板中可以进行跨站脚本攻击 (XSS)。一般来说，我们不认为这种情况是真正的漏洞，因为没有切实可行的方法，能够在以下两种场景中保护开发者不受 XSS 的影响。

1. 开发者显式地将用户提供的、未经无害化处理的内容作为 Vue 模板渲染。这本身就是不安全的，Vue 也无从溯源。

2. 开发者将 Vue 挂载到可能包含服务端渲染或用户提供内容的 HTML 页面上，这与 \#1 的问题基本相同，但有时开发者可能会不知不觉地这样做。攻击者提供的 HTML 可能在普通 HTML 中是安全的，但在 Vue 模板中是不安全的，这就会导致漏洞。最佳实践是：**不要将 Vue 挂载到可能包含服务端渲染或用户提供内容的 DOM 节点上**。

## 最佳实践 {#best-practices}

最基本的规则就是只要你允许执行未经无害化处理的、用户提供的内容 (无论是 HTML、JavaScript 还是 CSS)，你就可能面临攻击。无论是使用 Vue、其他框架，或是不使用框架，道理都是一样的。

除了上面为处理[潜在危险](#potential-dangers)提供的建议，我们也建议你熟读下面这些资源：

- [HTML5 安全手册](https://html5sec.org/)
- [OWASP 的跨站脚本攻击 (XSS) 防护手册](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

接着你可以利用学到的知识，来审查依赖项的源代码，看看是否有潜在的危险，防止它们中的任何一个以第三方组件或其他方式影响 DOM 渲染的内容。

## 后端协调 {#backend-coordination}

类似跨站请求伪造 (CSRF/XSRF) 和跨站脚本引入 (XSSI) 这样的 HTTP 安全漏洞，主要由后端负责处理，因此它们不是 Vue 职责范围内的问题。但是，你应该与后端团队保持沟通，了解如何更好地与后端 API 进行交互，例如，在提交表单时附带 CSRF 令牌。

## 服务端渲染 (SSR) {#server-side-rendering-ssr}

在使用 SSR 时还有一些其他的安全注意事项，因此请确保遵循我们的 [SSR 文档](/guide/scaling-up/ssr)给出的最佳实践来避免产生漏洞。
