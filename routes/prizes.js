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
  .get('/prize_pools', async (ctx) => {
    let data = await sql.queryByFields('prize', { is_active: 1 });
    ctx.body = data;
  });
// update active
// update probability
// upload pic
// set prize pools

module.exports = router;
