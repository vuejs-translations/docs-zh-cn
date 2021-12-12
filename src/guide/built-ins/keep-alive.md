# KeepAlive {#keepalive}

在之前的章节中，我们使用过了 `is` attribute 来实现在标签页界面中的组件切换：

```vue-html
<component :is="currentTabComponent"></component>
```

但是当在这些组件中切换时，你有时可能想要保留它们的状态或者为了提高性能避免反复重渲染。举个例子，我们把之前的例子扩展一些：

<!-- <common-codepen-snippet title="Dynamic components: without keep-alive" slug="jOPjZOe" tab="html,result" /> -->

你可能会注意到当你选择了一篇博文，再切换到 *归档* 标签页，再切换回 *博文* 页，并没有展示你之前选择的博文。这是因为每当你切换到一个新的标签页，Vue 都会创建一个新的 `currentTabComponent` 的组件实例。

重新创建动态组件通常是一个有用的行为，但在这个例子中，我们想要让这些标签页的组件实例能在创建伊始就被缓存下来。要解决这个问题，我们可以用 `<keep-alive>` 元素将动态组件包裹起来：

```vue-html
<!-- 不活跃的组件将被缓存起来！ -->
<keep-alive>
  <component :is="currentTabComponent"></component>
</keep-alive>
```

下面是更改过后的结果：

<!-- <common-codepen-snippet title="Dynamic components: with keep-alive" slug="VwLJQvP" tab="html,result" /> -->

现在 *博文* 标签页即使被重新渲染了，也会保持住它的状态（即选择的博文）。

要想了解关于 `<keep-alive>` 的更多细节，可以查看 [API 参考](/api/built-in-components.html#keep-alive) 章节中的相应内容。
