import mongoose from 'mongoose'

import TagModel from '../app/models/tag.model'
import GoodsModel from '../app/models/goods.model'


const ObjectId = mongoose.Types.ObjectId

function connect (config) {
  return new Promise((resolve, reject) => {
    mongoose.set('useCreateIndex', true)
    mongoose.set('debug', true)
    mongoose.connect(config)
    mongoose.connection.on('disconnect', () => {
      reject(new Error('Mongodb disconnect @_@~'))
    })
    mongoose.connection.on('error', err => {
      reject(new Error('Mongodb error @_@~')) 
    })
    mongoose.connection.on('open', () => {
      console.log('Mongodb connected! ^_^~')
      resolve(mongoose.connection)
    })
  }) 
}

connect('mongodb://localhost:27017/shopping-mall')
.then((connection) => {
  console.log('connection------------------')

  GoodsModel.findById('5c23363d80f5f42420295716')
  .populate('tags')
  .exec((err, doc) => {
    if (err) {
      console.log('err----------------')
      console.log(err)
    } else {
      console.log('doc----------------')
      console.log(doc)
    }
  })

  // const goods = new GoodsModel({
  //   title: '哈根达斯66666666666666666666666',
  //   price: 45.99,
  //   tags: [
  //     ObjectId("5c232c36b5147f42585cd7b8"),
  //     ObjectId("5c232cc409b38004e8aa6d5b")
  //   ],
  //   material: [{
  //     name: 'material 奶油',
  //     desc: 'material 奶油 desc',
  //     preview: 'material 奶油 preview'
  //   }],
  //   wrappings: [{
  //     name: 'wrappings 奶油',
  //     desc: 'wrappings 奶油 desc',
  //     preview: 'wrappings 奶油 preview'
  //   }]
  // })
  // goods.save((err, product) => {
  //   if (err) {
  //     console.log('err----------------')
  //     console.log(err)
  //   } else {
  //     console.log('product----------------')
  //     console.log(product)
  //   }
  // })

}).catch((e) => {
  console.log('e------------------------------------')
  console.log(e)
})





