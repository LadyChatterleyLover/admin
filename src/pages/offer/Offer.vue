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
        <el-button type="primary" size="small">新建offer</el-button>
        <el-button type="primary" size="small">转移状态</el-button>
        <el-button type="primary" size="small">导出</el-button>
      </div>
    </div>
    <div class="content">
      <el-card>
        <div class="c-btn">
          <el-button size="mini" round type="primary">待发offer ({{issued}})</el-button>
          <el-button size="mini" round type="primary">已发offer ({{noIssued}})</el-button>
          <el-button size="mini" round type="primary">已接受offer ({{accept}})</el-button>
          <el-button size="mini" round type="primary">已拒绝offer ({{refuse}})</el-button>
          <el-button size="mini" round type="primary">已入职offer ({{entry}})</el-button>
        </div>
        <div class="table">
          <el-table
              :row-style="rowStyle"
              ref="multipleTable"
              :data="tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
            <el-table-column
                show-overflow-tooltip
                type="selection"
                width="55">
            </el-table-column>
            <template>
              <el-table-column
                  :show-overflow-tooltip="true"
                  v-for="(item, index) in tableLabel"
                  :prop="item.prop"
                  :label="item.label"
                  :key="index"
                  align="center">
              </el-table-column>
            </template>
            <el-table-column align="right">
              <template slot-scope="scope" slot="header">
                <el-popover
                    v-model="show"
                    placement="bottom"
                    width="200"
                    trigger="click">
                  <div>
                    <div
                        style="font-size:12px;cursor:pointer;display: flex;align-items: center;justify-content: space-between;border-bottom: 1px solid #eee;padding-bottom: 6px">
                      <el-popover
                          v-model="showAdd"
                          placement="right"
                          trigger="click">
                        <div>
                          <div v-if="noSelectData.length > 0">
                            <div class="select" v-for="(item, index) in noSelectData" :key="index">
                              <el-checkbox-group v-model="checkList" @change="changeSelect">
                                <el-checkbox :label="item" style="margin: 5px 0;"></el-checkbox>
                              </el-checkbox-group>
                            </div>
                          </div>
                          <div v-else>暂无数据</div>
                          <div style="margin-top: 10px;text-align: right">
                            <el-button type="primary" size="mini" @click="add">确定</el-button>
                          </div>
                        </div>
                        <div style="color: #004F9E" slot="reference">
                          添加显示字段
                        </div>
                      </el-popover>
                      <el-popover
                          v-model="showDel"
                          placement="right"
                          trigger="click">
                        <div>
                          <div>
                            <div class="select" v-if="selectData.length > 0" v-for="(item, index) in selectData" :key="index">
                              <el-checkbox-group v-model="noCheckList" @change="changeNoSelect">
                                <el-checkbox :label="item" style="margin: 5px 0;"></el-checkbox>
                              </el-checkbox-group>
                            </div>
                            <div v-else>暂无数据</div>
                          </div>
                          <div style="margin-top: 10px;text-align: right">
                            <el-button type="primary" size="mini" @click="del">确定</el-button>
                          </div>
                        </div>
                        <div style="color: #004F9E" slot="reference">
                          删除显示字段
                        </div>
                      </el-popover>
                    </div>
                    <div style="margin-top: 8px;cursor: pointer;">
                      <div style="margin: 4px 0">选择间距类型</div>
                      <div style="display: flex;align-items: center;justify-content: space-around;">
                        <div :class="{color: activeIndex === 1}" @click="setHeight(1, 20)">
                          紧凑
                        </div>
                        <div :class="{color: activeIndex === 2}" @click="setHeight(2, 60)">
                          适中
                        </div>
                        <div :class="{color: activeIndex === 3}" @click="setHeight(3, 100)">
                          宽松
                        </div>
                      </div>
                    </div>
                  </div>
                  <div slot="reference" class="c-item">
                    <div class="t-icon" @click="setTable">
                      <i class="el-icon-setting"></i>
                    </div>
                  </div>
                </el-popover>

              </template>
            </el-table-column>
          </el-table>
          <pagination :tableData="tableData" @getPageSize="getPageSize" @getCurrentPage="getCurrentPage"
                      style="margin-top:16px;">
          </pagination>
        </div>
      </el-card>
    </div>
  </div>

</template>

<script>
  import pagination from '../../components/pagination/Pagination'
  import {labels} from '../../config/tabalHead'

  export default {
    name: "Offer",
    components: {
      pagination
    },
    props: {},
    data() {
      return {
        checkList: [], // 选中字段
        noCheckList: [], // 删除字段
        title: '',
        icon: '',
        value: '', // 姓名或者邮箱
        tableData: [],
        issued: 0, // 已发
        noIssued: 0, // 待发
        accept: 0, // 接受
        refuse: 0, // 拒绝
        entry: 0, // 入职
        loading: true,
        rowStyle: {
          height: '60px'
        },
        currentPage: 1, // 当前页数
        pageSize: 10, // 分页条数
        activeIndex: 2,
        colData: [], // 动态生成表格数据
        selectData: [], // 已选择的表头数据
        noSelectData: [], // 没有选中的表头数据
        showAdd: false,
        showDel: false,
        show: false,
        tableLabel: [], // 动态添加的列
        showName: false,
        showEmail: false
      }
    },
    methods: {
      // 添加显示字段
      add() {
        this.show = false
        this.showAdd = false
        this.checkList.map(item => {
          let obj = {}
          if (item === 'qq') {
            obj.label = item
            obj.prop = 'qq'
          }
          if (item === '部门') {
            obj.label = item
            obj.prop = 'department'
          }
          if (item === '姓名') {
            obj.label = item
            obj.prop = 'name'
          }
          if (item === '个人邮箱') {
            obj.label = item
            obj.prop = 'email'
          }
          if (item === '证件类型') {
            obj.label = item
            obj.prop = 'certificates'
          }
          if (item === '证件号码') {
            obj.label = item
            obj.prop = 'certificatesNum'
          }
          if (item === '性别') {
            obj.label = item
            obj.prop = 'gender'
          }
          if (item === '职位') {
            obj.label = item
            obj.prop = 'position'
          }
          if (item === 'offer状态') {
            obj.label = item
            obj.prop = 'status'
          }
          if (item === '出生日期') {
            obj.label = item
            obj.prop = 'birthday'
          }
          if (item === '籍贯') {
            obj.label = item
            obj.prop = 'nativePlace'
          }
          if (item === '民族') {
            obj.label = item
            obj.prop = 'nation'
          }
          if (item === '电话') {
            obj.label = item
            obj.prop = 'phone'
          }
          if (item === '手机') {
            obj.label = item
            obj.prop = 'tel'
          }
          if (item === '学历') {
            obj.label = item
            obj.prop = 'education'
          }
          if (item === '入职时间') {
            obj.label = item
            obj.prop = 'createTime'
          }
          if (item === '工作地点') {
            obj.label = item
            obj.prop = 'workAddress'
          }
          if (item === '婚姻状态') {
            obj.label = item
            obj.prop = 'marriage'
          }
          this.showAdd = false
          this.show = false
          this.selectData.push(item)
          this.noCheckList = []
          this.$lodash.pull(this.noSelectData, item)
          this.tableLabel.push(obj)
          localStorage.setItem('tableLabel', JSON.stringify(this.tableLabel))
        })
      },
      // 删除显示字段
      del() {
        this.showDel = false
        this.show = false
        this.noCheckList.map((item, index) => {
          let obj = {}
          if (item === 'qq') {
            obj.label = item
            obj.prop = 'qq'
          }
          if (item === '部门') {
            obj.label = item
            obj.prop = 'department'
          }
          if (item === '姓名') {
            obj.label = item
            obj.prop = 'name'
          }
          if (item === '个人邮箱') {
            obj.label = item
            obj.prop = 'email'
          }
          if (item === '证件类型') {
            obj.label = item
            obj.prop = 'certificates'
          }
          if (item === '证件号码') {
            obj.label = item
            obj.prop = 'certificatesNum'
          }
          if (item === '性别') {
            obj.label = item
            obj.prop = 'gender'
          }
          if (item === '职位') {
            obj.label = item
            obj.prop = 'position'
          }
          if (item === 'offer状态') {
            obj.label = item
            obj.prop = 'status'
          }
          if (item === '出生日期') {
            obj.label = item
            obj.prop = 'birthday'
          }
          if (item === '籍贯') {
            obj.label = item
            obj.prop = 'nativePlace'
          }
          if (item === '民族') {
            obj.label = item
            obj.prop = 'nation'
          }
          if (item === '电话') {
            obj.label = item
            obj.prop = 'phone'
          }
          if (item === '手机') {
            obj.label = item
            obj.prop = 'tel'
          }
          if (item === '学历') {
            obj.label = item
            obj.prop = 'education'
          }
          if (item === '入职时间') {
            obj.label = item
            obj.prop = 'createTime'
          }
          if (item === '工作地点') {
            obj.label = item
            obj.prop = 'workAddress'
          }
          if (item === '婚姻状态') {
            obj.label = item
            obj.prop = 'marriage'
          }
          this.noSelectData.push(item)
          this.$lodash.pull(this.selectData, item)
          this.checkList = []
          this.tableLabel =  this.tableLabel.filter(item1 => {
            return item1.label !== item
          })
        })
        localStorage.setItem('tableLabel', JSON.stringify(this.tableLabel))
      },
      changeSelect(val) {

      },
      changeNoSelect(val) {

      },
      getData() {
        this.$com.req('api/getOffer').then(res => {
          if (res.code === 200) {
            this.loading = false
            res.data.map(item => {
              item.nativePlace = item.nativePlace.replace(' ', '')
              item.nation = item.nation + '族'
              if (item.gender === 0) item.gender = '男'
              if (item.gender === 1) item.gender = '女'
              if (item.marriage === 0) item.marriage = '未婚'
              if (item.marriage === 1) item.marriage = '已婚'
              if (item.status === 0) item.offerStatus = '待发'
              if (item.status === 1) item.offerStatus = '已发'
              if (item.status === 2) item.offerStatus = '已接受'
              if (item.status === 3) item.offerStatus = '已拒绝'
              if (item.status === 4) item.offerStatus = '已入职'
              if (item.education === 0) item.education = '初中'
              if (item.education === 1) item.education = '高中'
              if (item.education === 2) item.education = '大专'
              if (item.education === 3) item.education = '本科'
              if (item.education === 4) item.education = '硕士'
              if (item.education === 5) item.education = '博士'
              if (item.education === 6) item.education = '博士以上'
            })
            let columns = this.$refs.multipleTable.columns
            columns.map(item => {
                  if (item.label !== undefined) {
                    this.selectData.push(item.label)
                  }
                }
            )
            this.selectData.map(item => {
              this.noSelectData = this.$lodash.pull(labels, item)
            })
            let arr = this.$lodash.groupBy(res.data, 'status')
            this.issued = arr[0].length
            this.noIssued = arr[1].length
            this.accept = arr[2].length
            this.refuse = arr[3].length
            this.entry = arr[4].length
            this.tableData = res.data
          }
        })
      },
      handleSelectionChange() {

      },
      getPageSize(data) {
        this.pageSize = data
      },
      getCurrentPage(data) {
        this.currentPage = data
      },
      setTable() {

      },
      setHeight(index, height) {
        this.activeIndex = index
        this.rowStyle = {
          height: height + 'px'
        }
      }
    },
    mounted() {
      this.title = this.$route.meta.title
      this.icon = this.$route.meta.icon
      this.getData()
      labels.map((item, index) => {
        let obj = {}
        if (item === 'qq') {
          obj.label = item
          obj.prop = 'qq'
          obj.index = index
        }
        if (item === '部门') {
          obj.label = item
          obj.prop = 'department'
          obj.index = index
        }
        if (item === '姓名') {
          obj.label = item
          obj.prop = 'name'
          obj.index = index
        }
        if (item === '个人邮箱') {
          obj.label = item
          obj.prop = 'email'
          obj.index = index
        }
        if (item === '证件类型') {
          obj.label = item
          obj.prop = 'certificates'
          obj.index = index
        }
        if (item === '证件号码') {
          obj.label = item
          obj.prop = 'certificatesNum'
          obj.index = index
        }
        if (item === '性别') {
          obj.label = item
          obj.prop = 'gender'
          obj.index = index
        }
        if (item === '职位') {
          obj.label = item
          obj.prop = 'position'
          obj.index = index
        }
        if (item === 'offer状态') {
          obj.label = item
          obj.prop = 'offerStatus'
          obj.index = index
        }
        if (item === '出生日期') {
          obj.label = item
          obj.prop = 'birthday'
          obj.index = index
        }
        if (item === '籍贯') {
          obj.label = item
          obj.prop = 'nativePlace'
          obj.index = index
        }
        if (item === '民族') {
          obj.label = item
          obj.prop = 'nation'
          obj.index = index
        }
        if (item === '电话') {
          obj.label = item
          obj.prop = 'phone'
          obj.index = index
        }
        if (item === '手机') {
          obj.label = item
          obj.prop = 'tel'
          obj.index = index
        }
        if (item === '学历') {
          obj.label = item
          obj.prop = 'education'
          obj.index = index
        }
        if (item === '入职时间') {
          obj.label = item
          obj.prop = 'createTime'
          obj.index = index
        }
        if (item === '工作地点') {
          obj.label = item
          obj.prop = 'workAddress'
          obj.index = index
        }
        if (item === '婚姻状态') {
          obj.label = item
          obj.prop = 'marriage'
          obj.index = index
        }
        if (localStorage.tableLabel) {
          this.tableLabel = JSON.parse(localStorage.tableLabel)
        } else {
          this.tableLabel.push(obj)
          this.tableLabel = this.tableLabel.filter((item, index) => {
            return index < 9
          })
        }
      })
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

    .content {
      margin-top: 16px;

      .c-top {
        display: flex;
        align-items: center;
        margin: 15px 0;

        .pop {
          position: relative;

          .sure {
            display: flex !important;
            justify-content: flex-end !important;
          }
        }

        .c-item {
          color: #aaa;
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-left: 4px;

          div {
            margin: 0 2px;
          }
        }
      }
    }

    .t-icon {
      color: #0285DC;
      font-size: 16px;
    }
  }

  .color {
    color: #0285DC !important;
  }

  .select {
    display: flex;
    align-items: center;

    div {
      margin-left: 10px;
    }
  }
</style>
