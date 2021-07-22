<template>
  <div>
    <!-- Dynamic Table Full -->
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">
          资源管理
          <br />
          <small>新增的功能页面，在此添加相应的资源</small>
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
                      v-model="condition.resourceName"
                    />
                    <label for="material-text">资源名称</label>
                  </div>
                </div>

                <div class="col-xs-6">
                  <div class="form-material">
                    <b-select class="form-control" size="1" v-model="condition.parentId">
                      <option value="-1" select="true">请选择...</option>
                      <option value="root" select="true">根节点</option>
                      <option
                        v-for="op in rootList"
                        :value="op._id"
                        :key="op._id"
                      >{{ op.resourceName }}</option>
                    </b-select>
                    <label for="material-select">父节点</label>
                  </div>
                </div>

                <button class="btn btn-primary push-5-r push-10 btn-submit" type="button" @click="search">
                  <i class="fa fa-search"></i> 查询
                </button>
                <button class="btn btn-primary push-5-r push-10 btn-submit" type="button" @click="openFalg = true">
                  <i class="fa fa-plus"></i> 新增资源
                </button>
              </div>
            </div>
          </form>
        </div>
        <table class="table table-bordered table-striped js-dataTable-full">
          <thead>
            <tr>
              <th class="text-center"></th>
              <th class="text-center" style="width: 15%;">资源ID</th>
              <th class="text-center" style="width: 15%;">资源名称</th>
              <th class="text-center" style="width: 15%;">访问路径</th>
              <th class="text-center" style="width: 8%;">排序</th>
              <th class="text-center" style="width: 15%;">父级节点</th>
              <th class="text-center" style="width: 10%;">创建时间</th>
              <th class="text-center" style="width: 8%;">状态</th>
              <th class="text-center" style="width: 10%;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in pageData.list" :key="item._id">
              <td class="text-center">{{i + 1}}</td>
              <td class="font-w600">{{item._id}}</td>
              <td class="font-w600">{{item.resourceName}}</td>
              <td class="font-w600">{{item.path}}</td>
              <td class="font-w600">{{item.resourceNo}}</td>
              <td class="font-w600">{{item.parentRootName}}</td>
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

    <ResourceDialog 
      :open="openFalg"
      :editData="editData"
      :rootList="rootList"
      @close="openFalg = false"
      @saveSuccess="saveSuccess"
    />
  </div>
</template>
<script>
import { listResource, deleteResource, getAllRoot } from "@/api/resource";
import ResourceDialog from '@/components/Resource/ResourceDialog';

const $ = window.jQuery;

export default {
  data() {
    return {
      condition: {
        resourceName: '',
        parentId: '-1'
      },
      pageData: {
        list: []
      },
      StateType: {
        0: "已删除",
        1: "正常"
      },
      rootList: [],
      openFalg: false,
      editData: null
    };
  },
  /**
   * 组件创建时的声明周期函数
   */
  async created() {
    this.queryList({ 
      pageSize: this.pageData.currentCount,
      parentId: '-1'
    })
    this.rootList = await getAllRoot()
  },

  /** 监听data中的数据变化 */
  watch: {
    // 监听页码变化,做分页查询
    "pageData.currentPage"(newValue) {
      this.queryList({
        roleName: this.condition.roleName,
        parentId: this.condition.parentId,
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
    ResourceDialog
  },
  methods: {
    /**
     * 查询指定页数据
     */
    async queryList(params = {}) {
      this.pageData = await listResource(params);
    },
    search() {
      this.queryList({
          resourceName: this.condition.resourceName,
          parentId: this.condition.parentId
        }); 
    },
    async deleteInfo(id) {
      try {
        await deleteResource(id);
        this.queryList({
          pageSize: this.pageData.currentCount,
          pageIndex: this.pageData.currentPage,
          resourceName: this.condition.resourceName,  
          parentId: this.condition.parentId
        });
      } catch (e) {
        console.log(e);
      }
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
