<template>
  <modal
    :title="`审批方案`"
    :open="!!auditData"
    @ok="audit"
    @close="$emit('close')"
  >
    <form class="form-horizontal push-12">
      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <textarea
              class="js-maxlength form-control"
              rows="3"
              maxlength="100"
              placeholder="请输入.."
              data-always-show="true"
              v-model="formData.remark">
            </textarea>
            <label for="material-text">备注</label>
          </div>  
        </div>
      </div>
    </form>
  </modal>
</template>

<script>
import {updatePlan } from '@/api/plan';

const initData = {
  ticketId: "",
  planState:""
}

export default {
  props: ['auditData'],
  data () {
    return {
      formData: {...initData}
    };
  },
  watch: {
    auditData (n) {
      this.formData = { ...(n || initData) }
    }
  },
  methods: {
    async audit () {
      const method =  updatePlan;
      console.log(this.formData);
      try {
        this.$loading(`${this.type}中...`)
        const result = await method(this.formData)
        this.$toast.center(`${this.type}成功`)
        this.$emit('updateSuccess')
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