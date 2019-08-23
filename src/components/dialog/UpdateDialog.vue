<template>
  <div>
    <el-dialog
        title="v1.0.0更新提示"
        :visible.sync="showDialogMsg"
        width="30%"
        :show-close="false"
    >
      <div v-for="(item, index) in msg" :key="index">
        <div class="item" v-if="item !==''">
          {{index + 1}}. {{item}}
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cal" type="primary">知道了</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: "UpdateDialog",
    components: {},
    props: {},
    data() {
      return {

      }
    },
    methods: {
      cal () {
        this.$store.commit('set_dialog', false)
      }
    },
    mounted() {
      setTimeout(() => {
        this.showDialogMsg = true
      }, 500)
    },
    created() {

    },
    filters: {},
    computed: {
      msg () {
        return this.$store.state.dialogMsg
      },
      showDialogMsg: {
        get () {
          return this.$store.state.showDialogMsg
        },
        set () {}
      }
    },
    watch: {},
    directives: {}
  }
</script>

<style scoped lang="scss">
  .item {
    margin: 6px 0;
    font-size: 16px;
  }
</style>
