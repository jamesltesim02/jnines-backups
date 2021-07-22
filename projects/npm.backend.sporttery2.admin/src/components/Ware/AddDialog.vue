<template>
  <modal
    title="添加商品"
    :open="open"
    @close="handleClose"
    @ok="handleOk"
  >
    <form class="form-horizontal push-10-t">
      <div class="form-group">
        <div class="col-sm-5">
          <div class="form-material">
            <input class="form-control" type="text" placeholder="输入商品名称" v-model="form.wareName">
            <label for="material-text">商品名称</label>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="form-material">
            <b-select class="form-control" v-model="form.type">
              <option></option>
              <option value="1">代金券</option>
              <option value="2">现金券</option>
              <option value="3">实物商品</option>
            </b-select>
            <label for="material-select">Please Select</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-5">
          <div class="form-material">
            <input class="form-control" type="text" placeholder="col-xs-6" v-model="form.inventory">
            <label for="material-gridf">库存</label>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="form-material">
            <input class="form-control" type="text" placeholder="col-xs-6" v-model="form.needIntegral">
            <label for="material-gridl">兑换所需积分</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-5">
          <div class="form-material">
            <date-time-picker class="form-control" placeholder="请选择开始时间" v-model="form.startTime" />
            <label for="material-text">有效期开始</label>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="form-material">
            <date-time-picker class="form-control" placeholder="请选择结束时间" v-model="form.startEnd" />
            <label for="material-text">有效期结束</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-5">
          <label class="col-xs-6" for="example-file-input">列表图片</label>
          <div class="col-xs-6">
            <input type="file" id="example-file-input" name="example-file-input">
          </div>
        </div>
        <div class="col-sm-5">
          <label class="col-xs-6" for="example-file-multiple-input">Banner图片</label>
          <div class="col-xs-6">
            <input
              type="file"
              multiple
              @change="bannerChange"
            >
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <color-list-picker v-model="form.wareColor" />
            <label for="material-text">颜色</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <tags v-model="form.size" />
            <label for="example-tags2">尺寸</label>
          </div>
        </div>
      </div>
    </form>
  </modal>
</template>
<script>

import { uploadFiles } from '@/api/files'

const initForm = {
  wareName: '',
  startTime: '',
  type: '',
  inventory: '',
  needIntegral: '',
  colors: [],
  capacity: [],
  banners: []
}

export default {
  props: {
    open: {},
    editData: {}
  },
  data () {
    return {
      form: { ...(this.editData || initForm) }
    }
  },
  methods: {
    handleOk() {
      console.log('ok', this.form)
    },
    handleClose () {
      this.$emit('update:open', false)
      this.form = { ...initForm }
    },
    
    /**
     * banner文件选择事件
     */
    async bannerChange (e) {
      const files = e.target.files
      if (!files.length) {
        return
      }

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file)
      })

      const result = await uploadFiles(formData)
      console.log(result)
    }
  }
}
</script>