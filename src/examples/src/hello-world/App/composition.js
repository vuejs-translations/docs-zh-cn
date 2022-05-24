import { ref } from 'vue'

export default {
  setup() {
    // “ref”是用来存储值的响应式数据源。
    // 理论上我们在展示该字符串的时候不需要将其包装在 ref() 中，
    // 但是在下一个示例中更改这个值的时候，我们就需要它了。
    const message = ref('Hello World!')

    return {
      message
    }
  }
}
