<template>
  <div class="col-lg-6">
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">近七天用户增长表</h3>
      </div>
      <div class="block-content">
        <div ref="charts" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
const Echarts = window.echarts
import { userChart } from '@/api/report'
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
      const chartData = await userChart({
        ...this.params,
      });

      if (!chartData || !chartData.length) {
        return
      }

      const xAxises = []
      const counts = []

      chartData.forEach(({
        statisticalDate,
        count
      }) => {
        xAxises.push(statisticalDate.substring(5))
        counts.push({
          value: count
        })
      })

      this.$charts.setOption({
        title: {
  
        },
        legend: {
          data: ['新增用户量']
        },
        xAxis: { data: xAxises },
        yAxis: {},
        series:[
          {
            name: '新增用户量',
            type: 'bar',
            data: counts
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