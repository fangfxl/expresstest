const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/express-TextDecoderStream',{
  useCreateIndex:true,
  useNewUrlParser:true,
  useUnifiedTopology: true,
})
mongoose.set('useFindAndModify', false)
// 用户表格
const UserSchema = new mongoose.Schema({
  username: { type: String ,unique:true},
  password: { 
    type: String ,
    set(val){
      return require('bcryptjs').hashSync(val,10)
    }
  },
  register_time:{type: Date},
  phone:{type:String},
  email:{type: String},
  // sex: {type: String},
})

// 文章表格
const ArticleSchema = new mongoose.Schema({
  author: { type : String },
  title: { type : String },
  views:{ type: Number},
  count:{ type: Number},
  content:{ type: String },
  image: {type: String },
  time:{type:String},
  sort: { type:String },
  label:{ type:String },
})
// 分类表
const sortSchema = new mongoose.Schema({
    Sort_name:{type:String},
    sort_description:{type:String}
})
// 标签表
const labelSchema = new mongoose.Schema({
  label_name:{type:String},
  label_description:{type:String}
})
// 评论表
const commentSchema = new mongoose.Schema({
  username:{type:String},
  article_id:{type:String},
  time:{type:String},
  isShow:{type:Boolean},
  content:{type:String},
  replay:[
    {
      name:{type:String},
      replayTime:{type:String},
      content:{type:String},
      isShow:{type:Boolean},
      parentName:{type:String}
    }
  ]
})
//留言表
const leaveMessageSchema = new  mongoose.Schema({
  createTime:{ type: String },
  content:{type:String},
  Name:{type:String},
  Iurl:{type:String},
  isShow:{type:Boolean},
  replay:[
    {
      name:{type:String},
      replayTime:{type:String},
      Iurl:{type:String},
      content:{type:String},
      parentName:{type:String},
      isShow:{type:Boolean},
    }
  ]
})

const User = mongoose.model('User', UserSchema)
const Article = mongoose.model('Article', ArticleSchema)
const Sort = mongoose.model('Sort', sortSchema )
const Labels = mongoose.model('Labels', labelSchema)
const Comment = mongoose.model('Comment',commentSchema)
const Message = mongoose.model('Message',leaveMessageSchema)
// User.db.dropCollection('users')//删除用户数据
// Article.db.dropCollection('articles')
// Sort.db.dropCollection('sorts')
// Message.db.dropCollection('messages')
//Labels.db.dropCollection('labels')
  // Comment.db.dropCollection('comments')
module.exports = { User , Article , Sort , Labels ,Comment, Message }