const router = require('koa-router')()
const svgCaptcha = require('svg-captcha')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const secret = 'lpwq 1225'
const nodemailer = require('nodemailer')
const rp = require('request-promise')
const {msgKey, emailPass, clientId, clientSecret, appId, appSecret} = require('../config')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

// 图形验证码
router.get('/captcha', async ctx => {
  const cap = svgCaptcha.create({
    size: 4, // 验证码长度
    width: 160,
    height: 60,
    fontSize: 50,
    ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
    noise: 2, // 干扰线条的数量
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    background: '#87ceeb' // 验证码图片背景颜色
  })
  ctx.session.captcha = cap.text
  ctx.response.type = 'image/svg+xml'
  ctx.body = cap.data
})

// 注册
router.post('/register', async ctx => {
  let {
    username,
    password,
      sms
  } = ctx.request.body
  let newUser = new User({
    username,
    password
  })
  let user = await User.find({
    username
  })
  if (sms !== ctx.session.sms) {
    ctx.body = {
      code: 500,
      msg: '验证码不正确,请重新输入'
    }
  } else {
    if (user.length > 0) {
      ctx.body = {
        code: 500,
        msg: '用户已存在'
      }
    } else {
      let res = await newUser.save()
      if (res) {
        ctx.body = {
          code: 200,
          msg: '注册成功'
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '注册失败'
        }
      }
    }
  }
})

// 登录
router.post('/login', async ctx => {
  let {username, password, code} = ctx.request.body
  let user = await User.find({
    username,
    password
  })

  let token = jwt.sign({
    username: username
  }, secret, {
    expiresIn: '1h'
  })
  if (code.toLowerCase() === (ctx.session.captcha).toLowerCase()) {
    if (user.length > 0) {
      ctx.session.user = user[0]
      ctx.body = {
        code: 200,
        data: ctx.session.user,
        token,
        msg: '登录成功'
      }
    } else {
      ctx.body = {
        code: 500,
        data: null,
        msg: '用户不存在'
      }
    }
  } else {
    ctx.body = {
      code: 500,
      data: null,
      msg: '验证码不正确'
    }
  }
})

// 删除用户
router.post('/delete', async ctx => {
  let id = ctx.request.body.id
  let res = await User.findByIdAndRemove(id)
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

// 修改密码
router.post('/updatePwd', async ctx => {
  let { username, password, id, newPwd} = ctx.request.body
  let user = await User.findOne({
    username,
    password
  })
  if (user) {
    if (password === newPwd) {
      ctx.body = {
        code: 500,
        msg: '新密码不能与原密码相同'
      }
    } else {
      let res = await User.findByIdAndUpdate(id, {
        username,
        password: newPwd
      })
      if (res) {
        ctx.body = {
          code: 200,
          msg: '修改成功'
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '修改失败'
        }
      }
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '原密码不正确,请重新输入'
    }
  }
})

// 找回密码
router.post('/findPwd', async ctx => {
  let {
    username,
    email
  } = ctx.request.body
  let user = await User.findOne({
    username: username
  })
  if (user) {
    let transporter = await nodemailer.createTransport({
      service: 'qq', // 邮箱类型
      secure: true,
      auth: {
        user: '285258675@qq.com',
        pass: emailPass
      }
    })

    let mailOptions = {
      from: '你的小可爱 285258675@qq.com', // 从哪个邮箱发送
      to: email,
      subject: '找回密码', // 标题
      text: `您用户名为${user.username}的密码是${user.password}`
      // cc: '抄送',
      // bcc: '私密发送'
    }

    // 发送邮件
    let info = await transporter.sendMail(mailOptions)
    if (!info) {
      ctx.body = {
        code: 500,
        msg: '发送失败'
      }
    } else {
      ctx.body = {
        code: 200,
        data: info,
        msg: `密码已成功发送在至您${email}的邮箱中`
      }
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '用户不存在'
    }
  }
})

// 获取全部用户
router.get('/allUser', async ctx => {
  let user = await User.find()
  if (user.length > 0) {
    ctx.body = {
      code: 200,
      user,
      msg: 'success'
    }
  } else {
    ctx.body = {
      code: 500,
      user,
      msg: '用户不存在'
    }
  }
})

// 发送短信验证码
router.post('/sendMsg', async ctx => {
  let {phone} = ctx.request.body
  let code = ('000000' + Math.floor(Math.random() * 999999)).slice(-6)
  let options = {
    method: 'GET',
    url: 'http://apis.haoservice.com/sms/sendv2',
    qs: {
      mobile: phone,
      tpl_id: 5194,
      content: `【小爱在线】您的验证码为${code},如非本人操作,请忽略此条短信。该验证码5分钟之内有效,感谢您对我们的支持。`,
      key: msgKey
    }
  }
  try {
    let res = rp(options)
    if (res) {
      ctx.session.sms = code
      ctx.body = {
        code: 200,
        msg: '短信发送成功',
        data: code
      }
    }
  } catch (e) {
    console.log(e);
  }
})

router.get('/logout', async ctx => {
  ctx.session.user = null
  ctx.body = {
    code: 200,
    msg: '退出成功'
  }
})


module.exports = router
