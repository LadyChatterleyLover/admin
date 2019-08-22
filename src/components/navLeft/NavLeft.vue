<template>
  <div class="container menu__title">
    <el-menu
        :collapse="isCollapse"
        :default-active="active"
        class="el-menu-vertical-demo"
        background-color="#004F9E"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="selectMenu">
      <div class="top" :class="{col: isCollapse}">
        <div @click="collapse">
          <i class="el-icon-s-fold icon" v-if="!isCollapse"></i>
        </div>
        <div @click="collapse">
          <i class="el-icon-s-unfold icon" v-if="isCollapse"></i>
        </div>
      </div>
      <template v-for="(item, idx) in menu" class="menu">
        <div class="menu">
          <div class="new" v-if="item.update && !isCollapse">new</div>
          <div class="dian" v-if="item.update && isCollapse"></div>
          <el-menu-item :key="idx" :index="item.index" v-if="!item.children" @click="goTo(item.path)">
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
          <el-submenu v-if="item.children" :index="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span v-if="!isCollapse">{{item.title}}</span>
            </template>
            <el-menu-item-group v-for="(item1,index) in item.children" :key="index" >
              <el-menu-item :index="item1.index" @click="goTo(item1.path)">
                {{item1.title}}
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
        isCollapse: false,
        active: '1',
        menu: [
          {
            index: '1',
            title: '首页',
            icon: 'el-icon-location',
            path: '/'
          },
          {
            index: '2',
            title: '日程',
            icon: 'el-icon-date',
            path: '/calendar'
          },
          {
            index: '3',
            title: '通讯录',
            icon: 'el-icon-document',
            path: '/mailList'
          },
          {
            index: '4',
            title: '组织员工',
            icon: 'el-icon-user',
            children: [
              {
                title: 'offer管理',
                index: '4-1',
                path: '/organization/offer'
              },
              {
                title: '人员信息',
                index: '4-2',
                path: '/organization/userInfo'
              },
              {
                title: '薪酬管理',
                index: '4-3',
                path: '/organization/pay'
              }
            ],

          },
          {
            index: '5',
            title: '表单页',
            icon: 'el-icon-files',
            children: [
              {
                title: '分步表单',
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
        this.menu.map(item =>{
          if (Number(index) === Number(item.index) && item.update || Number(path[0]) === Number(item.index) && item.update) {
            this.$store.state.dialogMsg = item.text
            this.$store.state.showDialogMsg = true
          }
        })
      },
      goTo(path) {
        this.$router.push(path)
      },
      collapse() {
        this.isCollapse = !this.isCollapse
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

  .top {
    position: absolute;
    background: #004F9E;
    display: flex;
    top: 20px;
    left: 150px;
    z-index: 999999;
  }

  .el-menu {
    position: fixed;
    height: 100vh;
    left: 0;
    top: 40px;
    padding-top: 30px;
  }

  .col {
    left: 20px !important;
  }

  @keyframes col {
    from {
      left: 150px;
    }
    to {
      left: 20px;
    }
  }

  .left {
    background: #004F9E;
    position: relative;
    z-index: 99;
    left: 20px !important;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
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
    left: 110px;
    top: 20px;
    z-index: 99;
    width: 30px;
  }
  .dian {
    background: red;
    border-radius: 50%;
    position: absolute;
    top: 28px;
    left: 46px;
    z-index: 99;
    font-size: 26px;
    width: 6px;
    height: 6px;
  }
</style>
