// @ts-check
const fs = require('fs')
const path = require('path')
const { genApiIndex } = require('../../scripts/genApiIndex')
const { genExamplesData } = require('../../scripts/genExamplesData')
const { genTutorialData } = require('../../scripts/genTutorialData')
const { headerPlugin } = require('./headerMdPlugin')

const nav = [
  {
    text: '文档',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      {
        items: [
          { text: '指引', link: '/guide/introduction' },
          { text: '教程', link: '/tutorial/' },
          { text: '范例', link: '/examples/' },
          { text: '快速开始', link: '/guide/quick-start' },
          { text: '风格指南', link: '/style-guide/' }
        ]
      }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: 'Playground',
    link: 'https://sfc.vuejs.org'
  },
  {
    text: '生态系统',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: '资源',
        items: [
          { text: '合作伙伴', link: '/ecosystem/partners' },
          { text: '主题', link: '/ecosystem/themes' },
          { text: '视频课程', link: '/ecosystem/video-courses' },
          { text: '工作', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'T-Shirt 商店', link: 'https://vue.threadless.com/' }
          // TODO should start a separate branch for Vue 3?
          // {
          //   text: 'Awesome Vue',
          //   link: 'https://github.com/vuejs/awesome-vue'
          // }
        ]
      },
      {
        text: '帮助',
        items: [
          { text: 'Chat', link: 'https://discord.com/invite/HBherRA' },
          { text: '论坛', link: 'https://forum.vuejs.org/' },
          { text: 'DEV Community', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: 'News',
        items: [
          { text: '博客', link: 'https://blog.vuejs.org/' },
          { text: 'Twitter', link: 'https://twitter.com/vuejs' },
          { text: '新闻', link: 'https://news.vuejs.org/' },
          { text: '大事件', link: 'https://events.vuejs.org/' }
        ]
      }
    ]
  },
  {
    text: '关于',
    activeMatch: `^/about/`,
    items: [
      {
        items: [
          { text: 'FAQ', link: '/about/faq' },
          { text: '团队', link: '/about/team' },
          { text: 'Releases', link: '/about/releases' },
          {
            text: '贡献指南',
            link: '/about/contribution-guide'
          },
          { text: '行为准则', link: '/about/coc' }
        ]
      }
    ]
  },
  {
    text: '赞助者',
    link: '/sponsor/'
  }
]

const sidebar = {
  '/guide/': [
    {
      text: '开始',
      items: [
        { text: '简介', link: '/guide/introduction' },
        {
          text: '快速开始',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: '概要',
      items: [
        {
          text: '创建一个应用',
          link: '/guide/essentials/application'
        },
        {
          text: '模板语法',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: '响应式基础',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        { text: '计算属性', link: '/guide/essentials/computed' },
        {
          text: '类与样式绑定',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: '条件渲染',
          link: '/guide/essentials/conditional'
        },
        { text: '列表渲染', link: '/guide/essentials/list' },
        { text: '事件处理', link: '/guide/essentials/event-handling' },
        { text: '表单输入绑定', link: '/guide/essentials/forms' },
        {
          text: '生命周期',
          link: '/guide/essentials/lifecycle'
        },
        { text: '监听器', link: '/guide/essentials/watchers' },
        { text: '模板 ref', link: '/guide/essentials/template-refs' },
        {
          text: '组件基础',
          link: '/guide/essentials/component-basics'
        }
      ]
    },
    {
      text: '深入组件',
      items: [
        {
          text: '注册',
          link: '/guide/components/registration'
        },
        { text: 'Props', link: '/guide/components/props' },
        { text: '透传 Attributes', link: '/guide/components/attrs' },
        { text: '事件', link: '/guide/components/events' },
        { text: '插槽', link: '/guide/components/slots' },
        {
          text: 'Provide / inject',
          link: '/guide/components/provide-inject'
        },
        {
          text: '异步组件',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: '可重用性',
      items: [
        {
          text: 'Composables',
          link: '/guide/reusability/composables'
        },
        {
          text: 'Custom Directives',
          link: '/guide/reusability/custom-directives'
        },
        { text: 'Plugins', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: '内置组件',
      items: [
        { text: 'Transition', link: '/guide/built-ins/transition' },
        { text: 'TransitionGroup', link: '/guide/built-ins/transition-group' },
        { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        { text: 'Teleport', link: '/guide/built-ins/teleport' },
        { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: '升级规模',
      items: [
        { text: '单文件组件', link: '/guide/scaling-up/sfc' },
        { text: '工具链', link: '/guide/scaling-up/tooling' },
        { text: '路由', link: '/guide/scaling-up/routing' },
        {
          text: '状态管理',
          link: '/guide/scaling-up/state-management'
        },
        { text: '测试', link: '/guide/scaling-up/testing' },
        { text: 'TypeScript', link: '/guide/scaling-up/typescript' }
      ]
    },
    {
      text: '最佳实践',
      items: [
        {
          text: '生产部署',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: '性能',
          link: '/guide/best-practices/performance'
        },
        {
          text: '安全',
          link: '/guide/best-practices/security'
        },
        {
          text: '可访问性 A11y',
          link: '/guide/best-practices/accessibility'
        }
      ]
    },
    {
      text: '进阶指南',
      items: [
        {
          text: '使用 Vue 的多种方式',
          link: '/guide/advanced/ways-of-using-vue'
        },
        {
          text: '深入响应式系统',
          link: '/guide/advanced/reactivity-in-depth'
        },
        {
          text: '组合式 API FAQ',
          link: '/guide/advanced/composition-api-faq'
        },
        {
          text: '渲染机制',
          link: '/guide/advanced/rendering-mechanism'
        },
        {
          text: '渲染函数 & JSX',
          link: '/guide/advanced/render-function'
        },
        {
          text: '服务端渲染',
          link: '/guide/advanced/server-side-rendering'
        },
        {
          text: 'Vue and Web Components',
          link: '/guide/advanced/web-components'
        },
        // {
        //   text: '为 Vue 构建一个库',
        //   link: '/guide/advanced/building-a-library'
        // },
        // {
        //   text: '动画进阶',
        //   link: '/guide/advanced/animation'
        // }
        // {
        //   text: 'Vue for React 开发者',
        //   link: '/guide/advanced/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: '全局 API',
      items: [
        { text: '引用', link: '/api/application' },
        {
          text: '概要',
          link: '/api/general'
        }
      ]
    },
    {
      text: '组合式 API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: '响应式: 核心',
          link: '/api/reactivity-core'
        },
        {
          text: '响应式: 进阶',
          link: '/api/reactivity-advanced'
        },
        {
          text: '响应式: 工具',
          link: '/api/reactivity-utilities'
        },
        {
          text: '生命周期钩子',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: '依赖注入',
          link: '/api/composition-api-dependency-injection'
        }
      ]
    },
    {
      text: '选项式 API',
      items: [
        { text: '状态选项', link: '/api/options-state' },
        { text: '渲染选项', link: '/api/options-rendering' },
        {
          text: '生命周期选项',
          link: '/api/options-lifecycle'
        },
        {
          text: '组合选项',
          link: '/api/options-composition'
        },
        { text: '其他杂项', link: '/api/options-misc' },
        {
          text: '组件实例',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: '内置内容',
      items: [
        { text: '指令', link: '/api/built-in-directives' },
        { text: '组件', link: '/api/built-in-components' },
        {
          text: '特殊 Attributes',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: '单文件组件',
      items: [
        { text: '语法定义', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: '<style> 功能', link: '/api/sfc-style' }
      ]
    },
    {
      text: '进阶 APIs',
      items: [
        { text: '渲染函数', link: '/api/render-function' },
        { text: '服务端渲染', link: '/api/ssr' },
        { text: 'TypeScript 工具类', link: '/api/utility-types' },
        { text: '自定义渲染', link: '/api/custom-renderer' }
      ]
    }
  ],
  '/examples/': [
    {
      text: '基础',
      items: [
        {
          text: '你好，世界',
          link: '/examples/#hello-world'
        },
        {
          text: '处理用户输入',
          link: '/examples/#handling-input'
        },
        {
          text: 'Attribute 绑定',
          link: '/examples/#attribute-bindings'
        },
        {
          text: '条件与循环',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: '表单绑定',
          link: '/examples/#form-bindings'
        },
        {
          text: '简单组件',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: '实战',
      items: [
        {
          text: 'Markdown 编辑器',
          link: '/examples/#markdown'
        },
        {
          text: '获取数据',
          link: '/examples/#fetching-data'
        },
        {
          text: '带有排序和过滤器的网格',
          link: '/examples/#grid'
        },
        {
          text: '树状视图',
          link: '/examples/#tree'
        },
        {
          text: 'SVG 图像',
          link: '/examples/#svg'
        },
        {
          text: '带过渡动效的模态框',
          link: '/examples/#modal'
        },
        {
          text: '带过渡动效的列表',
          link: '/examples/#list-transition'
        },
        {
          text: 'TodoMVC',
          link: '/examples/#todomvc'
        }
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: '7 GUIs',
      items: [
        {
          text: '计数器',
          link: '/examples/#counter'
        },
        {
          text: '温度转换器',
          link: '/examples/#temperature-converter'
        },
        {
          text: '机票预订',
          link: '/examples/#flight-booker'
        },
        {
          text: '计时器',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: '画圆',
          link: '/examples/#circle-drawer'
        },
        {
          text: '单元格',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/tutorial/': [
    {
      text: 'Tutorial',
      items: [
        {
          text: '1. Adding Data',
          link: '/tutorial/#step-1'
        },
        {
          text: '2. Two-way Binding',
          link: '/tutorial/#step-2'
        }
      ]
    }
  ]
}

genApiIndex(sidebar['/api/'])
genExamplesData()
genTutorialData()

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  // @ts-ignore
  extends: require('@vue/theme/config'),
  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      exclude: ['@vue/repl']
    },
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  },

  lang: 'zh-CN',
  title: 'Vue.js',
  description: 'Vue.js - 渐进式的 JavaScript 框架',

  head: [
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/restorePreference.js'),
        'utf-8'
      )
    ]
  ],

  markdown: {
    config(md) {
      md.use(headerPlugin)
    }
  },

  themeConfig: {
    logo: '/logo.svg',
    repo: 'vuejs/docs',

    algolia: {
      indexName: 'vuejs-v3',
      appId: 'BH4D9OD16A',
      apiKey: 'bc6e8acb44ed4179c30d0a45d6140d3f'
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },

    socialLinks: [
      { icon: 'languages', link: '/translations/' },
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/HBherRA' }
    ],

    nav,
    sidebar,

    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: 'Copyright © 2014-2021 Evan You'
    }
  }
}
