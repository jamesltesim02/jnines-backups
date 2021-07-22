<template>
  <div class="col-lg-6">
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">近七天盈利表</h3>
      </div>
      <div class="block-content">
        <div ref="charts" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
const Echarts = window.echarts
import { betChart,} from '@/api/report'
export default {
  data () {
    return {
      $charts: null,
      params: {
        startTime: '',
        endTime: ''
      },
    }
  },
  mounted () {
    this.$charts = Echarts.init(this.$refs.charts)
    this.queryData()
  },
  methods: {

    /**
     * 查询并显示报表数据
     */
    async queryData () {
      // 从接口查询
      const chartData = await betChart({
        ...this.params,
      });

      if (!chartData || !chartData.length) {
        return
      }

      const xAxises = []
      const betAmounts = []
      const profitAmounts = []

      chartData.forEach(({
        statisticalDate,
        betAmount,
        profitAmount
      }) => {
        xAxises.push(statisticalDate.substring(5))
        betAmounts.push({
          value: betAmount
        })
        profitAmounts.push({
          value: profitAmount
        })
      })

      this.$charts.setOption({
        title: {
          // text: '近七天盈利报表'
        },
        legend: {
          data: ['投注额', '盈利']
        },
        xAxis: { data: xAxises },
        yAxis: {},
        series:[
          {
            name: '投注额',
            type: 'bar',
            data: betAmounts
          },
          {
            name: '盈利',
            type: 'bar',
            data: profitAmounts
          }
        ]
      })
    },
  },
  created () {
    this.params.startTime  = new Date(moment().add(-7,'day').format('YYYY-MM-DD 00:00:00:00')).getTime();
    this.params.endTime = new Date(moment().format('YYYY-MM-DD 23:59:59:999')).getTime();
  }
}
</script>
<style scoped>
.chart-container {
  width: 100%;
  height: 500px;
}
</style>