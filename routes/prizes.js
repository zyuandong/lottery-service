const router = require('koa-router')();
const sql = require('../utils/sql');
const { v5: uuidv5 } = require('uuid');

router.prefix('/prizes')

router
  .post('/add', async (ctx) => {
    let data = await sql.insert('prize')
    ctx.body = data
  })
  .get('/', async (ctx) => {
    let data = await sql.queryAll('prize')
    ctx.body = data
  })

module.exports = router;