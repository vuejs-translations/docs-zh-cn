# 事件处理 {#event-handling}

## 监听事件 {#listening-to-events}

你可以使用 `v-on` 指令 (简写为 `@`) 来监听 DOM 事件和触发 JavaScript 代码运行。用法可以是 `v-on:click="methodName"` 或简写为 `@click="handler"`。

事件处理器的值应该是下面两种其中之一：

1. **内联事件处理器：**事件被触发时执行的内联 JavaScript 语句 (与原生的 `onclick` attribute 类似)。

2. **用方法作为事件处理器：**一个组件的属性名、或对某个方法的访问 (比如 `@click="some.method"`)。

## 内联事件处理器 {#inline-handlers}

内联的事件处理器常用于一些简单的场景，例如：

<div class="composition-api">

```js
const count = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    count: 0
  }
}
```

</div>

```vue-html
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

<div class="composition-api">

[在 Playground 中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgY291bnRlciA9IHJlZigwKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJjb3VudGVyKytcIj5BZGQgMTwvYnV0dG9uPlxuXHQ8cD5UaGUgYnV0dG9uIGFib3ZlIGhhcyBiZWVuIGNsaWNrZWQge3sgY291bnRlciB9fSB0aW1lcy48L3A+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[在 Playground 中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcblx0ICByZXR1cm4ge1xuICAgIFx0Y291bnRlcjogMFxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJjb3VudGVyKytcIj5BZGQgMTwvYnV0dG9uPlxuXHQ8cD5UaGUgYnV0dG9uIGFib3ZlIGhhcyBiZWVuIGNsaWNrZWQge3sgY291bnRlciB9fSB0aW1lcy48L3A+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

## 用方法作事件处理器 {#method-handlers}

随着事件处理器的逻辑变得越来越复杂，将其仅以内联代码方式书写在模板上渐渐变得不合适了。因此 `v-on` 也可以接受一个方法名或对某个方法的访问。

举个例子：

<div class="composition-api">

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` 是 DOM 原生事件
  if (event) {
    alert(event.target.tagName)
  }
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // 方法中的 `this` 指向的是当前活跃的组件实例
    alert(`Hello ${this.name}!`)
    // `event` 是 DOM 原生事件
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

</div>

```vue-html
<!-- `greet` 是上面定义过的方法名 -->
<button @click="greet">Greet</button>
```

<div class="composition-api">

[在 Playground 中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgbmFtZSA9IHJlZignVnVlLmpzJylcblxuZnVuY3Rpb24gZ3JlZXQoZXZlbnQpIHtcbiAgYWxlcnQoYEhlbGxvICR7bmFtZS52YWx1ZX0hYClcbiAgLy8gYGV2ZW50YCBpcyB0aGUgbmF0aXZlIERPTSBldmVudFxuICBpZiAoZXZlbnQpIHtcbiAgICBhbGVydChldmVudC50YXJnZXQudGFnTmFtZSlcbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJncmVldFwiPkdyZWV0PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[在 Playground 中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1Z1ZS5qcydcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBncmVldChldmVudCkge1xuICAgICAgLy8gYHRoaXNgIGluc2lkZSBtZXRob2RzIHBvaW50cyB0byB0aGUgY3VycmVudCBhY3RpdmUgaW5zdGFuY2VcbiAgICAgIGFsZXJ0KGBIZWxsbyAke3RoaXMubmFtZX0hYClcbiAgICAgIC8vIGBldmVudGAgaXMgdGhlIG5hdGl2ZSBET00gZXZlbnRcbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICBhbGVydChldmVudC50YXJnZXQudGFnTmFtZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxidXR0b24gQGNsaWNrPVwiZ3JlZXRcIj5HcmVldDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

以方法作事件处理器，会自动地接受原生 DOM 事件并触发执行，在上面的例子中，我们能够通过被触发事件的 `event.target.tagName` 访问到该 DOM 元素。

<div class="composition-api">

你也可以看看[为组件事件处理器标注类型](/guide/typescript/composition-api.html#typing-event-handlers)这一章了解更多。<sup class="vt-badge ts">TS</sup>

</div>
<div class="options-api">

你也可以看看[为组件事件处理器标注类型](/guide/typescript/options-api.html#typing-event-handlers)这一章了解更多。<sup class="vt-badge ts">TS</sup>

</div>

### 方法还是内联函数的区别 {#method-vs-inline-detection}

模板编译器会通过传给 `v-on` 的值字符串是否是一个合法的 JavaScript 标识符或属性访问来断定是何种形式的事件处理器。举个例子，`foo`、`foo.bar` 和 `foo['bar']` 都会被视为方法、而 `foo()` 和 `count++` 都会被视为内联事件处理器。

## 在内联处理器中调用方法 {#methods-in-inline-handlers}

除了直接绑定一个方法名，我们还可以在内联事件处理器中调用方法。这使我们可以在原生事件外在向方法中传入更多自定义参数：

<div class="composition-api">

```js
function say(message) {
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  say(message) {
    alert(message)
  }
}
```

</div>

```vue-html
<button @click="say('hello')">Say hello</button>
<button @click="say('bye')">Say bye</button>
```

<div class="composition-api">

[在 Playground 中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmZ1bmN0aW9uIHNheShtZXNzYWdlKSB7XG4gIGFsZXJ0KG1lc3NhZ2UpXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8YnV0dG9uIEBjbGljaz1cInNheSgnaGknKVwiPlNheSBoaTwvYnV0dG9uPlxuICA8YnV0dG9uIEBjbGljaz1cInNheSgnd2hhdCcpXCI+U2F5IHdoYXQ8L2J1dHRvbj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>
<div class="options-api">

[在 Playground 中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbWV0aG9kczoge1xuXHQgIHNheShtZXNzYWdlKSB7XG4gICAgXHRhbGVydChtZXNzYWdlKVxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJzYXkoJ2hpJylcIj5TYXkgaGk8L2J1dHRvbj5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJzYXkoJ3doYXQnKVwiPlNheSB3aGF0PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

## 在内联事件处理器中访问事件参数 {#accessing-event-argument-in-inline-handlers}

有时我们会需要在内联的事件处理器中访问原生 DOM 事件。你可以给该处理器方法传入一个特殊的 `$event` 变量，或者使用一个内联箭头函数：

```vue-html
<!-- 使用特殊的 $event 变量 -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- 使用箭头函数 -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

<div class="composition-api">

```js
function warn(message, event) {
  // `此处访问到了 DOM 原生事件`
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  warn(message, event) {
    // `此处访问到了 DOM 原生事件`
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

</div>

## 事件修饰符 {#event-modifiers}

在处理事件时调用 `event.preventDefault()` 或 `event.stopPropagation()` 是非常常见的。尽管我们确实可以直接在方法内调用，但如果方法能更专注于数据逻辑而不用去处理 DOM 事件的细节会更好。

为解决这一问题，Vue 为 `v-on` 提供了**事件修饰符**。回想一下，修饰符是用点表示的指令后缀。

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue-html
<!-- 单击事件的传播将停止 -->
<a @click.stop="doThis"></a>

<!-- 提交事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰语可以以链式书写 -->
<a @click.stop.prevent="doThat"></a>

<!-- 也可以只有修饰符而没有事件处理方法 -->
<form @submit.prevent></form>

<!-- 只有当 event.target 是此元素时才会触发事件处理 -->
<!-- 例如：事件不是来自于一个子元素 -->
<div @click.self="doThat">...</div>
```

::: tip
使用修饰符时需要注意调用的顺序，因为据此生成的相关代码也会是同样的顺序。因此使用 `@click.prevent.self` 会阻止元素内的**所有点击**而 `@click.self.prevent` 则只会阻止对元素本身的点击。
:::

The `.capture`, `.once`, and `.passive` modifiers mirror the [options of the native `addEventListener` method](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters):

```vue-html
<!-- 添加事件监听器时，使用 capture（捕获）模式 -->
<!-- 例如：一个指向内部元素的事件，在被内部元素处理前，先被外部处理 -->
<div @click.capture="doThis">...</div>

<!-- 这个点击事件最多被触发一次 -->
<a @click.once="doThis"></a>

<!-- 滚动事件的默认行为（滚动）将立即发生 -->
<!-- 而不是等待 `onScroll` 完成  -->
<!-- 以防其中包含 `event.preventDefault()` -->
<div @scroll.passive="onScroll">...</div>
```

`.passive` 修饰符一般用于触摸事件的监听器，可以用来[提升移动端设备上的性能表现](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners)。

::: tip
请勿同时使用 `.passive` 和 `.prevent`，因为 `.prevent` 会被忽略并且你的浏览器可能会抛出警告。请记住，`.passive` 是向浏览器表明你_不想_阻止事件的默认行为。并且如果你这样做，可能在浏览器中收到一个警告。
:::

## 按键修饰符 {#key-modifiers}

在监听键盘事件时，我们经常需要检查特定的按键。Vue 允许在 `v-on` 或 `@` 监听按键事件时添加按键修饰符。

```vue-html
<!-- 仅在 `key` 为 `Enter` 时调用 `vm.submit()` -->
<input @keyup.enter="submit" />
```

你可以直接使用 [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) 暴露的按键名称作为修饰符，但需要转为 kebab-case 形式。

```vue-html
<input @keyup.page-down="onPageDown" />
```

在上面的例子中，仅会在 `$event.key` 为 `PageDown` 时调用事件处理。

### 按键别名 {#key-aliases}

Vue 为一些常用的按键提供了别名：

- `.enter`
- `.tab`
- `.delete` (捕获“Delete”和“Backspace”两个按键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### 系统按键修饰符 {#system-modifier-keys}

你可以使用以下修饰符来触发鼠标或键盘事件监听器，只有当相应的修饰符按键被按下时才会触发。

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip 注意
在 Macintosh 电脑上，meta 按键是 Command 键 (⌘)。在 Windows 键盘上，meta 键是 Windows 键 (⊞)。在 Sun 微机系统键盘上，meta 是钻石键 (◆)。在某些键盘上，特别是 MIT 和 Lisp 机器的键盘及其后代版本的键盘，如 Knight 键盘，space-cadet 键盘，meta 都被标记为“meta”。在 Symbolics 键盘上，meta 也被标识为“META”为“Meta”。
:::

举个例子：

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
请注意，修饰符按键和一般的按键不同，当被用于 `keyup` 事件时，当事件发出时该按键需处于按下状态。换句话说，`keyup.ctrl` 只会在你仍然按住 `ctrl` 但松开了另一个键时被触发。若你只松开 `ctrl` 键将不会触发。
:::

### `.exact` 修饰符 {#exact-modifier}

`.exact` 修饰符允许控制触发一个事件所需的系统修饰符的确切组合。

```vue-html
<!-- 即使按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发此操作 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 这只会在没有按下任何系统修饰符时触发 -->
<button @click.exact="onClick">A</button>
```

## 鼠标按键修饰符 {#mouse-button-modifiers}

- `.left`
- `.right`
- `.middle`

这些修饰符将处理程序限制为由特定鼠标按钮触发的事件。
