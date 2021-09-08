const {v5: uuidv5} = require("uuid");
const sd = require("silly-datetime");
const runSql = require("../utils/runSql");

const tables = {
  user: `
    CREATE TABLE IF NOT EXISTS user(
      oid VARCHAR(36) NOT NULL PRIMARY KEY,
      name VARCHAR(36) NOT NULL,
      password VARCHAR(18) NOT NULL,
      avatar VARCHAR(72),
      gold_coin_num INT DEFAULT 300,
      is_admin TINYINT(1),
      create_time DATETIME,
      last_sign_in_time DATETIME
    )
    ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4;
  `,
  prize: `
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
  `,
  award_record: `
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
  `
};

const oid = uuidv5('admin_123456', uuidv5.DNS);
const adminSql = `
  INSERT INTO user 
  (oid, name, password, is_admin, gold_coin_num, create_time) values 
  ('${oid}', 'admin', '123456', 1, 300, '${sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}');
`;

const createAdmin = () => {
  runSql(
    adminSql,
    (res) => {
      console.log(`=== Initialize admin: success ===`);
      return true;
    },
    (err) => {
      console.log(`=== Initialize admin: error ===`);
      return false;
    }
  );
};

const createTable = (tb, sql) => {
  runSql(
    sql,
    (res) => {
      console.log(`=== Create table ${tb}: success ===`);
      if (tb === 'user') {
        createAdmin();
      }
      return true;
    },
    (err) => {
      console.error(`=== Create table ${tb}: error ===`, err);
      return false;
    }
  );
};

for (const key in tables) {
  if (tables.hasOwnProperty(key)) {
    createTable(key, tables[key]);
  }
}
