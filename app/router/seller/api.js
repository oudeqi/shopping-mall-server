// router.js
import Router from 'koa-router'
import Seller from '../../controllers/seller.ctr'

const router = new Router()
const SELLER_BASE_URL = '/seller'

router.prefix('/api/v1')
router.post(SELLER_BASE_URL + '/register', Seller.register)

export default router