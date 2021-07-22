<template>
  <modal
    title="修改商品库存"
    :open="inventoryOpen"
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
              v-model="formData.inventory"
            >
            <label for="material-gridf">库存</label>
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
import {updateInventory} from "@/api/ware";

const initData = {
  inventory: ""
}

export default {
  props: ['inventoryOpen', 'editData'],
  data () {
    return {
      formData: {...initData}
    };
  },
  methods: {
    async save () {
      try {
        this.$loading("修改中...")
        const result = await updateInventory(this.formData);
        this.$toast.center("修改成功")
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
      this.$emit('inventoryClose');
      this.formData = {...initData};
    }
  }
}
</script>
