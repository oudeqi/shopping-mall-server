// router.js
import Router from 'koa-router'
import User from '../controllers/user.ctr'
import Seller from '../controllers/seller.ctr'

const router = new Router()
const USER_BASE_URL = '/user'

router.prefix('/api/v1')
router.post(USER_BASE_URL + '/register', User.register)
router.post(USER_BASE_URL + '/login', User.login)
// router.post(USER_BASE_URL + '/logout', User.logout)

const SELLER_BASE_URL = '/seller'
router.post(SELLER_BASE_URL + '/register', Seller.register)
router.post(SELLER_BASE_URL + '/login', Seller.login)
router.post(SELLER_BASE_URL + '/logout', Seller.logout)

export default router

