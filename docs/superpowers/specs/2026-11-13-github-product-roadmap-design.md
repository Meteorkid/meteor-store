# GitHub 产品开发路线图设计

> 日期：2026-11-13

## 目标

为个人账号 `Meteorkid` 创建一个跨仓库 GitHub Project，集中管理 XIsland、XNook、Ex-Memory 与 Meteor Store 的开发事项。项目面向个人开发流程，不依赖组织或团队；未来可以按需增加协作者。

## Project

- 名称：`产品开发路线图`
- 所有者：个人账号 `Meteorkid`
- 可见性：公开
- 初始状态：开放

## 字段

### Status

使用 GitHub Project 内置状态字段，选项按以下顺序配置：

1. `Backlog`
2. `开发中`
3. `测试中`
4. `已发布`

所有首次导入且没有状态的事项进入 `Backlog`。

### 所属产品

单选字段，选项为：

- `Meteor Store`
- `XIsland`
- `XNook`
- `Ex-Memory`

导入时根据事项所属仓库自动填写。

### 优先级

单选字段，选项为：

- `P0 紧急`
- `P1 高`
- `P2 中`
- `P3 低`

已有事项没有足够信息推断优先级时保持空白，避免自动制造错误优先级。

### 目标版本

文本字段。已有 Issue 或 PR 没有明确里程碑或版本信息时保持空白。

## 视图

保留一个主看板视图，名称为 `产品路线图`：

- 布局：Board
- 分组：Status
- 排序：优先级升序；未设置优先级的事项排在已设置事项之后
- 显示字段：所属产品、优先级、目标版本

GitHub 自动创建的 Table 视图可以保留，用于批量编辑字段。

## 初始导入

扫描以下仓库的全部开放 Issue 与开放 Pull Request：

- `Meteorkid/meteor-store`
- `Meteorkid/XIsland`
- `Meteorkid/XNook`
- `Meteorkid/ex-memory`

导入规则：

- Issue 与 PR 均作为真实仓库事项加入，不复制为草稿。
- 同一事项只导入一次。
- Status 默认设为 `Backlog`。
- 所属产品按仓库映射填写。
- 已关闭 Issue、已关闭 PR 与已合并 PR 本次不导入。
- 当前没有开放事项的仓库仍保留所属产品选项，后续可直接使用。

## 权限与执行

当前 GitHub CLI 令牌缺少 `project` / `read:project` scope。执行前通过 GitHub 官方 OAuth 流程补充权限，不创建或保存新的长期 Token，也不把凭据写入仓库或日志。

执行完成后验证：

- Project 属于 `Meteorkid`，名称和可见性正确。
- 四个字段及其选项完整且顺序正确。
- 导入数量与四个仓库的开放 Issue/PR 数量一致。
- 每个导入事项的所属产品和默认 Status 正确。
- 没有导入关闭事项或重复事项。

## 非目标

- 不创建组织或团队。
- 不修改仓库权限、分支保护、Issue、PR 或里程碑内容。
- 不自动给已有事项猜测优先级或目标版本。
- 不创建额外 Project，也不为每个仓库建立独立看板。
