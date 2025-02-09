# 优先级C: 推荐的规则{#priority-c-rules-recommended}

在存在多个同样好的选项的情况下，可以做出任意选择以确保一致性。在这些规则中，我们描述了每个可接受的选项，并建议了一个默认选项。这意味着你可以在自己的代码库中自由地做出不同的选择，只要你保持一致并有充分的理由。请有一个好的理由！通过适应社区标准，您将：

1. 训练你的大脑更容易地解析你遇到的大多数社区代码
2. 能够复制和粘贴大多数社区代码示例而无需修改
3. 通常会发现新员工已经习惯了你喜欢的编码风格，至少在Vue方面是这样。

## 组件/实例选项顺序{#component-instance-options-order}

**组件/实例选项的顺序应保持一致。**

这是我们建议的组件选项的默认顺序。它们被分成不同的类别，所以你会知道在哪里从插件中添加新的属性。

1. **全局可见选项** (需要组件以外的知识)
   - `name`
   
2. **模版编译器选项** (会改变模版的编译方式)
   - `compilerOptions`
   
3. **模版依赖** (模版中使用的资源)
   - `components`
   - `directives`
   
4. **组合** (将属性合并到选项中)
   - `extends`
   - `mixins`
   - `provide`/`inject`
   
5. **接口** (组件的接口)
   - `inheritAttrs`
   - `props`
   - `emits`
   
6. **组合API** (使用组合API的入口点)
   - `setup`
   
7. **局部状态** (局部反应属性)
   - `data`
   - `computed`
   
8. **事件** (由反应性事件触发的回调)
   - `watch`
   - 事件生命周期 (按照调用顺序)
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
   
9. **非反应性属性**（独立于反应性系统的实例属性）
   - `methods`
   
10. **表现** (组件输出的声明性描述)
    - `template`/`render`

## 元素属性顺序{#element-attribute-order}

**元素（包括组件）的属性应该一致地排序。**

下面是我们建议的组件选项的默认顺序。它们被划分为不同的类别，因此您将知道在哪里添加自定义属性和指令。

1. **定义** (提供组件选项)
   - `is`
   
2. **列表渲染** (创建同一元素的多个变体)
   - `v-for`
   
3. **条件** (元素是否呈现/显示)
   - `v-if`
   - `v-else-if`
   - `v-else`
   - `v-show`
   - `v-cloak`
   
4. **渲染修改器** (更改元素渲染的方式)
   - `v-pre`
   - `v-once`
   
5. **全局可见** (需要组件之外的知识)
   - `id`
   
6. **唯一属性**（需要唯一值的属性）
   - `ref`
   - `key`
   
7. **双向绑定**（结合绑定和事件）
   - `v-model`
   
8. **其他属性**（所有未指定的绑定和未绑定属性）

9. **事件**（组件事件监听器）
   - `v-on`
   
10. **内容**（覆盖元素的内容）
    - `v-html`
    - `v-text`

## 组件/实例选项中的空行{#empty-lines-in-component-instance-options}

**您可能希望在多行属性之间添加一个空行，特别是如果不滚动选项就无法在屏幕上显示。**

当组件开始感到拥挤或难以阅读时，在多行属性之间添加空格可以使它们更容易再次浏览。在某些编辑器中，比如Vim，像这样的格式化选项也可以使它们更容易用键盘导航。

<div class="options-api">
<div class="style-example style-example-bad">
<h3>坏的示例</h3>


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

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```js
// No spaces are also fine, as long as the component
// is still easy to read and navigate.
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

</div>

<div class="composition-api">
<div class="style-example style-example-bad">
<h3>坏的示例</h3>


```js
defineProps({
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
})
const formattedValue = computed(() => {
  // ...
})
const inputClasses = computed(() => {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>好的示例</h3>


```js
defineProps({
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
})

const formattedValue = computed(() => {
  // ...
})

const inputClasses = computed(() => {
  // ...
})
```

</div>

</div>

## 单文件组件顶级元素顺序{#single-file-component-top-level-element-order}

**[单文件组件](https://github.com/vuejs-translations/docs-zh-cn/blob/main/guide/scaling-up/sfc)应始终对`<script>`、`<template>`和`<style>`标记进行一致的排序，并将`<style>放在`最后，因为其他两个标记中至少有一个始终是必需的。**

<div class="style-example style-example-bad">
<h3>坏的示例</h3>


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
<h3>好的示例</h3>


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
