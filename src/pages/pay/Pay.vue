<template>
  <div class="container">
    <div class="head">
      <div class="top">
        <div class="icon">
          <i :class="icon"></i>
        </div>
        <div class="title">
          {{title}}
        </div>
      </div>
    </div>
    <div class="header">
      <div class="h-con">
        <div class="h-title">
          {{month}} 薪酬预算
        </div>
        <div class="h-time">
          <el-date-picker
              :editable="false"
              v-model="selectMonth"
              type="month"
              :picker-options="pickerOptions"
              @change="changeMonth"
              placeholder="请选择月份">
          </el-date-picker>
        </div>
      </div>
      <div class="h-desc">
        如果有更多的渠道请自行添加, 所有添加的渠道会显示在CRM系统Leads的"线索来源"中
      </div>
    </div>
    <div class="content">
      <el-card>
        <div class="c-title">
          薪资结构
        </div>
        <el-table style="width: 100%" ref="table" :data="tableData"  @cell-click="cellClick">
          <el-table-column
            label="薪资构成"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="!scope.row.isNameEdit">
                {{scope.row.name}}
              </div>
              <div v-else>
                <el-input  v-model="scope.row.name" ref="refName" size="small" @blur="nameBlur(scope.row)" @keyup.enter.native="keyName"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="计划支出(元)"
              align="center"
          >
            <template slot-scope="scope">
              <div v-if="!scope.row.isPlanEdit">
                {{scope.row.planMoney}}
              </div>
              <div v-else>
                <el-input  v-model="scope.row.planMoney" ref="refPlan" size="small" @blur="planBlur(scope.row)" @keyup.enter.native="keyPlan"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="实际支出(元)"
              align="center"
          >
            <template slot-scope="scope">
              <div v-if="!scope.row.isActualEdit">
                {{scope.row.actualMoney}}
              </div>
              <div v-else>
                <el-input  v-model="scope.row.actualMoney" ref="refActual" size="small" @blur="actualBlur(scope.row)" @keyup.enter.native="keyActual"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
          <el-table-column
              label="上月计划(元)"
              align="center"
          >
            <template slot-scope="scope">
              <div style="cursor: not-allowed;color: #ccc">
                {{scope.row.lastMonth}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="上月实际(元)"
              align="center"
          >
            <template slot-scope="scope">
              <div style="cursor: not-allowed;color: #ccc">
                {{scope.row.thisMonth}}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="btn">
          <el-button type="primary" @click="add">添加更多</el-button>
        </div>
        <div class="all">
          <div class="all-item">总计</div>
          <div class="all-item">{{planMoney}}</div>
          <div class="all-item">{{actualMoney}}</div>
          <div class="all-item"></div>
          <div class="all-item"></div>
          <div class="all-item"></div>
          <div class="all-item">{{lastMonthMoney}}</div>
          <div class="all-item">{{thisMonthMoney}}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Pay",
    components: {},
    props: {},
    data() {
      return {
        title: '',
        icon: '',
        month: '',
        tableData: [],
        selectMonth: '',
        pickerOptions: {
          shortcuts: [{
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '上月',
            onClick(picker) {
              const start = new Date();
              start.setMonth(start.getMonth() - 1);
              picker.$emit('pick', start);
            }
          }]
        },
        planMoney: 0, // 总计划支出
        actualMoney: 0, // 总实际支出
        lastMonthMoney: 0, // 总上月计划
        thisMonthMoney: 0, // 总上月实际
      }
    },
    methods: {
      getData () {
        this.$com.req('api/pay').then(res => {
          if (res.code === 200) {
            this.tableData = res.data
            this.tableData.map(item => {
              this.$set(item, 'isPlanEdit', false)
              this.$set(item, 'isNameEdit', false)
              this.$set(item, 'isActualEdit', false)
              this.$set(item, 'isLastEdit', false)
              this.$set(item, 'isThisEdit', false)
              this.planMoney += item.planMoney
              this.actualMoney += item.actualMoney
              this.lastMonthMoney += item.lastMonth
              this.thisMonthMoney += item.thisMonth
            })
          }
        })
      },
      add () {
        this.tableData.push({
          isPlanEdit: true,
          isActualEdit: true,
          isNameEdit: true,
          name: '',
          planMoney: '',
          actualMoney: '',
          lastMonth: 0,
          thisMonth: 0
        })
      },
      cellClick (row, column, cell, event) {
        if (column.label === '计划支出(元)') {
          row.isPlanEdit = true
        }
        if (column.label === '实际支出(元)') {
          row.isActualEdit = true
        }
      },
      nameBlur (item) {
        item.isNameEdit = false
        this.$message.success('操作成功')
      },
      planBlur (item) {
        item.planMoney = Number(item.planMoney)
        item.isPlanEdit = false
        this.planMoney = 0
        this.tableData.map(item => {
          this.planMoney += item.planMoney
        })
        this.$message.success('修改成功')
      },
      actualBlur (item) {
        item.actualMoney = Number(item.actualMoney)
        item.isActualEdit = false
        this.actualMoney = 0
        this.tableData.map(item => {
          this.actualMoney += item.actualMoney
        })
        this.$message.success('修改成功')
      },
      keyPlan () {
        this.$refs.refPlan.blur()
      },
      keyActual () {
        this.$refs.refActual.blur()
      },
      keyName () {
        this.$refs.refName.blur()
      },
      changeMonth (val) {
        this.month = this.$moment(val).format('YYYY年MM月')
      }
    },
    mounted() {
      this.title = this.$route.meta.title
      this.icon = this.$route.meta.icon
      this.selectMonth = this.month = this.$moment(new Date()).format('YYYY年MM月')
      this.getData()
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
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .top {
        display: flex;
        align-items: center;

        .title {
          font-weight: 700;
          margin-left: 8px;
        }

        .icon {
          background: #38BA72;
          color: #fff;
          height: 24px;
          width: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 5px;
        }
      }
    }
    .header {
      margin-top: 24px;
      background: #fff;
      .h-con {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .h-title {
          font-size: 24px;
          font-weight: 700;
          padding-left: 15px;
          height: 80px;
          line-height: 80px;
        }
        .h-time {
          position: relative;
          right: 30px;
        }
      }
      .h-desc {
        width: 100%;
        background: #E5F2E1;
        height: 50px;
        line-height: 50px;
        padding-left: 15px;
        font-size: 14px;
      }
    }
    .content {
      .c-title {
        font-size: 24px;
        font-weight: 700;
      }
      .btn {
        position: relative;
        left: 3.5%;
        margin-top: 20px;
      }
      .all {
        margin-top: 20px;
        display: flex;
        align-items: center;
        color: #0285DC;
        .all-item {
          text-align: center;
          flex: 1;
        }
      }
    }
  }
  .el-table {
    border: 1px solid #eee;
    margin-top: 40px;
  }
</style>
