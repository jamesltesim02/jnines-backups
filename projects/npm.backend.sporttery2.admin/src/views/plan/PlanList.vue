<template>
  <div>
    <!-- Dynamic Table Full -->
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">方案列表 <small></small></h3>
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
                    <label for="material-text">方案编号</label>
                  </div>
                </div>
                <div class="col-xs-6">
                  <div class="form-material">
                    <select 
                      class="form-control"
                      placeholder="Choose one.."
                      v-model="params.planState"
                      >
                      <option></option><!-- Required for data-placeholder attribute to work with Select2 plugin -->
                      <option value="0">待审核</option>
                      <option value="1">已通过</option>
                      <option value="2">未通过</option>
                    </select>
                    <label for="material-text">方案状态</label>
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
                      <option value="4">已撤单</option>
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
            <tr>
              <th class="text-center">方案编号</th>
              <th class="text-center">用户id</th>
              <th class="text-center">注单金额</th>
              <th class="text-center" width="12%">方案状态</th>
              <th class="text-center" width="14%" >方案内容</th>
              <th class="text-center">方案时间</th>
              <th class="text-center">佣金</th>
              <th class="text-center">跟单数</th>
              <th class="text-center">跟单金额</th>
              <th class="text-center">抽佣比例</th>
              <th class="text-center">注单状态</th>
              <th class="text-center" width="100">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageData.list" :key="item._id">
              <td class="text-center">
                {{item.ticketId}}<br/>
              </td>
              <td class="text-center">{{item.userId}}</td>
              <td class="text-center">{{item.betAmount}}</td>
              <td class="text-center">
                <div :class="['', 'text-success', 'text-danger'][item.planState]">
                  {{planStateMapping[item.planState]}}
                </div>
                <div
                  class="text-left" v-if="item.planState !== 0"
                  :style="{
                    'font-size': '13px'
                  }"
                >
                  审核人:{{ item.auditUserId}}<br>
                  审核时间:{{ item.auditTime | dateFormat('yyyy-MM-dd HH:mm')}}
                </div>
              </td>
              <td class="text-center">{{item.planContent}}</td>
              <td class="text-center">
                发布：{{item.planTime | dateFormat('yyyy-MM-dd HH:mm')}}
                <div class="end-time">截止：{{item.displayTime | dateFormat('yyyy-MM-dd HH:mm')}}</div>
              </td>
              <td class="text-center">{{item.recCommission}}</td>
              <td class="text-center">
                <a v-if="item.planState === 1 && item.followCount >0" @click="followId = item.ticketId">{{item.followCount}}</a><span v-else>{{item.followCount}}</span></td>
              <td class="text-center">{{item.followAmount}}</td>
              <td class="text-center">{{item.isRake}}</td>
              <td
                :class="[
                  'text-center',
                  item.settleResult
                    ? (item.settlement > item.betAmount ? 'text-danger' : 'text-success')
                    : ''
                ]"
              >
                {{
                  item.betState == 3
                  ? `结算金额：${item.settlement}，[${item.settlement > item.betAmount ? '赢' : '输'}]`
                  : betStateMapping[item.betState]
                }}
              </td>
              <td class="text-center operations">
                <div class="btn-group">
                  <button v-if="item.planState !== 2 || item.betState < 3 " class="btn btn-xs btn-default" title="编辑" type="button" @click="editData = item">
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button v-if="item.planState !== 2" class="btn btn-xs btn-default" type="button" :title="item.isTop===0 ? '置顶' : '取消置顶'"   @click="placedTop(item.ticketId,item.isTop === 0 ? 1 : 0)">
                    <i :class="item.isTop===0 ? 'fa fa-arrow-up' :'fa fa-arrow-down'"></i>
                  </button>
                  <br />
                  <button v-if="item.planState === 0" class="btn btn-xs btn-default" title="通过" type="button" @click="auditData = {ticketId: item.ticketId, planState: 1}">
                    <i class="glyphicon glyphicon-ok text-success"></i>
                  </button>
                  <button v-if="item.planState === 0" class="btn btn-xs btn-default" title="拒绝" type="button" @click="auditData = {ticketId: item.ticketId, planState: 2}">
                    <i class="fa fa-times text-danger"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <b-pagination
          v-model="pageData.currentPage"
          :total-rows="pageData.totalRecord"
          :per-page="pageData.currentCount"
          aria-controls="my-table"
        />
      </div>
      <InputDialog
        :editData="editData"
        @close="editData = null"
        @updateSuccess="updateSuccess"
      />
      <AuditDialog
        :auditData="auditData"
        @close="auditData = null"
        @updateSuccess="updateSuccess"
      />
      <FollowsDialog
        :id="followId"
        @close="followId = null"
      />
    </div>
    <!-- END Dynamic Table Full -->
  </div>
</template>
<script>
import { listPlan,updatePlan } from '@/api/plan'
import OptionName from '@/components/common/OptionName'
import GameName from '@/components/common/GameName'
import InputDialog from '@/components/Plan/InputDialog';
import AuditDialog from '@/components/Plan/AuditDialog';
import FollowsDialog from '@/components/Plan/FollowsDialog';

export default {
  data() {
    return {
      detailIndex: -1,
      params: {
        startTime: '',
        endTime: '',
        ticketId:'',
        userId:'',
        betType:'',
        settleResult:'',
        betState:''
      },
      pageData: {
        currentPage: 1,
        currentCount: 10,
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
        2:'未结算',
        3:'已结算',
        4:'已撤单',
        5:'已退单',
        9:'已提前结算成功的注单'
      },
      planStateMapping:{
        0:'待审核',
        1:'已通过',
        2:'未通过'
      },
      editData: null,
      auditData: null,
      inputing: false,
      followId: ''
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
    InputDialog,
    AuditDialog,
    FollowsDialog,
  },
  /**
   * 组件创建时的声明周期函数
   */
  created () {
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
      this.pageData = await listPlan({
        ...this.queryParams,
        ...params
      });
    },
    /**
     * 查询
     */
    search() {
      this.queryList(this.queryParams);
    },
    updateSuccess(){
       this.queryList(this.queryParams);
       this.editData = null;
       this.auditData = null;
    },
    /***
     * 置顶
     */
    async placedTop(ticketId,isTop){
      const params = {
        ticketId,
        isTop
      }
      await updatePlan(params);
       this.$toast.center(`成功`);
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
