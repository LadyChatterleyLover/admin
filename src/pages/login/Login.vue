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
            <div class="flex">
              <div>
                <el-input v-model="form.password" style="width: 200px;" type="password"></el-input>
              </div>
              <div class="sms">
                <el-button type="success" @click="send" class="send">忘记密码</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="请输入验证码" prop="code">
            <div class="flex">
              <div>
                <el-input v-model="form.code" style="width: 200px;"></el-input>
              </div>
              <div class="captcha" @click="getCaptcha">
                <div v-html="captcha"></div>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="flex" style="justify-content: space-around">
              <el-button class="btn1" type="primary" @click="login" :loading="loading">立即登录</el-button>
              <el-button type="primary"  @click="register">立即注册</el-button>
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
      return {
        loading: false,
        captcha: '',
        form: {
          username: '',
          password: '',
          code: ''
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
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getCaptcha() {
        this.$com.req('api/users/captcha').then(res => {
          this.captcha = res
        }).catch(err => {
          console.log(err)
        })
      },
      register() {
        this.$router.push('/register')
      },
      login() {
        this.loading = true
        this.$com.req('api/users/login', {
          username: this.form.username,
          password: this.form.password,
          code: this.form.code,
        }).then(res => {
          if (res.code === 200) {
            this.loading = false
            localStorage.setItem('adminToken', res.token)
            localStorage.setItem('adminUser', JSON.stringify(res.data[0]))
            this.$store.state.user = res.data[0]
            this.$message({
              type: 'success',
              message: '登录成功'
            })
            this.$router.push('/')
          } else {
            this.loading = false
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      },
      send () {
        this.$router.push('/findPwd')
      }
    },
    mounted() {
      this.getCaptcha()
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
    left: 65%;
  }

</style>
