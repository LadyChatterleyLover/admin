<template>
  <div class="container">
    <div class="progress">
      <home-progress></home-progress>
    </div>
    <div class="content">
      <div>
        <city-data></city-data>
      </div>
    </div>
  </div>

</template>

<script>
  import cityData from '../components/home/CityData'
  import homeProgress from '../components/home/Progress'
  export default {
    name: "Home",
    components: {
      cityData,
      homeProgress
    },
    props: {},
    data() {
      return {
        handleAvatarSuccess(res, file) {
          console.log(res)
          console.log(file)
        }
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
    directives: {}
  }
</script>

<style scoped lang="scss">
  .container {
    .progress {
      margin: 10px 0 50px 0;
    }
    .content {
      /*display: flex;*/
      /*align-items: center;*/
      /*div {*/
      /*  margin-left: 30px;*/
      /*  &:first-child {*/
      /*    margin-left: 0;*/
      /*  }*/
      /*}*/
    }
  }
</style>
