const router = require('koa-router')();
const sql = require('../utils/sql');
const { v5: uuidv5 } = require('uuid');

router.prefix('/prizes');

router
  .post('/add', async (ctx) => {
    let data = await sql.insert('prize');
    ctx.body = data;
  })
  .get('/', async (ctx) => {
    // TODO 根据状态排序
    let data = await sql.queryAll('prize', ctx.request.query);
    ctx.body = data;
  })
  .get('/get_prize_pool', async (ctx) => {
    let data = await sql.queryByFields('prize', { is_active: 1 });
    ctx.body = data;
  })
  .put('/set_prize_pool', async (ctx) => {
    let form = ctx.request.body;
    // let { oid, place_index } = form;
    let data = await sql.update('prize', form.oid, form);
    ctx.body = data;
  });
// upload pic

module.exports = router;
