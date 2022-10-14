const router = require('koa-router')();
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

router.prefix('/swagger'); // 设置路由，与 app.js 中的路由配置保持一致
const swaggerDefinition = {
  info: {
    title: 'lottery-service API',
    version: 'v0.0.1',
    host: 'localhost:3001',
    basePath: '/',
  },
};

const options = {
  swaggerDefinition,
  // 写有注解的 route 的存放地址，
  apis: [path.join(__dirname, './users.js'), path.join(__dirname, './prizes.js')],
};

const swaggerSpec = swaggerJSDoc(options);

// 通过路由获取生成的注解文件
router.get('/swagger.json', async function (ctx) {
  ctx.set('Content-Type', 'application/json');
  ctx.body = swaggerSpec;
});

module.exports = router;
