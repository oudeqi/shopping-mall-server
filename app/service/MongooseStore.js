import mongoose from 'mongoose'

const schema = {
  _id: String,
  data: Object,
  updatedAt: {
      default: new Date(),
      expires: 86400,
      type: Date
  }
}
export default class MongooseStore {
  constructor ({
    collection = 'sessions',
    // mongoose = mongoose,
    expires = 86400,
    name = 'Session'
  } = {}) {
    const updatedAt = { ...schema.updatedAt, expires }
    const { Schema } = mongoose
    this.Session = mongoose.model(name, new Schema({ ...schema, updatedAt }), collection)
  }

  async destroy (id) {
    console.log('destroy----------------------------------------------')
    const { Session } = this
    return Session.remove({ _id: id })
  }

  async get (id) {
    console.log('get----------------------------------------------')
    const { Session } = this
    const { data } = await Session.findById(id) || {}
    return data
  }

  async set (id, data, maxAge, { changed, rolling }) {
    console.log('set----------------------------------------------')
    if (changed || rolling) {
      const { Session } = this
      const record = { _id: id, data, updatedAt: new Date() }
      await Session.findByIdAndUpdate(id, record, { upsert: true, safe: true })
    }
    return data
  }

  // static create (opts) {
  //   console.log('create----------------------------------------------')
  //   return new MongooseStore(opts)
  // }
}