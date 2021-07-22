<template>
  <modal
    title="设置标签"
    :open="open"
    @ok="save"
    @close="close"
  >
    <form class="form-horizontal push-12">
      <div class="form-group">
        <div class="col-md-10">
          <div class="form-material">
            <input
              class="form-control"
              type="text"
              placeholder="请输入..."
              v-model="formData.tags"
            />
            <label for="material-text">用户标签</label>
          </div>
        </div>
      </div>
    </form>
  </modal>
</template>

<script>
import { setTags } from "@/api/user";

const initData = {
  tags: ''
}

export default {
  props: ['open', 'editData'],
  data () {
    return {
      formData: {...initData}
    }
  },
  watch: {
    editData (n) {
      this.formData = { ...(n || initData) }
    }
  },
  methods: {
    async save () {
      try {
        this.$loading(`保存中...`)
        const result = await setTags(this.formData)
        this.$toast.center(`保存成功`)
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