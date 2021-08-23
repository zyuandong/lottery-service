const config = require("../config").database;
const mysql = require("mysql");
const pool = mysql.createPool(config);

const runSql = (sql, success, error) => {
  pool.getConnection((err, connect) => {
    if (err) {
      error({
        code: 500,
        message: "请求失败",
        data: err,
      });
    } else {
      connect.query(sql, (err, res) => {
        if (err) {
          error({
            code: 500,
            message: "请求失败",
            data: err,
          });
        } else {
          success(res);
          connect.release();
        }
      });
    }
  });
};

module.exports = runSql;
