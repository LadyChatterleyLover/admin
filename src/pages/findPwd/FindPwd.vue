<template>
  <div class="container">
    <div class="form">
      <el-card>
        <div slot="header" style="text-align: center">
          <h1>欢迎来到小爱后台管理系统</h1>
        </div>
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm"
                 label-position="left">
          <el-form-item label="请输入用户名" prop="username">
            <el-input v-model="form.username" style="width: 300px;" placeholder="请输入注册时用的用户名"></el-input>
          </el-form-item>
          <el-form-item label="请输入邮箱" prop="email">
            <el-input v-model="form.email" style="width: 300px;" placeholder="请输入注册时用的邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="flex" style="justify-content: space-around">
              <el-button class="btn1" type="primary" @click="login">立即登录</el-button>
              <el-button type="primary"  @click="find" :loading="loading">找回密码</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>

</template>

<script>
  export default {
    name: "FindPwd",
    components: {},
    props: {},
    data() {
      return {
        loading: false,
        captcha: '',
        form: {
          username: '',
          email: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {max: 10, message: '用户名最多为10位', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱'}
          ],
        }
      }
    },
    methods: {
      find () {
        this.loading = true
        this.$com.req('api/users/findPwd', {
          username: this.form.username,
          email: this.form.email
        }).then(res => {
          if (res.code === 200) {
            console.log(res)
            this.loading = false
            this.$message({
              type: 'success',
              message: res.msg
            })
          } else {
            this.loading = false
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        }).catch(err => {
          this.loading = false
        })
      },
      login () {
        this.$router.push('/login')
      }
    },
    mounted() {

    },
    created() {

    },
    filters: {},
    computed: {},
    watch: {},
    directives: {}
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
    left: 40%;
  }

</style>
