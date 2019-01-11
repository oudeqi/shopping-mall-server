import Router from 'koa-router'
const router = new Router()

router.get('/', async (ctx, next) => {
  if (ctx.session.user) {
    console.log(ctx.session.user._id)
  } else {
    console.log('用户 没有登录')
  }
  await ctx.render('user/index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/seller', async (ctx, next) => {
  if (ctx.session.user) {
    console.log('商家id：' + ctx.session.user._id)
    await ctx.render('seller/index', {
      title: '商家首页',
      user: ctx.session.user
    })
  } else {
    console.log('商家 没有登录')
    await ctx.render('seller/login', {
      title: '商家登陆'
    })
  }
  
})

export default router