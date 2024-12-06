<script setup lang="ts">
import PageHero from '@theme/components/PageHero.vue'

defineProps<{ title?: string }>()
</script>

<template>
  <PageHero>
    <template #title>{{ title || 'Vue 合作伙伴' }}</template>
    <template #lead>
      <p >
        Vue 合作伙伴是 Vue 团队认可提供一流 Vue 咨询和开发服务的机构。如果你的公司有兴趣被列为合作伙伴，请<a href="https://airtable.com/shrCQhat57SApJI2l"
        target="_blank">在此注册</a>。
      </p>
    </template>
  </PageHero>
</template>
