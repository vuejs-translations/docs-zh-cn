# Lifecycle and Template Refs

So far, Vue has been handling all the DOM updates for us, thanks to reactivity and declarative rendering. However, inevitably there will be cases where we need to manually work with the DOM.

We can request a **template ref** - i.e. a reference to an element in the template - using the <a target="_blank" href="/api/built-in-special-attributes.html#ref">special `ref` attribute</a>:

```vue-html
<p ref="p">hello</p>
```

<div class="composition-api">

To access the ref, we need to declare<span class="html"> and expose</span> a ref with matching name:

<div class="sfc">

```js
const p = ref(null)
```

</div>
<div class="html">

```js
setup() {
  const p = ref(null)

  return {
    p
  }
}
```

</div>

Notice the ref is initialized with `null` value. This is because the element doesn't exist yet when <span class="sfc">`<script setup>`</span><span class="html">`setup()`</span> is executed. The template ref is only accessible after the component is **mounted**.

To run code after mount, we can use the `onMounted()` function:

<div class="sfc">

```js
import { onMounted } from 'vue'

onMounted(() => {
  // component is now mounted.
})
```

</div>
<div class="html">

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // component is now mounted.
    })
  }
})
```

</div>
</div>

<div class="options-api">

The element will be exposed on `this.$refs` as `this.$refs.p`. However, you can only access it after the component is **mounted**.

To run code after mount, we can use the `mounted` option:

<div class="sfc">

```js
export default {
  mounted() {
    // component is now mounted.
  }
}
```

</div>
<div class="html">

```js
createApp({
  mounted() {
    // component is now mounted.
  }
})
```

</div>
</div>

This is called a **lifecycle hook** - it allows us to register a callback to be called at certain times of the component's lifecycle. There are other hooks such as <span class="options-api">`created` and `updated`</span><span class="composition-api">`onUpdated` and `onUnmounted`</span>. Check out the <a target="_blank" href="/guide/essentials/lifecycle.html#lifecycle-diagram">Lifecycle Diagram</a> for more details.

Now, try to add an <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> hook, access the `<p>` via <span class="options-api">`this.$refs.p`</span><span class="composition-api">`p.value`</span>, and perform some direct DOM operations on it (e.g. changing its `textContent`).
