<template>
  <div class="container">
    <div class="city">
      <el-card>
        <div slot="header">
          <h2>{{$t('commons.profit')}}({{$t('commons.tenThousand')}})</h2>
        </div>
        <ve-wordcloud :data="chartData" :settings="chartSettings"></ve-wordcloud>
      </el-card>
    </div>
  </div>

</template>

<script>
  export default {
    name: "CityData",
    components: {},
    props: {},
    data() {
      return {
        cityData: [],
        chartSettings: {
          sizeMin: 12,
          sizeMax: 20,
          color: ['#A1A5EE', '#79C7B7', '#8DC8EA', '#C4A1EE', '#96BF65', '#F5B168', '#F79C6F', '#00ffff', '#9f5f9f', '#855e42', '#ff5ec7']
        },
        chartData: {
          columns: ['city', 'value'],
          rows: []
        }
      }
    },
    methods: {
      getCityData () {
        this.$com.req('api/getCityData').then(res => {
          if (res.code === 200) {
            this.chartData.rows = res.data
          }
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getCityData()
      })
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
    .city {
      overflow-y: hidden;
      height: 400px;
    }
  }
  .ve-wordcloud {
    top: -42px !important;
  }

</style>
