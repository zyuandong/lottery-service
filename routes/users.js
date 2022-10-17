const router = require('koa-router')();
const sql = require('../utils/sql');
const { v5: uuidv5 } = require('uuid');
const sd = require('silly-datetime');
const Identicon = require('identicon.js');
const fs = require('fs');
const path = require('path');
const tools = require('../utils/tools');

router.prefix('/users');

router
  // #region
  /**
   * @swagger
   * /users/register:
   *    post:
   *      tags:
   *      - User
   *      summary: 注册用户
   *      consumes:
   *        - application/json
   *      parameters:
   *      - name: body
   *        in: body
   *        description: 新增管理员信息
   *        schema:
   *          type: object
   *          required:
   *            - id
   *            - name
   *            - password
   *          properties:
   *            name:
   *              type: string
   *              description: 用户名
   *            password:
   *              type: string
   *              description: 密码
   *            create_time:
   *              type: string
   *              description: 创建时间
   *      responses:
   *        200:
   *          description: successful operation
   * */
  // #endregion
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
    const checkMulti = await sql.queryByFields('user', {
      name: form.name,
      password: form.password,
    });
    // console.log('===checkMulti', checkMulti);
    if (checkMulti.data.length) {
      return (ctx.body = {
        code: 500,
        errorCode: '500_02',
        message: 'Account already exists',
      });
    }

    const publicDir = 'images/avatars';
    const fileDir = path.join(path.resolve('.'), 'public', publicDir);
    // console.log(fileDir);

    const state = await tools.isExistsDir(fileDir);
    // console.log(state);

    if (!state) {
      try {
        fs.mkdirSync(`${path.join(path.resolve('.'), 'public/images/')}`);
      } catch (error) {
        console.log(error);
      }
      fs.mkdirSync(`${path.join(path.resolve('.'), 'public/images/avatars')}`);
    }

    // 使用 identicon.js 生成随机 GitHub 风格头像
    const base64Str = new Identicon(oid, { format: 'svg' }).toString();
    // 将 base64 转为 svg 文件，并保存在 public/images/avatars 路径下
    tools.base64ToSVG(base64Str, `${fileDir}/${oid}.svg`);

    const data = await sql.insert('user', {
      ...{ oid, avatar: `${publicDir}/${oid}.svg` },
      ...form,
    });
    ctx.body = data;
  })
  .get('/login', async (ctx) => {
    const { name, password } = ctx.request.query;
    if (!name || !password) {
      return (ctx.body = {
        code: 500,
        errorCode: '500_01',
        message: 'Incorrect account information',
      });
    }
    const data = await sql.queryByFields('user', { name, password });
    ctx.body = data;
  })
  // #region
  /**
   * @swagger
   * /users:
   *   get:
   *     tags:
   *     - User
   *     summary: 获取用户列表
   *     consumes:
   *       - application/json
   *     parameters:
   *       - name: page
   *         in: query
   *         default: 1
   *       - name: pageSize
   *         in: query
   *         default: 10
   *
   */
  // #endregion
  .get('/', async (ctx) => {
    const data = await sql.queryAll('user', ctx.request.query, [
      { field: 'is_admin', type: 'desc' },
      { field: 'create_time', type: 'desc' },
    ]);
    ctx.body = data;
  })
  .get('/:oid', async (ctx) => {
    const data = await sql.queryById('user', ctx.params.oid);
    ctx.body = data;
  })
  .post('/:oid/avatar/upload', async (ctx) => {
    const publicDir = 'images/avatars';
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
      fs.mkdirSync(`${path.join(path.resolve('.'), 'public/images/avatars')}`);
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

    const res = await sql.update('user', ctx.params.oid, { avatar: `${publicDir}/${file.name}` });

    ctx.body = {
      ...res,
      data: `${publicDir}/${file.name}`,
    };
  })
  .post('/lottery', async (ctx) => {
    const { name: user_name, oid: user_oid, is_admin, gold_coin_num } = ctx.request.body;
    if (gold_coin_num < 100) {
      return (ctx.body = {
        code: 500,
        errorCode: '500_01',
        message: 'The number of gold coins is less than 100',
      });
    }
    let placeIndexRes = 0;
    let hashArr = new Array(8).fill(0);
    let fullPrizePoolArr = new Array(8).fill(0);
    const random = Math.floor(Math.random() * 11);

    const { data: prizePoolArr } = await sql.queryByFields('prize', { is_active: 1 }, [
      { field: 'place_index', type: 'asc' },
    ]);

    let count = 0;
    let prizePoolIndex = 0;
    // 计算奖品概率离散值
    hashArr = await hashArr.map((item, index) => {
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
      // 规避 i 号位奖品概率为 0，random 也为 0 的意外情况
      if (random <= hashArr[i] && hashArr[i] != 0) {
        placeIndexRes = Number(i);
        break;
      }
    }

    const prizeRes = fullPrizePoolArr[placeIndexRes];

    // computed gold_coin_number
    // “金币”、“实物” 类型奖品入库
    if (prizeRes.type) {
      await sql.insert('award_record', {
        oid: uuidv5(`${user_oid}_${prizeRes.oid}_${new Date()}`, uuidv5.DNS),
        user_oid,
        user_name,
        prize_oid: prizeRes.oid,
        prize_name: prizeRes.name,
        create_time: `${sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}`,
      });

      /**
       * is_admin
       *  ? end
       *  : prize.type === 1 ? (-100 + prize.number) : -100
       */
      if (!is_admin) {
        if (prizeRes.type === 1) {
          await sql.update('user', user_oid, {
            gold_coin_num: `${gold_coin_num - 100 + prizeRes.number}`,
          });
        } else {
          await sql.update('user', user_oid, {
            gold_coin_num: `${gold_coin_num - 100}`,
          });
        }
      }
    } else {
      // “文字” 类
      /**
       * is_admin
       *  ? end
       *  : -100
       *  */
      if (!is_admin) {
        await sql.update('user', user_oid, {
          gold_coin_num: `${gold_coin_num - 100}`,
        });
      }
    }

    ctx.body = {
      code: 200,
      message: 'success',
      data: {
        prize: prizeRes,
        placeIndex: placeIndexRes,
        random,
        hashArr,
        fullPrizePoolArr,
      },
    };
  })
  .post(`/:oid/sign_in`, async (ctx) => {
    const { data: user } = await sql.queryById('user', ctx.params.oid);
    // TODO 验证是否可以签到
    const gold_coin_num = (user.gold_coin_num += 300);
    const last_sign_in_time = `${sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}`;
    await sql.update('user', ctx.params.oid, {
      gold_coin_num,
      last_sign_in_time,
    });

    ctx.body = {
      code: 200,
      message: 'success',
      data: { ...user, gold_coin_num, last_sign_in_time },
    };
  });

module.exports = router;
