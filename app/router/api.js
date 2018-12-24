// router.js
import Router from 'koa-router'
import user from '../controllers/user.ctr'

const router = new Router
router.prefix('/api/v1')

/** user **/
const USER_BASE_URL = '/user'
router.post(USER_BASE_URL + '/register', user.register)
router.post(USER_BASE_URL + '/login', user.login)


/** goods **/
// const GOODS_BASE_URL = '/goods'
// router.get(GOODS_BASE_URL, user.validator, goods.find)
// router.post(GOODS_BASE_URL, user.validator, goods.add)
// router.put(GOODS_BASE_URL, user.validator, goods.update)
// router.delete(GOODS_BASE_URL, user.validator, goods.remove)

export default router