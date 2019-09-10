<template>
  <div class="box">
    <div class="tree tree__content">
      <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
    <div style="flex: 5">
      <div class="container" v-if="searchList.length > 0" >
        <div  class="content" v-for="(item, index) in searchList" :key="index">
          <el-card class="card">
            <div slot="header" class="top">
              <div class="img">
                <img :src="item.img" alt="">
              </div>
              <div class="t-desc">
                <div class="name">
                  {{item.name}}
                </div>
                <div class="t-con">
                  <div>
                    {{item.department}} / <span v-if="item.position !== ''">{{item.position}}</span><span
                      v-else>未设置</span>
                  </div>
                </div>
                <div class="tag-con flex">
                  <div class="tag" v-if="item.tag.length === 0">
                    <i class="el-icon-circle-plus-outline"></i>
                    <div style="margin-left: 4px">
                      快来给Ta添加第一个标签吧
                    </div>
                  </div>
                  <div v-for="(tag, index1) in item.tag" :key="index1" v-else>
                    <div class="tag-item" :style="{background: colors[Math.abs(item.num - index1)]}">
                      {{tag.name}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="desc">
              <div class="item">
                邮箱 : {{item.email}}
              </div>
              <div class="item">
                手机号码 : {{item.phone}}
              </div>
              <div class="item">
                办公电话 : {{item.tel}}
              </div>
              <div class="item">
                性别 : {{item.gender === 0 ? '男' : "女"}}
              </div>
              <div class="item">
                QQ : {{item.qq}}
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div v-else class="noData">暂无数据</div>
    </div>
  </div>

</template>

<script>
  import config from '../../config'
  import {Loading} from 'element-ui'

  export default {
    name: "MailList",
    components: {

    },
    props: {},
    data() {
      return {
        mailList: [], // 通讯录
        colors: [],
        treeData: [], // 树形结构
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        loadingInstance: null,
        searchList: []
      }
    },
    methods: {
      getData() {
        this.$com.req('api/getMailList').then(res => {
          if (res.data.length > 0) {
            res.data.map(item => {
              item.num = parseInt(Math.random() * this.colors.length)
            })
            this.mailList = res.data
            this.searchList = this.mailList
            this.loadingInstance.close()
          }
        })
      },
      getTreeData() {
        this.$com.req('api/getTreeData').then(res => {
          this.treeData = res.data.data
        })
      },
      handleNodeClick(data) {
        let keywords = data.label
        this.searchList = this.mailList.filter(item => {
          return JSON.stringify(item).includes(keywords)
        })
      }

    },
    mounted() {
      this.loadingInstance = Loading.service({
        text: '加载中...'
      })
      this.getData()
      this.getTreeData()
      this.colors = config.colors
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
  .box {
    display: flex;
    .tree {
      flex: 1;
      position: relative;
      top: 6px;
      margin-right: 16px;
    }
  }
  .container {
    flex: 5;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .content {
      width: 32%;
      margin: 5px;
    }
  }

  .top {
    display: flex;
    align-items: center;

    .img {
      width: 80px;
      height: 80px;
      margin-right: 20px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }

  .item {
    margin-bottom: 5px;
    font-size: 14px;
  }

  .t-desc {
    .name {
      font-size: 18px;
      margin-bottom: 8px;
    }

    .t-con {
      font-size: 14px;
      margin-bottom: 8px;
    }
  }

  .tag {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #ccc;
  }

  .tag-item {
    font-size: 14px;
    border-radius: 20px;
    color: #fff;
    padding: 4px 10px;
    margin-right: 4px;
  }

  .desc {
    position: relative;
    left: 20px;
  }
  .noData {
    display: flex;
    justify-content: center;
    color: #0285DC;
    align-items: center;
  }
</style>
