<script setup lang="ts">
import { onMounted } from 'vue'
import SiteMap from './SiteMap.vue'
// import NewsLetter from './NewsLetter.vue'
import { load, data, base } from './sponsors'
import SponsorsGroup from './SponsorsGroup.vue'
// NOTE: hide the home video
// https://github.com/vuejs-translations/docs-zh-cn/issues/177
// import VueMasteryModal from './VueMasteryModal.vue'

onMounted(load)
</script>

<template>
  <section id="hero">
    <img id="uwu" alt="Vue.js Kawaii Logo by @icarusgkx" />
    <h1 class="tagline">
      <span class="accent">渐进式</span>
      <br />JavaScript 框架
    </h1>
    <p class="description">
      易学易用，性能出色，适用场景丰富的 Web 前端框架。
    </p>
    <p class="actions">
      <!-- NOTE: hide the home video -->
      <!-- <VueMasteryModal /> -->
      <a class="get-started" href="/guide/introduction.html">
        快速上手
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
        >
          <path
            d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"
          />
        </svg>
      </a>
      <a class="setup" href="/guide/quick-start.html">安装</a>
      <a class="security" href="https://v2.cn.vuejs.org/eol/" target="_blank">
        获取针对 Vue 2 的安全更新
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"
          />
        </svg>
      </a>
    </p>
  </section>

  <section v-if="data && data.platinum_china" id="special-sponsor">
    <template >
      <h3>中国区铂金赞助</h3>
      <div id="special-sponsor-container">
        <template v-for="{ url, img, name, height, description } of data.platinum_china"
        >
          <a class="logo" :href="url" target="_blank" rel="sponsored noopener">
            <picture v-if="img.endsWith('png')">
              <source
                type="image/avif"
                :srcset="`${base}/images/${img.replace(/\.png$/,'.avif')}`"
              />
              <img :src="`${base}/images/${img}`" :alt="name" :style="{ height: height || '50px' }" />
            </picture>
            <img
              width="168"
              height="42"
              v-else
              :src="`${base}/images/${img}`"
              :alt="name"
            />
          </a>
          <span>{{ description }}</span>
        </template>
      </div>
    </template>
  </section>
  <section v-else id="special-sponsor">
    <span>
      <a href="/sponsor/#tier-benefits">
        中国区铂金赞助位现已空缺-立即咨询
      </a>
    </span>
  </section>

  <section id="highlights" class="vt-box-container">
    <div class="vt-box">
      <h2>易学易用</h2>
      <p>
        基于标准 HTML、CSS 和 JavaScript 构建，提供容易上手的 API
        和一流的文档。
      </p>
    </div>
    <div class="vt-box">
      <h2>性能出色</h2>
      <p>经过编译器优化、完全响应式的渲染系统，几乎不需要手动优化。</p>
    </div>
    <div class="vt-box">
      <h2>灵活多变</h2>
      <p>
        丰富的、可渐进式集成的生态系统，可以根据应用规模在库和框架间切换自如。
      </p>
    </div>
  </section>

  <section id="sponsors">
    <h2>Platinum Sponsors</h2>
    <SponsorsGroup tier="platinum" placement="landing" />
    <h2>Gold Sponsors</h2>
    <SponsorsGroup tier="gold" placement="landing" />
  </section>

  <SiteMap />
  <!-- <NewsLetter /> -->
</template>

<style scoped>
section {
  padding: 42px 32px;
}

#hero {
  padding: 96px 32px;
  text-align: center;
}

.tagline {
  font-size: 76px;
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: -1.5px;
  max-width: 960px;
  margin: 0px auto;
}

html:not(.dark) .accent,
.dark .tagline {
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  max-width: 960px;
  line-height: 1.5;
  color: var(--vt-c-text-2);
  transition: color 0.5s;
  font-size: 22px;
  margin: 24px auto 40px;
}

.actions a {
  font-size: 16px;
  display: inline-block;
  background-color: var(--vt-c-bg-mute);
  padding: 8px 18px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.5s, color 0.5s;
}

.actions .security {
  background: linear-gradient(var(--vt-c-bg-mute), var(--vt-c-bg-mute)) padding-box,
    linear-gradient(45deg, #42d392, #647eff) border-box;
  border: 2px solid transparent;
}

.actions .security:hover {
  background: linear-gradient(var(--vt-c-gray-light-4), var(--vt-c-gray-light-4)) padding-box,
    linear-gradient(45deg, #42d392, #647eff) border-box;
}

.dark .actions .security:hover {
  background: linear-gradient(var(--vt-c-gray-dark-3), var(--vt-c-gray-dark-3)) padding-box,
    linear-gradient(45deg, #42d392, #647eff) border-box;
}

.actions .security .icon {
  width: 12px;
  height: 12px;
  margin-left: 4px;
}

.actions .get-started,
.actions .setup {
  margin-right: 18px;
}

.actions .icon {
  display: inline;
  position: relative;
  top: -1px;
  margin-left: 2px;
  fill: currentColor;
  transition: transform 0.2s;
}

.actions .get-started:hover {
  transition-duration: 0.2s;
}

.actions .get-started:hover .icon {
  transform: translateX(2px);
}

.actions .get-started,
.actions .setup,
.actions .security {
  color: var(--vt-c-text-code);
}

.actions .get-started:hover,
.actions .setup:hover,
.actions .security:hover {
  background-color: var(--vt-c-gray-light-4);
  transition-duration: 0.2s;
}

.dark .actions .get-started:hover,
.dark .actions .setup:hover,
.dark .actions .security:hover {
  background-color: var(--vt-c-gray-dark-3);
}

/* NOTE: via #vuemastery-action in VueMasteryModal.vue */

.actions .get-started {
  font-size: 16px;
  display: inline-block;
  border-radius: 8px;
  transition: background-color 0.5s, color 0.5s;
  position: relative;
  font-weight: 600;
  background-color: var(--vt-c-green);
  color: #fff;
  margin-right: 18px;
  padding: 8px 1em;
}

.dark .actions .get-started {
  color: var(--vt-c-indigo);
}

.actions .get-started:hover {
  background-color: var(--vt-c-green-dark);
  transition-duration: 0.2s;
}

.dark .actions .get-started:hover {
  background-color: var(--vt-c-green-light);
}

/* end NOTE */

#special-sponsor {
  border-top: 1px solid var(--vt-c-divider-light);
  border-bottom: 1px solid var(--vt-c-divider-light);
  padding: 12px 24px;
  display: flex;
  align-items: center;
}

#special-sponsor h3 {
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  padding-bottom: 10px;
}

#special-sponsor-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

#special-sponsor .logo {
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

#special-sponsor span {
  color: var(--vt-c-text-2);
  font-weight: 500;
  font-size: 13px;
  vertical-align: middle;
  flex: 1;
}

#special-sponsor span:first-child {
  text-align: right;
}


#special-sponsor a {
  display: flex;
  justify-content: center;
  padding: 0 24px;
}

#special-sponsor img {
  height: 42px;
  margin: -6px 0;
}

.dark #special-sponsor img {
  filter: grayscale(1) invert(1);
}

#highlights {
  max-width: 960px;
  margin: 0px auto;
  color: var(--vt-c-text-2);
}

#highlights h2 {
  font-weight: 600;
  font-size: 20px;
  letter-spacing: -0.4px;
  color: var(--vt-c-text-1);
  transition: color 0.5s;
  margin-bottom: 0.75em;
}

#highlights p {
  font-weight: 400;
  font-size: 15px;
}

#highlights .vt-box {
  background-color: transparent;
}

#sponsors {
  max-width: 900px;
  margin: 0px auto;
}

#sponsors h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 1em;
}

#sponsors .sponsor-container {
  margin-bottom: 3em;
}

@media (max-width: 960px) {
  .tagline {
    font-size: 64px;
    letter-spacing: -0.5px;
  }
  .description {
    font-size: 18px;
    margin-bottom: 48px;
  }
}

@media (max-width: 794px) {
  .tagline {
    font-size: 48px;
    letter-spacing: -0.5px;
  }
  .actions .security {
    margin-top: 18px;
  }
}

@media (max-width: 576px) {
  #hero {
    padding: 56px 32px;
  }
  .description {
    font-size: 16px;
    margin: 18px 0 30px;
  }
  #special-sponsor {
    flex-direction: column;
    height: auto;
  }
  #special-sponsor img {
    height: 36px;
    margin: 8px 0;
  }
  #special-sponsor span {
    text-align: center !important;
  }
  #highlights h3 {
    margin-bottom: 0.6em;
  }
  #highlights .vt-box {
    padding: 20px 36px;
  }
  .actions a {
    margin: 18px 0;
  }
  .actions .security {
    margin-top: 0;
  }
}

@media (max-width: 370px) {
  .tagline {
    font-size: 36px;
  }
}

#uwu {
  display: none;
}

.uwu #uwu {
  display: block;
  width: 100%;
  max-width: 720px;
  margin: -120px auto -20px;
  aspect-ratio: 192 / 108;
  content: url(/logo-uwu.png);
}

@media (max-width: 576px) {
  .uwu #uwu {
    margin: -60px auto -10px;
  }
}
</style>
