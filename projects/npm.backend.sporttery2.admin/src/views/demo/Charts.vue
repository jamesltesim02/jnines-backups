<template>
  <div class="col-lg-6">
    <!-- Tristate -->
    <div class="block">
      <div class="block-header">
        <ul class="block-options">
          <li>
            <button
              type="button"
              data-toggle="block-option"
              data-action="refresh_toggle"
              data-action-mode="demo"
            >
              <i class="si si-refresh"></i>
            </button>
          </li>
        </ul>
        <h3 class="block-title">Tristate</h3>
      </div>
      <div class="block-content">
        <div ref="charts" class="chart-container"></div>
      </div>
    </div>
    <!-- END Tristate -->
  </div>
</template>
<script>
const Echarts = window.echarts

export default {
  data () {
    return {
      $charts: null
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
      const chartData = [2340, -362, 13430, -1044, 20, 8333, 453, 323, 343, 15645, -3424, 14343]

      // 将数据设置到报表中
      this.$charts.setOption({
          title: {
              text: '月度盈利报表'
          },
          tooltip: {},
          legend: {
              data:['盈利']
          },
          xAxis: {
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          },
          yAxis: {},
          series: [{
              name: '盈利',
              type: 'bar',
              // 根据数据计算颜色
              data: chartData.map(value => ({
                value,
                itemStyle: {
                  // 正数为红色, 负数为绿色
                  color: value > 0 ? '#f44336' : '#4caf50'
                }
              }))
          }]
      });
    }
  }
}
</script>
<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>