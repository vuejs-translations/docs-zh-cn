<script setup lang="ts">
function track() {
  fathom.trackGoal('3IG4VF8N', 0)
}
</script>

<template>
  <div class="text-ad">
    <span>广告</span>
  </div>
</template>

<style scoped>
.text-ad {
  font-size: 14px;
  margin-bottom: 28px;
  background-color: var(--vt-c-bg-soft);
  padding: 0.75rem;
  position: relative;
  display: flex;
  border-radius: 8px;
  color: var(--vt-c-text-2);
}

.text-ad span {
  white-space: nowrap;
  color: var(--vt-c-blue);
  font-size: 13px;
  line-height: 13px;
  border: 1px solid var(--vt-c-blue);
  border-radius: 4px;
  display: inline-block;
  padding: 0.2rem 0.2rem;
  margin-right: 1rem;
}
</style>
