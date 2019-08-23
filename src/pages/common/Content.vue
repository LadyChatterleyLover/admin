<template>
  <div style="overflow-x: hidden">
    <router-view v-if="$route.path === '/login' || $route.path === '/register' || $route.path === '/findPwd' || $route.path==='/form/checkForm'"></router-view>
    <el-container v-else>
      <el-header style="padding: 0;z-index: 999">
        <nav-header></nav-header>
      </el-header>
      <el-container>
        <el-aside width="200px" :class="{col: isCollapse}">
          <nav-left :active="active"></nav-left>
        </el-aside>
        <el-main>
          <dialog-msg></dialog-msg>
          <div class="top" :class="{isCol: isCollapse}">
            <div @click="collapse">
              <i class="el-icon-s-fold icon" v-if="!isCollapse"></i>
            </div>
            <div @click="collapse">
              <i class="el-icon-s-unfold icon" v-if="isCollapse"></i>
            </div>
          </div>
          <nav-view class="nav"></nav-view>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <div class="chat">
      <div>
        <i class="el-icon-chat-dot-round icon"></i>
      </div>
      <div>
        在线客服
      </div>
    </div>
  </div>

</template>

<script>
  import NavHeader from '../../components/navHeader/NavHeader'
  import NavLeft from '../..//components/navLeft/NavLeft'
  import NavView from './Nav'
  import DialogMsg from '../../components/dialog/UpdateDialog'
  export default {
    name: "Content",
    components: {
      NavHeader,
      NavLeft,
      NavView,
      DialogMsg
    },
    props: {},
    data() {
      return {
        active: '1'
      }
    },
    methods: {
      collapse() {
        this.$store.state.isCollapse = !this.$store.state.isCollapse
      },
    },
    mounted() {

    },
    created() {

    },
    filters: {},
    computed: {
      isCollapse () {
        return this.$store.state.isCollapse
      }
    },
    watch: {

    },
    directives: {}
  }
</script>

<style scoped lang="scss">
  .col {
    width: 100px !important;
  }
  .el-header {
    padding: 0;
  }
  .chat {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 26px;
    height: 90px;
    line-height: 16px;
    padding-top: 5px;
    background: #0285DC;
    color: #fff;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    .icon {
      font-size: 16px;
    }
  }
  .el-main {
    padding:0 0 0 40px;
  }
  .top {
    position: relative;
    background: #9EB2BD;
    display: flex;
    top: 18px;
    left: -30px;
    z-index: 99;
    font-size: 22px;
    width: 22px;
  }
  .icon {
    font-size: 24px;
    color: #fff;
  }

</style>
