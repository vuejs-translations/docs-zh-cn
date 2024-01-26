<script setup>
import { ref, onMounted } from 'vue'
import { data } from './errors.data.ts'
import ErrorsTable from './ErrorsTable.vue'

const highlight = ref()
onMounted(() => {
  highlight.value = location.hash.slice(1)
})
</script>

# 生产环境错误代码参考 {#error-reference}

## 运行时错误 {#runtime-errors}

在生产环境中，传递给以下错误处理程序 API 的第三个参数是一个短代码，而不是含有完整信息的字符串：

- [`app.config.errorHandler`](/api/application#app-config-errorhandler)
- [`onErrorCaptured`](/api/composition-api-lifecycle#onerrorcaptured) (组合式 API)
- [`errorCaptured`](/api/options-lifecycle#errorcaptured) (选项式 API)

下表提供了代码和其原始的完整信息字符串的映射。

<ErrorsTable kind="runtime" :errors="data.runtime" :highlight="highlight" />

## 编译错误 {#compiler-errors}

下表提供了生产环境的编译错误代码与其原始消息的映射。

<ErrorsTable kind="compiler" :errors="data.compiler" :highlight="highlight" />
