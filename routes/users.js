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
    const data = await sql.queryAll('user', ctx.request.query, [
      { field: 'is_admin', type: 'desc' },
    ]);
    ctx.body = data;
  })
  .post('/lottery', async (ctx) => {
    let placeIndexRes = 0;
    let hashArr = new Array(8).fill(0);
    let fullPrizePoolArr = new Array(8).fill(0);
    const random = Math.floor(Math.random() * 11);

    const { data: prizePoolArr } = await sql.queryByFields(
      'prize',
      { is_active: 1 },
      [{ field: 'place_index', type: 'asc' }]
    );

    let count = 0;
    let prizePoolIndex = 0;
    // 计算奖品概率离散值
    hashArr = hashArr.map((item, index) => {
      if (prizePoolArr[prizePoolIndex].place_index === index) {
        fullPrizePoolArr[index] = prizePoolArr[prizePoolIndex];
        if (prizePoolArr[prizePoolIndex].probability === 0) {
          prizePoolIndex++;
          return 0;
        }
        count += prizePoolArr[prizePoolIndex].probability * 10;
        prizePoolIndex++;
        item = count;
      }
      return item;
    });

    // 计算得出奖品索引
    for (let i = 0; i < hashArr.length; i++) {
      if (random <= hashArr[i]) {
        placeIndexRes = Number(i);
        break;
      }
    }

    // let params = ctx.request.body;

    // computed goldCoin

    // award record
    ctx.body = {
      code: 200,
      message: 'success',
      data: placeIndexRes,
      random,
      hashArr,
      prizePoolArr,
      fullPrizePoolArr,
    };
  });

module.exports = router;
