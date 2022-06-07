---
outline: deep
---

<script setup>
import { ref } from 'vue'
const message = ref('')
const multilineText = ref('')
const checked = ref(false)
const checkedNames = ref([])
const picked = ref('')
const selected = ref('')
const multiSelected = ref([])
</script>

# 表单输入绑定 {#form-input-bindings}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-inputs-vue-devtools-in-vue-3" title="用户输入 - 免费 Vue.js 课程"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-inputs-in-vue" title="用户输入 - 免费 Vue.js 课程"/>
</div>

在前端处理表单时，我们常常需要将表单输入框的内容同步给 JavaScript 中相应的变量。手动连接值绑定和更改事件监听器可能会很麻烦：

```vue-html
<input
  :value="text"
  @input="event => text = event.target.value">
```

`v-model` 指令帮我们简化了这一步骤：

```vue-html
<input v-model="text">
```

另外，`v-model` 还可以用于各种不同类型的输入，`<textarea>`、`<select>` 元素。它会根据所使用的元素自动扩展到不同的 DOM 属性和事件组合：

- 文本类型的 `<input>` 和 `<textarea>` 元素会使用到 `value` 属性和 `input` 事件；
- `<input type="checkbox">` 和 `<input type="radio">` 使用 `checked` 属性和 `change` 事件；
- `<select>` 使用的 `value` 作为 prop，`change` 作为事件：

::: tip 注意
`v-model` 会忽略任何表单元素上初始的 `value`、`checked` 或 `selected` attribute。它将始终将当前绑定的 JavaScript 状态视为数据的正确来源。你应该在 JavaScript 中声明该初始值，使用<span class="options-api"> `data` 选项</span><span class="composition-api">响应式系统的 API</span>。
:::

## 基本用法 {#basic-usage}

### 文本 {#text}

```vue-html
<p>Message is: {{ message }}</p>
<input v-model="message" placeholder="edit me" />
```

<div class="demo">
  <p>Message is: {{ message }}</p>
  <input v-model="message" placeholder="edit me" />
</div>

<div class="composition-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgbWVzc2FnZSA9IHJlZignJylcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxwPk1lc3NhZ2UgaXM6IHt7IG1lc3NhZ2UgfX08L3A+XG5cdDxpbnB1dCB2LW1vZGVsPVwibWVzc2FnZVwiIHBsYWNlaG9sZGVyPVwiZWRpdCBtZVwiIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogJydcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxwPk1lc3NhZ2UgaXM6IHt7IG1lc3NhZ2UgfX08L3A+XG5cdDxpbnB1dCB2LW1vZGVsPVwibWVzc2FnZVwiIHBsYWNlaG9sZGVyPVwiZWRpdCBtZVwiIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

<span id="vmodel-ime-tip"></span>
::: tip 注意
对于需要使用 [IME](https://en.wikipedia.org/wiki/Input_method) 的语言 (中文，日文和韩文等)，你会发现 `v-model` 不会在 IME 输入的组合状态时触发更新。如果你的确想在此时也触发更新，请使用 `input` 事件监听器和 `value` 绑定值而不要使用 `v-model`。
:::

### 多行文本 {#multiline-text}

```vue-html
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

<div class="demo">
  <span>Multiline message is:</span>
  <p style="white-space: pre-line;">{{ message }}</p>
  <textarea v-model="message" placeholder="add multiple lines"></textarea>
</div>

<div class="composition-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgbWVzc2FnZSA9IHJlZignJylcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxzcGFuPk11bHRpbGluZSBtZXNzYWdlIGlzOjwvc3Bhbj5cblx0PHAgc3R5bGU9XCJ3aGl0ZS1zcGFjZTogcHJlLWxpbmU7XCI+e3sgbWVzc2FnZSB9fTwvcD5cblx0PHRleHRhcmVhIHYtbW9kZWw9XCJtZXNzYWdlXCIgcGxhY2Vob2xkZXI9XCJhZGQgbXVsdGlwbGUgbGluZXNcIj48L3RleHRhcmVhPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>
<div class="options-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogJydcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxzcGFuPk11bHRpbGluZSBtZXNzYWdlIGlzOjwvc3Bhbj5cblx0PHAgc3R5bGU9XCJ3aGl0ZS1zcGFjZTogcHJlLWxpbmU7XCI+e3sgbWVzc2FnZSB9fTwvcD5cblx0PHRleHRhcmVhIHYtbW9kZWw9XCJtZXNzYWdlXCIgcGxhY2Vob2xkZXI9XCJhZGQgbXVsdGlwbGUgbGluZXNcIj48L3RleHRhcmVhPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

注意插值表达式在 `<textarea>` 中将不会工作。请使用 `v-model` 来替代。

```vue-html
<!-- 错误 -->
<textarea>{{ text }}</textarea>

<!-- 正确 -->
<textarea v-model="text"></textarea>
```

### 复选框 {#checkbox}

单一的复选框，绑定的是布尔类型值：

```vue-html
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

<div class="demo">
  <input type="checkbox" id="checkbox-demo" v-model="checked" />
  <label for="checkbox-demo">{{ checked }}</label>
</div>

<div class="composition-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgY2hlY2tlZCA9IHJlZih0cnVlKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiY2hlY2tib3hcIiB2LW1vZGVsPVwiY2hlY2tlZFwiIC8+XG5cdDxsYWJlbCBmb3I9XCJjaGVja2JveFwiPnt7IGNoZWNrZWQgfX08L2xhYmVsPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>
<div class="options-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2hlY2tlZDogdHJ1ZVxuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiY2hlY2tib3hcIiB2LW1vZGVsPVwiY2hlY2tlZFwiIC8+XG5cdDxsYWJlbCBmb3I9XCJjaGVja2JveFwiPnt7IGNoZWNrZWQgfX08L2xhYmVsPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

我们还可以将多个复选框绑定到同一个数组或[集合](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)的值：

<div class="composition-api">

```js
const checkedNames = ref([])
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      checkedNames: []
    }
  }
}
```

</div>

```vue-html
<div>Checked names: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
```

<div class="demo">
  <div>Checked names: {{ checkedNames }}</div>

  <input type="checkbox" id="demo-jack" value="Jack" v-model="checkedNames">
  <label for="demo-jack">Jack</label>

  <input type="checkbox" id="demo-john" value="John" v-model="checkedNames">
  <label for="demo-john">John</label>

  <input type="checkbox" id="demo-mike" value="Mike" v-model="checkedNames">
  <label for="demo-mike">Mike</label>
</div>

在这个例子中，`checkedNames` 数组将始终包含来自当前选中框的值。

<div class="composition-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgY2hlY2tlZE5hbWVzID0gcmVmKFtdKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdj5DaGVja2VkIG5hbWVzOiB7eyBjaGVja2VkTmFtZXMgfX08L2Rpdj5cblxuICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJqYWNrXCIgdmFsdWU9XCJKYWNrXCIgdi1tb2RlbD1cImNoZWNrZWROYW1lc1wiIC8+XG4gIDxsYWJlbCBmb3I9XCJqYWNrXCI+SmFjazwvbGFiZWw+XG4gXG4gIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cImpvaG5cIiB2YWx1ZT1cIkpvaG5cIiB2LW1vZGVsPVwiY2hlY2tlZE5hbWVzXCIgLz5cbiAgPGxhYmVsIGZvcj1cImpvaG5cIj5Kb2huPC9sYWJlbD5cbiBcbiAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwibWlrZVwiIHZhbHVlPVwiTWlrZVwiIHYtbW9kZWw9XCJjaGVja2VkTmFtZXNcIiAvPlxuICA8bGFiZWwgZm9yPVwibWlrZVwiPk1pa2U8L2xhYmVsPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>
<div class="options-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2hlY2tlZE5hbWVzOiBbXVxuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdj5DaGVja2VkIG5hbWVzOiB7eyBjaGVja2VkTmFtZXMgfX08L2Rpdj5cblxuICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJqYWNrXCIgdmFsdWU9XCJKYWNrXCIgdi1tb2RlbD1cImNoZWNrZWROYW1lc1wiIC8+XG4gIDxsYWJlbCBmb3I9XCJqYWNrXCI+SmFjazwvbGFiZWw+XG4gXG4gIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cImpvaG5cIiB2YWx1ZT1cIkpvaG5cIiB2LW1vZGVsPVwiY2hlY2tlZE5hbWVzXCIgLz5cbiAgPGxhYmVsIGZvcj1cImpvaG5cIj5Kb2huPC9sYWJlbD5cbiBcbiAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwibWlrZVwiIHZhbHVlPVwiTWlrZVwiIHYtbW9kZWw9XCJjaGVja2VkTmFtZXNcIiAvPlxuICA8bGFiZWwgZm9yPVwibWlrZVwiPk1pa2U8L2xhYmVsPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

### 单选按钮 {#radio}

```vue-html
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Two</label>
```

<div class="demo">
  <div>Picked: {{ picked }}</div>

  <input type="radio" id="one" value="One" v-model="picked" />
  <label for="one">One</label>

  <input type="radio" id="two" value="Two" v-model="picked" />
  <label for="two">Two</label>
</div>

<div class="composition-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgcGlja2VkID0gcmVmKCdPbmUnKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdj5QaWNrZWQ6IHt7IHBpY2tlZCB9fTwvZGl2PlxuXG5cdDxpbnB1dCB0eXBlPVwicmFkaW9cIiBpZD1cIm9uZVwiIHZhbHVlPVwiT25lXCIgdi1tb2RlbD1cInBpY2tlZFwiIC8+XG5cdDxsYWJlbCBmb3I9XCJvbmVcIj5PbmU8L2xhYmVsPlxuXG5cdDxpbnB1dCB0eXBlPVwicmFkaW9cIiBpZD1cInR3b1wiIHZhbHVlPVwiVHdvXCIgdi1tb2RlbD1cInBpY2tlZFwiIC8+XG4gIDxsYWJlbCBmb3I9XCJ0d29cIj5Ud288L2xhYmVsPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>
<div class="options-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcGlja2VkOiAnT25lJ1xuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGRpdj5QaWNrZWQ6IHt7IHBpY2tlZCB9fTwvZGl2PlxuXG5cdDxpbnB1dCB0eXBlPVwicmFkaW9cIiBpZD1cIm9uZVwiIHZhbHVlPVwiT25lXCIgdi1tb2RlbD1cInBpY2tlZFwiIC8+XG5cdDxsYWJlbCBmb3I9XCJvbmVcIj5PbmU8L2xhYmVsPlxuXG5cdDxpbnB1dCB0eXBlPVwicmFkaW9cIiBpZD1cInR3b1wiIHZhbHVlPVwiVHdvXCIgdi1tb2RlbD1cInBpY2tlZFwiIC8+XG5cdDxsYWJlbCBmb3I9XCJ0d29cIj5Ud288L2xhYmVsPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

### 选择器 {#select}

单个选择器的示例如下：

```vue-html
<div>Selected: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

<div class="demo">
  <div>Selected: {{ selected }}</div>
  <select v-model="selected">
    <option disabled value="">Please select one</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>

<div class="composition-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3Qgc2VsZWN0ZWQgPSByZWYoJycpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8c3Bhbj4gU2VsZWN0ZWQ6IHt7IHNlbGVjdGVkIH19PC9zcGFuPlxuXG4gIDxzZWxlY3Qgdi1tb2RlbD1cInNlbGVjdGVkXCI+XG4gICAgPG9wdGlvbiBkaXNhYmxlZCB2YWx1ZT1cIlwiPlBsZWFzZSBzZWxlY3Qgb25lPC9vcHRpb24+XG4gICAgPG9wdGlvbj5BPC9vcHRpb24+XG4gICAgPG9wdGlvbj5CPC9vcHRpb24+XG4gICAgPG9wdGlvbj5DPC9vcHRpb24+XG4gIDwvc2VsZWN0PlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>
<div class="options-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2VsZWN0ZWQ6ICcnXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8c3Bhbj4gU2VsZWN0ZWQ6IHt7IHNlbGVjdGVkIH19PC9zcGFuPlxuICA8c2VsZWN0IHYtbW9kZWw9XCJzZWxlY3RlZFwiPlxuICAgIDxvcHRpb24gZGlzYWJsZWQgdmFsdWU9XCJcIj5QbGVhc2Ugc2VsZWN0IG9uZTwvb3B0aW9uPlxuICAgIDxvcHRpb24+QTwvb3B0aW9uPlxuICAgIDxvcHRpb24+Qjwvb3B0aW9uPlxuICAgIDxvcHRpb24+Qzwvb3B0aW9uPlxuICA8L3NlbGVjdD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>

:::tip 注意
如果 `v-model` 表达式的初始值不匹配任何一个选择项，`<select>` 元素会渲染成一个“未选择”的状态。在 iOS 上，这将导致用户无法选择第一项，因为 iOS 在这种情况下不会触发一个 change 事件。因此，我们建议提供一个空值的禁用选项，如上面的例子所示。
:::

多选 (值绑定到一个数组)：

```vue-html
<div>Selected: {{ selected }}</div>

<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

<div class="demo">
  <div>Selected: {{ multiSelected }}</div>

  <select v-model="multiSelected" multiple>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>

<div class="composition-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3Qgc2VsZWN0ZWQgPSByZWYoW10pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2PlNlbGVjdGVkOiB7eyBzZWxlY3RlZCB9fTwvZGl2PlxuXG4gIDxzZWxlY3Qgdi1tb2RlbD1cInNlbGVjdGVkXCIgbXVsdGlwbGU+XG4gICAgPG9wdGlvbj5BPC9vcHRpb24+XG4gICAgPG9wdGlvbj5CPC9vcHRpb24+XG4gICAgPG9wdGlvbj5DPC9vcHRpb24+XG4gIDwvc2VsZWN0PlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuc2VsZWN0W211bHRpcGxlXSB7XG4gIHdpZHRoOiAxMDBweDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>
<div class="options-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2VsZWN0ZWQ6IFtdXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2PlNlbGVjdGVkOiB7eyBzZWxlY3RlZCB9fTwvZGl2PlxuXG4gIDxzZWxlY3Qgdi1tb2RlbD1cInNlbGVjdGVkXCIgbXVsdGlwbGU+XG4gICAgPG9wdGlvbj5BPC9vcHRpb24+XG4gICAgPG9wdGlvbj5CPC9vcHRpb24+XG4gICAgPG9wdGlvbj5DPC9vcHRpb24+XG4gIDwvc2VsZWN0PlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuc2VsZWN0W211bHRpcGxlXSB7XG4gIHdpZHRoOiAxMDBweDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>

选择器的选项可以使用 `v-for` 动态渲染：

<div class="composition-api">

```js
const selected = ref('A')

const options = ref([
  { text: 'One', value: 'A' },
  { text: 'Two', value: 'B' },
  { text: 'Three', value: 'C' }
])
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      selected: 'A',
      options: [
        { text: 'One', value: 'A' },
        { text: 'Two', value: 'B' },
        { text: 'Three', value: 'C' }
      ]
    }
  }
}
```

</div>

```vue-html
<select v-model="selected">
  <option v-for="option in options" :value="option.value">
    {{ option.text }}
  </option>
</select>

<div>Selected: {{ selected }}</div>
```

<div class="composition-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3Qgc2VsZWN0ZWQgPSByZWYoJ0EnKVxuXG5jb25zdCBvcHRpb25zID0gcmVmKFtcbiAgeyB0ZXh0OiAnT25lJywgdmFsdWU6ICdBJyB9LFxuICB7IHRleHQ6ICdUd28nLCB2YWx1ZTogJ0InIH0sXG4gIHsgdGV4dDogJ1RocmVlJywgdmFsdWU6ICdDJyB9XG5dKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHNlbGVjdCB2LW1vZGVsPVwic2VsZWN0ZWRcIj5cbiAgICA8b3B0aW9uIHYtZm9yPVwib3B0aW9uIGluIG9wdGlvbnNcIiA6dmFsdWU9XCJvcHRpb24udmFsdWVcIj5cbiAgICAgIHt7IG9wdGlvbi50ZXh0IH19XG4gICAgPC9vcHRpb24+XG4gIDwvc2VsZWN0PlxuXG5cdDxkaXY+U2VsZWN0ZWQ6IHt7IHNlbGVjdGVkIH19PC9kaXY+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2VsZWN0ZWQ6ICdBJyxcbiAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgeyB0ZXh0OiAnT25lJywgdmFsdWU6ICdBJyB9LFxuICAgICAgICB7IHRleHQ6ICdUd28nLCB2YWx1ZTogJ0InIH0sXG4gICAgICAgIHsgdGV4dDogJ1RocmVlJywgdmFsdWU6ICdDJyB9XG4gICAgICBdXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8c2VsZWN0IHYtbW9kZWw9XCJzZWxlY3RlZFwiPlxuICAgIDxvcHRpb24gdi1mb3I9XCJvcHRpb24gaW4gb3B0aW9uc1wiIDp2YWx1ZT1cIm9wdGlvbi52YWx1ZVwiPlxuICAgICAge3sgb3B0aW9uLnRleHQgfX1cbiAgICA8L29wdGlvbj5cbiAgPC9zZWxlY3Q+XG5cblx0PGRpdj5TZWxlY3RlZDoge3sgc2VsZWN0ZWQgfX08L2Rpdj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>

## 值绑定 {#value-bindings}

对于单选按钮，复选框和选择器选项，`v-model` 绑定的值通常是静态的字符串 (或者对复选框是布尔值)：

```vue-html
<!-- `picked` 在被选择时是字符串 "a" -->
<input type="radio" v-model="picked" value="a" />

<!-- `toggle` 只会为 true 或 false -->
<input type="checkbox" v-model="toggle" />

<!-- `selected` 在第一项被选中时为字符串 "abc" -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

但有时我们可能希望将该值绑定到当前活动实例上的动态属性，那么可以使用 `v-bind` 来做到。此外使用 `v-bind` 还使我们可以将选项值绑定为非字符串类型。

### 复选框 {#checkbox-2}

```vue-html
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />
```

`true-value` 和 `false-value` 是 Vue 特有的 attributes 且仅会在 `v-model` 存在时工作。这里 `toggle` 属性的值会在选中时被设为 `'yes'`，取消选择时设为 `'no'`。你同样可以通过 `v-bind` 将其绑定为其他动态值：

```vue-html
<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

:::tip 提示
`true-value` 和 `false-value` attributes 不会影响 `value` attribute，因为浏览器在表单提交时，并不会包含未选择的复选框。为了保证这两个值 (例如：“yes”和“no”) 的其中之一被表单提交，请使用单选按钮作为替代。
:::

### 单选按钮 {#radio-2}

```vue-html
<input type="radio" v-model="pick" :value="first" />
<input type="radio" v-model="pick" :value="second" />
```

`pick` 会在第一个按钮选中时被设为 `first`，在第二个按钮选中时被设为 `second`。

### 选择器选项 {#select-options-2}

```vue-html
<select v-model="selected">
  <!-- 内联对象字面量 -->
  <option :value="{ number: 123 }">123</option>
</select>
```

`v-model` 同样也支持非字符串类型的值绑定！在上面这个例子中，当某个选项被选中，`selected` 会被设为该对象字面量值 `{ number: 123 }`。

## 修饰符 {#modifiers}

### `.lazy`

默认情况下，`v-model` 会在每次 `input` 事件后更新数据 ([IME composition 阶段的状态](#vmodel-ime-tip)例外)。你可以添加 `lazy` 修饰符来改为在每次 `change` 事件后更新数据：

```vue-html
<!-- 在 "change" 事件后同步更新而不是 "input" -->
<input v-model.lazy="msg" />
```

### `.number` {#number}

如果你想让用户输入自动转换为数字，你可以在 `v-model` 后添加 `.number` 修饰符来管理输入：

```vue-html
<input v-model.number="age" />
```

如果该值无法被 `parseFloat()` 处理，那么将返回原始值。

`number` 修饰符会在输入框有 `type="number"` 时自动应用。

### `.trim` {#trim}

如果你想要默认自动去除用户输入内容中两端的空格，你可以在 `v-model` 后添加 `.trim` 修饰符来管理输入：

```vue-html
<input v-model.trim="msg" />
```

## 组件上的 `v-model` {#v-model-with-components}

> 如果你还不熟悉 Vue 的组件，那么现在可以跳过这个部分。

HTML 的内置表单输入类型并不总能满足你的需求。幸运的是，你可以使用 Vue 构建具有完全自定义行为的可复用输入组件，并且这些输入组件也可以使用 `v-model`！要了解更多关于此的内容，请在组件指引中阅读[配合 `v-model` 使用](/guide/components/events.html#usage-with-v-model)。
