<template>
  <modal
    :title="`${type}公告`"
    :open="open"
    @ok="save"
    @close="$emit('close')"
  >
    <form class="form-horizontal push-12">
      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <input
              class="form-control"
              type="text"
              placeholder="请输入标题.."
              v-model="formData.title"
            />
            <label for="material-text">标题</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-md-10">
          <div class="form-material">
            <textarea
              class="js-maxlength form-control"
              rows="3"
              maxlength="100"
              placeholder="请输入.."
              data-always-show="true"
              v-model="formData.content"
            ></textarea>
            <label for="example-material-maxlength7">公告内容</label>
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
            <b-select class="form-control" size="1" v-model="formData.type" >
              <option value="-1" select="true">请选择...</option>
              <option value="1">平台公告</option>
              <option value="2">商户公告</option>
            </b-select>
            <label for="material-select">公告类型</label>
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
import { addNotice, updateNotice } from "@/api/notice";

const initData = {
  title: "",
  content: "",
  type: "",
  validStart: "",
  validEnd: ""
}

export default {
  props: ['open', 'editData'],
  data () {
    return {
      formData: {...initData}
    }
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
      const method = this.editData ? updateNotice : addNotice;
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
    }
  }
}

</script>