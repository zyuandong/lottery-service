const router = require('koa-router')();
const sql = require('../utils/sql');
const { v5: uuidv5 } = require('uuid');
const fs = require('fs');
const path = require('path');
const tools = require('../utils/tools');

router.prefix('/prizes');

router
  .post('/add', async (ctx) => {
    const form = ctx.request.body;
    const oid = uuidv5(`${form.name}`, uuidv5.DNS);
    const checkMulti = await sql.queryByFields('prize', {name: form.name});
    if (checkMulti.data.length) {
      return (ctx.body = {
        code: 500,
        errorCode: '500_01',
        message: 'Prize already exists',
      });
    }
    const data = await sql.insert('prize', {
      ...{ oid, probability: 0 },
      ...form,
    });
    ctx.body = data;
  })
  .get('/', async (ctx) => {
    // TODO 根据状态排序
    // const data = await sql.queryAll('prize', ctx.request.query);
    const data = await sql.queryAll('prize', ctx.request.query, [
      { field: 'is_active', type: 'desc' },
    ]);
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
  })
  .post('/pic/upload', async (ctx) => {
    const publicDir = 'images/prizes';
    const fileDir = path.join(path.resolve('.'), 'public/', publicDir);
    // console.log(fileDir);

    const state = await tools.isExistsDir(fileDir);
    // console.log(state);

    if (!state) {
      try {
        fs.mkdirSync(`${path.join(path.resolve('.'), 'public/images/')}`);
      } catch (error) {
        console.log(error);
      }
      fs.mkdirSync(`${path.join(path.resolve('.'), 'public/images/prizes')}`);
    }

    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件
    // 创建可读流
    const reader = fs.createReadStream(file.path);

    // let filePath = path.join(__dirname, 'images/prizes') + `/${file.name}`;
    let filePath = `${fileDir}/${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);

    ctx.body = {
      code: 200,
      message: 'success',
      data: `${publicDir}/${file.name}`,
    };
  });

module.exports = router;
