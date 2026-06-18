# Vue.js 中文文档自动同步 PR 工作流

本文档介绍 `tedocs/docs-zh-cn` 仓库的自动化同步流程，包括上游同步、冲突检测、Copilot CLI 翻译、PR 和 Review。

## 流程总览

![同步工作流](sync-workflow.svg)

## 本流程是做什么的？

当前同步上游仓库 `vuejs/docs`，是基于自动 `autosync.yml` 的 workflow 同步英文仓库到 `upstream` 分支，然后将 `upstream` 合并到 `sync` 分支，在 `sync` 分支解决合并的冲突、翻译后，将 `sync` 分支通过 PR 合并到 `main` 分支。

此时，社区可以在 PR 中 review，比如：[Sync #31b4521a](https://github.com/vuejs-translations/docs-zh-cn/pull/1113)，在将 `upstream` 合并到 `sync` 分支和冲突过程，往往需要维护者耗费大量的时间精力成本在本地分支解决。

为此，`autopr.yml` 提出的方案是，基于 Github Actions 自动来处理这个过程，并实现：分支预处理——>解决冲突——>翻译——>发起 PR，可以设置为每周执行一次，或者维护者手动在 Github Actions 手动触发 `autopr.yml`，仅需点一下，自动完成整个流程。

![compare-sync-arch](compare-sync-arch.svg)

### 分支说明

| 分支       | 用途                                                    |
|------------|---------------------------------------------------------|
| `main`     | 主分支，用于发布和日常开发                               |
| `upstream` | 上游 `vuejs/docs:main` 的镜像，每日自动同步              |
| `sync`     | 翻译工作分支，合并上游变更后翻译，最终通过 PR 合并到 main |

## `autopr.yml` 如何工作？

### 第一步 (已有)：自动同步上游 (autosync.yml)

**触发方式**： 每日 00:00 自动执行 / 手动触发

**流程：**

1. 使用 `github-forks-sync-action` 拉取 `vuejs/docs:main` 的最新内容
2. 推送到 `vuejs-translations/docs-zh-cn:upstream` 分支
3. 纯镜像同步，不做任何翻译

```
vuejs/docs:main ──autosync.yml──→ vuejs-translations:upstream
```

### 第二步 (新增)：检测、合并、翻译、提交、发 PR (autopr.yml)

**触发方式**：每周一 03:17 UTC 自动执行 / [手动触发](/actions)

单 runner 串行执行 6 个 JS 脚本：

```
┌─────────────────────────────┐
│ 1-detect-changes-job.js     │
└──────────┬──────────────────┘
           │
     ┌─────┴─────┐
     │ has_changes│
     │  no_changes│──→ 结束
     └─────┬─────┘
           ▼
┌─────────────────────────────┐
│ 2-merge-job.js              │
└──────────┬──────────────────┘
           ▼
┌─────────────────────────────┐
│ 3-translate-job.js          │←── translation-prompt.md
└──────────┬──────────────────┘
           ▼
┌─────────────────────────────┐
│ 4-apply-job.js              │
└──────────┬──────────────────┘
           ▼
┌─────────────────────────────┐
│ 5-collect-merge-info.js     │
└──────────┬──────────────────┘
           ▼
┌─────────────────────────────┐
│ commit + push               │
└──────────┬──────────────────┘
           ▼
┌─────────────────────────────┐
│ 6-create-pr-and-review.js   │
└─────────────────────────────┘
```

#### `1-detect-changes-job.js` — 前置过滤

- `git rev-list --count origin/sync..origin/upstream` 判断有无新提交
- `git diff --name-only` 检出变更的 `.md` 文件列表
- 输出 `upstream_hash`、`changed_files`
- 无变更时输出 `merge_result=no_changes`，整个流程终止

#### `2-merge-job.js` — 冲突解决

- `git merge origin/upstream` 触发合并
- 解析冲突标记，按策略处理：
  - `pnpm-lock.yaml` → 整文件接受 incoming
  - `package.json`、`*.vue`、`*.ts`、`*.json` → 解析标记，只替换冲突块
  - `.md` 文件 → 逐块解析，记录 ours/theirs 到 `todo-translation.json`
- 解决后 `git add` 暂存

#### `3-translate-job.js` — Copilot CLI 翻译

- 读取 `todo-translation.json`
- 加载 `translation-prompt.md` 模板，注入翻译约定 (terminology.md、formatting.md、guidelines.md)，详见 `vuejs-docs-zh-cn` skill。
- 过滤 identical 条目 (`incoming === current`)，仅翻译有差异的条目
- 根据 `TRANSLATE_MODE` 环境变量选择模式 (默认 `all`)，调用 `copilot -p "..." --allow-all -s` 翻译 EN→ZH
- 输出 `done-translation.json`
- 翻译失败时设置 `translate_status=failed`，由下游 gate 拦截

#### `4-apply-job.js` — 应用翻译

- 读取 `done-translation.json`
- 按文件分组，按行号倒序替换，避免索引偏移

#### `5`-collect-merge-info.js` — 收集真实结果

- 读取 `todo-translation.json` 提取实际冲突文件列表
- `git diff HEAD` 收集实际变更文件
- 输出 `merge_result` (conflict/clean)、`conflict_files`、`changed_files`

#### `6-create-pr-and-review.js` — 发起 PR + Review

- `gh pr list` 检查是否已有 open PR (有则复用，避免重复创建)
- `gh pr create` 创建 PR：
  - title: `Sync(autopr) #<hash> — upstream merge & translate`
  - body：包含 upstream hash、merge result、upstream diff 链接、冲突文件列表、翻译文件列表
  - labels：`从英文版同步`、`请使用 merge commit 合并`
- GitHub API 请求 `copilot-pull-request-reviewer[bot]` review
- 发表评论要求检查：翻译准确性、无意外变更、markdown 格式完整性、代码块和链接完整性

## Secrets 配置

| Secret 名称            | 用途                                                          |
|------------------------|---------------------------------------------------------------|
| `GITHUB_TOKEN`    | Classic PAT，用于 checkout、push、创建 PR/Issue、请求 review      |
| `COPILOT_TOKEN` | Fine-Grained PAT，Copilot CLI 认证（需 "Copilot Requests" 权限） |

## 翻译约定

- [主约定](../../../.claude/skills/vuejs-docs-zh-cn/SKILL.md)
- [术语翻译约定](../../../.claude/skills/vuejs-docs-zh-cn/references/terminology.md)
- [文本格式](../../../.claude/skills/vuejs-docs-zh-cn/references/formatting.md)
- [翻译指南](../../../.claude/skills/vuejs-docs-zh-cn/references/guidelines.md)

## 特殊说明

### 翻译模式

通过环境变量 `TRANSLATE_MODE` 控制，默认 `all`。

| 模式   | 行为                                      | 适用场景                   |
|--------|-------------------------------------------|--------------------------|
| `all`  | 一次 Copilot CLI 调用翻译所有条目           | 条目少（<50），追求效率     |
| `file` | 按文件分组，每个文件一次调用                 | 条目较多，按文件粒度控制    |
| `item` | 每个条目单独一次调用                        | 大量变更，需要精确控制质量   |

[3-translate-job.js](3-translate-job.js) 会自动过滤 identical 条目 (`incoming === current`)，仅翻译有实际差异的条目，减少不必要的 Copilot CLI 调用。

如果出现大量变更导致 `todo-translation.json` 过大、Copilot CLI 处理失败，可切换到 `file` 或 `item` 模式解决。

### translation-prompt.md

[translation-prompt.md](translation-prompt.md) 是翻译的核心 prompt 模板，包含：

- 决策流程 (跳过判断 → 插入/替换策略)
- 翻译原则 (最小改动、术语准确、风格一致)
- 不需翻译的内容 (代码块、行内代码、URL、标识符等)
- 完整示例 (10 种典型场景)

模板中的 `{{TERMINOLOGY}}`、`{{FORMATTING}}`、`{{GUIDELINES}}`、`{{ITEMS}}` 占位符由 3-translate-job.js 运行时替换。

### 翻译失败 Gate

工作流内置了翻译失败保护机制：

- [3-translate-job.js](3-translate-job.js) 设置 `continue-on-error: true`，翻译失败不会立即终止 workflow
- 下游 `Check translation status` 步骤检查翻译结果，失败时阻断 PR 创建
- 手动触发时可通过 `skip_translate_gate: true` 跳过此检查 (用于测试)

### sync 分支仍需手动处理

- [ ] 后续考虑采用 ci 的方式来完成，预计 `sync->main` 仍需人为处理

### 保留手动 sync 的方式

为了避免预期之外的因素导致 `autopr.yml` 的方式失败，目前仍保留手动合并同步的方式，请参考 `pnpm run sync`。

## 特别感谢

在 `vuejs-translations/docs-zh-cn` 项目中，Github Copilot 额度由 [@Justineo](https://github.com/Justineo) 友情赞助。
