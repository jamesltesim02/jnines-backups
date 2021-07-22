<template>
  <modal
    title="添加公告"
    :open="open"
    @close="handleClose"
    @ok="handleOk"
  >
    <form class="form-horizontal push-10-t">
      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <input
              class="form-control"
              type="text"
              placeholder="输入账号"
              v-model="form.username"
            >
            <label for="material-text">账号</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <date-time-picker
              class="form-control"
              placeholder="请选择开始时间"
              v-model="form.startTime"
            />
            <label for="material-text">开始时间</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-5">
          <div class="form-material">
            <input class="form-control" type="text" placeholder="col-xs-6">
            <label for="material-gridf">Grid Input</label>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="form-material">
            <input class="form-control" type="text" placeholder="col-xs-6">
            <label for="material-gridl">Grid Input</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <b-select
              class="form-control"
              v-model="form.type"
            >
              <option></option>
              <option value="1">Option #1</option>
              <option value="2">Option #2</option>
              <option value="3">Option #3</option>
            </b-select>
            <label for="material-select">Please Select</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-xs-10">
          <div class="form-material">
            <textarea
              class="form-control"
              rows="3"
              placeholder="Please add a comment"
            ></textarea>
            <label for="material-textarea-small">Textarea Small</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <color-list-picker v-model="form.colors" />
            <label for="material-text">颜色</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <tags v-model="form.capacity" />
            <label for="example-tags2">规则</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <image-uploader
              v-model="form.photo1"
              name="photo"
            />
            <label for="example-tags2">单个图片上传</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <image-uploader
              v-model="form.photos"
              multiple
              name="bannerList"
            />
            <label for="example-tags2">多个个图片上传</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-12">
          <div class="form-material">
            <ck-editor
              v-model="form.newsContent"
              :id="contentId"
            />
            <label for="example-tags2">新闻编辑</label>
          </div>
        </div>
      </div>
      <textarea :value="form.newsContent"></textarea>
    </form>
  </modal>
</template>
<script>
const initData = {
  username: '',
  startTime: '',
  type: '',
  colors: [],
  capacity: [],
  photo1: null,
  photos: [],
  newsContent: ''
}
export default {
  props: {
    open: {},
    editData: {}
  },
  data () {
    return {
      contentId: '',
      form: {...initData}
    }
  },
  watch: {
    open (n) {
      if (!n) {
        this.contentId = ''
        return
      }

      this.contentId = this.editData ? this.editData._id : 'newdata'
    }
  },
  methods: {
    handleOk() {
      console.log('ok', this.form)
    },
    handleClose () {
      this.$emit('update:open', false)
      this.form = {...initData}
    }
  }
}
</script>