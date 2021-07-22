<template>
  <modal
    :title="`${type}商品`"
    :open="open"
    @ok="save"
    @close="close"
  >
    <form class="form-horizontal push-12">
      <div class="form-group">
        <div class="col-sm-5">
          <div class="form-material">
            <input class="form-control" type="text" placeholder="输入商品名称" v-model="formData.wareName">
            <label for="material-text">商品名称</label>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="form-material">
            <b-select class="form-control" size="1" v-model="formData.type">
              <option value="1">代金券</option>
              <option value="2">现金券</option>
              <option value="3">实物商品</option>
            </b-select>
            <label for="material-select">商品类别</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-5">
          <div class="form-material">
            <input
              class="form-control"
              type="text"
              v-model="formData.inventory"
            >
            <label for="material-gridf">库存</label>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="form-material">
            <input class="form-control" type="text" v-model="formData.needIntegral">
            <label for="material-gridl">兑换所需积分</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-5">
          <div class="form-material">
            <date-time-picker class="form-control" placeholder="请选择开始时间" v-model="formData.validStart" />
            <label for="material-text">有效期开始</label>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="form-material">
            <date-time-picker class="form-control" placeholder="请选择结束时间" v-model="formData.validEnd" />
            <label for="material-text">有效期结束</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <color-list-picker v-model="formData.wareColor" />
            <label for="material-text">颜色</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <tags v-model="formData.size" />
            <label for="example-tags2">尺寸</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <image-uploader
              v-model="formData.photo"
              name="photo"
            />
            <label for="example-tags2">列表图片</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <image-uploader
              v-model="formData.bannerList"
              multiple
              name="bannerList"
            />
            <label for="example-tags2">Banner图片</label>
          </div>
        </div>
      </div>

    </form>
<!-- 
    <template slot="fotter">

    </template> -->
  </modal>
</template>

<script>
import { uploadFiles } from '@/api/files'
import { addWare, updateWare } from "@/api/ware";

const initData = {
  wareName: "",
  type: "",
  inventory: "",
  needIntegral: "",
  validStart: "",
  validEnd: "",
  wareColor: [],
  size: [],
  bannerList: [],
  photo: null
}

export default {
  props: ['open', 'editData'],
  data () {
    return {
      formData: {...initData}
    };
  },
  computed: {
    type() {
      return this.editData ? '修改' : '添加'
    }
  },
  watch: {
    editData (n) {
      this.formData = { ...(n || initData) }
    }
  },
  methods: {
    async save () {
      const method = this.editData ? updateWare : addWare;
      try {
        this.$loading(`${this.type}中...`)
        const result = await method(this.formData)
        this.$toast.center(`${this.type}成功`)
        this.$emit('saveSuccess')
      } catch (e) {
        // if(e.code === '1111') {
        // TODO 特殊业务处理
        // }
      } finally {
        this.$loading.close();
      }
    },
    close() {
      this.$emit('close');
      this.formData = {...initData};
    }
  }
}

</script>