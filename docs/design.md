# 设计文档

## 1. 功能设计

## 2. 表设计

### 2.1. 用户表（user）

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

### 2.2. 奖品表（prize）

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

### 2.3. 获奖记录表（award_record）

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

## 3. 接口设计
