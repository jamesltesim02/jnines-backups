<template>
  <modal
    :title="`${type}资源`"
    :open="open"
    @ok="save"
    @close="$emit('close')"
  >
    <form class="form-horizontal push-12">
      <div class="form-group">
        <div class="col-sm-5">
          <div class="form-material">
            <input
              class="form-control"
              type="text"
              placeholder="请输入..."
              v-model="formData.resourceName"
            />
            <label for="material-text">资源名称</label>
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
            <label for="material-text">资源代码</label>
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
              v-model="formData.path"
            />
            <label for="material-text">访问路径</label>
          </div>
        </div>

        <div class="col-sm-5">
          <div class="form-material">
            <b-select class="form-control" size="1" v-model="formData.parentId">
              <option value="root" select="true">根节点</option>
              <option
                v-for="op in rootList"
                :value="op._id"
                :key="op._id"
              >{{ op.resourceName }}</option>
            </b-select>
            <label for="material-select">父节点</label>
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
              v-model="formData.resourceNo"
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
import { addResource, updateResource } from "@/api/resource";

const initData = {
  resourceName: "",
  name: "",
  path: "",
  parentId: "root",
  resourceNo: ""
}

export default {
  props: ['open', 'editData', 'rootList'],
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
      const method = this.editData ? updateResource : addResource;
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