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
| avatar        | VARCHAR(72) |
| gold_coin_num | INT         |
| is_admin      | TINYINT(1)  |

### 奖品表（prize）

| fields      | type        |
| :---------- | :---------- |
| oid         | VARCHAR(36) |
| name        | VARCHAR(36) |
| number      | INT         |
| pic         | VARCHAR(72) |
| probability | DOUBLE      |
| type        | TINYINT(1)  |
| is_active   | TINYINT(1)  |
| place_index | TINYINT(1)  |

### 获奖记录表（award_record）

| fields      | type        |
| :---------- | :---------- |
| oid         | VARCHAR(36) |
| user_oid    | VARCHAR(36) |
| user_name   | VARCHAR(36) |
| prize_oid   | VARCHAR(36) |
| prize_name  | VARCHAR(36) |
| create_time | DATETIME    |

## TODO

- [ ] 签到功能
- [ ] 生成用户 Token
- [ ] 优化创建目录方式
- [x] 更换头像
- [x] 生成随机头像
- [x] 消息推送
- [x] 抽奖逻辑
- [x] 奖品管理
- [x] 注册、登录
- [x] 用户管理
- [x] 表设计
