<template>
  <div class="container menu__title __main-menu">
    <el-menu
        :collapse="isCollapse"
        :default-active="active"
        class="el-menu-vertical-demo"
        background-color="#ffffff"
        text-color="#9EB2BD"
        active-text-color="#0FA0F8"
        @select="selectMenu">
      <template v-for="(item, idx) in menu" class="menu">
        <div class="menu">
          <div class="new" v-if="item.update && !isCollapse">new</div>
          <div class="dian" v-if="item.update && isCollapse"></div>
            <el-menu-item :key="idx" :index="item.index" v-if="!item.children" @click="goTo(item.path)">
              <i :class="item.icon"></i>
              <span slot="title">{{$t(`commons.${item.enTitle}`)}}</span>
            </el-menu-item>
          <el-submenu v-if="item.children" :index="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span v-if="!isCollapse">{{ $t(`commons.${item.enTitle}`)}}</span>
            </template>
            <el-menu-item-group v-for="(item1,index) in item.children" :key="index">
              <el-menu-item :index="item1.index" @click="goTo(item1.path)">
                {{ $t(`commons.${item1.enTitle}`)}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </div>
      </template>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'NavLeft',
    components: {},
    props: {},
    data() {
      return {
        active: '1',
        menu: [
          {
            index: '1',
            title: '首页',
            enTitle: 'dashboard',
            icon: 'el-icon-location',
            path: '/'
          },
          {
            index: '2',
            title: '日程',
            enTitle: 'calendar',
            icon: 'el-icon-date',
            path: '/calendar'
          },
          {
            index: '3',
            title: '通讯录',
            enTitle: 'mailList',
            icon: 'el-icon-document',
            path: '/mailList'
          },
          {
            index: '4',
            title: '组织员工',
            enTitle: 'organize',
            icon: 'el-icon-user',
            children: [
              {
                title: 'offer管理',
                enTitle: 'offer',
                index: '4-1',
                path: '/organization/offer'
              },
              {
                title: '人员信息',
                enTitle: 'userInfo',
                index: '4-2',
                path: '/organization/userInfo'
              },
              {
                title: '薪酬管理',
                enTitle: 'payMent',
                index: '4-3',
                path: '/organization/pay'
              }
            ],

          },
          {
            index: '5',
            title: '表单页',
            enTitle: 'form',
            icon: 'el-icon-files',
            children: [
              {
                title: '分步表单',
                enTitle: 'stepForm',
                index: '5-1',
                path: '/form/stepForm'
              }
            ],
          }
        ]
      }
    },
    methods: {
      selectMenu(index, path) {
        this.menu.map(item => {
          if (Number(index) === Number(item.index) && item.update || Number(path[0]) === Number(item.index) && item.update) {
            this.$store.state.dialogMsg = item.text
            this.$store.state.showDialogMsg = true
          }
        })
      },
      goTo(path) {
        this.$router.push(path)
      },
      getUpdate() {
        this.$com.req('api/update').then(res => {
          let data = res.data
          data.map(item => {
            this.menu.map((item1) => {
              if (item.id === Number(item1.index) && item.update) {
                this.$set(item1, 'update', item.update)
                this.$set(item1, 'text', item.text)
                item1.text = item1.text.split('。')
              }
            })
          })
          let arr = []
          this.menu.map((item, index) => {
            if (item.update && index === 0) {
              this.$store.state.showDialogMsg = true
            }
            if (item.update) {
              arr.push(index)
            }
          })
          if (arr.length > 0) {
            let idx = Math.min(...arr)
            this.$store.state.dialogMsg = this.menu[idx].text
          }
        })
      }
    },
    mounted() {
      this.getUpdate()
      let path = this.$route.path
      if (path === '/') {
        this.active = '1'
      }
      if (path === '/calendar') {
        this.active = '2'
      }
      if (path === '/mailList') {
        this.active = '3'
      }
      if (path === '/organization/offer') {
        this.active = '4-1'
      }
      if (path === '/organization/userInfo') {
        this.active = '4-2'
      }
      if (path === '/organization/pay') {
        this.active = '4-3'
      }
      if (path === '/form/stepForm') {
        this.active = '5-1'
      }
    },
    computed: {
      isCollapse() {
        return this.$store.state.isCollapse
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    overflow-x: hidden;
    position: relative;
  }

  .icon {
    font-size: 24px;
    color: #fff;
  }

  .i-con {
    background: #004F9E;
    position: relative;
    left: 160px;
    z-index: 99;
  }

  .el-menu {
    position: fixed;
    height: 100vh;
    left: 0;
    top: 40px;
  }


  .left {
    background: #004F9E;
    position: relative;
    z-index: 99;
    left: 20px !important;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .el-submenu .el-menu-item {
    min-width: 180px !important;
  }

  .menu {
    position: relative;
  }

  .new {
    color: red;
    position: absolute;
    left: 130px;
    top: 22px;
    z-index: 99;
    width: 30px;
  }

  .dian {
    background: red;
    border-radius: 50%;
    position: absolute;
    top: 26px;
    left: 46px;
    z-index: 99;
    font-size: 26px;
    width: 6px;
    height: 6px;
  }
</style>
