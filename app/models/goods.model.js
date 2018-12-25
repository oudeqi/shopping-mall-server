// # 关于计算
// 1. 单价---计算单位---单位补充文字 --- 算总价
// 2. 10元 * 1kg --- 每千克大约4-5个 --- 10元/kg * n = totalPrice
// 3. 10元 * 1个 --- 每个大约2斤     --- 10元/个 * n = totalPrice （算出重量单价 10/2 元/kg）

// Unit Price calcUnit: String

import mongoose from 'mongoose'

const Schema = mongoose.Schema
const GoodsSchema = new Schema({
  title: {
    type: String, 
    required: [true, 'title required @_@~']
  },
  desc: {
    type: String, 
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
  tags: [],
  scope: String, // 配送范围
  material: [],
  wrappings: [],
  // details: String,// /Goods/:goodsID
  content: String,
  user: String,
  shop: String,
  meta: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
})

const Goods = mongoose.model('Goods', GoodsSchema)

export default Goods