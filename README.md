# lottery-service

## 用户功能

- 注册
- 登录
- 鉴权

## 抽奖功能

- 抽奖
- 消息推送

## 表设计

### 用户表（user）

| fields        | type        |
| :------------ | :---------- |
| oid           | VARCHAR(36) |
| name          | VARCHAR(36) |
| password      | VARCHAR(18) |
| avatar        | BLOB        |
| gold_coin_num | INT         |
| is_admin      | TINYINT     |

### 奖品表（prize）

| fields      | type        |
| :---------- | :---------- |
| oid         | VARCHAR(36) |
| name        | VARCHAR(36) |
| pic         | BLOB        |
| probability | DOUBLE      |
| is_active   | TINYINT     |

### 获奖记录表（award_record）

| fields      | type        |
| :---------- | :---------- |
| oid         | VARCHAR(36) |
| user_oid    | VARCHAR(36) |
| prize_oid   | VARCHAR(36) |
| create_time | DATETIME    |

## TODO

- [x] 表设计
- [ ] 注册、登录
- [ ] 用户管理
- [ ] 奖品管理
- [ ] 抽奖逻辑
- [ ] 消息推送
- [ ] 生成用户 Token
