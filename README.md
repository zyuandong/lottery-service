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
| is_admin      | TINYINT(1)  |

### 奖品表（prize）

| fields      | type        |
| :---------- | :---------- |
| oid         | VARCHAR(36) |
| name        | VARCHAR(36) |
| number      | INT         |
| pic         | BLOB        |
| probability | DOUBLE      |
| type        | TINYINT(1)  |
| is_active   | TINYINT(1)  |
| place_index | TINYINT(1)  |

### 获奖记录表（award_record）

| fields      | type        |
| :---------- | :---------- |
| oid         | VARCHAR(36) |
| user_oid    | VARCHAR(36) |
| prize_oid   | VARCHAR(36) |
| create_time | DATETIME    |

## TODO

- [ ] 抽奖逻辑
- [ ] 消息推送
- [ ] 生成用户 Token
- [x] 奖品管理
- [x] 注册、登录
- [x] 用户管理
- [x] 表设计
