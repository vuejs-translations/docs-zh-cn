# 单文件组件 CSS 功能 {#sfc-css-features}

## 组件作用域 CSS {#scoped-css}

当 `<style>` 标签带有 `scoped` attribute 的时候，它的 CSS 只会影响当前组件的元素，和 Shadow DOM 中的样式封装类似。使用时有一些注意事项，不过好处是不需要任何的 polyfill。它的实现方式是通过 PostCSS 将以下内容：

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

转换为：

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

### 子组件的根元素 {#child-component-root-elements}

使用 `scoped` 后，父组件的样式将不会渗透到子组件中。不过，子组件的根节点会同时被父组件的作用域样式和子组件的作用域样式影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式。

### 深度选择器 {#deep-selectors}

处于 `scoped` 样式中的选择器如果想要做更“深度”的选择，也即：影响到子组件，可以使用 `:deep()` 这个伪类：

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

上面的代码会被编译成：

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
通过 `v-html` 创建的 DOM 内容不会被作用域样式影响，但你仍然可以使用深度选择器来设置其样式。
:::

### 插槽选择器 {#slotted-selectors}

默认情况下，作用域样式不会影响到 `<slot/>` 渲染出来的内容，因为它们被认为是父组件所持有并传递进来的。使用 `:slotted` 伪类以明确地将插槽内容作为选择器的目标：

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### 全局选择器 {#global-selectors}

如果想让其中一个样式规则应用到全局，比起另外创建一个 `<style>`，可以使用 `:global` 伪类来实现 (看下面的代码)：

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### 混合使用局部与全局样式 {#mixing-local-and-global-styles}

你也可以在同一个组件中同时包含作用域样式和非作用域样式：

```vue
<style>
/* 全局样式 */
</style>

<style scoped>
/* 局部样式 */
</style>
```

### 作用域样式须知 {#scoped-style-tips}

- **作用域样式并没有消除对 class 的需求**。由于浏览器渲染各种各样 CSS 选择器的方式，`p { color: red }` 结合作用域样式使用时 (即当与 attribute 选择器组合的时候) 会慢很多倍。如果你使用 class 或者 id 来替代，例如 `.example { color: red }`，那你几乎就可以避免性能的损失。

- **小心递归组件中的后代选择器**！对于一个使用了 `.a .b` 选择器的样式规则来说，如果匹配到 `.a` 的元素包含了一个递归的子组件，那么所有的在那个子组件中的 `.b` 都会匹配到这条样式规则。

## CSS Modules {#css-modules}

一个 `<style module>` 标签会被编译为 [CSS Modules](https://github.com/css-modules/css-modules) 并且将生成的 CSS class 作为 `$style` 对象暴露给组件：

```vue
<template>
  <p :class="$style.red">This should be red</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

得出的 class 将被哈希化以避免冲突，实现了同样的将 CSS 仅作用于当前组件的效果。

参考 [CSS Modules spec](https://github.com/css-modules/css-modules) 以查看更多详情，例如 [global exceptions](https://github.com/css-modules/css-modules#exceptions) 和 [composition](https://github.com/css-modules/css-modules#composition)。

### 自定义注入名称 {#custom-inject-name}

你可以通过给 `module` attribute 一个值来自定义注入 class 对象的属性名：

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### 与组合式 API 一同使用 {#usage-with-composition-api}

可以通过 `useCssModule` API 在 `setup()` 和 `<script setup>` 中访问注入的 class。对于使用了自定义注入名称的 `<style module>` 块，`useCssModule` 接收一个匹配的 `module` attribute 值作为第一个参数：

```js
import { useCssModule } from 'vue'

// 在 setup() 作用域中...
// 默认情况下, 返回 <style module> 的 class
useCssModule()

// 具名情况下, 返回 <style module="classes"> 的 class
useCssModule('classes')
```

## CSS 中的 `v-bind()` {#v-bind-in-css}

单文件组件的 `<style>` 标签支持使用 `v-bind` CSS 函数将 CSS 的值链接到动态的组件状态：

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

这个语法同样也适用于 [`<script setup>`](./sfc-script-setup)，且支持 JavaScript 表达式 (需要用引号包裹起来)：

```vue
<script setup>
const theme = {
  color: 'red'
}
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

实际的值会被编译成哈希化的 CSS 自定义属性，因此 CSS 本身仍然是静态的。自定义属性会通过内联样式的方式应用到组件的根元素上，并且在源值变更的时候响应式地更新。
