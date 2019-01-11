import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const materialSchema = new Schema({
  name: String,
  desc: String,
  preview: String
})
const wrappingsSchema = new Schema({
  name: String,
  desc: String,
  preview: String
})
const GoodsSchema = new Schema({
  title: {
    type: String, 
    required: [true, 'title required @_@~'],
    trim: true
  },
  desc: {
    type: String, 
    default: '',
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'price required @_@~']
  },
  unit: {
    type: String, 
    enum: ['1kg', '1份', '1个'],
    default: '1份'
  },
  quantity: {
    type: Number,
    default: 1,
  },
  preview: {
    type: String, 
    required: [true, 'preview required @_@~']
  },
  pictures: [String],
  tags: [{
    type: ObjectId,
    ref: 'Tag'
  }],
  scope: {
    type: String,
    default: ''
  },
  // 会生成id，不会生成独立的 collection
  material: [materialSchema],
  wrappings: [wrappingsSchema],
  content: {
    type: String,
    default: ''
  },
  user: {
    type: ObjectId,
    ref: 'User'
  },
  shop: {
    type: ObjectId,
    ref: 'Shop'
  },
  meta: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
})

GoodsSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

const Goods = mongoose.model('Goods', GoodsSchema)

export default Goods