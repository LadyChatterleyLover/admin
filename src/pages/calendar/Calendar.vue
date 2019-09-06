<template>
  <div class="lunarFullCalendar">
    <div class="full-calendar full__event">
      <lunar-full-calendar ref="calendar"
                           :events="events"
                           :config="config"
                           @day-click="dayClick"
                           @event-selected="eventSelected"
                           :event-sources="eventSources"
                           @event-render="eventRender"
                           noEventsMessage="本周暂无安排"
      ></lunar-full-calendar>
      <el-dialog
          :show-close="false"
          :visible.sync="showDialog"
          width="40%"
      >
        <div slot="title" class="title">
          <div style="color: #0285DC">日程</div>
          <div class="line"></div>
        </div>
        <div class="content">
          <div>
            <el-input v-model="schedule" placeholder="准备做什么..."></el-input>
          </div>
          <div class="time">
            <div class="t-item">
              时间:
            </div>
            <div class="picker">
              <div>
                <el-time-select placeholder="开始时间"
                                style="width:217px"
                                :editable="false"
                                v-model="startTime" :picker-options="{
                                    start: '07:00',
                                    step: '00:15',
                                    end: '24:00'}">
                </el-time-select>

              </div>
              <div class="range">~</div>
              <div>
                <el-time-select placeholder="结束时间" style="width:217px"
                                v-model="endTime"
                                :editable="false"
                                :picker-options="{
                                    start: '07:00',
                                    step: '00:15',
                                    end: '24:00',
                                    minTime: startTime,
                                    }">
                </el-time-select>
              </div>
            </div>
          </div>
          <div class="person">
            <div class="p-item">
              参与人:
            </div>
            <div class="name">
              <div v-for="(item, index) in meetingUser" :key="index">
                {{item}}
              </div>
            </div>
            <el-popover
                :value="showUser"
                placement="bottom"
                trigger="click"
            >
              <div style="position: relative;height: 80px;">
                <el-input v-model="user" placeholder="请输入参与人的姓名"></el-input>
                <div style="position: absolute;right: 0;margin-top: 12px;">
                  <el-button type="primary" size="mini" @click="sureAdd">确定</el-button>
                </div>
              </div>
              <div slot="reference" style="color: #0285DC;font-size: 18px;margin-left: 8px;" @click="addUser">
                <i class="el-icon-circle-plus-outline"></i>
              </div>
            </el-popover>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="calAdd">取 消</el-button>
          <el-button type="primary" @click="addEvent">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog
        center
        :visible.sync="dialogVisible"
        width="20%"
        >
      <div style="display: flex;justify-content: center;font-size: 16px">确定删除该日程安排吗?</div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sureDel">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: "Calendar",
    components: {},
    props: {},
    data() {
      let _this = this
      return {
        show: false,
        showDialog: false, // 显示弹出框
        schedule: '', // 日程
        currentTime: '',
        time: '', // 选择的日期
        events: [], // 日期事件
        config: { // 日历配置
          defaultView: 'month',
          lunarCalendar: true, // 控制是否显示中国农历、显示的为true，隐藏为flase，默认为true(Control whether the Chinese calendar shows true, unrealistic flase, default true.)
          locale: 'en-en', // 语言
          buttonText: { // 按钮
            today: '今天',
            month: '月',
            week: '周',
            day: '日'
          },
          // eventOrder:'index',   // 这个是控制事件排序的功能，意思是 按照字段 事件数据中index来排序
          // eventLimitClick: 'day', //点击今天日列表图
          header: { // 头部
            left: 'prev,next, today',
            center: 'title',
            right: 'hide, custom, month,agendaWeek,agendaDay'
          },
          allDaySlot: true, // agenda视图下是否显示all-day
          allDayText: '全天', // agenda视图下all-day的显示文本
          timezone: 'local', // 时区默认本地的
          slotLabelFormat: 'HH:mm', // 周视图和日视同的左侧时间显示
        },
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        eventSources: [{ // 异步渲染事件
          events(start, end, timezone, callback) {
            let events = []
            _this.$com.req('api/calendar').then(res => {
              if (res.data !== null) {
                let icon = `<i class="el-icon-user-solid"></i>`
                let nbsp = `&nbsp;&nbsp;&nbsp;`
                let br = `<br/>`
                res.data.map(item => {
                  if (item.users !== undefined) {
                    events.push({
                      start: item.startTime,
                      end: item.endTime,
                      title: _this.$moment(item.startTime).format('HH:mm') + ' - ' + _this.$moment(item.endTime).format('HH:mm') + nbsp + item.schedule + br + '参与人: ' + nbsp + item.users.join(' ') + nbsp + br + '参与人数: ' + nbsp + icon + item.users.length,
                      extra: JSON.stringify(item),
                      backgroundColor: '#aaefca',
                      borderColor: '#d3f1cc',
                      textColor: '#333333',
                      fontWeight: '700'
                    })
                  }
                })
              }
              callback(events)
            })
          }
        }],
        currentDay: null,
        username: '',
        startArr: [], // 参与人初始数组
        meetingUser: [], // 参与人
        user: '', // 参与人数
        showUser: false,
        dialogVisible: false,
        id: '', // 日程id
      }
    },
    methods: {
      // 选择日期
      dayClick(date) {
        if (this.$moment(date).format("YYYY-MM-DD") < this.$moment(Date.now()).format("YYYY-MM-DD")) {
          this.$message.error('不能安排今天之前的日程')
          return
        }
        this.currentDay = this.$moment(date).format('YYYY-MM-DD')
        this.currentTime = this.$moment(date).format('YYYY-MM-DD') + ' ' + this.$moment(Date.now()).format('HH:mm:ss')
        this.showDialog = true
      },
      // 选中事件
      eventSelected(event, jsEvent, view) {
        this.id = JSON.parse(event.extra)._id
        this.show = true
        this.dialogVisible = true
      },
      // 删除日程
      sureDel () {
        this.dialogVisible = false
        this.$com.req('api/delCalendar', {
          id: this.id
        }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.$refs.calendar.$emit('refetch-events')
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
            this.$refs.calendar.$emit('refetch-events')
          }
        })
      },
      // 添加日程
      addEvent() {
        this.startTime = this.currentDay + ' ' + this.startTime
        this.endTime = this.currentDay + ' ' + this.endTime
        this.showDialog = false
        this.$com.req('api/calendar', {
          users: this.meetingUser,
          startTime: this.startTime,
          endTime: this.endTime,
          schedule: this.schedule
        }).then(res => {
          if (res.code === 200) {
            this.$refs.calendar.$emit('refetch-events')
            this.startTime = ''
            this.endTime = ''
            this.schedule = ''
          }
        })
      },
      // 渲染视图方式(html方式)
      eventRender(event, element, view) {
        element.html(event.title)
      },
      // 添加参与人数
      addUser() {
        this.showUser = true
      },
      // 确认添加参与人数
      sureAdd() {
        this.showUser = false
        this.meetingUser.push(this.user)
        this.user = ''
      },
      calAdd () {
        this.showDialog = false
        this.user = ''
        this.startTime = ''
        this.endTime = ''
        this.schedule = ''
        this.meetingUser = this.startArr
      }
    },
    mounted() {
      let user = JSON.parse(localStorage.adminUser)
      this.username = user.username || user.login
      this.meetingUser.push(this.username)
      this.startArr.push(this.username)
    },
    created() {

    },
    filters: {},
    computed: {
      // user() {
      //   return this.$store.state.user
      // }
    },
    watch: {},
    directives: {}
  }
</script>

<style scoped lang="scss">
  @import "../../style/calendar";

  .line {
    width: 20px;
    height: 4px;
    background: #0285DC;
    position: relative;
    top: 8px;
    left: 6px;
    border-radius: 4px;
  }

  .time, .person {
    display: flex;
    align-items: center;
    margin-top: 20px;

    .t-item, .p-item {
      width: 80px;
    }
  }

  .icon {
    margin-left: 10px;
    font-size: 18px;
    color: #0285DC;
  }

  .picker {
    display: flex;
    align-items: center;
  }

  .range {
    margin: 0 4px;
  }

  .name {
    display: flex;
    align-items: center;

    div:first-child {
      margin-left: 0;
    }

    div {
      margin-left: 10px;
    }
  }

</style>
