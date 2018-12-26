// router.js
import Router from 'koa-router'
import User from '../../controllers/user.ctr'

const router = new Router()
const USER_BASE_URL = '/user'

router.prefix('/api/v1')
router.post(USER_BASE_URL + '/register', User.register)
router.post(USER_BASE_URL + '/login', User.login)

export default router