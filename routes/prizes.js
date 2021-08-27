const router = require('koa-router')();
const sql = require('../utils/sql');
const { v5: uuidv5 } = require('uuid');

router.prefix('/prizes');

router
  .post('/add', async (ctx) => {
    const form = ctx.request.body;
    const oid = uuidv5(`${form.name}`, uuidv5.DNS);
    const data = await sql.insert('prize', {
      ...{ oid, probability: 0 },
      ...form,
    });
    ctx.body = data;
  })
  .get('/', async (ctx) => {
    // TODO 根据状态排序
    // const data = await sql.queryAll('prize', ctx.request.query);
    const data = await sql.queryAll('prize', ctx.request.query, [{ field: 'is_active', type: 'desc' }]);
    ctx.body = data;
  })
  .get('/get_prize_pool', async (ctx) => {
    const data = await sql.queryByFields('prize', { is_active: 1 });
    ctx.body = data;
  })
  .put('/set_prize_pool', async (ctx) => {
    const form = ctx.request.body;
    const data = await sql.update('prize', form.oid, form);
    ctx.body = data;
  });
// upload pic

module.exports = router;
