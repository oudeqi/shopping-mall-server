import Koa from 'koa'
import body from 'koa-body'
import koaStatic from 'koa-static'
import session from 'koa-session'
import cors from 'koa2-cors'
import compress from 'koa-compress'
import cacheControl from 'koa-cache-control'
import onerror from 'koa-onerror'
import logger from 'koa-logger'
import helmet from 'koa-helmet'
import nunjucks from 'koa-nunjucks-2'
import MongooseStore from './service/MongooseStore'
import env from './service/env'

// 导入 rouer.js 文件
import api from './router/api'
import page from './router/page'

// 连接数据库
import * as config from './config' //  { mongodb, port } 
import connect from './service/mongo'
connect(config.mongodb)

const app = new Koa()
if (env.dev) { // 将捕获的错误消息生成友好的错误页面（仅限开发环境）
  onerror(app)
}
// 在命令行打印日志
app.use(logger())
// 缓存控制
app.use(cacheControl({ maxAge: 60000 }))
// 开启 gzip 压缩
app.use(compress())
// 跨域（允许在 http 请求头中携带 cookies）
app.use(cors({ credentials: true }))
// 安全
app.use(helmet())
// 静态资源服务器
app.use(koaStatic(__dirname + '/static'))
// 在使用 koa-session 之前，必须需要指定一个私钥
// 用于加密存储在 session 中的数据
app.keys = ['some secret key'];
app.use(session({ store: new MongooseStore() }, app))
// 解析 sequest body
// 开启了多文件上传，并设置了文件大小限制
app.use(body({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024
  }
}))
// Must be used before any router is used
app.use(nunjucks({
  ext: 'html',
  path: __dirname + '/views',// 指定视图目录
  nunjucksConfig: {
    noCache: true, // 默认 false 缓存，开发环境应该设置为 true 不缓存
    // noCache: process.env.NODE_ENV === 'development',
    trimBlocks: true // 开启转义 防Xss
  }
}))
app.use(page.routes(), page.allowedMethods())
app.use(api.routes(), api.allowedMethods())
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})
app.listen(config.port, () => {
  console.log(`server start at port ${port}`)
})
// 导出 koa 实例（用于测试）
export default app

