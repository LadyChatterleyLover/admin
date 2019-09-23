<template>
  <div class="headerNav">
    <div class="top">
      <div class="title">{{$t('commons.xiaoai')}}{{$t('commons.admin')}}</div>
      <div class="t-right">
        <div class="select">
          <el-dropdown @command="changeLang" placement="bottom">
          <span class="el-dropdown-link">
            <img src="../../assets/lang.svg" alt="">
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="cn">简体中文</el-dropdown-item>
              <el-dropdown-item command="tw">繁體中文</el-dropdown-item>
              <el-dropdown-item command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div>
          <el-dropdown @command="handleCommand">
            <div class="com">
              <div class="img" v-if="user.avatar || user.avatar_url">
                <el-avatar :size="30" :src="user.avatar || user.avatar_url"></el-avatar>
              </div>
              <div class="img" v-else>
                <el-avatar :size="30" :src="user.avatar || user.avatar_url"></el-avatar>
<!--                <el-avatar :size="30" :src="circleUrl"></el-avatar>-->
              </div>
              <div class="name">
                {{$t('commons.dear')}}{{user.username || user.login}}
              </div>
              <div class="icon">
                <i class="el-icon-caret-bottom"></i>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="upload">
                <el-upload
                    class="avatar-uploader"
                    action="api/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                  <div>{{$t('commons.uploadAvatar')}}</div>
                </el-upload>
              </el-dropdown-item>
              <el-dropdown-item command="updatePwd">{{$t('commons.editPwd')}}</el-dropdown-item>
              <el-dropdown-item command="logout">{{$t('commons.logout')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          :modal-append-to-body="false"
          width="30%"
      >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
          <el-form-item label="请输入原密码" prop="password">
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="请输入新密码" prop="newPwd">
            <el-input v-model="ruleForm.newPwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="请确认新密码" prop="rePwd">
            <el-input v-model="ruleForm.rePwd" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="btn">
              <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
              <el-button @click="cal">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NavHeader',
    data() {
      return {
        user: {},
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        dialogVisible: false,
        ruleForm: {
          password: '',
          newPwd: '',
          rePwd: ''
        },
        rules: {
          password: [
            {required: true, message: '请输入原密码', trigger: 'blur'},
            {min: 6, message: '密码至少6位', trigger: 'blur'}
          ],
          newPwd: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 6, message: '密码至少6位', trigger: 'blur'}
          ],
          rePwd: [
            {required: true, message: '请确认密码', trigger: 'blur'},
            {min: 6, message: '密码至少6位', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      // 根据下拉框的中被选中的值切换语言
      handleCommand(command) {
        if (command === 'upload') {

        }
        if (command === 'updatePwd') {
          this.dialogVisible = true
        }
        if (command === 'logout') {
          this.$com.req('api/users/logout').then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              localStorage.removeItem('adminUser')
              localStorage.removeItem('adminToken')
              this.$router.push('/login')
            }
          })
        }
      },
      handleAvatarSuccess(res) {
        if (res) {
          this.$set(this.user, 'avatar', res.url)
          localStorage.setItem('adminUser', JSON.stringify(this.user))
          this.$message.success('上传成功')
        }
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isLt2M
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.newPwd !== this.ruleForm.rePwd) {
              this.$message.error('两次密码输入不一致,请重新输入')
              return
            }
            this.$com.req('api/users/updatePwd', {
              id: this.user._id,
              username: this.user.username,
              password: this.ruleForm.password,
              newPwd: this.ruleForm.newPwd
            }).then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.user.password = this.ruleForm.newPwd
                localStorage.setItem('adminUser', JSON.stringify(this.user))
                this.dialogVisible = false
                this.ruleForm.password = ''
                this.ruleForm.newPwd = ''
                this.ruleForm.rePwd = ''
              }
              if (res.code === 500) {
                this.$message.error(res.msg)
                this.ruleForm.password = ''
                this.ruleForm.newPwd = ''
                this.ruleForm.rePwd = ''
              }
            })
          } else {
            this.$message.error('表单输入错误,请检查后重新输入')
            return false;
          }
        });
      },
      cal() {
        this.dialogVisible = false
        this.$refs.ruleForm.resetFields()
        this.ruleForm.password = ''
        this.ruleForm.newPwd = ''
        this.ruleForm.rePwd = ''
      },
      changeLang(e) {
        localStorage.setItem('lang', e)
        this.$i18n.locale = e
      },
    },
    mounted() {
      if (localStorage.adminUser) {
        this.user = JSON.parse(localStorage.getItem('adminUser'))
      } else {
        this.user = {}
      }
    }
  }
</script>

<style scoped lang="scss">
  .headerNav {
    background: #fff;
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #2e5e85;
    position: fixed;
    top: 0;
    z-index: 99;
    border-bottom: 1px solid #f0f2f5;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .t-right {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        .select {
          position: absolute;
          left: -70px;
          cursor: pointer;
          .el-dropdown-link {
            display: flex;
            align-items: center;
            width: 24px;
            height: 24px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .title {
        padding-left: 30px;
        font-size: 18px;
      }

      .com {
        display: flex;
        align-items: center;
        position: relative;
        right: 30px;
        cursor: pointer;

        .img {
          width: 30px;
          height: 30px;
          margin-right: 6px;
        }

        .name {
          margin-right: 4px;
        }
      }
    }
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
</style>
