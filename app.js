const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
// const bodyparser = require('koa-bodyparser');
const koaBody = require('koa-body');
const logger = require('koa-logger');

const routes = require('./routes/index');
// const index = require("./routes/index");
// const users = require("./routes/users");

// swagger
const { koaSwagger } = require('koa2-swagger-ui');

require('./model/index');

// error handler
onerror(app);

// middlewares
// app.use(
//   bodyparser({
//     enableTypes: ['json', 'form', 'text'],
//   })
// );
app.use(koaBody({ multipart: true }));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// swagger
app.use(
  koaSwagger({
    routePrefix: '/swagger/index.html', // 配置 swagger 的访问路径
    swaggerOptions: {
      url: '/swagger/swagger.json', // 配置 swagger 的文档配置 URL，展示的 API 都是通过这个接口生成的
    },
  })
);

// routes

Object.keys(routes).forEach((key) => {
  app.use(routes[key].routes(), routes[key].allowedMethods());
});
// app.use(index.routes(), index.allowedMethods());
// app.use(users.routes(), users.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
