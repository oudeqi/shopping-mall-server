import UserModel from '../models/user.model'

export default class User {
  /**
   * 手机号码注册
   */
  static async register (ctx, next) {
    const { phoneNumber, password } = ctx.request.body
    if (!phoneNumber || !password) {
      return ctx.body = {
        success: false,
        msg: 'phoneNumber or password required'
      }
    }
    const user = await UserModel.findOne({ phoneNumber }, { password: 0, __v: 0 })
    if (user) {
      return ctx.body = {
        success: false,
        msg: '该用户名已经被注册'
      }
    } else {
      const encrypt = UserModel.encrypt(password)
      const newUser = new UserModel({ phoneNumber, password: encrypt})
      const created = await newUser.save()
      if (created) {
        ctx.session.user = created._doc
        return ctx.body = {
          success: true,
          data: { ...created._doc, password: undefined }
        }
      } else {
        return ctx.body = {
          success: false,
          msg: '未知错误'
        }
      }
    }
  }

  /**
   * 用户登录
   */
  static async login (ctx, next) {
    const { phoneNumber, password } = ctx.request.body
    const user = await UserModel.findOne(
      { phoneNumber, password: UserModel.encrypt(password)}, 
      { password: 0, __v: 0 }
    )
    if (user) {
      ctx.session.user = user._doc
      return ctx.body = {
        success: true,
        data: {...user._doc, password: undefined}
      }
    } else {
      return ctx.body = {
        success: false,
        msg: '用户名或密码错误'
      }
    }
  }

}
