<template>
  <div class="container">
    <div class="top">
      <div style="margin-bottom: 10px">
        请填写您的转账信息
      </div>
      <div class="t-item">
        请务必是你本人操作,确认转账金额及收款人信息
      </div>
    </div>
    <div class="desc">
      <el-card>
        <div class="content">
          <div class="c-item" v-for="(item, index) in info" :key="item.id">
            <div class="flex">
              <div class="circle" :class="[{'c-back': active <=index}, {'c-next': active >index}]" >
                <div v-if="active <= index">{{index + 1}}</div>
                <div v-if="active > index">
                  <i class="el-icon-check"></i>
                </div>
              </div>
              <div class="c-info">
                {{item.info}}
              </div>
            </div>
            <div class="line" v-if="index < 2"></div>
          </div>
        </div>
        <div class="c-desc" v-if="active === 0">
          <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
            <el-form-item label="付款账户:" prop="account1">
              <el-input v-model="form.account1"></el-input>
            </el-form-item>
            <el-form-item label="收款账户:" prop="account2">
              <div style="display: flex;align-items: center">
                <el-select v-model="value">
                  <el-option
                      v-for="item in selectOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
                <el-input v-model="form.account2"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="付款人姓名:" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="收款金额:" prop="money">
              <el-input v-model.number="form.money">
                <div slot="prefix" style="color: #777;font-size: 20px">￥</div>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div style="text-align: center">
                <el-button type="primary" @click="next('ruleForm')">下一步</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="active === 1" class="flex" style="justify-content: center">
          <div class="sure">
            <div class="alert">
              <el-alert
                  title="确认转账后，资金将直接打入对方账户，无法退回。"
                  type="warning"
                  show-icon>
              </el-alert>
            </div>
            <div>
              <div class="s-item">
                付款账户 : {{form.account1}}
              </div>
              <div class="s-item">
                收款账户 : {{form.account2}}
              </div>
              <div class="s-item">
                收款人姓名 : {{form.name}}
              </div>
              <div class="s-item">
                收款金额 : <span style="font-size: 22px">{{form.money}}</span>元
              </div>
            </div>
            <el-divider></el-divider>
            <div class="pwd">
              <el-form :model="form2" :rules="rules" label-width="100px" ref="sendForm">
                <el-form-item label="支付密码:" prop="password">
                  <el-input type="password" v-model="form2.password" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="next('sendForm')">提交</el-button>
                  <el-button @click="active = 0">上一步</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div v-if="active === 2" class="flex" style="justify-content: center">
          <div class="msg">
             <div class="m-icon">
               <i class="el-icon-check"></i>
             </div>
            <div style="margin-top: 25px">操作成功</div>
            <div class="m-info">预计两小时到账</div>
            <div class="m-desc">
              <div class="m-item">
                付款账户 : {{form.account1}}
              </div>
              <div class="m-item">
                收款账户 : {{form.account2}}
              </div>
              <div class="m-item">
                收款人姓名 : {{form.name}}
              </div>
              <div class="m-item">
                收款金额 : <span style="font-size: 22px">{{form.money}}</span>元
              </div>
            </div>
            <div class="m-btn">
              <div>
                <el-button type="primary" @click="aglin">再转一笔</el-button>
              </div>
              <div>
                <el-button @click="check">查看账单</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>

</template>

<script>
  export default {
    name: "StepForm",
    components: {},
    props: {},
    data() {
      return {
        active: 0,
        info: [
          {
            id: 1,
            info: '填写转账信息'
          },
          {
            id: 2,
            info: '确认转账信息'
          },
          {
            id: 3,
            info: '完成'
          }
        ],
        form: {
          account1: '', // 付款账户
          account2: '', // 收款账户
          name: '', // 收款人姓名
          money: '', // 付款金额
        },
        form2: {
          password: '', // 支付密码
        },
        rules: {
          account1: [
            {required: true, message: '请输入付款人账户', trigger: 'blur'}
          ],
          account2: [
            {required: true, message: '请输入收款人账户', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入收款人姓名', trigger: 'blur'},
          ],
          money: [
            {required: true, message: '请输入转账金额', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '输入正确的支付密码才能支付', trigger: 'blur'},
          ]
        },
        value: '',
        selectOptions: [
          {
            value: '0',
            label: '支付宝'
          },
          {
            value: '1',
            label: '银行卡'
          }
        ]
      }
    },
    methods: {
      next(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.active++;
            if (this.active === 2) return
          } else {
            this.$message.error('请正确填写表单')
            return false;
          }
        })
      },
      aglin () {
        this.active = 0
        this.form.account1 = ''
        this.form.account2 = ''
        this.form.password = ''
        this.form.name = ''
        this.form.money = ''
      },
      check () {
        sessionStorage.setItem('formInfo',JSON.stringify(this.form))
        window.open('/form/checkForm')
      },
      print () {

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
  .flex {
    display: flex;
    align-items: center;
  }

  .container {
    .top {
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 60px;
      padding-left: 10px;

      .t-item {
        color: #ccc;
        font-size: 14px;
      }
    }

    .desc {
      margin-top: 30px;

      .content {
        display: flex;
        align-items: center;

        .c-item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 20px;

          &:first-child {
            padding-left: 10%;
          }

          &:last-child {
            display: flex;
            justify-content: flex-start;
          }

          .circle {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 6px;
            border: 1px solid #ccc;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ccc;
          }

          .c-info {
            flex: 1;
          }

          .line {
            flex: 1;
            height: 1px;
            background: #ccc;
            margin-left: 15px;
          }
        }
      }
    }

    .c-desc {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 60px;

      .el-form {
        width: 40%;
      }
    }
    .sure {
      margin-top: 30px;
      width: 40%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .alert {
        width: 100%;
      }
      .s-item {
        margin: 15px 0;
        color: #272727;
        font-size: 14px;
      }
    }
    .msg {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 30px;
      .m-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #52C41A;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        color: #fff;
      }
      .m-info {
        margin: 5px 0;
        color: #ccc;
        font-size: 14px;
      }
      .m-desc {
        background: #FAFAFA;
        width:400px;
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .m-item {
          margin: 10px;
        }
      }
      .m-btn {
        display: flex;
        align-items: center;
        margin-top: 25px;
        div {
          margin: 0 6px;
        }
      }
    }
  }

  .c-back {
    background: #1890FF;
    color: #fff !important;
  }
  .el-alert--warning.is-light {
    color: #565C5F;
    background: #E6F7FF;
  }
  .c-next {
    border:1px solid #45b984 !important;
    color: #45b984 !important;
  }
</style>
