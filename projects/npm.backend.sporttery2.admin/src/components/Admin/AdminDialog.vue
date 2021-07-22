<template>
  <modal
    :title="`${type}用户`"
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
              v-model="formData.userName"
            />
            <label for="material-text">用户名</label>
          </div>
        </div>

        <div class="col-sm-5">
          <div class="form-material">
            <input
              class="form-control"
              type="password"
              placeholder="请输入..."
              v-model="formData.passWord"
            />
            <label for="login-password">密码</label>
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
              v-model="formData.phone"
            />
            <label for="material-text">电话号码</label>
          </div>
        </div>

        <div class="col-sm-5">
          <div class="form-material">
            <b-select class="form-control" size="1" v-model="formData.roleId" >
              <option value="99999999">请选择...</option>
              <option
                v-for="op in roleList"
                :value="op._id"
                :key="op._id"
                :selected="op._id === formData.roleId"
              >{{ op.roleName }}</option>
            </b-select>
            <label for="material-select">角色</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <input
              class="form-control"
              type="text"
              placeholder="请输入..."
              v-model="formData.note"
            />
            <label for="material-text">备注</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-10">
          <div class="form-material">
            <image-uploader
              v-model="formData.header"
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
import { addAdminUser, updateAdminUser } from "@/api/admin";

const initData = {
  userName: "",
  passWord: "",
  roleId: "",
  note: "",
  header: null
}

export default {
  props: ['open', 'editData', 'roleList'],
  data () {
    return {
      formData: {...initData},
    };
  },
  computed: {
    type() {
      return this.editData ? '修改' : '新增'
    }
    
  },
  watch: {
    editData (n) {
      this.formData = { ...(n || initData) }
    }
  },
  methods: {
    async save () {
      const method = this.editData ? updateAdminUser : addAdminUser;
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
      this.formData = {...initData}
      this.$emit('close')
    }
  }
}
</script>
