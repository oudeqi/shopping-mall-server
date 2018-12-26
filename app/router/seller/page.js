import Router from 'koa-router'
const router = new Router()

router.prefix('/seller')
router.get('/', async (ctx, next) => {
  if (ctx.session.user) {
    console.log(ctx.session.user._id)
  } else {
    console.log('没有登录')
  }
  await ctx.render('seller/index', {
    title: 'Hello Koa 2!'
  })
})

export default router