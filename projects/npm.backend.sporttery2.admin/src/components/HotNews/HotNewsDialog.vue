<template>
  <modal
    :title="`${type}新闻`"
    :open="open"
    @ok="save"
    @close="close"
  >
    <form class="form-horizontal push-12">
      <div class="form-group">
        <div class="col-sm-5">
          <div class="form-material">
            <input
              class="form-control"
              type="text"
              placeholder="请输入..."
              v-model="formData.title"
            />
            <label for="material-text">新闻标题</label>
          </div>
        </div>

        <div class="col-sm-5">
          <div class="form-material">
            <input
              class="form-control"
              type="text"
              placeholder="请输入..."
              v-model="formData.url"
            />
            <label for="material-text">链接地址</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-5">
          <div class="form-material">
            <date-time-picker
              class="form-control"
              placeholder="请选择..."
              v-model="formData.validStart"
            />
            <label for="material-text">有效期开始</label>
          </div>
        </div>

        <div class="col-sm-5">
          <div class="form-material">
            <date-time-picker
              class="form-control"
              placeholder="请选择..."
              v-model="formData.validEnd"
            />
            <label for="material-text">有效期结束</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-12">
          <div class="form-material">
            <ck-editor
              v-model="formData.content"
              :id="contentId"
            />
            <label for="example-tags2">新闻编辑</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <image-uploader
              v-model="formData.thumbnail"
              name="photo"
            />
            <label for="example-tags2">列表图片</label>
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
import { addHotNews, updateHotNews } from "@/api/hotNews";

const initData = {
  title: '',
  url: '',
  validStart: '',
  validEnd: '',
  content: '',
  thumbnail: ''
}

export default {
  props: ['open', 'editData'],
  data () {
    return {
      formData: {...initData},
      contentId: ''
    }
  },
  computed: {
    type() {
      return this.editData ? '修改' : '添加'
    }
  },
  watch: {
    open (n) {
      if (!n) {
        this.contentId = ''
        return
      }

      this.contentId = this.editData ? this.editData._id : 'newdata'
    },
    editData(n){
      this.formData = { ...(n || initData) }
    }
  },
  methods: {
    async save () {
      const method = this.editData ? updateHotNews : addHotNews;
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
        this.formData = {...initData};
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