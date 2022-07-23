import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'

const nav = [
  {
    text: '文档',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      { text: '指南', link: '/guide/introduction' },
      { text: '教程', link: '/tutorial/' },
      { text: '示例', link: '/examples/' },
      { text: '快速开始', link: '/guide/quick-start' },
      // { text: '风格指南', link: '/style-guide/' },
      {
        text: 'Vue 2 文档',
        link: 'https://v2.vuejs.org'
      },
      {
        text: '从 Vue 2 迁移',
        link: 'https://v3-migration.vuejs.org/'
      }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: '演练场',
    link: 'https://sfc.vuejs.org'
  },
  {
    text: '生态系统',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: '资源',
        items: [
          { text: '合作伙伴', link: '/partners/' },
          { text: '主题', link: '/ecosystem/themes' },
          { text: '工作', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'T-Shirt 商店', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: '核心库',
        items: [
          { text: 'Vue Router', link: 'https://router.vuejs.org/' },
          { text: 'Pinia', link: 'https://pinia.vuejs.org/' }
        ]
      },
      {
        text: '视频课程',
        items: [
          {
            text: 'Vue Mastery',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School',
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
          }
        ]
      },
      {
        text: '帮助',
        items: [
          {
            text: 'Discord 聊天室',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'GitHub 论坛',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'DEV Community', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: '动态',
        items: [
          { text: '博客', link: 'https://blog.vuejs.org/' },
          { text: 'Twitter', link: 'https://twitter.com/vuejs' },
          { text: '新闻', link: 'https://news.vuejs.org/' },
          { text: '活动', link: 'https://events.vuejs.org/' }
        ]
      }
    ]
  },
  {
    text: '关于',
    activeMatch: `^/about/`,
    items: [
      { text: '常见问题', link: '/about/faq' },
      { text: '团队', link: '/about/team' },
      { text: '版本发布', link: '/about/releases' },
      {
        text: '社区指南',
        link: '/about/community-guide'
      },
      { text: '行为准则', link: '/about/coc' },
      {
        text: '纪录片',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: '赞助者',
    link: '/sponsor/'
  },
  {
    text: '合作伙伴',
    link: '/partners/',
    activeMatch: `^/partners/`
  }
]

export const sidebar = {
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
      text: '基础',
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
        {
          text: '计算属性',
          link: '/guide/essentials/computed'
        },
        {
          text: '类与样式绑定',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: '条件渲染',
          link: '/guide/essentials/conditional'
        },
        { text: '列表渲染', link: '/guide/essentials/list' },
        {
          text: '事件处理',
          link: '/guide/essentials/event-handling'
        },
        { text: '表单输入绑定', link: '/guide/essentials/forms' },
        {
          text: '生命周期',
          link: '/guide/essentials/lifecycle'
        },
        { text: '侦听器', link: '/guide/essentials/watchers' },
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
        { text: 'Prop', link: '/guide/components/props' },
        { text: '事件', link: '/guide/components/events' },
        {
          text: '透传 Attribute',
          link: '/guide/components/attrs'
        },
        { text: '插槽', link: '/guide/components/slots' },
        {
          text: '依赖注入',
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
          text: '组合式函数',
          link: '/guide/reusability/composables'
        },
        {
          text: '自定义指令',
          link: '/guide/reusability/custom-directives'
        },
        { text: '插件', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: '内置组件',
      items: [
        { text: 'Transition', link: '/guide/built-ins/transition' },
        {
          text: 'TransitionGroup',
          link: '/guide/built-ins/transition-group'
        },
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
        {
          text: '服务端渲染 (SSR)',
          link: '/guide/scaling-up/ssr'
        }
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
          text: '无障碍访问',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: '安全',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: '总览', link: '/guide/typescript/overview' },
        {
          text: 'TS 与组合式 API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'TS 与选项式 API',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: '进阶主题',
      items: [
        {
          text: '使用 Vue 的多种方式',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: '组合式 API FAQ',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: '深入响应式系统',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: '渲染机制',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: '渲染函数 & JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue 与 Web Components',
          link: '/guide/extras/web-components'
        },
        {
          text: '动画技巧',
          link: '/guide/extras/animation'
        },
        {
          text: '响应性语法糖',
          link: '/guide/extras/reactivity-transform'
        }
        // {
        //   text: '为 Vue 构建一个库',
        //   link: '/guide/extras/building-a-library'
        // },
        // { text: 'Custom Renderers', link: '/guide/extras/custom-renderer' },
        // {
        //   text: 'Vue for React 开发者',
        //   link: '/guide/extras/vue-for-react-devs'
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
          text: '响应式: 工具',
          link: '/api/reactivity-utilities'
        },
        {
          text: '响应式: 进阶',
          link: '/api/reactivity-advanced'
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
          text: '特殊元素',
          link: '/api/built-in-special-elements'
        },
        {
          text: '特殊 Attribute',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: '单文件组件',
      items: [
        { text: '语法定义', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'CSS 功能', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: '进阶 API',
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
  '/style-guide/': [
    {
      text: 'Style Guide',
      items: [
        {
          text: 'Overview',
          link: '/style-guide/'
        },
        {
          text: 'A - Essential',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - Strongly Recommended',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - Recommended',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - Use with Caution',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  lang: 'zh-CN',
  title: 'Vue.js',
  description: 'Vue.js - 渐进式的 JavaScript 框架',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],
  scrollOffset: 'header',

  head: [
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'meta',
      {
        name: 'twitter:image',
        content: 'https://vuejs.org/images/logo.png'
      }
    ],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://sponsors.vuejs.org'
      }
    ],
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/restorePreference.js'),
        'utf-8'
      )
    ],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'XNOLWPLB',
        'data-spa': 'auto',
        defer: ''
      }
    ]
  ],

  themeConfig: {
    nav,
    sidebar,

    algolia: {
      indexName: 'vuejs',
      appId: 'ML0LEBN7FQ',
      apiKey: 'f49cbd92a74532cc55cfbffa5e5a7d01',
      searchParameters: {
        facetFilters: ['version:v3']
      }
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

    editLink: {
      repo: 'vuejs-translations/docs-zh-cn',
      text: '在 GitHub 上编辑此页'
    },

    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Copyright © 2014-${new Date().getFullYear()} Evan You`
    }
  },

  markdown: {
    config(md) {
      md.use(headerPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  },

  vue: {
    reactivityTransform: true
  }
})
