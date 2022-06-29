import { ref } from 'vue'

export default {
  setup() {
    const message = ref('Hello World!')

    function reverseMessage() {
      // 通过其 .value 属性
      // 访问/修改一个 ref 的值。
      message.value = message.value.split('').reverse().join('')
    }

    function notify() {
      alert('navigation was prevented.')
    }

    return {
      message,
      reverseMessage,
      notify
    }
  }
}
