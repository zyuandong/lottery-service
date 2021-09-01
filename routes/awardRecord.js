const router = require('koa-router')();
const sd = require('silly-datetime');
const sql = require('../utils/sql');
const runSql = require('../utils/runSql');

router.prefix('/award_records');

const getLatestAwardRecord = () => {
  return new Promise((resolve, reject) => {
    let str = `select * from award_record where create_time >= '${sd.format(
      new Date() - 24 * 3600 * 1000,
      'YYYY-MM-DD HH:mm:ss'
    )}' order by create_time desc`;
    runSql(
      str,
      (res) => {
        resolve({
          code: 200,
          message: 'success',
          data: res,
        });
      },
      (err) => reject(err)
    );
  });
};

router.get('/', async (ctx) => {
  const data = await sql.queryAll('award_record', ctx.request.query, [
    { field: 'create_time', type: 'desc' },
  ]);
  ctx.body = data;
});

router.get('/latest', async (ctx) => {
  const data = await getLatestAwardRecord();
  ctx.body = data;
});

router.get('/users/:oid', async (ctx) => {
  const data = await sql.queryByFields('award_record', {user_oid: ctx.params.oid}, [{field: 'create_time', type: 'desc'}]);
  ctx.body = data;
});

module.exports = router;
