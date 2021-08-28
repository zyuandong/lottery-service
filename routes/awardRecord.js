const router = require('koa-router')();
const sql = require('../utils/sql');

router.prefix('/award_records');

router.get('/', async (ctx) => {
  const data = await sql.queryAll('award_record', ctx.request.query, [
    { field: 'create_time', type: 'desc' },
  ]);
  ctx.body = data;
});

module.exports = router;
