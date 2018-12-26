import mongoose from 'mongoose'

const Schema = mongoose.Schema
const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  meta: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
})

tagSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

const Tag = mongoose.model('Tag', tagSchema)

export default Tag