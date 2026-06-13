# 术语翻译约定

## 英文术语翻译对照表

| 英文                         | 建议翻译                                                          |
| ---------------------------- | ----------------------------------------------------------------- |
| attribute                    | _不翻译_                                                          |
| breaking                     | "非兼容"或"不兼容"                                                |
| build (n.)                   | 构建版本                                                          |
| build (v.)                   | 构建                                                              |
| caveats                      | 注意事项                                                          |
| class                        | JS 中译为"类"，CSS 中不翻译                                       |
| computed                     | 计算属性                                                          |
| computed property            | 计算属性                                                          |
| convention                   | 约定                                                              |
| declarative                  | 声明式                                                            |
| directive                    | 指令                                                              |
| drilling                     | 逐级透传                                                          |
| effect scope                 | effect 作用域                                                     |
| emit (a value)               | 抛出                                                              |
| emit/fire/trigger (an event) | 触发                                                              |
| feature/functionality        | 功能                                                              |
| fetch                        | 获取                                                              |
| first-class                  | 一等公民                                                          |
| getter                       | _不翻译_                                                          |
| guard                        | 守卫                                                              |
| handler                      | 处理函数                                                          |
| hoist/hoisting               | 提升/变量提升                                                     |
| hook                         | 钩子                                                              |
| hydrate                      | 激活                                                              |
| immutable                    | 不可变                                                            |
| imperative                   | 命令式                                                            |
| in-DOM                       | DOM 内                                                            |
| local                        | 和 global 对应用"局部"，和 remote 对应用"本地"                    |
| listen/listener              | 监听/监听器                                                       |
| mixin                        | _不翻译_                                                          |
| mutable                      | 可变                                                              |
| mutate/mutation              | 变更                                                              |
| normalize (HTML code, ...)   | 规范化                                                            |
| observe/observer             | 侦听/侦听器                                                       |
| parse                        | 解析                                                              |
| playground                   | 演练场                                                            |
| prop                         | _不翻译_                                                          |
| property                     | 指代 DOM property 强调和 attribute 的区分时不翻译，其他译为"属性" |
| queue (v.)                   | 把……加入队列                                                      |
| render                       | 渲染                                                              |
| reactive                     | 响应式                                                            |
| reactivity                   | 响应性                                                            |
| ref                          | _不翻译_                                                          |
| selector                     | 选择器                                                            |
| setter                       | _不翻译_                                                          |
| shadow (DOM/root)            | 影子 (影子 DOM/影子根)                                            |
| side effect                  | 副作用                                                            |
| slot                         | 插槽                                                              |
| slot outlet                  | 出口                                                              |
| standardize                  | 标准化                                                            |
| stringify                    | 字符串化                                                          |
| strong identity comparisons  | 严格比对                                                          |
| stub                         | 测试替身                                                          |
| teleport                     | _不翻译_                                                          |
| truthy, falsy, truthiness    | _不翻译，保留英文，加 MDN 解释作为译注_                           |
| type (v.)                    | 标注类型                                                          |
| watch/watcher                | 侦听/侦听器                                                       |
| workaround (n.)              | 变通办法                                                          |
| workaround (v.)              | 绕过                                                              |
| wrap/unwrap                  | 包装/解包                                                         |
| you                          | 你（不用"您"）                                                    |
| hydration                    | 激活                                                              |
| dist file                    | 构建文件                                                          |
| template ref                 | 模版引用                                                          |
| nullable                     | 可为 null 的                                                      |

> truthy: https://developer.mozilla.org/en-US/docs/Glossary/Truthy
> falsy: https://developer.mozilla.org/en-US/docs/Glossary/Falsy

## API 名词与产品/品牌名称保留英文

- **CSS Modules** — 产品/品牌名称，保留英文及复数形式。原文用自然语言"a CSS module"时译为"一个 CSS 模块"。
- **effect** — 特指 effect scope 时保留英文，即"effect 作用域"；一般语境译为"作用"，如"side effect"译为"副作用"。
- **proxy** — 仅大写特指 ES6 Proxy 对象时保留英文"Proxy"，其他译为"代理"。
- **tree-shaking** 及相关语法变换 — 保留英文，动词用"tree-shake"，名词用"tree-shaking"。
- **webpack**、**npm** 等刻意小写的产品名称 — 保持开头小写，即使作为句子第一个词。
- **web component(s)** — 保留英文。

## 保留英文术语清单

- attribute
- getter
- mixin
- prop(s)
- ref
- setter
- teleport

## 保留英文的单复数规则

中文翻译中夹带的英文一律用单数形式：

- children → child
- properties → property

特例：

- **props** — 除非语境特指单一 prop，否则统一用复数 props
- **透传 Attributes** — 同理

## 中文术语约定

| 中文      | 约定写法     |
| --------- | ------------ |
| 应用程序  | 应用         |
| 开发人员  | 开发者       |
| 其他/其它 | 统一为"其他" |
| 举个例子  | 举例来说     |

## MDN 前端术语处理

1. 优先参考 MDN 中文译法；无中文译法则保留英文。
2. 原文的 MDN 链接：
   - 若 MDN 有对应中文翻译，可转为中文链接。
   - 否则保持英文原链接。

## 英文缩写处理

1. 大众熟悉的日常缩写（HTML、DOM 等）保留。
2. Vue 本身创造的缩写（SFC、VOA、VCA 等）译为中文，首次出现时可选附英文缩写。
