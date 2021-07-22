<template>
  <div>
    <!-- Dynamic Table Full -->
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">
          管理后台用户管理
          <br />
          <small>管理后台用户，新增、修改、删除以及给用户分配角色</small>
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
                      v-model="condition.title"
                    />
                    <label for="material-text">用户名</label>
                  </div>
                </div>

                <div class="col-xs-6">
                  <div class="form-material">
                    <b-select class="form-control" size="1" v-model="condition.roleId">
                      <option value="-1" select="true">请选择...</option>
                      <option
                        v-for="op in roleList"
                        :value="op._id"
                        :key="op._id"
                      >{{ op.roleName }}</option>
                    </b-select>
                    <label for="material-select">角色</label>
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
                  class="btn btn-primary push-5-r push-10 btn-submit"
                  type="button"
                  @click="openFalg=true"
                >
                  <i class="fa fa-plus"></i> 新增
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
              <th class="text-center" style="width: 8%;"></th>
              <th class="text-center" style="width: 15%;">用户名</th>
              <th class="text-center" style="width: 15%;">角色</th>
              <th class="text-center" style="width: 15%;">电话</th>
              <th class="text-center" style="width: 15%;">创建时间</th>
              <th class="text-center" style="width: 10%;">状态</th>
              <th class="text-center" style="width: 15%;">备注</th>
              <th class="text-center" style="width: 10%;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in pageData.list" :key="item._id">
              <td class="text-center">{{i + 1}}</td>
              <td class="hidden-xs">
                <img class="thum" :src="item.header" />
              </td>
              <td class="font-w600">{{item.userName}}</td>
              <td class="font-w600">{{item.roleName || '---'}}</td>
              <td class="font-w600">{{item.phone}}</td>
              <td class="font-w600">{{item.createTime | dateFormat('yyyy-MM-dd HH:mm')}}</td>
              <td class="text-center font-w600">{{AdminState[item.state]}}</td>
              <td class="font-w600">{{item.note}}</td>
              <td class="text-center">
                <div class="btn-group">
                  <button
                    class="btn btn-xs btn-default"
                    type="button"
                    title="修改"
                    @click="editData = item"
                  >
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button
                    class="btn btn-xs btn-default"
                    type="button"
                    title="删除"
                    @click="deleteInfo(item._id)"
                  >
                    <i class="fa fa-times"></i>
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
    <!-- END Dynamic Table Full -->
    <AdminDialog 
      :open="openFalg"
      :editData="editData"
      :roleList="roleList"
      @close="close"
      @saveSuccess="saveSuccess"
    />
  </div>
</template>
<script>
import { listAdminUser, deleteAdminUser, getAllRoles } from "@/api/admin";
import AdminDialog from '@/components/Admin/AdminDialog';
const $ = window.jQuery;

export default {
  data() {
    return {
      condition: {
        userName: "",
        roleId: ""
      },
      pageData: {
        list: []
      },
      AdminState: {
        0: "已删除",
        1: "正常"
      },
      openFalg: false,
      editData: null,
      roleList: []
    };
  },
  /**
   * 组件创建时的声明周期函数
   */
  async created() {
    this.queryList({ pageSize: this.pageData.currentCount })
    this.roleList = await getAllRoles()
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
    },
    openFalg (n) {
      if (!n) {
        this.editData = null;
      }
    }
  },
  components: {
    AdminDialog
  },
  methods: {
    /**
     * 查询指定页数据
     */
    async queryList(params = {}) {
      this.pageData = await listAdminUser(params);
    },
    search() {
      this.queryList({
        title: this.condition.userName,
        roleId: this.condition.roleId
      });
    },
    
    async deleteInfo(id) {
      try {
        await deleteAdminUser(id);
        this.queryList({
          pageSize: this.pageData.currentCount,
          pageIndex: this.pageData.currentPage,
          title: this.condition.userName,
          roleId: this.condition.roleId
        });
      } catch (e) {
        console.log(e);
      }
    },
    close(){
      this.openFalg = false
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
