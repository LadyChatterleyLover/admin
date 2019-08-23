<template>
  <div class="container">
    <div class="form">
      <el-card style="width: 30%">
        <div slot="header" style="text-align: center">
          <h1>欢迎来到小爱后台管理系统</h1>
        </div>
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm"
                 label-position="left">
          <el-form-item label="请输入用户名" prop="username">
            <el-input v-model="form.username" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="请输入密码" prop="password" class="el_input_item">
            <el-input v-model="form.password" style="width: 300px;" type="password"></el-input>
          </el-form-item>
          <el-form-item label="请输入电话" prop="phone" class="el_input_item">
            <el-input v-model="form.phone" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="请输入邮箱" prop="email" class="el_input_item">
            <el-input v-model="form.email" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="请输入验证码" prop="code">
            <div class="flex">
              <div>
                <el-input v-model="form.sms" style="width: 300px;"></el-input>
              </div>
              <div class="sms">
                <el-button type="success" @click="sendSms" class="send">{{text}}</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="flex" style="justify-content: space-around">
              <el-button class="btn1" type="primary" @click="login">立即登录</el-button>
              <el-button type="primary" @click="register"  :loading="loading">立即注册</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      let checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      }
      return {
        timer: null,
        time: 30,
        text: '发送验证码',
        loading: false,
        form: {
          username: '',
          password: '',
          email: '',
          code: '',
          phone: '',
          sms: '',
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {max: 10, message: '用户名最多为10位', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, message: '密码最少为6位', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱'}
          ],
          phone: [
            {required: true, validator: checkPhone, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码',trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      sendSms() {
        if (this.timer) clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.time--
          if (this.time === 0) {
            this.text = '重新发送'
            this.time = 30
            clearInterval(this.timer)
          } else {
            this.text = '已发送' + this.time + 's'
          }
        }, 1000)
        this.$com.req('api/users/sendMsg', {
          phone: this.form.phone
        }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: res.msg
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      login() {
        this.$router.push('/login')
      }
      ,
      register() {
        this.loading = true
        this.$com.req('api/users/register', {
          username: this.form.username,
          password: this.form.password,
          email: this.form.email,
          phone: this.form.phone,
          sms: this.form.sms
        }).then(res => {
          if (res.code === 200) {
            this.loading = false
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.$router.push('/login')
          } else {
            this.loading = false
            this.$message({
              type: 'error',
              message: res.msg
            })
            this.form.sms = ''
          }
        })
      }
    },
    mounted() {

    }
  }
</script>

<style scoped lang="scss">
  .container {
    width: 100vw;
    height: 100vh;
    background: url("../../assets/bj.jpg") no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;

    .form {

    }

    .flex {
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;

      .btn1 {
        position: relative;
        right: 100px;
      }
    }

    .form {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .captcha {
        width: 80px;
        height: 60px;
        margin-left: 30px;
        cursor: pointer;

        .img {
          display: block;
          height: 100%;
        }
      }
    }
  }

  .sms {
    position: absolute;
    right: 3%;
  }

  .send {
    width: 98px;
    display: flex;
    justify-content: center;
  }

</style>
