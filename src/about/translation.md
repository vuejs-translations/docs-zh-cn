---
aside: deep
---

# 翻译说明

该中文文档翻译由 [@ShenQingchuan](https://github.com/ShenQingchuan) 个人发起，随后作为 Vue 官方认可的中文翻译仓库，以团队的形式进行官方维护。最新的代码仓库链接是：https://github.com/vuejs-translations/docs-zh-cn

## 翻译须知

请移步至官方仓库的 [wiki 页面](https://github.com/vuejs-translations/docs-zh-cn/wiki/%E7%BF%BB%E8%AF%91%E9%A1%BB%E7%9F%A5)查阅。

## 协作指南

请移步至官方仓库的 [wiki 页面](https://github.com/vuejs-translations/docs-zh-cn/wiki/%E5%8D%8F%E4%BD%9C%E6%8C%87%E5%8D%97)查阅。

> 编写文档是一种换位思考的练习。我们并不是在描述客观现实，那是源代码已经做到了的。我们的工作是帮助塑造用户与 Vue 生态系统之间的关系。

<details>
<summary>原版翻译说明，仅供备忘和归档</summary>

## 基本原则

翻译工作追求的无外乎 “信、达、雅” 三个字，因此我们总结了以下原则：

1. **忠实原文，通俗易懂**，保证正确是最基本的要求。此外，还应该尽可能将一些特定概念降维，使得入门级读者也能够流畅阅读。

2. **中文词汇优先，特殊概念次之**：要尽可能地将文档中的英语单词译作读者好理解的词汇。

   同时用词应尽可能地从前端开发领域已有的词汇中衍生。我们认为作为 Vue 文档的译者应承担这样一种职责：避免创建一套独立于标准 JavaScript 环境之外、Vue 专属的语境。

   但也有例外的情况，某些英文单词我们倾向于选择不翻译、用原词。开发者常常与一部分英语单词打交道，许多英语单词甚至作为了开发框架或操作系统的专有名词，直接抛出这个单词也的确能够帮助用户更好的理解、锁定所讲的是什么概念。

3. **更符合中文的表述方式**：我们必须正视英语和中文本身的差异与不同，由于表达方式和语法结构的区别，常常一个结构复杂的多重定语从句很难逐字逐词地直译成中文，翻译出的句子应符合母语者的叙述习惯，即尽可能避免英语式的倒装（哪怕讲述方式与作者原文有较大区别），表述尽可能口语化。最好的方式应该是将视线从单个句子中移出来，结合上下文先进行理解再用中文的习惯性表达将其重新复述出来。

## 格式规范

### 提交规范

可以参考 [这个网站](https://www.conventionalcommits.org/) 了解提交信息的既定书写格式：

```text
<type>(<scope>): <subject>
^-------------^  ^-------^
|                |
|                +-> 主题。总结 commit 内容，用现在时书写。
|
+-------> 目的: chore, docs, feat, fix, refactor, style, 或 test。<scope> 为可选项。

// 以下是 body 部分，这部分是可选的：
  hash: (对应到官方英文文档的某次更新 commit hash)
  time: (由 `new Date().toLocaleString()` 生成的时间戳)
```

- 如果你贡献提交的目的并不是与官方英文文档同步内容相关，为 `chore` 或其他类型，body 部分可以省略。
- body 部分的信息只是为了在特定情况下方便溯源。

#### 释义

- feat: (新功能，面向用户)
- fix: (bug 修复，面向用户)
- docs: (编辑文档)
- style: (格式，如全角半角；对生产环境没有影响)
- refactor: (比如重命名变量)
- test: (加入缺少的测试，对生产环境没有影响)
- chore: (更新依赖等，对生产环境没有影响)

### 文档格式规范

#### 译注写法

1. 在原文需要加译者注的位置添加角标：

```html
... <sup>[[1]](#footnote-1)</sup> ... <sup>[[2]](#footnote-2)</sup> ...
```

2. 在文章最末尾加入译者注的内容，格式如下：

```html
<small>
  __译者注__
  <a id="footnote-1"></a>[1] ... <a id="footnote-2"></a>[2] ...
  <a id="footnote-3"></a>[3] ...
</small>
```

#### 标点符号

- 逗号、句号、分号、冒号、叹号、问号，统一使用全角字符：，。；：！？
- 破折号使用：——
- 引号统一使用 “ ” 和 ‘ ’
- 括号统一使用全角括号 （）
- 非注释部分的代码除外，保留英文标点符号。

#### 内联代码或代码关键字

- 务必用反引号（即英文输入法下，按键盘上 Tab 键上方的那个键）将内容括起来。
- 包括代码注释中出现代码或代码关键字时，也要括起来。

#### 空格的使用

- 英文单词和英文单词之间要有一个空格
  `something in English`

- 中文和英文单词之间要有一个空格
  `中文当中有 something 是英文`

- 英文单词和标点符号之间没有空格
  `这里是一句中文，something 又是英文`

#### 链接、斜体、粗体与行内代码等

对于 Markdown 中上述的行内简单样式，为了保证 Vitepress 中良好的渲染效果，我们提倡在文档中使用如下的格式：

```markdown
<!-- 链接 -->

这是一个 [链接](https://github.com/vitejs/vite) 指向 Vite 官方仓库

<!-- 加粗 -->

这是一个 **加粗** 的文字

<!-- 斜体 -->

这是一个 _斜体_ 的文字 <!-- Good -->
这是一个 _斜体_ 的文字 <!-- 不推荐，尽在下划线效果不可用时作为替代使用 -->

<!-- 行内代码 -->

这是一个 `code` 行内代码
假如后面就是标点符号 `code`：
```

你可能已经注意到，默认情况下，在两端我们都加上了空格。

**此处的某些规则可能暂时和旧有的 [Vue.js 中文文档的风格](https://github.com/vuejs/cn.vuejs.org/wiki) 不太一致**，如果你曾参与过 Vue 中文文档相关工作，可能与你的习惯有一定区别。

这是为了保证文档视图中不会出现字符靠太近而黏合的问题。

关于文档中的链接，针对以下两种 Markdown 书写：

```markdown
<!-- 链接前后带空格  -->

Vite 支持了一套 [通用插件 API](./api-plugin) 扩展了 Rollup 的插件接口

<!-- 链接前后不带空格 -->

Vite 支持了一套[通用插件 API](./api-plugin)扩展了 Rollup 的插件接口
```

Vitepress 和 Vuepress 中对以上两种写法的渲染视觉效果为：

**链接前后带空格**

![链接前后带空格](/images/link-with-around-spaces.png)

**链接前后不带空格**

![链接前后不带空格](/images/link-without-around-spaces.png)

不带空格的形式 与 带空格相比，没有那么突出。

同样这类情况还包括 Markdown 中的斜体字：

```markdown
这是一个_斜体_尝试 <!-- Vitepress 和 Vuepress 中无效！  -->

这是一个*斜体*尝试 <!-- 前后无空格 -->

这是一个 *斜体* 尝试 <!-- 前后有空格 -->
```

下面是效果，不带空格的情况看上去中文字体的笔画之间会接在一起，变得很拥挤，观感较差。

![斜体尝试](/images/italic-demo.png)

#### 关于加粗和斜体格式的约定

根据 [GitHub Flavored Markdown Spec](https://github.github.com/gfm/#emphasis-and-strong-emphasis)，用成对的星号或下划线都可以用来代表加粗或斜体，但是使用下划线的时候存在更多的特殊条件限制，例如：

> `5*6*78` → `<p>5<em>6</em>78</p>` https://github.github.com/gfm/#example-346
>
> `5_6_78` → `<p>5_6_78</p>` https://github.github.com/gfm/#example-351

经过讨论，考虑到 GFM 的规范以及中文的特殊情况，决定：

- 中文翻译统一使用星号来标注加粗和斜体，而不是使用下划线，同时尊重英文版自身的用法。
- 仍然不能正确渲染的地方，允许适当调整包含或不包含加粗或斜体部分两侧的标点符号。参见 [这个例子](https://github.com/vuejs/composition-api-rfc/pull/30/files)。
- 仍然不能正确渲染的地方，手动使用 `<strong>` 或 `<em>` 标记。

## 术语翻译参考

| 英文 | 建议翻译 | 备注 |
| --- | --- | --- |
| property | 属性 | 组件的属性（数据、计算属性等） |
| attribute | _不翻译_ | 特指 HTML 元素上的属性 |
| getter | _一般不翻译_ | 计算属性中作计算函数 |
| setter | _一般不翻译_ | 计算属性中作设置函数 |
| prop | _不翻译_ | |
| ref | _不翻译_ | |
| feature/functionality | 功能 | |
| directive | 指令 | |
| mixin | 混入 | |
| listen/listener | 监听/监听器 | |
| observe/observer | 侦听/侦听器 | |
| watch/watcher | 侦听/侦听器 | |
| normalize (HTML code, ...) | 规范化 | |
| standardize | 标准化 | |
| fire/trigger (事件) | 触发 | |
| emit (某个值或事件) | 抛出 | |
| queue (v.) | 把……加入队列 | |
| workaround (n.) | 变通办法 | |
| workaround (v.) | 绕过 | |
| convention | 约定 | |
| parse | 解析 | |
| stringify | 字符串化 | |
| side effect | 副作用 | |
| declarative | 声明式 | |
| imperative | 命令式 | |
| handler | 处理函数 | |
| you | 你 (而不用 “您”) | |
| computed | 计算属性 | |
| computed property | 计算属性 | |
| guard | 守卫 | |
| hook | 钩子 | |
| selector | 选择器 | |
| truthy | 真值 | 需加 MDN 的解释作为译注 |
| falsy | 假值 | 需加 MDN 的解释作为译注 |
| mutate/mutation | 变更 | |
| immutable | 不可变 | |
| mutable | 可变 | |

- MDN - `truthy` → https://developer.mozilla.org/en-US/docs/Glossary/Truthy
- MDN - `falsy` → https://developer.mozilla.org/en-US/docs/Glossary/Falsy

## 工作流

### 更新内容同步策略

此中文文档由 [印记中文](https://docschina.org/) 团队进行翻译，它们也是 Vite 官方中文文档背后的翻译维护团队。

[QC-L](https://github.com/QC-L) 曾在 Vue 文档的讨论区提出过这套 [中英文档同步工作流](https://github.com/vuejs/docs-next-zh-cn/discussions/522#discussioncomment-779521)，这也是 Vite 官方中文文档正在使用的一套工作流。

- 保留英文文档的原始 commit 记录，以保证可以对后续的更新进行再翻译、合并
- 由于 Vue 文档以 Markdown 书写，每一行成一个自然段。因此在 Markdown 文档中原则上应该保证中英文行号一一对应，以保证后续更新时位置不发生错乱
- 由机器人每日定时从英文文档仓库同步新的提交，并生成 Pull Request 交由翻译团队 Review、翻译并最终合入中文文档

### 锚点链接的统一化

:::tip 插件支持
我们提供了一个包含此项功能的 [Vue 官方文档翻译助手插件](https://marketplace.visualstudio.com/items?itemName=shenqingchuan.vue-docs-tr-helper)，你可以在 VSCode 中安装，并遵照 README 的指引来使用。
:::

在 Markdown 文档中 `[title](link)` 形式的链接非常常用，而 Vue 文档中大量使用了这一语法，用来作章节的跳转。

链接中有时还会带有锚点（以 `#` 作前缀）用来定位到页面的对应位置，例如 `[props 大小写格式](/guide/components/props.html#prop-name-casing)`。

但是在 VitePress 中，由于锚点是对应 Markdown 内容中的 “标题行” 的，因此若改动了英文内容的标题行，别处引用此处的锚点就是失效了：

```markdown
<!-- 英文文档中该标题行为 -->

## Props name casing

<!-- 中文文档将标题翻译为 -->

## Props 大小写格式

<!-- 此时这个链接在页面上无法正常跳转 -->

[props 大小写格式](/guide/components/props.html#prop-name-casing)
```

若将链接中的锚点也改为中文内容的确可以暂时解决问题，但若后续该标题有改动，又需要修改所有引用了该锚点的地方，可维护性较差。

因此我们提供了一种特殊的锚点标记：

```markdown
<!-- 标记的内容就是原来的锚点 -->

## Props 大小写格式 {#props-name-casing}
```

我们会为 VitePress 提供处理这个标记的逻辑，保证它不会在页面上显示出来。

但也有需要注意的例外情况：若按上面的方式为一篇文章的所有标题行都生成了标记，但文章中出现了两个相同的标记，比如 “类和 CSS 样式” 章节中的 “绑定对象” 小节，可以为其加上数字标记，保证其在文章中的唯一性。

此外，由于文章的总标题也被加上了锚点标记，导致在开发环境下，浏览器的标签页上会看到标记。但在构建发布时，我们运行了一个脚本，为文档的 frontmatter 中添加了不含标记的 `title`，因此读者将不会看到该标记。

</details>

<!-- zhlint disabled -->
