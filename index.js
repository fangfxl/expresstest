const {
  User,
  Article,
  Sort,
  Labels,
  Comment,
  Message
} = require('./model')
var express = require('express')

const jwt = require('jsonwebtoken')
var app = express()
//跨域
app.use(require('cors')())
app.use(express.json())
const SECRET = 'aasaasaasdaswwq112'

//测试
app.get('/api', async (req, res) => {
  res.send('Hello Woqqrld!')
})
/**description
 * 用户
 */
//查询用户接口 
app.get('/api/users', async (req, res) => {
  const users = await User.find()
  res.send(users)
})
// 注册接口
app.post('/api/register', async (req, res) => {
  const user1 = await User.findOne({
    username: req.body.username
  })
  if (user1) {
    return res.send({
      massage: "用户名已存在！！"
    })
  } else {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      register_time: req.body.register_time,
      phone: req.body.phone,
      email: req.body.email,
      sex: req.body.sex
    })
    res.send({
      massage: "注册成功",
      user
    })
  }
})
// 登录接口
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  })
  if (!user) {
    return res.send({
      massage: '用户名不存在'
    })
  }
  const isPasswordVaild = require('bcryptjs').compareSync(
    req.body.password,
    user.password
  )
  if (!isPasswordVaild) {
    return res.send({
      massage: '密码错误！！'
    })
  }
  //生产token
  const token = jwt.sign({
    id: String(user.id)
  }, SECRET)
  res.send({
    massage: '登录成功',
    user,
    token
  })
})
// 获取个人信息
// 中间件写法
const auth = async (req, res, next) => {
  const raw = String(req.headers.authorization).split(' ').pop()
  //  const tokenData = jwt.verify(raw , SECRET)
  // 用结构方法获取放回的id
  const {
    id
  } = jwt.verify(raw, SECRET)
  req.user = await User.findById(id)
  next()
}
app.get('/api/profile', auth, async (req, res) => {
  res.send(req.user)
})
/**
 * description
 * 文章接口
 */
// 查询文章列表
app.get('/api/articles', async (req, res) => {
  const articles = await Article.find()
  res.send(articles)
})
// 添加文章
app.post('/api/addArticle', async (req, res) => {
  const article = await Article.create({
    title: req.body.title,
    content: req.body.content,
    Image: req.body.image,
    time: req.body.time,
    author: req.body.author,
    views: req.body.views,
    count: req.body.count,
    sort: req.body.sort,
    label: req.body.label
  })
  res.send(article)
})

//删除文章
app.delete('/api/deleteArticles/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.send({
    status: true
  })
})
//查询文章详情
app.post('/api/articleDetails', async (req, res) => {
  const details = await Article.findById(req.body.id)
  res.send(details)
})
//修改文章
app.put('/api/updateArticle', async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.body._id, req.body)
  res.send(article)
})
//删除广告

/**
 * description
 *  分类
 * 
 */

//查询分类详情
app.post('/api/sortDetails', async (req, res) => {
  const details = await Sort.findById(req.body.id)
  res.send(details)
})
//修改分类
app.put('/api/updateSort', async (req, res) => {
  const updatesort = await Sort.findByIdAndUpdate(req.body._id, req.body)
  res.send(updatesort)
})
// 删除分类
app.delete('/api/deleteSort/:id', async (req, res) => {
  await Sort.findByIdAndDelete(req.params.id)
  res.send({
    status: true
  })
})
// 查询分类
app.get('/api/sort', async (req, res) => {
  const Sorts = await Sort.find()
  res.send(Sorts)
})
// 添加分类
app.post('/api/addSort', async (req, res) => {
  const sortname = await Sort.findOne({
    Sort_name: req.body.name,
  })
  if (sortname) {
    return res.send({
      massage: "分类已存在！！"
    })
  } else {
    const addsort = await Sort.create({
      Sort_name: req.body.name,
      sort_description: req.body.description
    })
    res.send({
      massage: "分类添加成功",
      addsort
    })
  }
})

/**
 * description
 * 标签
 */
// 查询标签
app.get('/api/label', async (req, res) => {
  const labels = await Labels.find()
  res.send(labels)
})
// 添加标签
app.post('/api/addLabel', async (req, res) => {
  const labelname = await Labels.findOne({
    label_name: req.body.name,
  })
  if (labelname) {
    return res.send({
      massage: "分类已存在！！"
    })
  } else {
    const addLabel = await Labels.create({
      label_name: req.body.name,
      label_description: req.body.description
    })
    res.send({
      massage: "标签添加成功",
      addLabel
    })
  }
})
// 删除标签
app.delete('/api/deleteLabel/:id', async (req, res) => {
  await Labels.findByIdAndDelete(req.params.id)
  res.send({
    status: true
  })
})
//查询标签详情
app.post('/api/labelDetails', async (req, res) => {
  const details = await Labels.findById(req.body.id)
  res.send(details)
})
//修改标签
app.put('/api/updateLabel', async (req, res) => {
  const updateLabel = await Labels.findByIdAndUpdate(req.body._id, req.body)
  res.send(updateLabel)
})


/**
 * description
 * 评论
 */
app.get('/api/Comments', async (req, res) => {
  const Comments = await Comment.find()
  res.send(Comments)
})
//发表评论
app.post('/api/Comment', async (req, res) => {
  const comment = await Comment.create({
    username: req.body.name,
    article_id:req.body.article_id,
    time: req.body.time,
    content: req.body.content,
    isShow:req.body.isShow,
    replay: req.body.replay
  })
  res.send(comment)
})
//回复评论
app.put('/api/replayComment', async (req, res) => {
  const replayComment = await Comment.findByIdAndUpdate(req.body._id, {
    $push: {
      "replay": req.body.replay
    }
  })
  res.send(replayComment)
})

/**
 * description
 * 留言
 */
app.get('/api/leaveMessage', async (req, res) => {
  const leaveMessages = await Message.find()
  res.send(leaveMessages)
})
//删除留言
app.delete('/api/LeaveMS', async (req, res) => {
  await Message.findByIdAndDelete(req._id)
  res.send({
    status: true

  })
})
//发布留言
app.post('/api/addLM', async (req, res) => {
  const message = await Message.create({
    createTime: req.body.createTime,
    content: req.body.content,
    Name: req.body.name,
    Iurl: req.body.Iurl,
    isShow:req.body.isShow,
    replay: req.body.replay
  })
  res.send(message)
})
//回复留言
app.put('/api/updateLM', async (req, res) => {
  const updateLM = await Message.findByIdAndUpdate(req.body._id, {
    $push: {
      "replay": req.body.replay
    }
  })
  res.send(updateLM)
})

app.listen(3000, function () {
  console.log('http://localhost:3000/api')
})