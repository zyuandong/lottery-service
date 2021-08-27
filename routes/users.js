const router = require('koa-router')();
const sql = require('../utils/sql');
const { v5: uuidv5 } = require('uuid');

router.prefix('/users');

router
  .post('/register', async (ctx) => {
    const form = ctx.request.body;
    if (!form.name || !form.password) {
      return (ctx.body = {
        code: 500,
        errorCode: '500_01',
        message: 'Incorrect account information',
      });
    }
    const oid = uuidv5(`${form.name}_${form.password}`, uuidv5.DNS);
    const checkMulti = await sql.queryByFields('user', form);
    if (checkMulti.data.length) {
      return (ctx.body = {
        code: 500,
        errorCode: '500_02',
        message: 'Account already exists',
      });
    }
    const data = await sql.insert('user', { ...{ oid }, ...form });
    ctx.body = data;
  })
  .get('/login', async (ctx) => {
    const data = await sql.queryByFields('user', ctx.request.query);
    ctx.body = data;
  })
  .get('/', async (ctx) => {
    const data = await sql.queryAll('user', ctx.request.query);
    ctx.body = data;
  })
  .post('/lottery', async (ctx) => {
    // TODO
    const data = Math.floor(Math.random() * 7);
    // let params = ctx.request.body;

    // computed goldCoin

    // award record
    ctx.body = {
      code: 200,
      message: 'success',
      data,
    };
  });

module.exports = router;
