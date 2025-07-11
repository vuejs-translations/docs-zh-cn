<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { SponsorData, data, base, load } from './sponsors'

type Placement = 'aside' | 'page' | 'landing'

const props = withDefaults(
  defineProps<{
    tier: keyof SponsorData
    placement?: Placement
  }>(),
  {
    placement: 'aside'
  }
)

const container = ref<HTMLElement>()
const visible = ref(false)

onMounted(async () => {
  // only render when entering view
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { rootMargin: '0px 0px 300px 0px' }
  )
  observer.observe(container.value!)
  onUnmounted(() => observer.disconnect())

  // load data
  await load()
})

// fathom events
const eventMap: Record<Placement, string> = {
  aside: '4QUPDDRU',
  landing: '58FLAR2Z',
  page: 'ZXLO3IUT'
}

function track(interest?: boolean) {
  fathom.trackGoal(interest ? `Y2BVYNT2` : eventMap[props.placement], 0)
}

function resolveList(data: SponsorData) {
  let currentTier = data[props.tier] || []
  // in aside, treat platinum+priority as special
  if (props.placement === 'aside') {
    if (props.tier === 'platinum') {
      currentTier = currentTier.filter((s) => !s.priority)
    } else if (props.tier === 'special') {
      currentTier = [
        ...currentTier,
        ...data.platinum.filter((s) => s.priority)
      ]
    }
  }
  return currentTier
}
</script>

<template>
  <div
    ref="container"
    class="spsr-container"
    :class="[tier === 'platinum_china' ? 'special' : tier, placement]"
  >
    <template v-if="data && visible">
      <a
        v-for="{ url, url_cn, img, name } of resolveList(data)"
        class="spsr-item"
        :href="url_cn || url"
        target="_blank"
        rel="sponsored noopener"
        @click="track()"
      >
        <picture v-if="img.endsWith('png')">
          <source
            type="image/avif"
            :srcset="`${base}/images/${img.replace(/\.png$/, '.avif')}`"
          />
          <img :src="`${base}/images/${img}`" :alt="name" />
        </picture>
        <img v-else :src="`${base}/images/${img}`" :alt="name" />
      </a>
    </template>
    <a
      v-if="placement !== 'page' && tier !== 'special'"
      href="/sponsor/"
      class="spsr-item action"
      @click="track(true)"
      >成为赞助商</a
    >
    <a
      v-if="tier === 'special' && data && !data[tier]?.length"
      href="/sponsor/#tier-benefits"
      class="spsr-item action"
      @click="track(true)"
      >Inquire about Special Sponsorship</a
    >
  </div>
</template>

<style scoped>
.spsr-container {
  --max-width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--max-width), 1fr));
  column-gap: 4px;
}

.spsr-container.platinum {
  --max-width: 240px;
}
.spsr-container.gold {
  --max-width: 180px;
}
.spsr-container.silver {
  --max-width: 140px;
}

.spsr-item {
  margin: 2px 0;
  background-color: var(--vt-c-white-soft);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 2px;
  transition: background-color 0.2s ease;
  height: calc(var(--max-width) / 2 - 6px);
}
.spsr-item.action {
  font-size: 11px;
  color: var(--vt-c-text-3);
}
.spsr-container.page .spsr-item.action {
 font-size: 16px;
}
.spsr-item img {
  max-width: calc(var(--max-width) - 30px);
  max-height: calc(var(--max-width) / 2 - 20px);
}
.special .spsr-item {
  height: 160px;
}
.special .spsr-item img {
  max-width: 300px;
  max-height: 150px;
}

/* dark mode */
.dark .aside .spsr-item,
.dark .landing .spsr-item {
  background-color: var(--vt-c-bg-soft);
}
.aside .spsr-item img,
.landing .spsr-item img {
  transition: filter 0.2s ease;
}
.dark .aside .spsr-item img,
.dark .landing .spsr-item img {
  filter: grayscale(1) invert(1);
}
.dark .aside .spsr-item:hover,
.dark .landing .spsr-item:hover {
  color: var(--vt-c-indigo);
  background-color: var(--vt-c-white-mute);
}
.dark .spsr-item:hover img {
  filter: none;
}

/* aside mode (on content pages) */
.spsr-container.platinum.aside {
  --max-width: 110px;
  column-gap: 1px;
}
.aside .spsr-item {
  margin: 1px 0;
}
.aside .special .spsr-item {
  width: 100%;
  height: 70px;
}
.aside .special .spsr-item img {
  max-width: 120px;
  max-height: 48px;
}
.aside .platinum .spsr-item {
  width: 111px;
  height: 50px;
}
.aside .platinum .spsr-item img {
  max-width: 88px;
}

/* narrow, aside will be hidden under this state so it's mutually exclusive */
@media (max-width: 720px) {
  .spsr-container.platinum {
    --max-width: 180px;
  }
  .spsr-container.gold {
    --max-width: 140px;
  }
  .spsr-container.silver {
    --max-width: 120px;
  }
}

@media (max-width: 480px) {
  .spsr-container.platinum {
    --max-width: 150px;
  }
  .spsr-container.gold {
    --max-width: 120px;
  }
  .spsr-container.silver {
    --max-width: 100px;
  }
}
</style>
