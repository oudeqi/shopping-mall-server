import mongoose from 'mongoose'
import { md5 } from 'utility'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const salt = 'dfg_4$*65_ZX4_&12'
const MAX_LOGIN_ATTEMPTS = 5 // 登录的最大失败尝试次数
const LOCK_TIME = 2 * 60 * 60 * 1000 // 登录失败后锁定时间

const UserSchema = new Schema({
  avatar: {
    type: String, 
    default: ''
  },
  nickname: {
    type: String, 
    default: '新人'
  },
  role: {
    type: String, 
    enum: ['User', 'Admin', 'Seller'],
    default: 'User' 
  },
  phoneNumber: {
    type: String, 
    required: [true, 'phoneNumber required @_@~'],
    validate: {
      validator: function(data) {
        return /^1(3|4|5|7|8)\d{9}$/.test(data)
      },
      message: '{VALUE} is not a valid phone number @_@~'
    },
  },
  email: {
    type: String, 
    default: ''
  },
  password: {
    type: String, 
    required: [true, 'password required @_@~']
  },
  lock: {
    until: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
  },
  wechat: {
    openID: [String],
    unionID: String
  },
  // shops: [{ // 商家才有
  //   type: ObjectId,
  //   ref: 'Shop'
  // }], 
  // follow: {
  //   shops: [{type: ObjectId, ref: 'Shop'}],
  //   goods: [{type: ObjectId, ref: 'Goods'}],
  //   users: [{type: ObjectId, ref: 'User'}]
  // },
  meta: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
})

// 虚拟字段
UserSchema.virtual('isLocked').get(function () {
  return this.lock.until && this.lock.until > Date.now()
})

// 中间件
UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

// 静态方法
// 直接在Model上调用 相关的查询或者删除
UserSchema.statics.findByName = function (name, cb) {
  //这里的this 指的就是Model
  return this.find({ name: new RegExp(name, 'i') }, cb);
}
UserSchema.statics.encrypt = function (pwd) {
  if (pwd) {
    return md5(md5(pwd + salt))
  } else {
    return null
  }
}
UserSchema.statics.shouldEqual = function (pwd, pwd2) {
  return md5(md5(pwd + salt)) === pwd2
}

// 实例方法
// 在Schema.methods.fn 上定义的方法,只能在 new Model() 得到的实例中才能访问
UserSchema.methods.findSimilarTypes = function (cb) {
  //这里的this指的是具体document上的this
  return this.model('Animal').find({ type: this.type }, cb);
}

// UserSchema.methods = {
//   loginAttempts (user) {
//     return new Promise((resolve, reject) => {
//       if (this.lockUntil && this.lockUntil < Date.now()) {
//         this.update({
//           $set: { loginAttempts: 1 },
//           $unset: { lockUntil: 1 }
//         }, function (err) {
//           if (!err) resolve(true)
//           else reject(err)
//         })
//       } else {
//         let updates = {
//           $inc: { loginAttempts: 1 }
//         }
//         if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS || !this.isLocked) {
//           updates.$set = { lockUntil: Date.now() + LOCK_TIME }
//         }
//         this.update(updates, err => {
//           if (!err) resolve(true)
//           else reject(err)
//         })
//       }
//     })
//   }
// }

const User = mongoose.model('User', UserSchema)

export default User