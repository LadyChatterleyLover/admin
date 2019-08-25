<template>
  <div class="container">
    <div class="content">
      <el-card>
        <div slot="header" class="desc">
          <div>
            <div>个人动态</div>
          </div>
          <div>
            <el-button type="primary" size="mini" @click="add">添加动态</el-button>
          </div>
        </div>
        <div class="con">
          <el-date-picker
              @change="changeDate"
              v-model="value"
              type="date"
              :editable="false"
              placeholder="选择日期">
          </el-date-picker>
        </div>
        <div>
          <div class="i-desc" v-if="filterReports.length > 0">
            <div v-for="(item, index) in filterReports" :key="index">
              <div :class="{back: index % 2 === 0}" class="c-desc">
                <div class="c-item">
                  <div class="name">
                    <div>{{item.classification}}</div>
                    <div>{{item.username}}</div>
                  </div>
                  <div class="c-report">
                    <div v-if="item.reportUsers.length > 0">
                      汇报人:
                    </div>
                    <div v-if="item.reportUsers.length > 0">
              <span v-for="(item1, index1) in item.reportUsers" :key="index1">
                {{item1}}
              </span>
                    </div>
                  </div>
                  <div class="t-name">
                    <div class="text">
                      动态: {{item.dynamic}}
                    </div>
                    <div class="time">
                      发布于{{item.time}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="noThing">暂无动态</div>
        </div>
      </el-card>
    </div>
    <el-dialog
        title="添加动态"
        :visible.sync="dialogVisible"
        >
      <div class="item home__tags">
        <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
          <el-form-item label="动态类型">
            <el-select v-model="ruleForm.selectValue" placeholder="请选择动态类型">
              <el-option label="个人心情" value="个人心情"></el-option>
              <el-option label="工作汇报" value="工作汇报"></el-option>
              <el-option label="公司相关" value="公司相关"></el-option>
              <el-option label="其他事物" value="其他事物"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="相关汇报人" v-if="ruleForm.selectValue === '工作汇报'">
            <el-select v-model="ruleForm.users" multiple  placeholder="请选择汇报人">
              <el-option
                  v-for="item in reportUsers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="详情内容">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="ruleForm.text">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
      <el-button @click="cal">取 消</el-button>
      <el-button type="primary" @click="sureAdd">确 定</el-button>
  </div>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: "Dynamic",
    components: {},
    props: {},
    data() {
      return {
        value: '', // 日期选择框
        dialogVisible: false,
        username: '',
        ruleForm: {
          name: '',
          selectValue: '',
          text: '',
          users: []
        },
        reportUsers: [],
        reports: [],
        filterReports: []
      }
    },
    methods: {
      changeDate () {
        this.value = this.$moment(this.value).format('YYYY-MM-DD')
        this.getReport()
      },
      add () {
        this.dialogVisible = true
      },
      sureAdd () {
        this.$com.req('api/addDynamic', {
          username: this.username,
          date: this.value,
          dynamic: this.ruleForm.text,
          classification: this.ruleForm.selectValue,
          reportUsers: this.ruleForm.users
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.ruleForm.text= ''
            this.ruleForm.selectValue = ''
            this.ruleForm.users = []
            this.dialogVisible = false
            this.getReport()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      cal () {
        this.dialogVisible = false
        this.value = this.$moment(this.value).format('YYYY-MM-DD')
        this.ruleForm.text= ''
        this.ruleForm.selectValue = ''
        this.ruleForm.users = []
      },
      getReportUser () {
        this.$com.req('api/report').then(res => {
          if (res.code === 200) {
            this.reportUsers = res.data
          }
        })
      },
      getReport () {
        this.$com.req('api/getDynamic').then(res => {
          if (res.code === 200) {
            res.data.map(item => {
              item.time = this.$moment(item.date).format('YYYY年MM月DD日')
              item.date = this.$moment(item.date).format('YYYY-MM-DD')
            })
            this.filterReports = res.data.filter(item => item.date === this.value)
            this.reports = res.data
          }
        })
      }
    },
    mounted() {
      if (localStorage.adminUser) this.username = JSON.parse(localStorage.adminUser).username
      this.value = this.$moment(new Date()).format('YYYY-MM-DD')
      this.getReportUser()
      this.getReport()
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
    .content {
      height: 400px;
      overflow-y: auto;
      .desc {
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .c-desc {
        background: #FAFAFA;
        margin: 5px 0;
        padding: 20px;
        &:hover {
          background: #F2F3F7;
        }
        .c-item {
          .name {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
        .t-name {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          div {
            display: flex;
            align-items: center;
          }
          .time {
            color: #ccc;
          }
        }
        .c-report {
          margin-top: 20px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .noThing {
    margin-top: 30px;
  }
  .el-select {
    width: 100%;
  }
  .back {
    background: #eee !important;
    &:hover {
      background: #F2F3F7 !important;
    }
  }
  ::-webkit-scrollbar {
    width: 10px;   /* 滚动条宽度， width：对应竖滚动条的宽度  height：对应横滚动条的高度*/
  }
</style>
