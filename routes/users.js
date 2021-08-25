const router = require('koa-router')();
const sql = require('../utils/sql');

router.prefix('/users');

router
  .post('/register', async (ctx) => {
    let data = await sql.insert('user', ctx.request.body);
    return ctx.body = data;
  })
  .get('/login', async (ctx) => {
    let data = await sql.queryByFields('user', ctx.request.query);
    ctx.body = data;
  })
  .get('/test', (ctx) => {
    ctx.body = 'test';
  });

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!';
});

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response';
});

module.exports = router;
