// shared data across instances so we load only once

import { ref } from 'vue'

export interface Sponsor {
  url: string
  img: string
  name: string
  description?: string
  height?: string
}

export interface SponsorData {
  special: Sponsor[]
  platinum: Sponsor[]
  platinum_china: Sponsor[]
  gold: Sponsor[]
  silver: Sponsor[]
  bronze: Sponsor[]
}

export const data = ref<SponsorData>()
export const pending = ref<boolean>(false)

export const base = `https://sponsors.vuejs.org`

export const load = async () => {
  if (!pending.value) {
    pending.value = true
    const raw = await (await fetch(`${base}/data.json`)).json()

    // custom dcloud randomization logic
    raw.platinum_china.forEach((s: Sponsor) => {
      if (s.name === 'DCloud') {
        s.height = '70px'
        if (Math.random() >= 0.5) s.img = 'dcloud2.png'
      }
    })

    data.value = raw
  }
}
