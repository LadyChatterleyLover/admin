<template>
  <div class="container">
    <div class="progress">
      <home-progress></home-progress>
    </div>
    <div>
      <city-data></city-data>
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
  }
</style>
