<template>
  <div class="container">
    <div class="card">
      <el-card>
        <div slot="header">
          账单详情
        </div>
        <div>
          <div class="desc" id="printTest">
            <div class="item">
              付款账户 : {{formInfo.account1}}
            </div>
            <div class="item">
              收款账户 : {{formInfo.account2}}
            </div>
            <div class="item">
              收款人姓名 : {{formInfo.name}}
            </div>
            <div class="item">
              收款金额 : {{formInfo.money}}元
            </div>
          </div>
          <div class="btn">
            <el-button type="primary" @click="back">返回首页</el-button>
            <el-button @click="print" v-print="'#printTest'" type="success">打印</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>

</template>

<script>
  export default {
    name: "Check",
    components: {},
    props: {},
    data() {
      return {
        formInfo: {}
      }
    },
    methods: {
      back () {
        this.$router.push('/')
      },
      print () {

      }
    },
    mounted() {
      if (sessionStorage.formInfo) {
        this.formInfo = JSON.parse(sessionStorage.formInfo)
      }
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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    .card {
      width: 400px;
      height: 400px;
      .desc {
        background: #FAFAFA;
        width:400px;
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .item {
          margin: 10px;
        }
      }
      .btn {
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
