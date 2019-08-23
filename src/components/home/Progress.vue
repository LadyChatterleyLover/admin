<template>
  <div class="content">
    <div class="item" v-for="(item, index) in progress" :key="item.id">
      <div class="desc" :class="{'bor-top': active === index}" :style="{borderColor: item.barColor}"
           @click="active=index">
        <div class="con">
          <div class="c-title">
            {{item.title}}
          </div>
          <div class="money">
            <div v-if="active === index">
              ￥
              <count-to :startVal='startVal' :endVal='item.money'></count-to>
            </div>
            <div v-else>
              ￥{{item.money | currency}}
            </div>
          </div>
        </div>
        <div v-show="active !== index">
          <circle-progress
              :key="index"
              :id="item.id"
              :width="80"
              :radius="10"
              :delay="200"
              :duration="1000"
              barColor="#9FB2BD"
              backgroundColor="#DCE2E6"
              :isRound="true"
              :isAnimation="true"
          ></circle-progress>
        </div>
        <div v-show="active === index">
          <circle-progress
              :key="index"
              :id="item.id"
              :width="80"
              :radius="10"
              :progress="item.value"
              :delay="200"
              :duration="1000"
              :barColor="item.barColor"
              :backgroundColor="item.backgroundColor"
              :isRound="true"
              :isAnimation="true"
          ></circle-progress>
        </div>
        <div class="num" v-if="active === index">
          {{item.value}}<span v-if="item.value > 0">%</span>
        </div>
        <div class="p-desc" v-if="active === index">
          {{item.desc}}
        </div>
        <div class="line" v-if="index < 2"></div>
      </div>
    </div>
  </div>

</template>

<script>
  import circleProgress from '../circleProgress/CircleProgress'
  import countTo from 'vue-count-to'

  export default {
    name: "Progress",
    components: {
      circleProgress,
      countTo
    },
    props: {},
    data() {
      return {
        progress: [],
        active: 0,
        startVal: 0
      }
    },
    methods: {
      getData() {
        this.$com.req('api/progress').then(res => {
          if (res.code === 200) {
            res.data.map((item, index) => {
              if (Number(item.value) === 0) {
                item.value = '-'
              }
              if (index === 0) {
                this.$set(item, 'barColor', '#5EB0FE')
                this.$set(item, 'backgroundColor', '#A9D0FF')
                this.$set(item, 'desc', '完成率')
                this.$set(item, 'title', '本月营收(元)')
              }
              if (index === 1) {
                this.$set(item, 'barColor', '#80E313')
                this.$set(item, 'backgroundColor', '#D3F4AF')
                this.$set(item, 'desc', '完成率')
                this.$set(item, 'title', '待回款(元)')
              }
              if (index === 2) {
                this.$set(item, 'barColor', '#F2AE57')
                this.$set(item, 'backgroundColor', '#FFE8CC')
                this.$set(item, 'desc', '月增幅')
                this.$set(item, 'title', '客单价(元/合同)')
              }
            })
            this.progress = res.data
          }
        })
      }
    },
    mounted() {
      this.getData()
    },
    created() {

    },
    filters: {
      currency(money) {
        if (money && money !== null) {
          money = String(money)
          let left = money.split('.')[0], right = money.split('.')[1]
          right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : ''
          let temp = left.split('').reverse().join('').match(/(\d{1,3})/g)
          return (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right
        } else if (money === 0) {
          return '0'
        } else {
          return ''
        }


      }
    },
    computed: {},
    watch: {},
    directives: {}
  }
</script>

<style scoped lang="scss">
  .content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;

    .item {
      flex: 1;
      display: flex;
      justify-content: center;

      .desc {
        width: 100%;
        height: 120px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        .line {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 24px;
          background: #ccc;
        }
        .con {
          position: absolute;
          height: 120px;
          width: 200px;
          left: 10%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 20px;

          .c-title {
            margin: 10px 0;
            font-size: 14px;
            color: #ccc;
          }

          .money {
            position: relative;
            right: 4px;
            margin: 10px 0;
          }
        }

        .num {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -45%);
        }

        .p-desc {
          position: absolute;
          top: 60%;
          left: 50%;
          transform: translate(-50%, -60%);
        }
      }
    }
  }

  .bor-top {
    border-top: 8px solid;
  }
</style>
