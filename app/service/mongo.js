import mongoose from 'mongoose'

export default function connect (uri) {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true)
  }
  mongoose.set('useCreateIndex', true)
  mongoose.connect(uri, { useNewUrlParser: true })
  mongoose.connection.on('disconnect', () => {
    throw new Error('Mongodb 连接失败 @_@~')
  })
  mongoose.connection.on('error', err => {
    throw new Error('Mongodb 连接失败 @_@~')
  })
  mongoose.connection.on('open', () => {
    console.log('Mongodb connected ^_^~')
  })
}







