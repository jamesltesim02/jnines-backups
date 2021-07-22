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
                      placeholder="请输入账号"
                      v-model="condition.keyword"
                    >
                    <label for="material-text">Username</label>
                  </div>
                </div>
                <div class="col-xs-6">
                  <div class="form-material">
                    <date-time-picker
                      class="form-control"
                      placeholder="选择开始时间"
                      :options="{
                        // options的参考文档: https://eonasdan.github.io/bootstrap-datetimepicker/
                        format: 'YYYY-MM-DD HH:mm' // 默认为 YYYY-MM-DD HH:mm:ss
                      }"
                      v-model="condition.dateValue"
                    />
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
                <button
                  class="btn btn-info push-5-r push-10 btn-submit"
                  type="button"
                  @click="adding = true"
                >
                  <i class="fa fa-plus"></i> 添加
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
            <template v-for="(item, i) in pageData.list">
              <tr :key="item._id">
                <td class="text-center">{{i + 1}}</td>
                <td class="hidden-xs">
                  <img class="thum" :src="item.thumbnail" />
                </td>
                <td class="font-w600">{{item.title}}</td>
                <td class="hidden-xs">{{item.createTime | dateFormat('yyyy-MM-dd')}}</td>
                <td class="text-center">
                  <div class="btn-group">
                    <button class="btn btn-xs btn-default" type="button"><i class="fa fa-pencil"></i></button>
                    <button class="btn btn-xs btn-default" type="button"><i class="fa fa-times"></i></button>
                    <button
                      class="btn btn-xs btn-default"
                      type="button"
                      @click="setRoleDetail(item)"
                    >
                      <i class="fa fa-cog"></i>
                    </button>
                    <button
                      class="btn btn-xs btn-default"
                      type="button"
                      @click="$router.push('/demo/charts')"
                    >
                      <i class="fa fa-bar-chart"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <b-pagination
          v-model="pageData.currentPage"
          :total-rows="pageData.totalRecord"
          :per-page="pageData.currentCount"
        />
      </div>
    </div>
    <!-- END Dynamic Table Full -->
    <AddDialog :open.sync="adding" />
    <RoleDetailDialog
      :roleData="roleData"
      @close="roleData = null"
    />
  </div>
</template>
<script>
import { listNews } from '@/api/info';

import AddDialog from '@/components/Home/AddDialog';
import RoleDetailDialog from '@/components/Home/RoleDetailDialog';

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
      },
      adding: false,
      roleData: null
    };
  },
  components: {
    AddDialog,
    RoleDetailDialog
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
    'condition.keyword' (newValue, oldValue) {
      this.keyword = (newValue || '').trim()
    }
  },
  /**
   * 组件创建时的声明周期函数
   */
  created () {
    this.queryList({ pageSize: this.pageData.currentCount })
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
    },
    /**
     * 打开权限编辑弹窗
     */
    setRoleDetail(role) {
      this.roleData = {
        _id: 'hjgu7687ughjg',
        name: '超级管理员',
        resources: [
          {
            _id: '5e06bf058aba137eedbef256',
            resourceName: '用户',
            name: 'adminUser',
            path: '---',
            subReources: [
              {
                _id: '5e06c2a7dce7b52528475a98',
                resourceName: '用户管理',
                name: 'adminUser',
                path: '/admin'
              }
            ]
          },
          {
            _id: '5e06bd2e0b5e983c251b1d43',
            subReources: [
              {
                _id: '5e06c3d6dce7b52528475a9d'
              }
            ]
          }
        ]
      }
    }
  },
}
</script>
<style scoped>
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
