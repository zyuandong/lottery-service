const router = require('koa-router')();
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const { koaSwagger } = require('koa2-swagger-ui');
const yaml = require('js-yaml');
const fs = require('fs');
const lettoryJson = require('../swagger/lottery.json');

router.prefix('/swagger'); // 设置路由，与 app.js 中的路由配置保持一致

// 通过 swagger-jsdoc 将注解解析为 json 格式的 swagger 文档
const jsDocSpec = swaggerJSDoc({
  definition: {
    // openapi: '3.0.0',
    info: {
      title: 'lottery-service API',
      version: 'v1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/',
  },
  apis: [path.join(__dirname, './users.js'), path.join(__dirname, './prizes.js')],
});

// 读取官方示例文件
const pet = yaml.load(fs.readFileSync('./swagger/petStore.yml', 'utf8'));

// 通过路由获取生成的注解文件
router.get('/swagger.json', async function (ctx) {
  ctx.set('Content-Type', 'application/json');
  // 示例 1. 官方示例
  ctx.body = pet;

  // 示例 2. 解析路由中的注解生成的数据
  // ctx.body = jsDocSpec;
});

// 示例 1. router.use()
router.use(
  '/pet',
  koaSwagger({
    routePrefix: false,
    swaggerOptions: {
      // 示例 1. localhost:3000/swagger/swagger.json
      url: '/swagger/swagger.json',

      // 示例 2. yaml -> json
      spec: yaml.load(fs.readFileSync('./swagger/petStore.yml', 'utf8')),

      // 示例 3. json
      // spec: lettoryJson,
    },
  })
);
router.get('/pet');

// 示例 2. router.get()
const lottery = yaml.load(fs.readFileSync('./swagger/lottery.yml', 'utf8'));
router.get('/lottery', koaSwagger({ routePrefix: false, swaggerOptions: { spec: lottery } }));

module.exports = router;
