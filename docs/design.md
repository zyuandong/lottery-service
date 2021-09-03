# 设计文档

## 1. 功能设计

### 1.1. 用户管理功能

用户根据不同权限分为管理员和普通用户，相关功能设计如下：

- 用户注册
  - 默认分配 300 金币
  - 生成随机 Github 风格头像
- 用户登录
  - 可上传、更新头像
  - 查看自己的中奖记录
  - 查看 24 小时内所有用户中奖记录
- 用户权限
  - 管理员
    - 奖品管理
    - 设置奖品中奖概率
    - 查看用户列表
    - 查看中奖记录列表
  - 普通用户
    - 抽奖

### 1.2. 奖品管理功能

管理员拥有奖品管理权限：

- 添加奖品
- 设置奖品图片
- 设置奖品中奖概率
- 设置奖池中的奖品内容及排列顺序

### 1.3. 抽奖功能

核心抽奖玩法功能设计：

- 抽奖算法
  根据奖品中奖概率计算出对应的离散值，并根据随机数得到中奖结果

- 约束奖池中奖品概率和为 1
  不为 1 则抽奖结果不做统计

- 统计用户及中奖结果数据

### 1.4. 消息推送

使用 Socket.io 实现消息推送：

- 用户上线消息推送
- 用户中奖消息推送

### 1.5. 特色功能

为增加「来抽奖吧」系统的趣味性，增加如下功能：

- 用户上线及中奖通知使用弹幕形式展示
- 奖品类型分为三类：
  均扣除 100 金币，少于 100 金币无法抽奖

  - 文字
    扣除 100 金币，不统计此中奖结果
  - 金币
    金币数值可设置为正、负数，正数则为用户自动增加对应的金币数值，负数则继续减少用户对应的金币数值
  - 实物

- 签到功能
  每天可签到 1 次，增加 100 金币（暂未实现）

## 2. 接口设计

### 2.1. 用户相关接口

| desc     | url                         | method | params         |
| :------- | :-------------------------- | :----- | :------------- |
| 注册     | `/users/register`           | post   | name, password |
| 登录     | `/users/login`              | get    | name, password |
| 用户列表 | `/users`                    | get    | page, pageSize |
| 用户详情 | `/users/:oid`               | get    | oid            |
| 修改头像 | `/users/:oid/avatar/upload` | post   | oid, file      |
| 抽奖     | `/users/lottery`            | post   | user:Object    |

### 2.2. 奖品相关接口

| desc         | url                      | method | params                    |
| :----------- | :----------------------- | :----- | :------------------------ |
| 添加奖品     | `/prizes/add`            | post   | name, type, number, pic   |
| 上传奖品图片 | `/prizes/pic/upload`     | post   | file                      |
| 奖品列表     | `/prizes`                | get    | page, pageSize            |
| 设置将池     | `/prizes/set_prize_pool` | post   | place_index , probability |
| 奖池列表     | `/prizes/get_prize_pool` | get    |                           |

### 2.3. 抽奖结果相关接口

| desc              | url                         | method | params         |
| :---------------- | :-------------------------- | :----- | :------------- |
| 中奖记录列表      | `/award_records`            | post   | page, pageSize |
| 24 小时内中奖记录 | `/award_records/latest`     | post   |                |
| 用户中奖记录      | `/award_records/users/:oid` | get    | user.oid       |

## 3. 表设计

### 3.1. 用户表（user）

| fields        | type        |
| :------------ | :---------- |
| oid           | VARCHAR(36) |
| name          | VARCHAR(36) |
| password      | VARCHAR(18) |
| avatar        | VARCHAR(72) |
| gold_coin_num | INT         |
| is_admin      | TINYINT(1)  |

```sql
CREATE TABLE IF NOT EXISTS user(
  oid VARCHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(36) NOT NULL,
  password VARCHAR(18) NOT NULL,
  avatar VARCHAR(72),
  gold_coin_num INT DEFAULT 300,
  is_admin TINYINT(1),
  create_time DATETIME
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;
```

### 3.2. 奖品表（prize）

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

```sql
CREATE TABLE IF NOT EXISTS prize(
  oid VARCHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(36) NOT NULL,
  number INT NOT NULL DEFAULT 1,
  pic VARCHAR(72),
  probability DOUBLE,
  type TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1),
  place_index TINYINT(1)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;
```

### 3.3. 获奖记录表（award_record）

| fields      | type        |
| :---------- | :---------- |
| oid         | VARCHAR(36) |
| user_oid    | VARCHAR(36) |
| user_name   | VARCHAR(36) |
| prize_oid   | VARCHAR(36) |
| prize_name  | VARCHAR(36) |
| create_time | DATETIME    |

```sql
CREATE TABLE IF NOT EXISTS award_record(
  oid VARCHAR(36) NOT NULL PRIMARY KEY,
  user_oid VARCHAR(36) NOT NULL,
  user_name VARCHAR(36) NOT NULL,
  prize_oid VARCHAR(36) NOT NULL,
  prize_name VARCHAR(36) NOT NULL,
  create_time DATETIME,
  FOREIGN KEY(user_oid) REFERENCES user(oid) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY(prize_oid) REFERENCES prize(oid) ON DELETE NO ACTION ON UPDATE NO ACTION
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;
```
