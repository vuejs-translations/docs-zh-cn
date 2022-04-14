# 优先级 C 规则：推荐

当存在多个同样优秀的选项时，可以选择其中任意一项以确保一致性。在这些规则中我们对每个可供选择选项进行解释，建议你选择其一作为你的默认风格。这意味着只要保持风格一致且理由充分，在代码中你可以随意使用不同的风格。但请保证确实有这样使用的必要！遵守社区标准，你将得到：

1. 训练你的大脑使得其更容易吸收大多数社区代码
2. 能够不加修改地复制和粘贴大多数社区代码中的示例
3. 新员工很可能已经在 Vue 上习惯你所喜爱的编码风格

## 组件/实例选项排序

**组件/实例的选项排序应保持一致。**

这是我们为组件选项推荐的默认顺序。它们被划分为几大类，你能够由此知道来自插件的新 property 应该被放到哪里。

1. **全局感知**（要求在组件以外被感知）

   - `name`

2. **模板编译选项**（改变模板编译的方式）

   - `compilerOptions`

3. **模板依赖**（模板内使用的资源）

   - `components`
   - `directives`

4. **组合**（合并 property 至选项内）

   - `extends`
   - `mixins`
   - `provide`/`inject`

5. **接口**（组件的接口）

   - `inheritAttrs`
   - `props`
   - `emits`

6. **组合式 API**（使用组合式 API 的入口点）

   - `setup`

7. **本地状态**（本地的响应式 property）

   - `data`
   - `computed`

8. **事件**（通过响应式事件触发的回调）

   - `watch`
   - 生命周期事件（按照它们被调用的顺序）
     - `beforeCreate`
     - `created`
     - `beforeMount`
     - `mounted`
     - `beforeUpdate`
     - `updated`
     - `activated`
     - `deactivated`
     - `beforeUnmount`
     - `unmounted`
     - `errorCaptured`
     - `renderTracked`
     - `renderTriggered`

9. **非响应式 Properties**（不依赖响应性系统的实例 property）

   - `methods`

10. **渲染**（组件输出的声明式描述）
    - `template`/`render`

## 元素 attribute 排序

**元素（包括组件）的 attribute 排序应保持一致**

这是我们为组件选项推荐的默认顺序。它们被划分为几大类，你能够由此知道新添加的自定义 attribute 和指令应该被放到哪里。

1. **定义**（提供组件的选项）

   - `is`

2. **列表渲染**（创建相同元素的多个变体）

   - `v-for`

3. **条件**（元素是否渲染/显示）

   - `v-if`
   - `v-else-if`
   - `v-else`
   - `v-show`
   - `v-cloak`

4. **渲染修饰符**（改变元素的渲染方式）

   - `v-pre`
   - `v-once`

5. **全局感知**（要求在组件以外被感知）

   - `id`

6. **唯一 Attributes**（需要唯一值的 attribute）

   - `ref`
   - `key`

7. **双向绑定**（结合了绑定与事件）

   - `v-model`

8. **其他 Attributes**（所有普通的、绑定或未绑定的 attribute）

9. **事件**（组件事件监听器）

   - `v-on`

10. **内容**（覆写元素的内容）
    - `v-html`
    - `v-text`

## 组件/实例选项中的空行

**你可能想在多个 property 之间增加一个空行，特别是在这些选项多到一屏放不下，需要滚动才能看完时。**

当你开始觉得组件密集或难以阅读时，在多个 property 之间添加空行可以使其重新变得易于阅读。在一些诸如 Vim 的编辑器里，格式化后的选项还能通过键盘快速导航。

<div class="style-example style-example-good">
<h3>正面示例</h3>

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

```js
// 在组件仍然能够被轻松阅读与定位时，
// 没有空行又何妨
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```

</div>

## 单文件组件的顶级元素排序

**[单文件组件](/guide/scaling-up/sfc.html)应始终保持 `<script>`、`<template>` 和 `<style>` 标签的顺序一致。且 `<style>` 要放在最后，因为另外两个标签至少会有一个。**

<div class="style-example style-example-bad">
<h3>反面示例</h3>

```vue-html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>

<div class="style-example style-example-good">
<h3>正面示例</h3>

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>
