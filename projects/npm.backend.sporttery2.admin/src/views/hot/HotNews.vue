<template>
  <div>
    <!-- Dynamic Table Full -->
    <div class="block">
      <div class="block-header">
        <h3 class="block-title">
          热门新闻
          <br />
          <small>编辑相关新闻信息，发布到前段显示，并控制期生命周期</small>
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
                    <label for="material-text">新闻标题</label>
                  </div>
                </div>

                <div class="col-xs-6">
                  <div class="form-material">
                    <b-select class="form-control" size="1" v-model="condition.state">
                      <option value="-1" select="true">请选择...</option>
                      <option value="1">正常</option>
                      <option value="0">已删除</option>
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
                <button class="btn btn-primary push-5-r push-10 btn-submit" type="button" @click="openFalg = true">
                  <i class="fa fa-plus"></i> 新增新闻
                </button>
              </div>
            </div>
          </form>
        </div>
        <table class="table table-bordered table-striped js-dataTable-full">
          <thead>
            <tr>
              <th class="text-center"></th>
              <th class="text-center" style="width: 10%;">列表图片</th>
              <th class="text-center" style="width: 8%;">标题</th>
              <th class="text-center" style="width: 20%;">内容</th>
              <th class="text-center" style="width: 5%;">访问路径</th>
              <th class="text-center" style="width: 10%;">创建时间</th>
              <th class="text-center" style="width: 10%;">有效期开始</th>
              <th class="text-center" style="width: 10%;">有效期结束</th>
              <th class="text-center" style="width: 8%;">状态</th>
              <th class="text-center" style="width: 5%;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in pageData.list" :key="item._id">
              <td class="text-center">{{i + 1}}</td>
              <td class="hidden-xs">
                <img class="thum" :src="item.thumbnail" />
              </td>
              <td class="font-w600">{{item.title}}</td>
              <td class="font-w600">{{item.content}}</td>
              <td class="font-w600">{{item.url}}</td>
              <td class="font-w600">{{item.createTime | dateFormat('yyyy-MM-dd HH:mm')}}</td>
              <td class="font-w600">{{item.createTime | dateFormat('yyyy-MM-dd HH:mm')}}</td>
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

    <HotNewsDialog 
      :open="openFalg"
      :editData="editData"
      @close="openFalg = false"
      @saveSuccess="saveSuccess"
    />
  </div>
</template>
<script>
import { listHotNews, deleteHotNews } from "@/api/hotNews";
import HotNewsDialog from '@/components/HotNews/HotNewsDialog';

const $ = window.jQuery;

export default {
  data() {
    return {
      condition: {
        title: '',
        state: -1,
        startTime: '',
        endTime: ''
      },
      pageData: {
        list: []
      },
      StateType: {
        0: "已删除",
        1: "正常"
      },
      openFalg: false,
      editData: null
    };
  },
  /**
   * 组件创建时的声明周期函数
   */
  created() {
    this.queryList({ 
      pageSize: this.pageData.currentCount,
      state: -1
    });
  },

  /** 监听data中的数据变化 */
  watch: {
    // 监听页码变化,做分页查询
    "pageData.currentPage"(newValue) {
      this.queryList({
        title: this.condition.title,
        state: this.condition.state,
        startTime: this.condition.startTime,
        endTime: this.condition.endTime,
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
    HotNewsDialog
  },
  methods: {
    /**
     * 查询指定页数据
     */
    async queryList(params = {}) {
      this.pageData = await listHotNews(params);
    },
    search() {
      this.queryList({
        title: this.condition.title,
        state: this.condition.state,
        startTime: this.condition.startTime,
        endTime: this.condition.endTime
      }); 
    },
    async deleteInfo(id) {
      try {
        await deleteHotNews(id);
        this.queryList({
          pageSize: this.pageData.currentCount,
          pageIndex: this.pageData.currentPage,
          title: this.condition.title,
          state: this.condition.state,
          startTime: this.condition.startTime,
          endTime: this.condition.endTime
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
