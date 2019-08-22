const router = require('koa-router')()
const Calendar = require('../models/Calendar')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})


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

module.exports = router
