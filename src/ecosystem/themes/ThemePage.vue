<script setup lang="ts">
import ThemeHero from './ThemeHero.vue'
import ThemeList from './ThemeList.vue'
import ThemeContact from './ThemeContact.vue'
</script>

<template>
  <div class="ThemePage">
    <ThemeHero>
      <template #title>主题</template>
      <template #lead>查看主题、UI Kits 和插件。你可以看到我们的合作伙伴是如何用 Vue 构建一个真实世界的应用。</template>
    </ThemeHero>

    <ThemeList />

    <ThemeContact>
      想在这里介绍你的主题吗？ <a class="link" href="mailto:evan@vuejs.org?subject=Theme+affiliation">联系我们!</a>
    </ThemeContact>
  </div>
</template>
