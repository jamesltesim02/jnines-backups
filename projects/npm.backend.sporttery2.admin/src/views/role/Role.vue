<template>
  <div>
    <!-- Dynamic Table Full -->
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">
          管理后台角色管理
          <br />
          <small>管理角色，以及给相应的角色分配相关的资源权限</small>
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
                      v-model="condition.roleName"
                    />
                    <label for="material-text">角色名称</label>
                  </div>
                </div>
                <button class="btn btn-primary push-5-r push-10 btn-submit" type="button" @click="search">
                  <i class="fa fa-search"></i> 查询
                </button>
                <button class="btn btn-primary push-5-r push-10 btn-submit" type="button" @click="openFalg = true">
                  <i class="fa fa-plus"></i> 新增角色
                </button>
              </div>
            </div>
          </form>
        </div>
        <table class="table table-bordered table-striped js-dataTable-full">
          <thead>
            <tr>
              <th class="text-center"></th>
              <th class="text-center" style="width: 15%;">角色名称</th>
              <th class="text-center" style="width: 15%;">英文名称</th>
              <th class="text-center" style="width: 50%;">权限资源</th>
              <th class="text-center" style="width: 10%;">创建时间</th>
              <th class="text-center" style="width: 8%;">状态</th>
              <th class="text-center" style="width: 10%;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in pageData.list" :key="item._id">
              <td class="text-center">{{i + 1}}</td>
              <td class="font-w600">{{item.roleName}}</td>
              <td class="font-w600">{{item.name}}</td>
              <td>
                <template v-for="(s, j) in item.roleResource" >
                  <div :key="j">
                    <span
                      class="font-w600"
                    >{{s.resourceName}}:</span>
                    <span v-for="(m, n) in s.nextResourceList" :key="n">
                      {{m.resourceName}}
                    </span> 
                  </div>
                </template>
              </td>
              <td class="font-w600">{{item.createTime | dateFormat('yyyy-MM-dd HH:mm')}}</td>
              <td class="font-w600 text-center">{{StateType[item.state]}}</td>
              <td class="text-center">
                <div class="btn-group">
                  <button
                    class="btn btn-xs btn-default"
                    type="button"
                    data-toggle="tooltip"
                    title="编辑"
                    @click="editData = item"
                  >
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button
                    class="btn btn-xs btn-default"
                    type="button"
                    data-toggle="tooltip"
                    title="删除"
                    @click="deleteInfo(item._id)"
                  >
                    <i class="fa fa-times"></i>
                  </button>

                  <button
                      class="btn btn-xs btn-default"
                      type="button"
                      @click="setRoleDetail(item)"
                    >
                      <i class="fa fa-cog"></i>
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
    <RoleDialog 
      :open="openFalg"
      :editData="editData"
      @close="openFalg = false"
      @saveSuccess="saveSuccess"
    />

    <RoleSourceDialog
      :roleData="roleData"
      @close="roleData = null"
      @saveSource="saveSource"
    />
  </div>
</template>
<script>
import { listRole, deleteRole } from "@/api/role";
import RoleDialog from '@/components/Role/RoleDialog'
import RoleSourceDialog from '@/components/Role/RoleSourceDialog' 


const $ = window.jQuery;

export default {
  data() {
    return {
      condition: {
        roleName: ""
      },
      pageData: {
        list: []
      },
      StateType: {
        0: "已删除",
        1: "正常"
      },
      openFalg: false, // 新增、修改弹窗控制标识
      editData: null,  // 修改角色属性数据
      roleData: null   // 修改权限数据
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
    },
    openFalg (n) {
      if(!n){
        this.editData = null;
      }
    }
  },
  
  components: {
    RoleDialog,
    RoleSourceDialog
  },
  methods: {
    /**
     * 查询指定页数据
     */
    async queryList(params = {}) {
      this.pageData = await listRole(params);
    },
    search() {
      this.queryList({
          roleName: this.condition.roleName
        });
    },
    async deleteInfo(id) {
      try {
        await deleteRole(id);
        this.queryList({
          pageSize: this.pageData.currentCount,
          pageIndex: this.pageData.currentPage,
          roleName: this.condition.roleName
        });
      } catch (e) {
        console.log(e);
      }
    },

    /**
     * 打开权限编辑弹窗
     */
    setRoleDetail(role) {
      this.roleData = role
    },
    saveSuccess () {
      this.openFalg = false
      this.search()
    },
    saveSource () {
      this.roleData = null
      this.queryList({
          pageSize: this.pageData.currentCount,
          pageIndex: this.pageData.currentPage,
          roleName: this.condition.roleName
        })
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
