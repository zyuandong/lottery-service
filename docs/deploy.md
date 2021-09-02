# 部署文档

## 1. 本地开发

1. 环境依赖

   - Node.js
     推荐版本至少为 v12。建议使用 NVM 安装、管理 Node.js 版本
   - MySQL
     创建一个数据库，名称任意。本文档中使用：`lottery_service`

2. 安装项目依赖

   ```sh
   # 1. clone 到本地
   git@github.com:zyuandong/lottery-service.git

   # 2. cd 进入项目目录
   cd lottery-service

   # 3. 安装依赖
   npm i
   ```

   > 如果安装依赖时出现错误，推测可能是因为当前 `package-lock.json` 是根据我本地环境安装的 Node.js 版本为 v12。
   >
   > 建议删除 `node_modules` 和 `package-lock.json` 之后再次执行 `npm i`。
   >
   > 推荐 Node.js 的版本至少为 v12。

3. 启动项目

   启动之前，确保有一个可以正常访问的 MySQL 数据库。

   根据自己部署的数据库情况，配置 `config.js` 文件：

   ```js
   // 以下 '***' 号部分，根据实际情况填写
   const config = {
     port: 3000,
     database: {
       host: '***', // 连接 IP 地址：（本地数据库为：localhost，远程数据库为对应的 IP）
       port: '***', // 端口：默认是 3306
       user: '***', // 用户名
       password: '***', // 密码
       database: '***', // 数据库名称（本文档中使用：lottery_service）
     },
   };
   module.exports = config;
   ```

   确保数据库连接配置无误后，即可使用以下方式启动项目：

   ```sh
   # 启动
   npm start

   # 或者 nodemon 启动
   # nodemon 可以帮助你在改动代码之后自动热更新服务；不用再手动停止、启动服务
   npm run dev
   ```

   当第一次启动项目，命令行输出数据库初始化成功的提示时，代表项目启动成功，初始化成功提示如下：

   ```sh
   === Create table award_record: success ===
   === Create table prize: success ===
   === Create table user: success ===
   === Initialize admin: success ===
   ```

   ！**注：第一次启动项目时，数据库初始化，会根据 `model/index.js` 中的代码自动创建一个管理员用户；之后启动项目也会执行创建管理员逻辑，但由于此数据已存在，因此初始化时提示 `=== Initialize admin: error ===` 是正常现象。**

## 2. 部署上线

推荐使用 Docker 镜像的方式部署。

Dockerfile:

```docker
FROM centos/nodejs-12-centos7

USER root
RUN mkdir -p /home/lottery-service
WORKDIR /home/lottery-service

# Bundle app source
COPY . /home/lottery-service
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]
```

生成镜像：

`docker build -t lottery-service .`

创建并运行容器

```sh
docker run -d \
--name lottery-service:v1 \
-p 3000:3000 \
-e TZ="Asia/Shanghai" \
lottery-service
```
