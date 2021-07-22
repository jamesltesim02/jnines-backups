<template>
  <div>
    <!-- Dynamic Table Full -->
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">Dynamic Table <small>Full</small></h3>
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
                      id="material-text"
                      name="material-text"
                      placeholder="请输入账号"
                      v-model="condition.keyword"
                    >
                    <label for="material-text">Username</label>
                  </div>
                </div>
                <div class="col-xs-6">
                  <div class="form-material">
                    <input
                      class="form-control"
                      type="date"
                      id="material-text"
                      name="material-text"
                      placeholder="选择开始时间"
                      pattern="yyyy-mm-dd"
                      v-model="condition.dateValue"
                    >
                    <label for="material-text">开始时间</label>
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
        <!-- DataTables init on table by adding .js-dataTable-full class, functionality initialized in js/pages/base_tables_datatables.js -->
        <table class="table table-bordered table-striped js-dataTable-full">
          <thead>
            <tr>
              <th class="text-center"></th>
              <th>Name</th>
              <th class="hidden-xs">Email</th>
              <th class="hidden-xs" style="width: 15%;">Access</th>
              <th class="text-center" style="width: 10%;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in pageData.list"
              :key="item._id"
            >
              <td class="text-center">{{i + 1}}</td>
              <td class="hidden-xs">
                <img class="thum" :src="item.thumbnail" />
              </td>
              <td class="font-w600">{{item.title}}</td>
              <td class="hidden-xs">{{item.createTime}}</td>
              <td class="text-center">
                <div class="btn-group">
                  <button class="btn btn-xs btn-default" type="button" data-toggle="tooltip" title="Edit Client"><i class="fa fa-pencil"></i></button>
                  <button class="btn btn-xs btn-default" type="button" data-toggle="tooltip" title="Remove Client"><i class="fa fa-times"></i></button>
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
          aria-controls="my-table"
        />
      </div>
    </div>
    <!-- END Dynamic Table Full -->
  </div>
</template>
<script>
import { listNews } from '@/api/info'

const $ = window.jQuery

export default {
  data() {
    return {
      condition: {
        keyword: '',
        dateValue: ''
      },
      pageData: {
        currentPage: 1,
        currentCount: 3,
        totalRecord: 0,
        list: []
      }
    };
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
    }
  },
  methods: {
    /**
     * 查询指定页数据
     */
    async queryList(params = {}) {
      this.pageData = await listNews(params);
    },
    search() {
      console.log(this.condition)
    }
  },
}
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
.conditions .row .col-xs-6{
  padding-right: 15px
}
.conditions .btn-submit {
  height: 36px;
  line-height: 34px;
  padding: 0 12px;
}
</style>
