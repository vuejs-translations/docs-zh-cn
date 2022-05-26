# Props {#props}

> 阅读此章节时，我们假设你已经读过[组件基础](/guide/essentials/component-basics)，若你对组件还完全不了解，请先阅读它。

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-3-reusable-components-with-props" title="Props - 免费 Vue.js 课程"/>
</div>

## Prop 声明 {#props-declaration}

组件需要显式声明 prop，这样 Vue 才能知道外部传入的哪些是 prop，哪些是透传 attribute (我们会在[专门的章节](/guide/components/attrs)中讨论到它)。

<div class="composition-api">

在单文件组件中使用 `<script setup>` 时，prop 可以使用 `defineProps()` 宏来定义：

```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```

在没有使用 `<script setup>` 的组件中，prop 可以使用 [`props`](/api/options-state.html#props) 选项来定义：

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() 将 props 作为第一个参数
    console.log(props.foo)
  }
}
```

请注意，传递给 `defineProps()` 的参数和提供给 `props` 选项的值是相同的，两种声明方式背后其实使用的都是 prop 选项。

</div>

<div class="options-api">

prop 使用 [`props`](/api/options-state.html#props) 选项来定义：

```js
export default {
  props: ['foo'],
  created() {
    // props 会暴露到 `this` 上
    console.log(this.foo)
  }
}
```

</div>

除了使用字符串数组来声明 prop 外，还可以使用对象的形式：

<div class="options-api">

```js
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>
<div class="composition-api">

```js
// 使用 <script setup>
defineProps({
  title: String,
  likes: Number
})
```

```js
// 非 <script setup>
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>

对于以对象形式声明中的每个属性，key 是 prop 的名称，而值应该是预期类型的构造函数。

这不仅为你的组件提供了文档，而且如果其他开发者在使用你的组件时传递了错误的类型，也会在浏览器控制台中抛出警告。我们将在本章节稍后进一步讨论有关 [prop 校验](#prop-validation)的更多细节。

<div class="options-api">

其他相关：[为组件 Props 标注类型](/guide/typescript/options-api.html#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

如果你正在搭配 TypeScript 使用 `<script setup>`，也可以使用类型标注来声明 prop：

```vue
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

查看这一章获取更多[组件 props 类型标注](/guide/typescript/composition-api.html#typing-component-props)的相关细节。<sup class="vt-badge ts" />

</div>

## 传递 prop 的细节 {#prop-passing-details}

### Prop 名字格式 {#prop-name-casing}

如果 prop 的名字很长，应使用 camelCase 形式，因为它们是合法的 JavaScript 标识符，可以直接在模板的表达式中使用，避免在作为属性 key 名时必须带引号。

<div class="composition-api">

```js
defineProps({
  greetingMessage: String
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    greetingMessage: String
  }
}
```

</div>

```vue-html
<span>{{ greetingMessage }}</span>
```

从技术上来讲，你也可以在子组件传递 prop 时使用 camelCase 形式。(使用 [DOM 模板](/guide/essentials/component-basics.html#dom-template-parsing-caveats)时例外) 而实际上为了和 HTML attribute 对齐，都会将其转为 kebab-case 形式：

```vue-html
<MyComponent greeting-message="hello" />
```

一般情况下都会使用 [PascalCase 作为组件标签名](/guide/components/registration.html#component-name-casing)，因为这提高了模板的可读性，能很好地区分出 Vue 组件和原生 HTML 元素。然而这对于传递 prop 来说收效并不高，因此我们选择对其进行转换。

### 静态 vs. 动态 Prop {#static-vs-dynamic-props}

至此，你已经见过了很多像这样的静态值形式的 prop：

```vue-html
<BlogPost title="My journey with Vue" />
```

相应地还有使用 `v-bind` 或缩写 `:` 所动态绑定的 prop 值：

```vue-html
<!-- 根据一个变量的值动态传入 -->
<BlogPost :title="post.title" />

<!-- 根据一个更复杂表达式的值动态传入 -->
<BlogPost :title="post.title + ' by ' + post.author.name" />
```

### 传递不同的值类型 {#passing-different-value-types}

在上述的两个例子中，我们只传入了字符串值，但实际上**任何**类型的值都可以作为一个 prop。

#### Number {#number}

```vue-html
<!-- 虽然 `42` 是静态的值，我们还是需要使用 v-bind -->
<!-- 因为这是一个 JavaScript 表达式而不是一个字符串 -->
<BlogPost :likes="42" />

<!-- 根据一个变量的值动态传入 -->
<BlogPost :likes="post.likes" />
```

#### Boolean {#boolean}

```vue-html
<!-- 仅写上 prop 但不传值，会隐式表达为 `true` -->
<BlogPost is-published />

<!-- 虽然 `false` 是静态的值，我们还是需要使用 v-bind -->
<!-- 因为这是一个 JavaScript 表达式而不是一个字符串 -->
<BlogPost :is-published="false" />

<!-- 根据一个变量的值动态传入 -->
<BlogPost :is-published="post.isPublished" />
```

#### Array {#array}

```vue-html
<!-- 虽然这个数组是静态不变的值，我们还是需要使用 v-bind -->
<!-- 因为这是一个 JavaScript 表达式而不是一个字符串 -->
<BlogPost :comment-ids="[234, 266, 273]" />

<!-- 根据一个变量的值动态传入 -->
<BlogPost :comment-ids="post.commentIds" />
```

#### Object {#object}

```vue-html
<!-- 虽然这个对象字面量是静态不变的值，我们还是需要使用 v-bind -->
<!-- 因为这是一个 JavaScript 表达式而不是一个字符串 -->
<BlogPost
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
 />

<!-- 根据一个变量的值动态传入 -->
<BlogPost :author="post.author" />
```

### 使用一个对象绑定多个 prop {#binding-multiple-properties-using-an-object}

如果你想要将一个对象的所有属性都当作 prop 传入，你可以使用[没有参数的 `v-bind`](/guide/essentials/template-syntax.html#dynamically-binding-multiple-attributes)，即只是 `v-bind` 而非 `:prop-name`。例如，这里有一个 `post` 对象：

<div class="options-api">

```js
export default {
  data() {
    return {
      post: {
        id: 1,
        title: 'My Journey with Vue'
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const post = {
  id: 1,
  title: 'My Journey with Vue'
}
```

</div>

以及下面的模板：

```vue-html
<BlogPost v-bind="post" />
```

而这实际上等价于：

```vue-html
<BlogPost :id="post.id" :title="post.title" />
```

## 单向数据流 {#one-way-data-flow}

所有的 prop 都遵循着**单向绑定**原则，prop 因父组件的更新而变化，自然地将新的状态向下流往子组件，而不会逆向传递。这避免了子组件意外修改了父组件的状态，不然应用的数据流就会变得难以理解了。

另外，每次父组件更新后，所有的子组件中的 props 都会被更新到最新值，这意味着你**不应该**在子组件中去更改一个 prop。若你这么做了，Vue 会在控制台上向你抛出警告：

<div class="composition-api">

```js
const props = defineProps(['foo'])

// ❌ 警告！prop 是只读的！
props.foo = 'bar'
```

</div>
<div class="options-api">

```js
export default {
  props: ['foo'],
  created() {
    // ❌ 警告！prop 是只读的！
    this.foo = 'bar'
  }
}
```

</div>

想要更改 prop 通常都符合以下两种场景：

1. **prop 被用于传入初始值；而子组件想在之后将其作为一个局部数据属性**。在这种情况下，最好是新定义一个局部数据属性，从 prop 上获取初始值即可：

   <div class="composition-api">

   ```js
   const props = defineProps(['initialCounter'])

   // 计数器只是将 props.initialCounter 作为初始值
   // 像下面这样做就使 prop 和后续更新无关了
   const counter = ref(props.initialCounter)
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['initialCounter'],
     data() {
       return {
         // 计数器只是将 this.initialCounter 作为初始值
         // 像下面这样做就使 prop 和后续更新无关了
         counter: this.initialCounter
       }
     }
   }
   ```

   </div>

2. **prop 以原始的形式传入，但还需作转换**。在这种情况中，最好是基于该 prop 值定义一个计算属性：

   <div class="composition-api">

   ```js
   const props = defineProps(['size'])

   // 该 prop 变更时计算属性也会自动更新
   const normalizedSize = computed(() => props.size.trim().toLowerCase())
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['size'],
     computed: {
       // 该 prop 变更时计算属性也会自动更新
       normalizedSize() {
         return this.size.trim().toLowerCase()
       }
     }
   }
   ```

   </div>

### 更改对象 / 数组类型的 prop {#mutating-object-array-props}

当对象或数组作为 prop 被传入时，虽然子组件无法更改 prop 绑定，但仍然**可以**更改对象或数组内部的值。这是因为 JavaScript 的对象和数组是按引用传递，而对 Vue 来说，阻止这样的改变不但非常昂贵，也不合理。

这种更改的主要缺陷是它允许了子组件以某种不明显的方式影响了父组件的状态，可能会使数据流在将来变得更难以推理。按照最佳实践来讲，你应该避免这样的更改，除非父子组件在设计上耦合得非常紧密。在大多数的用例场景中，子组件都应该[抛出一个事件](/guide/components/events.html)来通知父组件做出改变。

## Prop 校验 {#prop-validation}

组件可以更细致地指定对其 prop 的需求，比如你上面看到的类型限制，如果并没有指定要求，Vue 会在浏览器的 JavaScript 控制台中抛出警告来提醒你。这在开发为其他人提供的组件时非常有用。

要描述对 prop 的校验，你可以向 <span class="composition-api">`defineProps()` 宏</span><span class="options-api">`props` 选项</span>提供一个带有 prop 校验的对象，而不是一个字符串数组，例如：

<div class="composition-api">

```js
defineProps({
  // 基础类型检查
  // （给出 `null` 和 `undefined` 值则会跳过任何类型检查）
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必传，且为 String 类型
  propC: {
    type: String,
    required: true
  },
  // Number 类型的默认值
  propD: {
    type: Number,
    default: 100
  },
  // 对象类型的默认值
  propE: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定义类型校验函数
  propF: {
    validator(value) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 函数类型的默认值
  propG: {
    type: Function,
    // 不像对象或数组的默认，这不是一个工厂函数。这会是一个用来作为默认值的函数
    default() {
      return 'Default function'
    }
  }
})
```

:::tip
`defineProps()` 宏中的参数**不可以访问 `<script setup>` 中定义的其他变量**，因为在编译时整个表达式都会被移到外部的函数中。
:::

</div>
<div class="options-api">

```js
export default {
  props: {
    // 基础类型检查
    //（给出 `null` 和 `undefined` 值则会跳过任何类型检查）
    propA: Number,
    // 多种可能的类型
    propB: [String, Number],
    // 必传，且为 String 类型
    propC: {
      type: String,
      required: true
    },
    // Number 类型的默认值
    propD: {
      type: Number,
      default: 100
    },
    // 对象类型的默认值
    propE: {
      type: Object,
      // 对象或者数组应当用工厂函数返回。
      // 工厂函数会收到组件所接收的原始 props
      // 作为参数
      default(rawProps) {
        return { message: 'hello' }
      }
    },
    // 自定义类型校验函数
    propF: {
      validator(value) {
        // The value must match one of these strings
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // 函数类型的默认值
    propG: {
      type: Function,
      // 不像对象或数组的默认，这不是一个工厂函数。这会是一个用来作为默认值的函数
      default() {
        return 'Default function'
      }
    }
  }
}
```

</div>

一些补充细节：

- 所有 prop 默认都是可选的，除非声明了 `required: true`。

- 除 `Boolean` 外的未传递的可选 prop 将会有一个默认值 `undefined`。
  
- `Boolean` 类型的未传递 prop 将被转换为 `false`。你应该为它设置一个 `default` 值来确保行为符合预期。

- 如果声明了 `default` 值，那么在 prop 的值被解析为 `undefined` 时，无论 prop 是未被传递还是显式指明的 `undefined`，都会改为 `default` 值。

当 prop 的校验失败后，Vue 会抛出一个控制台警告 (在开发模式下)。

<div class="composition-api">

如果使用了[基于类型的 prop 声明](/api/sfc-script-setup.html#typescript-only-features)，Vue 会尽最大努力在运行时按照 prop 的类型标注进行编译。举个例子，`defineProps<{ msg: string }>` 会被编译为 `{ msg: { type: String, required: true }}`。

</div>
<div class="options-api">

::: tip 注意
注意 prop 的校验是在组件实例被创建**之前**，所以实例的属性 (比如 `data`、`computed` 等) 将在 `default` 或 `validator` 函数中不可用。
:::

</div>

### 运行时类型检查 {#runtime-type-checks}

`type` 可以是下列这些原生构造器：

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`

另外，`type` 也可以是自定义的类或构造函数，可以通过 `instanceof` 来检查、断言。例如下面这个类：

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

你可以将其作为一个 prop 的类型：

<div class="composition-api">

```js
defineProps({
  author: Person
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    author: Person
  }
}
```

</div>

这会校验 `author` prop 的值是否是由 `new Person` 创建的。

## Boolean 类型转换 {#boolean-casting}

为了更贴近原生 boolean attributes 的行为，声明为 `Boolean` 类型的 props 有特别的类型转换规则。以带有如下声明的 `<MyComponent>` 组件为例：

<div class="composition-api">

```js
defineProps({
  disabled: Boolean
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    disabled: Boolean
  }
}
```

</div>

该组件可以被这样使用：

```vue-html
<!-- 等同于传入 :disabled="true" -->
<MyComponent disabled />

<!-- 等同于传入 :disabled="false" -->
<MyComponent />
```

当需要一个 prop 在声明时允许多种类型时，应该像这样：

<div class="composition-api">

```js
defineProps({
  disabled: [Boolean, Number]
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    disabled: [Boolean, Number]
  }
}
```

</div>

无论声明类型的顺序如何，`Boolean` 类型的特殊转换规则都会被应用。
