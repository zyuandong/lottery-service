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

| fields | type |
| :--- | :--- |
| oid | VARCHAR(36) |
| name | VARCHAR(36) |
| password | VARCHAR(18) |
| gold_coin_num | int |
| is_admin | CHAR(1) |

### 奖品表（prize）

| fields | type |
| :--- | :--- |
| oid | VARCHAR(36) |
| name | VARCHAR(36) |
| pic | BLOB |
| probability | DOUBLE |
| is_active | CHAR(1) |

### 获奖记录表（award_record）

| fields | type |
| :--- | :--- |
| oid | VARCHAR(36) |
| user_id | VARCHAR(36) |
| prize_id | VARCHAR(36) |
| create_time | DATETIME |
