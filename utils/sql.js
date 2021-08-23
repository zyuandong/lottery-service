const runSql = require("./runSql");

function getByPage(tableName, filter) {
  // select * from tableName limit (page - 1) * pageSize, pageSize;
  // TODO 是否能执行一条 sql 语句实现分页并得到总条数
  const { page, pageSize } = { ...filter };
  const str = `select * from ${tableName} limit ${
    (page - 1) * pageSize
  }, ${pageSize};`;
  return new Promise((resolve, reject) => {
    query(
      str,
      (res) => {
        let data = {
          code: 200,
          message: "获取成功",
          data: {
            metadata: {
              paginationParam: {
                page,
                pageSize,
                total: 0,
              },
            },
            resultSet: res,
          },
        };
        runSql(
          `select count(id) from ${tableName}`,
          (res) => {
            data.data.metadata.paginationParam.total = res[0]["count(id)"];
            resolve(data);
          },
          (err) => reject(err)
        );
      },
      (err) => reject(err)
    );
  });
}

const sql = {
  queryAll: (tableName, filter) => {
    // select * from tableName;
    if (filter && Object.keys(filter).length) {
      console.log("== filter ==", filter);
      return getByPage(tableName, filter);
    }
    return new Promise((resolve, reject) => {
      let str = `select * from ${tableName}`;
      runSql(
        str,
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  },
  queryById: (tableName, id) => {
    // select * from tableName where key=value;
    return new Promise((resolve, reject) => {
      let str = `select * from ${tableName} where id=${id}`;
      runSql(
        str,
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  },
  insert: (tableName, data) => {
    // insert inti tableName (xx, yy, zz) values ("xx", yy, zz);
    // console.log(tableName, data, typeof data);
    let keys = [],
      values = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        keys.push(key);
        let value = data[key];
        if (typeof data[key] === "string") {
          value = `"${data[key]}"`;
        }
        values.push(value);
      }
    }
    // console.log(keys, values);
    let str = `insert into ${tableName} (${keys}) values (${values})`;
    // console.log(str);

    return new Promise((resolve, reject) => {
      runSql(
        str,
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  },
  update: (tableName, id, data) => {
    // update tableName set xx="xx", yy=yy, zz=zz where key=value;
    let [keyValueStr, index] = ["", 0];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (index) keyValueStr += ",";
        let value = data[key];
        if (typeof value === "string") value = `"${data[key]}"`;
        keyValueStr += `${key}=${value}`;
        index++;
      }
    }
    let str = `update ${tableName} set ${keyValueStr} where id=${id}`;
    return new Promise((resolve, reject) => {
      runSql(
        str,
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  },
  delete: (tableName, id) => {
    // delete from tableName where key=value;
    let str = `delete from ${tableName} where id=${id}`;
    return new Promise((resolve, reject) => {
      runSql(
        str,
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  },
};

module.exports = sql;
