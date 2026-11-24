# 任务跟踪：GitHub

本项目的任务和需求规格存放在 https://github.com/moxi-2534/Captcha-Labeling 的 GitHub Issues 中。
使用 `gh` 命令行工具操作。在 WSL 中，如果 `gh` 不可用，使用 `gh.exe`。
任务标题、正文、评论和面向用户的说明使用中文；命令、路径、标识符和标签名保留原样。

## 常用操作

- 每次会话首次创建任务前，用 `gh repo view --json nameWithOwner` 检查目标仓库。预期为 `moxi-2534/Captcha-Labeling`。目标不符时，先确认再创建。
- skill 要求“发布到任务系统”时，创建 GitHub Issue。
- 创建任务：`gh issue create --repo moxi-2534/Captcha-Labeling --title "标题" --body-file <正文文件>`。
- 多行正文或评论先写入临时文件，再通过 `--body-file` 传入，保留实际换行。
- 读取任务：`gh issue view <编号> --json number,title,body,labels,comments`。
- 列出任务：`gh issue list --state open --json number,title,body,labels,comments`，按需添加 `--label` 或调整 `--state`。
- 添加标签：`gh issue edit <编号> --add-label <标签>`。
- 删除标签：`gh issue edit <编号> --remove-label <标签>`。
- 添加评论：`gh issue comment <编号> --body-file <评论文件>`。
- 关闭任务：先用评论说明处理结果，再执行 `gh issue close <编号>`。对于已关闭的任务，也单独发布评论，避免说明被忽略。

## 父子任务与阻塞关系

优先使用 GitHub 原生子任务和任务依赖关系。使用依赖 CLI 版本的参数前，检查已安装版本的帮助信息。

也可以使用 `gh api`：

- 添加子任务：向 `repos/moxi-2534/Captcha-Labeling/issues/<父任务编号>/sub_issues` 发起 POST，使用 `-F sub_issue_id=<子任务数据库ID>`。
- 添加阻塞任务：向 `repos/moxi-2534/Captcha-Labeling/issues/<被阻塞任务编号>/dependencies/blocked_by` 发起 POST，使用 `-F issue_id=<阻塞任务数据库ID>`。
- 获取数据库 ID：`gh api repos/moxi-2534/Captcha-Labeling/issues/<编号> --jq .id`。这里需要数字数据库 ID，而非任务编号或 node_id。
- 查询未关闭的阻塞数量：`gh api repos/moxi-2534/Captcha-Labeling/issues/<编号> --jq .issue_dependencies_summary.blocked_by`。

原生关系不可用时，在子任务正文开头使用 `Part of #<父任务编号>` 和 `Blocked by: #<编号>` 表示关系，并在父任务中维护任务列表。所有阻塞任务关闭后，该任务才能开始。

## 将拉取请求作为需求入口

PRs as a request surface: no.

当前不将外部拉取请求纳入需求分诊队列。上面的固定字段供 triage skill 读取。

## 大型项目的决策地图

供 `/wayfinder` 使用：

- 地图是一个带有 `wayfinder:map` 标签的任务，正文记录笔记、已确定的决策和尚未明确的问题。
- 决策票作为地图的子任务，按类型使用 `wayfinder:research`、`wayfinder:prototype`、`wayfinder:grilling` 或 `wayfinder:task` 标签。使用前创建缺少的标签。
- 子任务不可用时，在地图中维护任务列表，并在子任务中添加 `Part of #<地图编号>`。
- 按地图顺序选择未被认领且所有阻塞均已关闭的任务。
- 使用 `gh issue edit <编号> --add-assignee @me` 认领任务。
- 解决后发布结论评论，关闭任务，再将结论摘要及任务链接补充到地图的已确定决策中。
