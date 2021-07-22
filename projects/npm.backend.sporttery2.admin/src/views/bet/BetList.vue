<template>
  <div>
    <!-- Dynamic Table Full -->
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">注单列表 <small></small></h3>
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
                <div class="col-xs-6">
                  <div class="form-material">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="请输入用户Id"
                      v-model="params.userId"
                    >
                    <label for="material-text">用户ID</label>
                  </div>
                </div>
                <div class="col-xs-6">
                  <div class="form-material">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="请输入注单编号"
                      v-model="params.ticketId"
                    >
                    <label for="material-text">注单编号</label>
                  </div>
                </div>
                <div class="col-xs-6">
                  <div class="form-material">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="请输入注单金额"
                      v-model="params.betAmount"
                    >
                    <label for="material-text">最小注单金额</label>
                  </div>
                </div>
                <div class="col-xs-6">
                  <div class="form-material">
                    <select 
                      class="form-control"
                      placeholder="Choose one.."
                      v-model="params.betState"
                      >
                      <option></option><!-- Required for data-placeholder attribute to work with Select2 plugin -->
                      <option value="2">未结算</option>
                      <option value="3">已结算</option>
                      <option value="4">已取消</option>
                    </select>
                    <label for="material-text">注单状态</label>
                  </div>
              </div>
                <div class="col-xs-6">
                  <div class="form-material">
                    <select 
                      class="form-control"
                      placeholder="Choose one.."
                      v-model="params.settleResult"
                      >
                      <option></option><!-- Required for data-placeholder attribute to work with Select2 plugin -->
                      <option value="100">赢</option>
                      <option value="-100">输</option>
                      <option value="0">取消</option>
                    </select>
                    <label for="material-text">结算结果</label>
                  </div>
              </div>
                <div class="col-xs-6">
                  <div class="form-material">
                    <select class="form-control" 
                      name="val-select2" 
                      placeholder="Choose one.."
                      v-model="params.betType"
                      >
                      <option></option><!-- Required for data-placeholder attribute to work with Select2 plugin -->
                      <option value="1">单注</option>
                      <option value="2">串关</option>
                    </select>
                    <label for="material-text">注单类型</label>
                  </div>
              </div>
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
            <tr >
              <th colspan="9" class="bg-primary">
                总投注额:{{pageData.statisticalData.totalBetAmount}} ,
                总单数:{{pageData.statisticalData.betCount}},
                盈利:{{pageData.statisticalData.profitAmount}}
              </th>
            </tr>
            <tr>
              <th class="text-center">注单号</th>
              <th class="text-center">用户id</th>
              <th class="text-center">注单金额</th>
              <th class="text-center">注单类型</th>
              <th class="text-center">订单类型</th>
              <th class="text-center">投注时间</th>
              <th class="text-center">结算金额</th>
              <th class="text-center">结算结果</th>
              <th class="text-center">注单状态</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in pageData.list">
            <tr :key="item._id">
              <td class="text-center">{{item.ticketId}}</td>
              <td class="text-center">{{item.userId}}</td>
              <td class="text-center">{{item.betAmount}}</td>
              <td class="text-center">
                {{betTypeMapping[item.betType]}}
                <a @click="detailIndex = detailIndex === i ? -1 : i">查看详情</a>
              </td>
              <td class="text-center">{{ticketTypeMapping[item.ticketType]}}</td>
              <td class="text-center">{{item.betTime | dateFormat('yyyy-MM-dd HH:mm')}}</td>
              <td class="text-center">{{item.settlement || '---'}}</td>
              <td
                :class="[
                  'text-center',
                  'font-w600',
                  item.settleResult > 0 ? 'text-danger' : 'text-success'
                ]"
              >{{settleResultMapping[item.settleResult] || '---'}}</td>
              <td class="text-center">{{betStateMapping[item.betState]}}</td>
            </tr>
            <tr
              :key="item._id"
              v-if="detailIndex === i"
            >
              <td
                colspan="9"
                class="item-detail"
              >
                <ul class="options">
                  <li
                    v-for="opt in item.optionArray"
                    :key="`${item.ticketId}-${opt.macthId}-${opt.optionId}`"
                  >
                    <span>
                      第{{opt.matchStartTime | dateFormat('yyMMdd')}}期
                      周{{'日一二三四五六'.charAt(new Date(opt.matchStartTime).getDay())}}
                      001
                    </span>
                    <span>
                      {{opt.tourName}}
                    </span>
                    <span>{{opt.macthName}}</span>
                    <span>
                      <GameName
                        :sportId="opt.sportNo"
                        :groupType="opt.groupType"
                        :betStage="opt.betStage"
                        :gameType="opt.gameType"
                      /> |
                      <OptionName
                        :gameType="opt.gameType"
                        :betBar="opt.betBar"
                        :betOption="opt.betOption"
                      />
                      @{{Number(opt.oddsView).toFixed(2)}}
                    </span>
                  </li>
                  </ul>
              </td>
            </tr>
            </template>
          </tbody>
        </table>
        <b-pagination
          v-model="pageData.currentPage"
          :total-rows="pageData.totalRecord"
          :per-page="pageData.currentCount"
          aria-controls="my-table"
        />
      </div>
    </div>
    <!-- END Dynamic Table Full -->
  </div>
</template>
<script>
import { listBet } from '@/api/bet'
import OptionName from '@/components/common/OptionName'
import GameName from '@/components/common/GameName'

export default {
  data() {
    console.log(this.$router, this.$route)
    return {
      detailIndex: -1,
      params: {
        startTime: '',
        endTime: '',
        ticketId:'',
        userId: this.$route.query.userId || '',
        betType:'',
        settleResult:'',
        betState:'',
        betAmount:''
      },
      pageData: {
        currentPage: 1,
        currentCount: 20,
        totalRecord: 0,
        list: []
      },
      betTypeMapping: {
        1: '单注',
        2: '串关'
      },
      settleResultMapping: {
        0:'取消',
        100:'赢',
        '-100':'输'
      },
      betStateMapping:{
        1:'待确认',
        2:'未结算',
        3:'已结算',
        4:'已撤单',
        5:'已退单',
        9:'已提前结算成功的注单'
      },
      ticketTypeMapping:{
        1:'普通注单',
        2:'方案',
        3:'跟单'
      }
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
  /** 依赖的组件 */
  components: {
    OptionName,
    GameName,
  },
  /**
   * 组件创建时的声明周期函数
   */
  created () {
    this.params.startTime  = moment().format('YYYY-MM-DD 12:00:00:00');
    this.params.endTime = moment().add(1,'day').format('YYYY-MM-DD 11:59:59:999');
    this.queryList({ pageSize: this.pageData.currentCount })

  },

  /** 监听data中的数据变化 */
  watch: {
    // 监听页码变化,做分页查询
    'pageData.currentPage' (newValue) {
      this.queryList({
        pageSize: this.pageData.currentCount,
        pageIndex: newValue
      })
    },
    'params.userId' (newValue) {
      this.params.userId = (newValue || '').trim()
    },
    'params.ticketId' (newValue) {
      this.params.ticketId = (newValue || '').trim()
    }
    
  },
  methods: {
    /**
     * 查询指定页数据
     */
    async queryList(params = {}) {
      this.detailIndex = -1
      this.pageData = await listBet({
        ...this.queryParams,
        ...params
      });
    },
    search() {
      this.queryList(this.queryParams);
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
.item-detail {
  text-align: center;
  padding: 5px 0;
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
.options li:nth-child(2n) {
  /* background-color: #f7f7f7; */
}
</style>
