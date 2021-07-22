<template>
  <div>
    <!-- Dynamic Table Full -->
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">报表 <small></small></h3>
      </div>
      <div class="block-content">
        <div class="block-content conditions">
          <form class="form-horizontal">
            <div class="form-group">
              <div class="row">
                <div class="col-xs-6">
                    <div class="form-material">
                        <date-time-picker class="form-control" placeholder="请选择开始时间" v-model="params.startTime" />
                        <label for="material-text">开始时间</label>
                    </div>
                </div>
                <div class="col-xs-6">
                    <div class="form-material">
                        <date-time-picker class="form-control" placeholder="请选择结束时间" v-model="params.endTime" />
                        <label for="material-text">结束时间</label>
                    </div>
                </div>
                 <button
                    class="btn btn-primary push-5-r push-10 btn-submit"
                    type="button"
                    @click="weekReport"
                >
                     本周
                </button>
                <button
                    class="btn btn-primary push-5-r push-10 btn-submit"
                    type="button"
                    @click="monthReport"
                >
                     本月
                </button>
                <button
                    class="btn btn-primary push-5-r push-10 btn-submit"
                    type="button"
                    @click="search"
                >
                    <i class="fa fa-search"></i> 查询
                </button>
                </div>
              </div>
          </form>
        </div>
        <table class="table table-bordered table-striped js-dataTable-full">
          <thead>
            <tr>
              <th class="text-center">时间</th>
              <th class="text-center">总投注额</th>
              <th class="text-center">总单数</th>
              <th class="text-center">已结算注单</th>
              <th class="text-center">赢的注单</th>
              <th class="text-center">已结算投注额</th>
              <th class="text-center">盈利</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in rsp.betDayReportRsps" :key="item._id">
              <td class="text-center">{{item.statisticalDate}}</td>
              <td class="text-center">{{item.totalBetAmount}}</td>
              <td class="text-center">{{item.betCount}}</td>
              <td class="text-center">{{item.settleCount}}</td>
              <td class="text-center">{{item.winBetCount}}</td>
              <td class="text-center">{{item.totalSettleBetAmount}}</td>
              <td class="text-center">{{item.profitAmount}}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
                <td class="text-center">合计</td>
                <td class="text-center">{{rsp.totalBetAmount}}</td>
                <td class="text-center">{{rsp.betCount}}</td>
                <td class="text-center">{{rsp.settleCount}}</td>
                <td class="text-center">{{rsp.winBetCount}}</td>
                <td class="text-center">{{rsp.totalSettleBetAmount}}</td>
                <td class="text-center">{{rsp.totalProfitAmount}}</td>
              </tr>
          </thead>
        </table>
      </div>
    </div>
    <!-- END Dynamic Table Full -->
  </div>
</template>
<script>
import { betReport} from '@/api/report'
export default {
  data() {
    return {
      params: {
        startTime: '',
        endTime: ''
      },
      rsp:{},
    };
  },
  /**
   * 计算属性
   */
  computed: {
    queryParams() {
      const params = {
        ...this.params
      }

      if (params.startTime) {
        params.startTime = new Date(params.startTime).getTime()
      }
      if (params.endTime) {
        params.endTime = new Date(params.endTime).getTime()
      }

      return params
    }
  },
  /**
   * 组件创建时的声明周期函数
   */
  created () {
    this.params.startTime  = moment().format('YYYY-MM-DD 12:00:00:00');
    this.params.endTime = moment().add(1,'day').format('YYYY-MM-DD 11:59:59:999');
    this.query(this.queryParams)
  },

  /** 监听data中的数据变化 */
  watch: {

  },
    
  methods: {
    /**
     * 查询指定页数据
     */
    async query(params = {}) {
      this.rsp = await betReport({
        ...params,
      });
    },
    /**
     * 查询
     */
    search() {
      this.query(this.queryParams);
    },
    /**
     * 周报表
     */ 
    weekReport(){
      this.params.startTime  = moment().days(1).format('YYYY-MM-DD 12:00:00');
      this.params.endTime = moment().days(1).add(1, 'week').format('YYYY-MM-DD 11:59:59');
      this.query(this.queryParams)
    },
    /**
     * 月报表
     */ 
    monthReport(){
      this.params.startTime  = moment().date(1).format('YYYY-MM-DD 12:00:00:00');
      this.params.endTime = moment().date(1).add(1, 'month').format('YYYY-MM-DD 11:59:59');
      this.query(this.queryParams)
    },

  },
}
</script>
<style scoped>
.form-horizontal .col-xs-6 {
  margin-bottom: 15px;
}
.form-horizontal select {
  min-width: 180px;
}
.pagination {
  justify-content: flex-end;
}
.thum {
  height: 60px;
  width: 60px;
}
.conditions .row {
  align-items: center;
}
.conditions .row .col-xs-6{
  padding-right: 15px
}
.conditions .btn-submit {
  height: 36px;
  line-height: 34px;
  padding: 0 12px;
}
a {
  cursor: pointer;
}
.options {
  display: inline-block;
  padding: 0;
  margin: 0;
  border: .5px dotted #ddd;
  border-bottom: none;
  border-left: none;
}
.options li {
  list-style: none;
  display: grid;
  grid-template-columns: 140px 140px 240px 200px;
  border-bottom: .5px dotted #ddd;
  background-color: #fdf3e5;
}
.options li span {
  border-left: .5px dotted #ddd;
}
.table th, .table td {
  vertical-align: middle;
}
.options li:nth-child(2n) {
  /* background-color: #f7f7f7; */
}
.end-time {
  color: #d26a5c;
}
.operations button {
  margin: 3px !important;
}
</style>
