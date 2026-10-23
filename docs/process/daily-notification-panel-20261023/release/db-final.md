# 0050生产迁移后只读验收

检查时间：2026-10-23 23:24:39 北京时间（UTC 15:24:39.302）。

**结论：0050迁移后的账本、表结构、偏好记录数量和本次备份检查均通过。** 本分工未再次执行迁移、备份、R2上传或任何生产写入。

## 生产数据库

- 生产源码HEAD：`fc8db5e55f8d7fae3a7907a935caae9affbb458d`。
- PostgreSQL 18.6；本次连接强制并实测`transaction_read_only=on`。
- `drizzle.__drizzle_migrations`：**51行**，当前源码journal同为51条。
- 按顺序逐条核对原始SQL文件SHA256和journal.when，**51条全部匹配**。
- 最新条目：`0050_daily_panel_settings`；when=`1792760480288`；hash=`c7c9e5fe0c8db7955b95bc9b1c73441eb1e386e527b3feecb22f19b5386cc25c`，精确匹配。

| 列 | 类型 | 可空 | 默认值 |
|---|---|---|---|
| panel_settings | jsonb | YES | null（未设置默认值） |
| panel_updated_at | text | YES | null（未设置默认值） |

偏好仅查询聚合计数：daily_preferences共**1行**；panel_settings非空**0行**；panel_updated_at非空**0行**。未读取或输出user_id、channels、reminders、updated_at的具体值或任何账号信息。

## 迁移记录与旧字段保护

生产私有备份目录中的`migration-result.json`以及本地`deploy.log:119`一致：

```json
{"applied":true,"hash":"c7c9e5fe0c8db7955b95bc9b1c73441eb1e386e527b3feecb22f19b5386cc25c","when":1792760480288,"existingPreferencesUnchanged":true,"existingPreferenceRows":1,"newFieldsNull":true}
```

旧字段未变的证据来自迁移脚本在持有daily_preferences排他锁的同一事务内，对旧四字段聚合指纹做迁移前后比较并成功提交；本次postcheck只重复核对计数与元数据，没有重新输出或保存旧字段内容。

## 本次新备份

- 路径：`/root/meteor-daily-panel-release-20261023/database/meteor-store-20261023-232238.dump`。
- 大小：**504425字节**。
- SHA256：`5d8aedd88cd485d37bfb9a97d7687014828a64da97d5da3c5ef705c12aca2196`。
- 发布备份目录与database子目录均**700**，dump文件**600**。
- 只读`/usr/pgsql-18/bin/pg_restore --list`成功，共**38个TABLE DATA条目**。
- users、orders、posts、license_keys、daily_preferences及drizzle.__drizzle_migrations均存在于备份目录。

这证明dump目录可解析且关键表齐备；本次没有执行整库恢复演练，不把目录检查升级为实际恢复通过。

## R2已有回读日志

`/tmp/meteor-daily-release-20261023/deploy.log:10-13`记录本次备份完成，随后上传同名dump到R2私有发布桶的`db-backups/`前缀，并输出“493 KB，已回读校验”；本次过期删除0份。

核对`backup-to-r2.mjs:63-67`：只有`HeadObject.ContentLength === 本地文件大小`时才打印“已回读校验”。因此这份日志支持**本次上传后R2对象大小与504425字节本地备份一致**，不是对远端完整对象做SHA256或恢复验证。本次只核对已有日志，没有重新访问或修改R2对象。

日志中的“496K”来自本地du分配大小，“493 KB”来自文件实际字节数/1024取整，两者与504425字节并不矛盾。

## 应用激活关联

同一`deploy.log:286`记录激活成功：BUILD_ID=`build-TfctsWXpff2fKS`，运行回滚目录=`/var/backups/meteor-store-runtime-D34VzFAF`。本分工只核对该现有日志与当前源码HEAD，HTTP/真实浏览器健康以主代理的独立验收记录为准。

连接使用固定`deploy/known_hosts`、StrictHostKeyChecking=yes、BatchMode=yes；数据库连接串仅在服务器进程内部读取，没有打印凭据或用户PII。
