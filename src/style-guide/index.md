---
outline: deep
---

# 编码指南 {#style-guide}

这是Vue特定代码的官方风格指南。如果你在一个项目中使用Vue，这是一个很好的参考，可以避免错误，bikeshedding和反模式。然而，我们并不认为任何风格指南都是所有团队或项目的理想选择，因此我们鼓励根据过去的经验、周围的技术堆栈和个人价值观来考虑偏差。

在大多数情况下，我们也避免了关于JavaScript或HTML的建议。我们不介意您使用逗号或尾随逗号。我们不介意HTML对属性值使用单引号还是双引号。然而，也存在一些例外，我们发现特定的模式在Vue的上下文中是有帮助的。

最终，我们将规范内容分为四个部分：

## 规则分类{#rule-categories}

### 优先级A：必须的规则{#priority-a-essential-error-prevention}

这些规则有助于防止错误，因此不惜一切代价学习并遵守它们。可能存在例外，但应该非常罕见，只有那些对JavaScript和Vue的专业知识的人才能做到。

* [查看所有优先级A的规则](https://cn.vuejs.org/style-guide/rules-essential.html)。



### 优先级B：强烈推荐的规则{#priority-b-strongly-recommended} 

已经发现这些规则可以提高大多数项目中的可读性和/或开发人员的经验。如果您违反它们，您的代码仍将运行，但是违规应该罕见且完善。

* [查看所有优先级B的规则](https://cn.vuejs.org/style-guide/rules-strongly-recommended.html)。



### 优先级C：推荐规则{#priority-c-recommended}

如果存在多个同样好的选项，则可以做出任意选择以确保一致性。在这些规则中，我们描述了每个可接受的选项，并提出一个默认选择。这意味着您可以随意在自己的代码库中做出不同的选择，只要您保持一致并且有充分的理由。请有充分的理由！通过适应社区标准，您将：

1. 训练您的大脑更轻松地解析您遇到的大多数社区代码

2. 能够在不修改的情况下复制和粘贴大多数社区代码示例

3. 通常发现新员工已经习惯了您喜欢的编码样式，至少在Vue方面

* [查看所有优先级C的规则](https://cn.vuejs.org/style-guide/rules-recommended.html)。



### 优先级D：谨慎使用的规则{#priority-d-use-with-caution}

存在VUE的某些功能，可以容纳稀有边缘案例或从传统代码基础上迁移。但是，当过度使用时，它们可以使您的代码更难维护甚至成为错误的来源。这些规则阐明了潜在的风险特征，描述了何时以及为什么要避免它们。

- [查看所有优先级D的规则](./rules-use-with-caution)。
