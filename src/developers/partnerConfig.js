import partnerData from '../partners/partners.json'

const partnerName = 'Proxify'
const partner = partnerData.find(partner => partner.name === partnerName)

const websiteLabel = 'proxify.io'
const websiteUrl = 'https://proxify.io/'
const applyUrl = 'https://career.proxify.io/apply'
const hireUrl = 'https://proxify.io/hire-vuejs'
const vueArticleUrl = 'https://proxify.io/hire-vue-developers'
const imageStorageUrl = 'https://res.cloudinary.com/proxify-io/image/upload'

const partnerConfig = {
  // Partner information
  partnerName: partner?.name,
  logo: partner?.logo,
  flipLogo: partner?.flipLogo || false,

  // Partner website
  websiteUrl: websiteUrl,
  hireUsButtonUrl: hireUrl,

  // Image storage URL
  imageStorageUrl: imageStorageUrl,

  // Hero Section
  pageHeroBanner: {
    title: '为你的团队寻找顶级的 Vue.js 开发者',
    description1: '访问可用于你的下一个项目的经过认证的 Vue.js 开发者',
    description2: 'Proxify 负责筛选过程，以确保顶级的质量和可靠性',
    hireButton: {
      url: hireUrl,
      label: '立即寻找 Vue.js 开发者'
    },
    footer: '在不到 48 小时内与顶级 Vue.js 开发者匹配'
  },

  // Hero Section
  pageJoinSection: {
    title: '成为一名注册开发者',
    description: '获得一个长期的兼职或全职职位，适合正在寻找 Vue.js 开发者的公司',
    applyButton: {
      url: applyUrl,
      label: '申请加入'
    }
  },

  // Footer Configuration
  pageFooter: {
    text: `This highly vetted developer is brought to you by Vue’s partner:`,
    email: 'vue@proxify.io',
    phone: '+44 20 4614 2667',
    websiteVueLink: vueArticleUrl,
    websiteVueLabel: websiteLabel + '/hire-vue-developers'
  },

  // Diagram sections
  profileDiagram: {
    title: 'Candidate profile',
    prependText: 'How our developers score in the parameters that correlate best with future success in the role.'
  },

  scoreDiagram: {
    title: 'Engineering excellence score',
    prependText: 'The practical score range is 0 to 300. This is the distribution of scores for all evaluated Vue.js developers, and here’s where your candidate scored.',
    appendText: 'Data from 3,661 evaluated Vue.js developers and 38,008 applicants.'
  },

  // Proficiency Section
  proficiencies: {
    skillsPerCard: 5
  }
}

export default partnerConfig
