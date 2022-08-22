<script lang="ts">
const shuffleMembers = (members: Member[], pinTheFirstMember = false): void => {
  let offset = pinTheFirstMember ? 1 : 0
  // `i` is between `1` and `length - offset`
  // `j` is between `0` and `length - offset - 1`
  // `offset + i - 1` is between `offset` and `length - 1`
  // `offset + j` is between `offset` and `length - 1`
  let i = members.length - offset
  while (i > 0) {
    const j = Math.floor(Math.random() * i);
    [
      members[offset + i - 1],
      members[offset + j]
    ] = [
      members[offset + j],
      members[offset + i - 1]
    ]
    i--
  }
}
</script>

<script setup lang="ts">
import { VTLink } from '@vue/theme'
import membersCoreData from './members-core.json'
import membersEmeritiData from './members-emeriti.json'
import membersPartnerData from './members-partner.json'
import TeamHero from './TeamHero.vue'
import TeamList from './TeamList.vue'
import type { Member } from './Member'
shuffleMembers(membersCoreData as Member[], true)
shuffleMembers(membersEmeritiData as Member[])
shuffleMembers(membersPartnerData as Member[])
</script>

<template>
  <div class="TeamPage">
    <TeamHero>
      <template #title>认识团队</template>
      <template #lead>Vue 及其生态系统发展的背后是一个国际化的团队，以下是部分团员的个人信息。</template>

      <template #action>
        <VTLink href="https://github.com/vuejs/governance/blob/master/Team-Charter.md">了解更多团队信息</VTLink>
      </template>
    </TeamHero>

    <TeamList :members="membersCoreData as Member[]">
      <template #title>核心团队成员</template>
      <template #lead>核心团队成员是那些积极参与维护一个或多个核心项目的人。他们对 Vue 的生态系统做出了重大贡献，并对项目及其用户的成功做出了长期的承诺。</template>
    </TeamList>

    <TeamList :members="membersEmeritiData as Member[]">
      <template #title>名誉核心团队</template>
      <template #lead>我们在此致敬过去曾做出过突出贡献的不再活跃的团队成员。</template>
    </TeamList>

    <TeamList :members="membersPartnerData as Member[]">
      <template #title>社区伙伴</template>
      <template #lead>一些 Vue 的社区成员让这里变得更加丰富多彩，有必要在此特别提及。我们与这些主要合作伙伴建立了更加亲密的关系，经常与他们就即将到来的功能和新闻展开协作。</template>
    </TeamList>
  </div>
</template>

<style scoped>
.TeamPage {
  padding-bottom: 16px;
}

@media (min-width: 768px) {
  .TeamPage {
    padding-bottom: 96px;
  }
}

.TeamList + .TeamList {
  padding-top: 64px;
}
</style>
