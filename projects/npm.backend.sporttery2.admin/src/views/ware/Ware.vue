<template>
  <div>
    <!-- Dynamic Table Full -->
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">
          商品管理
          <br />
          <small>管理商品的上下架，以及商品兑换条件的设定</small>
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
                      placeholder="名称"
                      v-model="condition.wareName"
                    />
                    <label for="material-text">商品名称</label>
                  </div>
                </div>
                
                <div class="col-xs-6">
                  <div class="form-material">
                    <b-select class="form-control" size="1" v-model="condition.type">
                      <option value="-1" select="true">请选择...</option>
                      <option value="1">代金券</option>
                      <option value="2">现金券</option>
                      <option value="3">实物商品</option>
                    </b-select>
                    <label for="material-select">商品类型</label>
                  </div>
                </div>

                <div class="col-xs-6">
                  <div class="form-material">
                    <b-select class="form-control" size="1" v-model="condition.state">
                      <option value="-1" select="true">请选择...</option>
                      <option value="1">正常</option>
                      <option value="2">已删除</option>
                    </b-select>
                    <label for="material-select">状态</label>
                  </div>
                </div>
                
                <div class="col-xs-6">
                  <div class="form-material">
                    <date-time-picker class="form-control" placeholder="请选择开始时间" v-model="condition.startTime" />
                    <label for="material-text">开始时间</label>
                  </div>
                </div>
                <div class="col-xs-6">
                  <div class="form-material">
                    <date-time-picker class="form-control" placeholder="请选择结束时间" v-model="condition.endTime" />
                    <label for="material-text">结束时间</label>
                  </div>
                </div>
                
                <button class="btn btn-primary push-5-r push-10 btn-submit" type="button" @click="search">
                  <i class="fa fa-search"></i> 查询
                </button>
                <button class="btn btn-primary push-5-r push-10 btn-submit" type="button" @click="inputing = true">
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
              <th class="text-center" style="width: 10%;">列表图片</th>
              <th class="text-center" style="width: 10%;">商品名称</th>
              <th class="text-center" style="width: 8%;">商品类别</th>
              <th class="text-center" style="width: 8%;">库存</th>
              <th class="text-center" style="width: 8%;">所需积分</th>
              <th class="text-center" style="width: 15%;">尺寸</th>
              <th class="text-center" style="width: 18%;">颜色</th>
              <th class="text-center" style="width: 10%;">创建时间</th>
              <th class="text-center" style="width: 5%;">状态</th>
              <th class="text-center" style="width: 5%;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in pageData.list" :key="item._id">
              <td class="text-center">{{i + 1}}</td>
              <td class="hidden-xs">
                <img class="thum" :src="item.photo" />
              </td>
              <td class="font-w600">{{item.wareName}}</td>
              <td class="font-w600 text-center">{{WareType[item.type]}}</td>
              <td class="font-w600">{{item.inventory}}</td>
              <td class="font-w600">{{item.needIntegral}}</td>
              <td class="font-w600">
                <div class="" v-for="(s, j) in item.size" :key="j">
                  {{s}}
                </div>
              </td>
              <td class="font-w600">
                <div
                  v-for="(col) in item.wareColor"
                  :key="col._id"
                  :style="{
                    color: col.value
                  }"
                >
                  {{col.name}} {{col.value}}
                </div>
              </td>
              <td class="font-w600">{{item.createTime | dateFormat('yyyy-MM-dd HH:mm')}}</td>
              <td class="font-w600 text-center">{{StateType[item.state]}}</td>
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
    <InputDialog
      :open="inputing"
      :editData="editData"
      @close="inputing = false"
      @saveSuccess="saveSuccess"
    />
  </div>

</template>
<script>
import { listWare, delWare } from "@/api/ware";

import InputDialog from '@/components/Ware/InputDialog'; // 新增、修改商品弹窗
const $ = window.jQuery;

export default {
  data() {
    return {
      condition: {
        wareName: "",
        state: -1,
        type: -1,
        startTime: "",
        endTime: ""
      },
      pageData: {
        list: []
      },
      StateType: {
        0: "已删除",
        1: "正常"
      },
      WareType:{
        1: "代金券",
        2: "现金券",
        3: "实物商品"
      },
      
      editData: null,
      inputing: false
    };
  },
  components: {
    InputDialog
  },
  /**
   * 组件创建时的声明周期函数
   */
  created() {
    this.queryList({
      pageSize: this.pageData.currentCount,
      state: -1,
      type: -1
    });
  },

  /** 监听data中的数据变化 */
  watch: {
    // 监听页码变化,做分页查询
    "pageData.currentPage"(newValue) {
      this.queryList({
        wareName: this.condition.wareName,
        type: this.condition.type,
        state: this.condition.state,
        startTime: this.condition.startTime,
        endTime: this.condition.endTime,
        pageSize: this.pageData.currentCount,
        pageIndex: newValue
      });
    },
    editData (n) {
      if (n) {
        this.inputing = true;
      }
    },
    inputing (n) {
      if (!n) {
        this.editData = null;
      }
    }
  },
  methods: {
    /**
     * 查询指定页数据
     */
    async queryList(params = {}) {
      this.pageData = await listWare(params);
    },
    search() {
      this.queryList({
        wareName: this.condition.wareName,
        type: this.condition.type,
        state: this.condition.state,
        startTime: this.condition.startTime,
        endTime: this.condition.endTime
      });
    },
    async deleteInfo(id) {
      try {
        await delWare(id);
        this.queryList({
          pageSize: this.pageData.currentCount,
          pageIndex: this.pageData.currentPage,
          wareName: this.condition.title,
          state: this.condition.state,
          type: this.condition.type,
          startTime: this.condition.startTime,
          endTime: this.condition.endTime
        });
      } catch (e) {
        console.log(e);
      }
    },
    saveSuccess(){
      this.inputing = false;
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
