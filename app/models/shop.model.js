import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const ShopSchema = new Schema({
  name: {
    type: String,
    required: [true, 'shopName required @_@~']
  },
  location: {
    longitude: Number, // 经度
    latitude: Number, // 纬度
    province: String,
    city: String,
    district: String,
    street: String,
    streetNumber: String
  },
  user: {
    type: ObjectId,
    ref: 'User'
  },
  goods: [{
    type: ObjectId,
    ref: 'Goods'
  }],
  meta: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
})

ShopSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

const Shop = mongoose.model('Shop', ShopSchema)

export default Shop

