const router = require('koa-router')()
const Calendar = require('../models/Calendar')
const User = require('../models/User')
const Dynamic = require('../models/Dynamic')
const multer = require('koa-multer')

router.get('/', async (ctx, next) => {
  ctx.body = 'hell koa2'
})

// 获取日程
router.get('/calendar', async ctx => {
  let res = await Calendar.find()
  if (res.length > 0) {
    ctx.body = {
      code: 200,
      msg: 'success',
      data: res
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '暂无日程',
      data: null
    }
  }
})

// 添加日程
router.post('/calendar', async ctx => {
  let newSchedule = new Calendar(ctx.request.body)
  let res = await newSchedule.save()
  if (res) {
    ctx.body = {
      code: 200,
      msg: '添加日程成功',
      data: newSchedule
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '添加日程失败',
      data: null
    }
  }
})

// 删除日程
router.post('/delCalendar', async ctx => {
  let id = ctx.request.body.id
  let res = await Calendar.findByIdAndRemove(id)
  if (res) {
    ctx.body = {
      code: 200,
      msg: '删除成功'
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '删除失败'
    }
  }
})

//加载koa-multer模块
//文件上传
//配置
let storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    let fileFormat = (file.originalname).split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
let upload = multer({storage: storage});
//路由
router.post('/upload', upload.single('file'), async (ctx, next) => {
  let id = ctx.session.user._id
  let path = ctx.req.file.path
  path = path.replace('public', '')
  let url = `${ctx.origin}${path}`
  let res = await User.findByIdAndUpdate(id, {
    avatar: url
  })
  if (res) {
    ctx.body = {
      filename: ctx.req.file.filename,
      path: ctx.req.file.path,//返回文件名
      url: `${ctx.origin}${path}`
    }
  }
})

// 发布动态
router.post('/addDynamic', async ctx => {
  let newDynamic = new Dynamic(ctx.request.body)
  let res = await newDynamic.save()
  if (res) {
    ctx.body = {
      code: 200,
      msg: '添加动态成功',
      data: newDynamic
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '添加动态失败',
      data: null
    }
  }
})

// 获取动态
router.get('/getDynamic', async ctx => {
  let res = await Dynamic.find()
  if (res.length > 0) {
    ctx.body = {
      code: 200,
      msg: 'success',
      data: res
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '暂无数据',
      data: null
    }
  }
})



module.exports = router
