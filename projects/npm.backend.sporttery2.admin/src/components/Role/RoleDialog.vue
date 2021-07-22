<template>
  <modal
    :title="`${type}角色`"
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
              v-model="formData.roleName"
            />
            <label for="material-text">角色名称</label>
          </div>
        </div>

        <div class="col-sm-5">
          <div class="form-material">
            <input
              class="form-control"
              type="text"
              placeholder="请输入..."
              v-model="formData.name"
            />
            <label for="material-text">英文名称</label>
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
              v-model="formData.description"
            ></textarea>
            <label for="example-material-maxlength7">角色描述</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-5">
          <div class="form-material">
            <input
              class="form-control"
              type="text"
              placeholder="请输入..."
              v-model="formData.orderNum"
            />
            <label for="material-text">排序</label>
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
import { addRole, updateRole } from "@/api/role";

const initData = {
  roleName: "",
  name: "",
  orderNum: "",
  description: ""
}

export default {
  props: ['open', 'editData'],
  data () {
    return {
      formData: {
        ...initData
      }
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
      const method = this.editData ? updateRole : addRole;
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
      this.formData = {...initData}
      this.$emit('close')
    }
  }
}

</script>