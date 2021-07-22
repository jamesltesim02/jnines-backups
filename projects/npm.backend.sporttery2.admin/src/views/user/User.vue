<template>
  <div>
    <!-- Dynamic Table Full -->
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">
          会员管理中心
          <br />
          <small>展示用户相关统计数据，设置用户标签以及分析用户投注行为</small>
        </h3>
      </div>
      <div class="block-content">
        <div class="block-content conditions">
          <form class="form-horizontal">
            <div class="form-group">
              <div class="row">
                <div class="col-xs-6">
                  <div class="form-material">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="请输入..."
                      v-model="condition.nickName"
                    />
                    <label for="material-text">用户昵称</label>
                  </div>
                </div>

                <div class="col-xs-6">
                  <div class="form-material">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="请输入..."
                      v-model="condition.tags"
                    />
                    <label for="material-text">用户标签</label>
                  </div>
                </div>

                <div class="col-xs-6">
                  <div class="form-material">
                    <b-select class="form-control" size="1" v-model="condition.type">
                      <option value="-1" select="true">请选择...</option>
                      <option value="betCount">总单数</option>
                      <option value="winBetCount">赢得单数</option>
                      <option value="totalBetAmount">总投注额</option>
                      <option value="totalReturn">总返还金额</option>
                      <option value="betRate">总命中率</option>
                      <option value="betReturnRate">总返还率</option>
                    </b-select>
                    <label for="material-select">排序</label>
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
              <th class="text-center"></th>
              <th class="text-center" style="width: 6%;">用户昵称</th>
              <th class="text-center" style="width: 10%;">用户ID</th>
              <th class="text-center" style="width: 10%;">总单数</th>
              <th class="text-center" style="width: 10%;">赢利单数</th>
              <th class="text-center" style="width: 10%;">总投注额</th>
              <th class="text-center" style="width: 10%;">总返还额</th>
              <th class="text-center" style="width: 10%;">总命中率</th>
              <th class="text-center" style="width: 10%;">总返还率</th>
              <th class="text-center" style="width: 10%;">用户标签</th>
              <th class="text-center" style="width: 10%;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in pageData.list" :key="item._id">
              <td class="text-center">{{i + 1}}</td>
              <td class="font-w600">{{item.nickName}}</td>
              <td class="font-w600">{{item.userId}}</td>
              <td class="font-w600">{{item.betCount}}</td>
              <td class="font-w600">{{item.winBetCount}}</td>
              <td class="font-w600">{{item.totalBetAmount}}</td>
              <td class="font-w600">{{item.totalReturn}}</td>
              <td class="font-w600">{{item.betRate * 100}}%</td>
              <td class="font-w600">{{item.betReturnRate * 100}}%</td>
              <td class="font-w600">{{item.tags}}</td>
              <td class="text-center">
                <div class="btn-group">
                  <button
                    class="btn btn-xs btn-default"
                    type="button"
                    title="设置标签"
                    @click="editData = item"
                  >
                    <i class="fa fa-cog"></i>
                  </button>
                  <!-- <button
                    class="btn btn-xs btn-default"
                    type="button"
                    title="用户分析"
                  >
                    <i class="si si-bar-chart"></i>
                  </button> -->
                  <button
                    class="btn btn-xs btn-default"
                    type="button"
                    title="注单详情"
                    @click="$router.push(`/bet?userId=${item.userId}`)"
                  >
                    <i class="fa fa-list-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <b-pagination
          class="pagination"
          v-model="pageData.currentPage"
          :total-rows="pageData.totalRecord"
          :per-page="pageData.currentCount"
        />
      </div>
    </div>

    <UserTagsDialog 
      :open="openFalg"
      :editData="editData"
      @close="close"
      @saveSuccess="saveSuccess"
    />

  </div>
</template>
<script>
import { listUser } from "@/api/user";
import UserTagsDialog from '@/components/User/UserTagsDialog';
const $ = window.jQuery;

export default {
  data() {
    return {
      condition: {
        nickName: '', 
        tags: '',
        type: ''
      },
      pageData: {
        list: []
      },
      openFalg: false,
      editData: null
    };
  },
  /**
   * 组件创建时的声明周期函数
   */
  created() {
    this.queryList({ pageSize: this.pageData.currentCount });
  },

  /** 监听data中的数据变化 */
  watch: {
    // 监听页码变化,做分页查询
    "pageData.currentPage"(newValue) {
      this.queryList({
        pageSize: this.pageData.currentCount,
        pageIndex: newValue
      });
    },
    editData (n) {
      if (n) {
        this.openFalg = true;
      }
    }
  },
  components: {
    UserTagsDialog
  },
  methods: {
    /**
     * 查询指定页数据
     */
    async queryList(params = {}) {
      this.pageData = await listUser(params);
    },
    search() {
      this.queryList({
        nickName: this.condition.nickName,
        tags: this.condition.tags,
        type: this.condition.type
      });
    },
    close(){
      openFalg = false
      this.editData = null
    },
    saveSuccess(){
      this.openFalg = false;
      this.search();
    }
  }
};
</script>
<style scoped>
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
.conditions .row .col-xs-6 {
  padding-right: 15px;
}
.conditions .btn-submit {
  height: 36px;
  line-height: 34px;
  padding: 0 12px;
}
</style>
