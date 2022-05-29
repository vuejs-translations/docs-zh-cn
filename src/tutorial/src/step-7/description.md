# 列表渲染

我们可以使用 `v-for` 指令来渲染一个基于源数组的元素列表：

```vue-html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

这里的 `todo` 是一个局部变量，表示当前正在迭代的数组元素。它只能在 `v-for` 元素上或元素内部访问。

注意，我们还给每个 todo 对象设置了唯一的 `id`，并且将它作为<a target="_blank" href="/api/built-in-special-attributes.html#key">特殊的 `key` attribute</a> 绑定到每个 `<li>`。`key` 使得 Vue 能够精确的移动每个 `<li>` ，以匹配对应的对象在数组中的位置。

更新列表有两种方式：

1. 在源数组上调用 [变更方法](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating) ：

   <div class="composition-api">

   ```js
   todos.value.push(newTodo)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos.push(newTodo)
   ```

   </div>

2. 使用新的数组代替源数组：

   <div class="composition-api">

   ```js
   todos.value = todos.value.filter(/* ... */)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos = this.todos.filter(/* ... */)
   ```

   </div>

这里有一个简单的 todo 列表 - 尝试实现 `addTodo()` 和 `removeTodo()` 方法的逻辑，使它能够起作用！

关于 `v-for` 的更多细节：<a target="_blank" href="/guide/essentials/list.html">指南 - 列表渲染</a>
