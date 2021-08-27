const runSql = require('./runSql');

const baseRes = {
  code: 200,
  message: 'success',
};

function getByPage(tableName, filter) {
  // select * from tableName limit (page - 1) * pageSize, pageSize;
  // TODO 是否能执行一条 sql 语句实现分页并得到总条数
  const { page, pageSize } = { ...filter };
  const str = `select * from ${tableName} limit ${
    (page - 1) * pageSize
  }, ${pageSize};`;
  return new Promise((resolve, reject) => {
    runSql(
      str,
      (res) => {
        let data = {
          code: 200,
          message: '获取成功',
          data: {
            metadata: {
              pagination: {
                page,
                pageSize,
                total: 0,
              },
            },
            resultSet: res,
          },
        };
        runSql(
          `select count(oid) from ${tableName}`,
          (res) => {
            data.data.metadata.pagination.total = res[0]['count(oid)'];
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
  // select * from tableName where fields.item = 'xxx';
  queryByFields: (tableName, fields) => {
    let whereSql = '';

    if (fields && Object.keys(fields).length) {
      Object.keys(fields).forEach((key, i) => {
        whereSql +=
          i === 0
            ? `${key} = '${fields[key]}'`
            : ` && ${key} = '${fields[key]}'`;
      });
    } else {
      return {
        code: 500,
        message: 'Fields is error',
      };
    }

    return new Promise((resolve, reject) => {
      let str = `select * from ${tableName} where ${whereSql}`;
      runSql(
        str,
        (res) =>
          resolve({
            ...baseRes,
            data: res,
          }),
        (err) => reject(err)
      );
    });
  },

  // select * from tableName;
  queryAll: (tableName, filter) => {
    if (filter && Object.keys(filter).length) {
      return getByPage(tableName, filter);
    }
    return new Promise((resolve, reject) => {
      let str = `select * from ${tableName}`;
      runSql(
        str,
        (res) =>
          resolve({
            ...baseRes,
            data: res,
          }),
        (err) => reject(err)
      );
    });
  },

  // select * from tableName where key=value;
  queryById: (tableName, id) => {
    return new Promise((resolve, reject) => {
      let str = `select * from ${tableName} where id=${id}`;
      runSql(
        str,
        (res) =>
          resolve({
            ...baseRes,
            data: res,
          }),
        (err) => reject(err)
      );
    });
  },

  // insert inti tableName (xx, yy, zz) values ("xx", yy, zz);
  insert: (tableName, data) => {
    let keys = [],
      values = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        keys.push(key);
        let value = data[key];
        if (typeof data[key] === 'string') {
          value = `"${data[key]}"`;
        }
        values.push(value);
      }
    }
    let str = `insert into ${tableName} (${keys}) values (${values})`;

    return new Promise((resolve, reject) => {
      runSql(
        str,
        (res) =>
          resolve({
            ...baseRes,
            // data: res
          }),
        (err) => reject(err)
      );
    });
  },

  // update tableName set xx="xx", yy=yy, zz=zz where key=value;
  update: (tableName, oid, data) => {
    let [keyValueStr, index] = ['', 0];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (index) keyValueStr += ',';
        let value = data[key];
        if (typeof value === 'string') value = `"${data[key]}"`;
        keyValueStr += `${key}=${value}`;
        index++;
      }
    }
    let str = `update ${tableName} set ${keyValueStr} where oid=${oid}`;
    // console.log('===', str);
    return new Promise((resolve, reject) => {
      runSql(
        str,
        (res) =>
          resolve({
            ...baseRes,
            // data: res
          }),
        (err) => reject(err)
      );
    });
  },

  // delete from tableName where key=value;
  delete: (tableName, id) => {
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
