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
      <div class="btn">
        <el-button type="primary" size="small" v-if="flag" @click="changeFlag">批量转正申请</el-button>
        <el-button type="primary" size="small" v-if="!flag" @click="sure">确认</el-button>
        <el-button type="primary" size="small" v-if="!flag" @click="flag = true">取消</el-button>
        <el-button type="primary" size="small">导出</el-button>
      </div>
    </div>
    <div class="table">
      <div class="tag">
        <div class="t-item" v-for="(item, index) in tags" :key="index">
          <el-tag class="tag" :class="{active: activeIndex === index}" @click="clickTag(item, index)">{{item}}</el-tag>
        </div>
      </div>
        <el-table
            ref="multipleTable"
            :data="tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)"
            style="width: 100%"
            @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              >
          </el-table-column>
          <el-table-column
              prop="name"
              label="姓名"
              align="center"
              show-overflow-tooltip
              >
          </el-table-column>
          <el-table-column
              prop="num"
              label="工号"
              align="center"
              sortable
              show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
              label="机构"
              align="center"
              prop="mechanism"
              show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
              label="部门"
              prop="department"
              align="center"
              show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
              prop="startTime"
              align="center"
              sortable
              label="试用期开始日期"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="endTime"
              align="center"
              sortable
              label="试用期结束日期"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              label="转正审批状态"
              align="center"
              show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.state === 0" style="color: #0285DC">审核通过</div>
              <div v-if="scope.row.state === 1" style="color: #0285DC">审核未通过</div>
              <div v-if="scope.row.state === 2" style="color: #0285DC">审核中</div>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              align="center"
              show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="primary" size="mini">编辑试用期</el-button>
            </template>
          </el-table-column>
        </el-table>
      <pagination :tableData="tableData" @getPageSize="getPageSize" @getCurrentPage="getCurrentPage"
                  style="margin-top:16px;">
      </pagination>
    </div>
  </div>
</template>

<script>
  import pagination from '../../components/pagination/Pagination'
  export default {
    name: "UserInfo",
    components: {
      pagination
    },
    props: {},
    data() {
      return {
        title: '',
        icon: '',
        tableData: [],
        flag: true, // 转正按钮状态
        currentPage: 1, // 当前页数
        pageSize: 10, // 分页条数
        sureArr: [],
        data: [],
        activeIndex: 0,
        tags: ['全部员工', '考核中员工', '已转正员工']
      }
    },
    methods: {
      getPageSize(data) {
        this.pageSize = data
      },
      getCurrentPage(data) {
        this.currentPage = data
      },
      getData () {
        this.$com.req('api/userInfo').then(res => {
          if (res.code === 200) {
            this.data = res.data
            this.tableData = this.data
          }
        })
      },
      handleSelectionChange (selection) {
        this.sureArr = selection
      },
      changeFlag () {
        this.flag = false
        this.tableData = this.data.filter(item => {
          return item.state !== 0
        })
      },
      sure () {
        if (this.sureArr.length === 0) {
          this.$message.warning('请选择至少一条数据')
        } else {
          this.sureArr.map(item => {
            item.state = 0
          })
          setTimeout(() => {
            this.$message.success('操作成功')
            this.flag = true
            this.tableData = this.data
          }, 1000)
        }
      },
      clickTag(item, index) {
        this.activeIndex = index
        if (index === 0) {
          this.tableData = this.data
        }
        if (index === 1) {
          this.tableData = this.data.filter(item => {
            return item.state !== 0
          })
        }
        if (index === 2) {
          this.tableData = this.data.filter(item => {
            return item.state === 0
          })
        }
      }
    },
    mounted() {
      this.title = this.$route.meta.title
      this.icon = this.$route.meta.icon
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
    .table {
      margin-top: 30px;
      .tag {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .t-item {
          margin: 0 8px;
          .tag {
            border-radius: 20px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .active {
    background: #1587D9 !important;
    color: #fff;
  }
</style>
