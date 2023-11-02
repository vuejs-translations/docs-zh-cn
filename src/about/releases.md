---
outline: deep
---

<script setup>
import { ref, onMounted } from 'vue'

const version = ref()

onMounted(async () => {
  const res = await fetch('https://api.github.com/repos/vuejs/core/releases/latest')
  version.value = (await res.json()).name
})
</script>

# 版本发布 {#releases}

<p v-if="version">
当前 Vue 的最新稳定版本是 <strong>{{ version }}</strong>。
</p>
<p v-else>
正在检测最新版本……
</p>

完整的过往发布记录可以在 [GitHub](https://github.com/vuejs/core/blob/main/CHANGELOG.md) 查阅。

## 发布周期 {#release-cycle}

Vue 并没有固定的发布周期。

- 补丁版本 (patch releases) 发布会及时按需进行。

- 小版本 (minor releases) 发布总是会包含一些新特性，发布周期通常会在 3~6 个月之间，并会经历 beta 预发布阶段。

- 大版本 (major releases) 发布会提前知会，且经历早期讨论和 alpha、beta 等预发布阶段。

## 语义化版本控制的特殊情况 {#semantic-versioning-edge-cases}

Vue 的发布会遵循[语义化版本控制](https://semver.org/)，同时伴随一些特殊情况。

### TypeScript 类型声明 {#typescript-definitions}

我们可能会在**小版本**发布之间包含 TypeScript 类型声明的不兼容变更，因为：

1. 有的时候 TypeScript 自身会在其小版本之间发布不兼容变更，我们不得不为了支持更新版本的 TypeScript 而调整自身的类型定义。

2. 我们也会偶尔需要使用最新版本的 TypeScript 中才可用的特性，并提升 TypeScript 的最低版本要求。

如果你正在使用 TypeScript，则可以使用一个语义化版本的范围来锁住当前的小版本，并在 Vue 新的小版本发布时进行手动升级。

### 编译后的代码和旧版运行时之间的兼容性 {#compiled-code-compatibility-with-older-runtime}

较新**小版本**的 Vue 编译器可能会生成与较旧小版本的 Vue 运行时不兼容的代码。例如，由 Vue 3.2 编译器生成的代码可能不完全兼容 Vue 3.1 的运行时。

只有库的作者需要考虑这个问题，因为编译器版本和运行时版本在应用中总是相同的。只有当你把预编译的 Vue 组件代码发布为一个包，而用户在一个使用旧版本 Vue 的项目中使用它时，才会发生版本不匹配。因此，你的包可能需要明确声明 Vue 的最低小版本要求。

## 预发布版本 {#pre-releases}

小版本发布通常会经历不定量的 beta 版。而大版本发布则会经历 alpha 和 beta 阶段。

此外，我们每周都会从 GitHub 上的 `main` 和 `minor` 分支发布金丝雀版本。它们将作为不同的软件包发布以避免稳定通道的 npm 元数据变得臃肿。你可以分别通过 `npx install-vue@canary` 或 `npx install-vue@canary-minor` 安装它们。

预发布版本 (pre releases) 是为了进行集成/稳定性测试，并让早期用户为不稳定的功能提供反馈。请不要在生产中使用预发布版本。所有的预发布版本都被认为是不稳定的，并且可能会在两者之间产生不兼容变更，所以在使用预发布版本时，一定要精确锁定版本号。

## 废弃的特性 {#deprecations}

我们可能会定期废弃那些在新的小版本中拥有更新更好的替代品的功能。被废弃的功能仍将继续工作，但会在进入废弃状态后的下一个大版本中被删除。

## RFC {#rfcs}

具有可观表层 API 的新特性和 Vue 的重大变更都将经历**意见征集** (RFC) 流程。RFC 流程的目的是为新功能进入该框架提供一个一致且可控的路径，并给用户一个机会参与设计过程并提供反馈。

该 RFC 流程会在 GitHub 上的 [vuejs/rfcs](https://github.com/vuejs/rfcs) 仓库进行。

## 试验性特性 {#experimental-features}

有些特性在 Vue 的稳定版本中已经发布并被记录了，但被标记为试验性的。试验性特性通常与某些 RFC 讨论相关联，这些讨论中的大部分设计问题已经在理论上得到了解决，但仍缺乏来自真实实践的反馈。

试验性特性的目的是允许用户通过在生产环境中测试它们来提供反馈，而不必使用不稳定的 Vue 版本。试验性特性本身是被认为不稳定的，只能以某种受控的方式使用，且该特性可预期地会在任何发布类型中发生变化。
