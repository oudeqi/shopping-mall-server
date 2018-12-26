# 创建schemas
``` bash
var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdOn: Date
});
```

# schemas中的数据类型有以下几种：
* String
* Number
* Date
* Boolean
* Buffer
* ObjectId
* Mixed
* Array  

特别需要说明ObjectId类型、Mixed类型、Array类型，在schemas中声明这几种类型的方式如下：
``` bash
// ObjectId就类似于唯一键值
projectSchema.add({
  owner: mongoose.Schema.Types.ObjectId
})

// 混合类型，就是说里面可以放置任意类型的数据，有两种方式创建该类型数据
// 方式一：直接赋予一个空的字面量对象
vardjSchema= new mongoose.Schema({
  mixedUp: {}
})
// 方式二：根据Schemas.Types中值来赋予
vardjSchema= new mongoose.Schema({
  mixedUp: Schema.Types.Mixed
})

// Array类型数据有两种创建方式，一种是简单数组创建：
var userSchema = new mongoose.Schema({
  name: String,
  emailAddresses: [String]
})
// 第二种方式就是复杂类型数据数组，例如我们可以再数组中添加不同类型的schemas:
var emailSchema = new mongoose.Schema({
  email: String,
  verified: Boolean
})
var userSchema = new mongoose.Schema({
  name: String,
  emailAddresses: [emailSchema]
})

// 注意：如果定义一个空的数据的话，则会创建为一个混合类型数据的数组：
var emailSchema = new mongoose.Schema({
  email: String,
  verified: Boolean
})
var userSchema = new mongoose.Schema({
  name: String,
  emailAddresses: [emailSchema]
})
```

# 给schema创建静态方法
可以给schema创建静态方法，这个静态方法将来会用在Model中，创建该静态方法需要在创建完成schema之后，在Model编译之前：
``` bash
projectSchema.statics.findByUserID = function (userid, callback) {
  this.find(
    { createdBy: userid }, 
    '_id projectName', 
    {sort: 'modifiedOn'}, 
    callback);
}
// 在其对应的模型创建完成并编译后，我们就可以像下面这样来调用该静态方法了：
Model.findByUserID(userid,callback);
```

# 创建Model
``` bash
Mongoose.Model('User', userSchema);
// 参数一为Model的名字，
// 参数二为生成Model所需要的schema
// Model就像是schema所编译而成的一样。
```
mongoose连接数据库是有两种方式的

``` bash
// 方式一：
var dbURI = 'mongodb://localhost/mydatabase'
mongoose.connect(dbURI)

// 方式二：
var dbURI = 'mongodb://localhost/myadmindatabase'
var adminConnection = mongoose.createConnection(dbURI)

// 如果需要声明端口号：
var dbURI = 'mongodb://localhost:27018/mydatabase'
// 如果需要定义用户名和密码：
var dbURI = 'mongodb://username:password@localhost/mydatabase'
// 也可以像下面这样传一个对象类型的参数：
var dbURI = 'mongodb://localhost/mydatabase'
var dbOptions = {'user':'db_username','pass':'db_password'}
mongoose.connect(dbURI, dbOptions)
```

根据连接数据库的方式，我们可以得到第二种创建Model的方式，就是使用数据库连接的引用名来创建：

``` bash
adminConnection.model( 'User', userSchema)
// 默认情况下mongoose会根据我们传入的Model名字来生成collection名字
// 在上面的代码中就会生成名为users(全为小写字母)的collection(集合)
```

有两种方法能让我们自定义collection的名字。
``` bash
// 方式一，在创建schema的时候定义collection的名字：
var userSchema = new mongoose.Schema(
  {
    name: String,
    email: {type: String, unique:true}
  },
  {
    collection: 'myuserlist'
  }
)

// 方式二，在创建Model的时候定义collection的名字：
mongoose.model( 'User', userSchema, 'myuserlist' );
```

# 创建Model实例
``` bash

var user = new User({ name: 'Simon' });
// user就是模型User的一个实例，

// 它具有mongoose中模型所具有的一些方法，例如保存实例：
user.save(function (err) {
  if (err) return handleError(err);
})

```
模型也具有一些常用的增删查改的方法
``` bash
User.findOne({'name' : 'Sally', function(err,user) {
  if(!err){
    console.log(user);
  }
})
User.find({}, function(err, users) {
  if(!err){
    console.log(users);
  }
})

// 可以使用链式方式使用这些方法，例如：
var newUser = new User({
  name: 'Simon Holmes',
  email: 'simon@theholmesoffice.com',
  lastLogin : Date.now()
}).save( function( err ){
  if(!err){
      console.log('User saved!');
  }
})

// 上面的代码创建了一个模型实例，然后进行保存。
// 我们有一个更为简介的方式来完成这项工作，就是使用 Model.create()方法

User.create(
  {
    name: 'Simon Holmes',
    email: 'simon@theholmesoffice.com',
    lastLogin : Date.now()
  }, 
  function( err, user ){
    if(!err){
      console.log('User saved!');
      console.log('Saved user name: ' + user.name);
      console.log('_id of saved user: ' + user._id);
    }
  }
)
```

# 查找数据和读取数据的方法
``` bash
var myQuery = User.find({'name' : 'Simon Holmes'})
.where('age').gt(18)
.sort('-lastLogin')
.select('_id name email')
.exec(function (err, users){
  if (!err){
    console.log(users); // output array of users found
  }
})
// 上面代码中的第一行创建了一个query，查找名字为"Simon Holmes"，
// 并且年龄大于18岁，
// 查找结果根据lastLogin降序排列，
// 只获取其中的_id, name, email三个字段的值，
// 上面的代码只有在调用exec方法后才真正执行数据库的查询。
 
// 也有另外一种方式能够直接查找数据库的，
// 就是直接在查找方法中添加回调函数，使用方式为
// Model.find(conditions, [fields], [options], [callback])

User.find({'name', 'simon holmes'}, function(err, user) {})

User.find({'name', 'simon holmes'}, 'name email',function(err, user) {
  console.log('some thing')
})

User.find(
  {'name' : 'Simon Holmes'},
  null, // 如果使用null，则会返回所有的字段值
  {sort : {lastLogin : -1}}, // 降序排序
  function (err, users){
    if (!err){console.log(users);}
  }
)
```
列举几个比较实用的查找方法：
``` bash
Model.find(query);
Model.findOne(query);//返回查找到的所有实例的第一个
Model.findById(ObjectID);//根据ObjectId查找到唯一实例

User.findOne(
  {'email' : req.body.Email},
 '_id name email',
 function(err, user) { }
;
```

有三种方式来更新数据：
``` bash
update(conditions,update,options,callback); 
// 该方法会匹配到所查找的内容进行更新，不会返回数据；

findOneAndUpdate(conditions,update,options,callback);
// 该方法会根据查找去更新数据库，另外也会返回查找到的并未改变的数据；

findByIdAndUpdate(conditions,update,options,callback);
// 该方法跟上面的findOneAndUpdate方法功能一样，
// 不过他是根据ID来查找文档并更新的。

// 三个方法都包含四个参数：
// conditions:查询条件
// update:更新的数据对象，是一个包含键值对的对象
// options:是一个声明操作类型的选项，这个参数在下面再详细介绍
// callback:回调函数
```
对于options参数，在update方法中和findOneAndUpdate、findByIdAndUpdate两个方法中的可选设置是不同的；
``` bash
// 在update方法中，options的可选设置为：
{
  safe:true|false,  //声明是否返回错误信息，默认true
  upsert:false|true, 
  //声明如果查询不到需要更新的数据项，是否需要新插入一条记录，默认false
  multi:false|true,  //声明是否可以同时更新多条记录，默认false
  strict:true|false  //声明更新的数据中是否可以包含在schema定义之外的字段数据，默认true
}

// 对于findOneAndUpdate、findByIdAndUpdate这两个方法，他们的options可选设置项为：
{
  new:true|false, 
  //声明返回的数据时更新后的该是更新前的，如果为true则返回更新后的，默认true
  upsert:false|trure, 
  sort:javascriptObject, 
  //如果查询返回多个文档记录，则可以进行排序，在这里是根据传入的javascript object对象进行排序
  select:String //这里声明要返回的字段，值是一个字符串
}

// 例子
User.update(
  {_id:user._id},
  {$set: {lastLogin: Date.now()}},
  function(){}
)

```

# 数据删除
跟更新数据一样，也有三种方法给我们删除数据：
* remove();
* findOneAndRemove();
* findByIdAndRemove();  

remove方法有两种使用方式，一种是用在模型上，另一种是用在模型实例上，例如：
``` bash
User.remove({ name : /Simon/ } , function (err){
  if (!err){
    // 删除名字中包含simon的所有用户
  }
});
  
User.findOne(
  { email : 'simon@theholmesoffice.com'},
  function (err,user){
    if (!err){
      user.remove( function(err){
        // 删除匹配到该邮箱的第一个用户
      })
    }
  }
)

User.findOneAndRemove(
  {name : /Simon/},
  {sort : 'lastLogin', select : 'name email'},
  function (err, user){
    if (!err) {
      console.log(user.name + " removed");
      // Simon Holmes removed
    }
  }
)

User.findByIdAndRemove(
  req.body._id,
  function (err, user) {
    if(err){
      console.log(err);
      return;
    }
      console.log("User deleted:", user);
  }
)
```

# 数据验证
数字类型schemasType
``` bash
// 对于Number类型的数据，具有min,max提供用来界定最大最小值：
var teenSchema = new Schema({
  age: {type: Number, min: 13, max:19}
})
```

字符串类型SchemasType
``` bash
// 对于该类型数据，mongoose提供了两种验证器：
// match:可使用正则表达式来匹配字符串是否符合该正则表达式的规则
// enum:枚举出字符串可使用的一些值分别举例如下：
var weekdaySchema = new Schema({
  day: {
    type: String, 
    match: /^(mon|tues|wednes|thurs|fri)day$/i
  }
});
 
var weekdays = ['monday', 'tuesday', 'wednesday', 'thursday','friday'];
var weekdaySchema = new Schema({
  day : {
    type: String, 
    enum: weekdays
  }
})
```

在进行一些数据库的时候，如果有错误，可能会返回一些错误信息，这些信息封装在一个对象中，该对象的数据格式大致如下：
``` bash
{ 
  message: 'Validation failed',
  name: 'ValidationError',
  errors:{ 
    email:{
      message: 'Validator "required" failed for path email',
      name: 'ValidatorError',
      path: 'email',
      type: 'required' 
    },
    name:{ 
      message: 'Validator "required" failed for path name',
      name: 'ValidatorError',
      path: 'name',
      type: 'required' 
    } 
  } 
}
// 知道该错误信息的具体格式之后，
// 可以从中得出我们想要的信息并反馈到控制台。
if(err){
  Object.keys(err.errors).forEach(function(key) {
    var message = err.errors[key].message;
    console.log('Validation error for "%s": %s', key, message);
  })
}
```

自定义数据验证
``` bash
var lengthValidator = function(val) {
  if (val && val.length >= 5){
    return true;
  }
  return false;
}

// 只需要在schema中添加validate键值对即可
// validate对应的值便是我们自定义的验证方法
name: {type: String, required: true, validate: lengthValidator }
 
var weekdaySchema = new Schema({
  day : {
    type: String, 
    validate: {validator:/^(mon|tues|wednes|thurs|fri)day$/i, 
    msg: 'Not a day' 
  }
})

// 将验证器写在schema外部，例如：
var validateLength = [
  {
    validator: lengthValidator, 
    msg: 'Too short'
  }
]
var validateLength = [lengthValidator, 'Too short' ] // 简写
var validateDay = [/^(mon|tues|wednes|thurs|fri)day$/i, 'Not a day']

// 传递多个验证器给schema
var validateUsername = [
  {validator: lengthValidator, msg: 'Too short'},
  {validator: /^[a-z]+$/i, msg: 'Letters only'}
]

// usage
name: {type: String, required: true, validate: validateLength }
day : {type: String, validate: validateDay }

// 还有另外一种方法给的schema提供验证器：
userSchema.path('name').validate(lengthValidator, 'Too short')
userSchema.path('name').validate(/^[a-z]+$/i, 'Letters only')

```
