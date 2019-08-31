<template>
  <div class="container">

    <div class="progress">
      <home-progress></home-progress>
    </div>
    <div class="content">
      <div>
        <city-data></city-data>
      </div>
      <div>
        <dynamic></dynamic>
      </div>
    </div>
    <div class="table">
      <question></question>
    </div>
  </div>

</template>

<script>
  import cityData from '../components/home/CityData'
  import homeProgress from '../components/home/Progress'
  import dynamic from '../components/home/Dynamic'
  import question from '../components/home/Question'
  export default {
    name: "Home",
    components: {
      cityData,
      homeProgress,
      dynamic,
      question
    },
    props: {},
    data() {
      return {

      }
    },
    methods: {

    },
    mounted() {

    },
    created() {

    },
    filters: {},
    computed: {},
    watch: {},
    directives: {},
    beforeRouteEnter (to, from,next) {
      if (from.name === null && localStorage.adminUser) {
        next(vm => {
          vm.$message.success('登录成功')
        })
      }
      next()
    }
  }
</script>

<style scoped lang="scss">
  .container {
    .progress {
      margin: 10px 0 50px 0;
    }
    .content {
      display: flex;
      align-items: center;
      div {
        flex: 1;
        &:first-child {
          margin-right: 10px;
        }
      }
    }
    .table {
      margin-top: 30px;
    }
  }
</style>
